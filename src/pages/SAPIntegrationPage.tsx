import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Database,
  CheckCircle,
  AlertCircle,
  Clock,
  Package,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
} from 'lucide-react';
import { sapService, type WorkOrder, type Material } from '@/services/sapService';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SAPIntegrationPage() {
  const { t, formatCurrency } = useLanguage();
  const [connectionStatus, setConnectionStatus] = useState(sapService.getConnectionStatus());
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [reorderMaterials, setReorderMaterials] = useState<Material[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setConnectionStatus(sapService.getConnectionStatus());
    setWorkOrders(sapService.getWorkOrders());
    setMaterials(sapService.getMaterials());
    setReorderMaterials(sapService.getMaterialsNeedingReorder());
  };

  const getStatusIcon = (status: WorkOrder['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'on-hold':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityBadge = (priority: WorkOrder['priority']) => {
    const variants: Record<
      WorkOrder['priority'],
      'default' | 'secondary' | 'destructive' | 'outline'
    > = {
      low: 'secondary',
      normal: 'default',
      high: 'destructive',
      urgent: 'destructive',
    };
    return (
      <Badge variant={variants[priority]} className="text-xs">
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const inProgressOrders = workOrders.filter((o) => o.status === 'in-progress');
  const plannedOrders = workOrders.filter((o) => o.status === 'planned');
  const completedToday = workOrders.filter((o) => o.status === 'completed');

  const totalInventoryValue = sapService.getTotalInventoryValue();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('sap.title', 'SAP/ERP Integration')}</h1>
          <p className="text-muted-foreground">
            {t('sap.description', 'Enterprise resource planning system connectivity')}
          </p>
        </div>
        <Button onClick={loadData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t('sap.refreshData', 'Refresh Data')}
        </Button>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            {t('sap.connectionStatus', 'System Connection Status')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${connectionStatus.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
              />
              <div>
                <div className="text-xs text-muted-foreground">{t('sap.status', 'Status')}</div>
                <div className="font-semibold">
                  {connectionStatus.connected
                    ? t('sap.connected', 'Connected')
                    : t('sap.disconnected', 'Disconnected')}
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                {t('sap.systemVersion', 'System Version')}
              </div>
              <div className="font-semibold text-sm">{connectionStatus.systemVersion}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{t('sap.latency', 'Latency')}</div>
              <div className="font-semibold">{connectionStatus.latency}ms</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                {t('sap.dataQuality', 'Data Quality')}
              </div>
              <div className="font-semibold">{connectionStatus.dataQuality}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{t('sap.lastSync', 'Last Sync')}</div>
              <div className="font-semibold text-sm">
                {connectionStatus.lastSync.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t('sap.activeOrders', 'Active Orders')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inProgressOrders.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {plannedOrders.length} {t('status.planned', 'planned')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t('sap.completedToday', 'Completed Today')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedToday.length}</div>
            <div className="text-xs text-green-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {t('status.onTarget', 'On target')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t('sap.inventoryValue', 'Inventory Value')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalInventoryValue)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {materials.length} {t('sap.materials', 'materials')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t('sap.reorderAlerts', 'Reorder Alerts')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{reorderMaterials.length}</div>
            <div className="text-xs text-orange-500 mt-1 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              {t('status.belowThreshold', 'Below threshold')}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work Orders */}
        <Card>
          <CardHeader>
            <CardTitle>{t('sap.workOrders', 'Production Work Orders')}</CardTitle>
            <CardDescription>
              {t('sap.activeAndPlanned', 'Active and planned manufacturing orders')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  {getStatusIcon(order.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{order.orderNumber}</span>
                      {getPriorityBadge(order.priority)}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {order.productName}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{order.lineName}</span>
                      <span>
                        {order.completedQuantity}/{order.quantity} units
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Material Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>{t('sap.materialInventory', 'Material Inventory')}</CardTitle>
            <CardDescription>Stock levels and reorder alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {materials.slice(0, 5).map((material) => {
                const needsReorder = material.currentStock <= material.reorderPoint;
                const stockPercentage = (material.currentStock / material.maxStock) * 100;

                return (
                  <div key={material.id} className="p-3 rounded-lg border bg-card">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {material.materialName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {material.materialCode} • {material.location}
                        </div>
                      </div>
                      {needsReorder && (
                        <Badge variant="destructive" className="text-xs">
                          <Package className="w-3 h-3 mr-1" />
                          Reorder
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Stock Level</span>
                        <span className="font-semibold">
                          {material.currentStock} {material.unit}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            needsReorder
                              ? 'bg-red-500'
                              : stockPercentage < 50
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Min: {material.minStock}</span>
                        <span>Max: {material.maxStock}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
