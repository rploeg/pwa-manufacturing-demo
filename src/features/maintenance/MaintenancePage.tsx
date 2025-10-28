import { useState } from 'react';
import {
  Wrench,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Filter,
  Play,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import type { WorkOrder, PMTask } from '@/data/types';

export function MaintenancePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'work-orders' | 'pm-schedule'>('work-orders');
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);

  // Mock data
  const mockWorkOrders: WorkOrder[] = [
    {
      id: 'WO-001',
      type: 'corrective',
      machineId: 'filler-3',
      machineName: 'Filler-3',
      title: 'Seal mechanism jam - requires replacement',
      description:
        'Sealing mechanism jammed during production. Unit stopped responding. Requires seal cartridge replacement and alignment check.',
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'Tech-A',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 1),
      estimatedDuration: 120,
      parts: [
        {
          id: 'p1',
          name: 'Seal cartridge',
          partNumber: 'P/N 12345',
          quantity: 1,
          unit: 'pcs',
          inStock: 3,
        },
        {
          id: 'p2',
          name: 'O-rings set',
          partNumber: 'P/N 12346',
          quantity: 1,
          unit: 'set',
          inStock: 5,
        },
      ],
    },
    {
      id: 'WO-002',
      type: 'preventive',
      machineId: 'conveyor-1',
      machineName: 'Conveyor Belt 1',
      title: 'Belt alignment and tension adjustment',
      description: 'Scheduled PM - check belt alignment, adjust tension, lubricate bearings',
      priority: 'medium',
      status: 'open',
      assignedTo: 'Tech-B',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 4),
      estimatedDuration: 90,
    },
    {
      id: 'WO-003',
      type: 'predictive',
      machineId: 'pump-2',
      machineName: 'Hydraulic Pump 2',
      title: 'Bearing replacement - vibration detected',
      description:
        'Predictive maintenance triggered by elevated vibration levels. Replace bearing before failure.',
      priority: 'high',
      status: 'open',
      assignedTo: 'Tech-A',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 8),
      estimatedDuration: 180,
      parts: [
        {
          id: 'p3',
          name: 'Bearing',
          partNumber: 'P/N 67890',
          quantity: 1,
          unit: 'pcs',
          inStock: 2,
        },
        {
          id: 'p4',
          name: 'Seal kit',
          partNumber: 'P/N 67891',
          quantity: 1,
          unit: 'kit',
          inStock: 4,
        },
      ],
    },
    {
      id: 'WO-004',
      type: 'corrective',
      machineId: 'robot-arm-1',
      machineName: 'Robot Arm 1',
      title: 'Gripper calibration',
      description: 'Gripper not holding parts correctly. Requires recalibration and testing.',
      priority: 'medium',
      status: 'completed',
      assignedTo: 'Tech-C',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 46),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 44),
      estimatedDuration: 60,
    },
  ];

  const mockPMSchedule: PMTask[] = [
    {
      id: 'PM-001',
      machineId: 'filler-1',
      machineName: 'Filler-1',
      title: 'Monthly lubrication and filter change',
      description: 'Lubricate all moving parts, replace air filter, check fluid levels',
      frequency: 'monthly',
      lastCompleted: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28),
      nextDue: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      estimatedDuration: 60,
      steps: [
        {
          id: 's1',
          order: 1,
          title: 'Lubricate bearings',
          description: 'Apply grease to all bearing points',
          completed: false,
        },
        {
          id: 's2',
          order: 2,
          title: 'Replace air filter',
          description: 'Remove old filter and install new one',
          completed: false,
        },
        {
          id: 's3',
          order: 3,
          title: 'Check fluid levels',
          description: 'Verify all fluid levels are within spec',
          completed: false,
        },
      ],
    },
    {
      id: 'PM-002',
      machineId: 'filler-2',
      machineName: 'Filler-2',
      title: 'Quarterly belt replacement',
      description: 'Replace drive belt, inspect pulleys, check alignment',
      frequency: 'quarterly',
      lastCompleted: new Date(Date.now() - 1000 * 60 * 60 * 24 * 85),
      nextDue: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      estimatedDuration: 120,
      steps: [
        {
          id: 's1',
          order: 1,
          title: 'Remove old belt',
          description: 'Release tension and remove belt',
          completed: false,
        },
        {
          id: 's2',
          order: 2,
          title: 'Install new belt',
          description: 'Install and tension new belt',
          completed: false,
        },
        {
          id: 's3',
          order: 3,
          title: 'Check alignment',
          description: 'Verify pulley alignment',
          completed: false,
        },
      ],
    },
    {
      id: 'PM-003',
      machineId: 'conveyor-1',
      machineName: 'Conveyor Belt 1',
      title: 'Weekly belt tension check',
      description: 'Check and adjust belt tension as needed',
      frequency: 'weekly',
      lastCompleted: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
      nextDue: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // Overdue
      estimatedDuration: 30,
      steps: [
        {
          id: 's1',
          order: 1,
          title: 'Check tension',
          description: 'Measure belt tension',
          completed: false,
        },
        {
          id: 's2',
          order: 2,
          title: 'Adjust if needed',
          description: 'Adjust tension to spec',
          completed: false,
        },
      ],
    },
  ];

  const handleStartWork = (orderId: string) => {
    toast({
      title: 'Work order started',
      description: `Started working on ${orderId}`,
    });
  };

  const handleCompleteWork = (orderId: string) => {
    toast({
      title: 'Work order completed',
      description: `Completed work order ${orderId}`,
    });
    setSelectedOrder(null);
  };

  const handleSchedulePM = (pmId: string) => {
    toast({
      title: 'PM scheduled',
      description: `Created work order for ${pmId}`,
    });
  };

  const getTypeColor = (type: WorkOrder['type']) => {
    switch (type) {
      case 'corrective':
        return 'text-red-600 bg-red-100';
      case 'preventive':
        return 'text-blue-600 bg-blue-100';
      case 'predictive':
        return 'text-purple-600 bg-purple-100';
    }
  };

  const getPriorityColor = (priority: WorkOrder['priority']) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
    }
  };

  const getStatusColor = (status: WorkOrder['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      case 'open':
        return 'text-gray-600 bg-gray-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
    }
  };

  const isOverdue = (dueDate?: Date) => dueDate && new Date() > dueDate;
  const isPMOverdue = (pmTask: PMTask) => new Date() > pmTask.nextDue;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Maintenance</h1>
        <p className="text-muted-foreground">Work orders and preventive maintenance schedule</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Open Work Orders</p>
              <p className="text-2xl font-bold">
                {mockWorkOrders.filter((w) => w.status === 'open').length}
              </p>
            </div>
            <Wrench className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">
                {mockWorkOrders.filter((w) => w.status === 'in-progress').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">PM Overdue</p>
              <p className="text-2xl font-bold">{mockPMSchedule.filter(isPMOverdue).length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed Today</p>
              <p className="text-2xl font-bold">
                {mockWorkOrders.filter((w) => w.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('work-orders')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'work-orders'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground'
          }`}
        >
          Work Orders
        </button>
        <button
          onClick={() => setActiveTab('pm-schedule')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'pm-schedule'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground'
          }`}
        >
          PM Schedule
        </button>
      </div>

      {/* Work Orders Tab */}
      {activeTab === 'work-orders' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">All work orders</span>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Work Order
            </Button>
          </div>

          <div className="space-y-3">
            {mockWorkOrders.map((order) => (
              <Card key={order.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-muted-foreground">
                        {order.id}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(order.type)}`}
                      >
                        {order.type}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}
                      >
                        {order.priority}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{order.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{order.machineName}</p>
                    <p className="text-sm mb-3">{order.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <span>Assigned: {order.assignedTo}</span>
                      <span>Duration: {order.estimatedDuration} min</span>
                      {order.dueDate && (
                        <span
                          className={isOverdue(order.dueDate) ? 'text-red-600 font-medium' : ''}
                        >
                          Due: {new Date(order.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {order.parts && order.parts.length > 0 && (
                        <span>Parts: {order.parts.length} items</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                    <Button
                      size="sm"
                      variant={order.status === 'in-progress' ? 'default' : 'outline'}
                      onClick={() => setSelectedOrder(order)}
                    >
                      {order.status === 'completed'
                        ? 'View'
                        : order.status === 'in-progress'
                          ? 'Continue'
                          : 'Start'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* PM Schedule Tab */}
      {activeTab === 'pm-schedule' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">All PM tasks</span>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add PM Task
            </Button>
          </div>

          <div className="space-y-3">
            {mockPMSchedule.map((pm) => (
              <Card
                key={pm.id}
                className={`p-4 hover:shadow-lg transition-shadow ${isPMOverdue(pm) ? 'border-red-300' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-muted-foreground">{pm.id}</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-100">
                        {pm.frequency}
                      </span>
                      {isPMOverdue(pm) && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-100">
                          OVERDUE
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold mb-1">{pm.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{pm.machineName}</p>
                    <p className="text-sm mb-3">{pm.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      {pm.lastCompleted && (
                        <span>Last: {new Date(pm.lastCompleted).toLocaleDateString()}</span>
                      )}
                      <span className={isPMOverdue(pm) ? 'text-red-600 font-medium' : ''}>
                        Next: {new Date(pm.nextDue).toLocaleDateString()}
                      </span>
                      <span>Duration: {pm.estimatedDuration} min</span>
                      <span>Steps: {pm.steps.length}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isPMOverdue(pm) ? 'destructive' : 'outline'}
                    onClick={() => handleSchedulePM(pm.id)}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    {isPMOverdue(pm) ? 'Schedule Now' : 'Create Work Order'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Work Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {selectedOrder.id}: {selectedOrder.title}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Machine</h3>
                <p>{selectedOrder.machineName}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{selectedOrder.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Priority</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedOrder.priority)}`}
                  >
                    {selectedOrder.priority}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Timeline</h3>
                <div className="text-sm space-y-1">
                  <p>Created: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  {selectedOrder.dueDate && (
                    <p
                      className={isOverdue(selectedOrder.dueDate) ? 'text-red-600 font-medium' : ''}
                    >
                      Due: {new Date(selectedOrder.dueDate).toLocaleString()}
                    </p>
                  )}
                  {selectedOrder.completedAt && (
                    <p>Completed: {new Date(selectedOrder.completedAt).toLocaleString()}</p>
                  )}
                </div>
              </div>

              {selectedOrder.parts && selectedOrder.parts.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Parts Required</h3>
                  <div className="space-y-2">
                    {selectedOrder.parts.map((part) => (
                      <div
                        key={part.id}
                        className="flex items-center justify-between text-sm border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">{part.name}</p>
                          <p className="text-xs text-muted-foreground">{part.partNumber}</p>
                        </div>
                        <div className="text-right">
                          <p>
                            Qty: {part.quantity} {part.unit}
                          </p>
                          <p
                            className={`text-xs ${part.inStock >= part.quantity ? 'text-green-600' : 'text-red-600'}`}
                          >
                            In stock: {part.inStock}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedOrder.steps && selectedOrder.steps.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Steps</h3>
                  <div className="space-y-2">
                    {selectedOrder.steps.map((step) => (
                      <div key={step.id} className="flex items-start gap-3 text-sm">
                        <span className="text-muted-foreground">{step.order}.</span>
                        <div className="flex-1">
                          <p className="font-medium">{step.title}</p>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                        </div>
                        {step.completed && <Check className="w-4 h-4 text-green-600" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
              {selectedOrder.status !== 'completed' && (
                <>
                  {selectedOrder.status === 'open' && (
                    <Button onClick={() => handleStartWork(selectedOrder.id)}>
                      <Play className="w-4 h-4 mr-1" />
                      Start Work
                    </Button>
                  )}
                  {selectedOrder.status === 'in-progress' && (
                    <Button onClick={() => handleCompleteWork(selectedOrder.id)}>
                      <Check className="w-4 h-4 mr-1" />
                      Complete
                    </Button>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
