import { useState } from 'react';
import { Wrench, CheckCircle, AlertTriangle, XCircle, MapPin } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  category: 'power-tool' | 'hand-tool' | 'measurement' | 'fixture';
  status: 'available' | 'in-use' | 'maintenance' | 'missing';
  location: string;
  assignedTo?: string;
  calibrationDue?: string;
  condition: 'good' | 'fair' | 'poor';
}

export function ToolManagementPage() {
  const [tools] = useState<Tool[]>([
    {
      id: 'T-001',
      name: 'Torque Wrench 2.5-25 Nm',
      category: 'power-tool',
      status: 'available',
      location: 'Tool Crib A - Slot 12',
      calibrationDue: '2025-12-15',
      condition: 'good',
    },
    {
      id: 'T-002',
      name: 'Digital Caliper',
      category: 'measurement',
      status: 'in-use',
      location: 'Line 1 - Station 3',
      assignedTo: 'John Doe',
      calibrationDue: '2025-11-30',
      condition: 'good',
    },
    {
      id: 'T-003',
      name: 'Assembly Fixture AF-200',
      category: 'fixture',
      status: 'available',
      location: 'Line 2 - Storage',
      condition: 'fair',
    },
    {
      id: 'T-004',
      name: 'Impact Driver',
      category: 'power-tool',
      status: 'maintenance',
      location: 'Maintenance Shop',
      condition: 'poor',
    },
    {
      id: 'T-005',
      name: 'Micrometer 0-25mm',
      category: 'measurement',
      status: 'available',
      location: 'QC Lab - Cabinet 2',
      calibrationDue: '2026-01-20',
      condition: 'good',
    },
    {
      id: 'T-006',
      name: 'Hex Key Set',
      category: 'hand-tool',
      status: 'missing',
      location: 'Unknown',
      condition: 'good',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'available' | 'in-use' | 'maintenance' | 'missing'>(
    'all'
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-use':
        return <AlertTriangle className="w-4 h-4" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4" />;
      case 'missing':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-50 text-green-700';
      case 'in-use':
        return 'bg-blue-50 text-blue-700';
      case 'maintenance':
        return 'bg-orange-50 text-orange-700';
      case 'missing':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'power-tool':
        return '⚡';
      case 'hand-tool':
        return '🔧';
      case 'measurement':
        return '📏';
      case 'fixture':
        return '🔩';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'good':
        return 'text-green-600';
      case 'fair':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const needsCalibration = (calibrationDue?: string) => {
    if (!calibrationDue) return false;
    const days = Math.floor(
      (new Date(calibrationDue).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days < 30;
  };

  const filteredTools = filter === 'all' ? tools : tools.filter((t) => t.status === filter);

  const availableCount = tools.filter((t) => t.status === 'available').length;
  const inUseCount = tools.filter((t) => t.status === 'in-use').length;
  const maintenanceCount = tools.filter((t) => t.status === 'maintenance').length;
  const missingCount = tools.filter((t) => t.status === 'missing').length;

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Tool Management</h1>
        <p className="text-muted-foreground">Track tools, equipment, and calibration status</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => setFilter('available')}
          className={`bg-card rounded-lg border p-4 text-left hover:shadow-md transition-all ${filter === 'available' ? 'ring-2 ring-green-600' : ''}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-muted-foreground">Available</span>
          </div>
          <div className="text-2xl font-bold">{availableCount}</div>
        </button>
        <button
          onClick={() => setFilter('in-use')}
          className={`bg-card rounded-lg border p-4 text-left hover:shadow-md transition-all ${filter === 'in-use' ? 'ring-2 ring-blue-600' : ''}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-muted-foreground">In Use</span>
          </div>
          <div className="text-2xl font-bold">{inUseCount}</div>
        </button>
        <button
          onClick={() => setFilter('maintenance')}
          className={`bg-card rounded-lg border p-4 text-left hover:shadow-md transition-all ${filter === 'maintenance' ? 'ring-2 ring-orange-600' : ''}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Wrench className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-muted-foreground">Maintenance</span>
          </div>
          <div className="text-2xl font-bold">{maintenanceCount}</div>
        </button>
        <button
          onClick={() => setFilter('missing')}
          className={`bg-card rounded-lg border p-4 text-left hover:shadow-md transition-all ${filter === 'missing' ? 'ring-2 ring-red-600' : ''}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-muted-foreground">Missing</span>
          </div>
          <div className="text-2xl font-bold">{missingCount}</div>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between mb-4">
        <div>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="text-sm text-versuni-primary hover:underline"
            >
              ← Show all tools
            </button>
          )}
        </div>
        <button className="px-3 py-1.5 text-sm bg-versuni-primary text-white rounded-md hover:bg-versuni-primary/90">
          Request Tool
        </button>
      </div>

      {/* Tools List */}
      <div className="bg-card rounded-lg border">
        <div className="divide-y">
          {filteredTools.map((tool) => (
            <div key={tool.id} className="p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{getCategoryIcon(tool.category)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{tool.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1 ${getStatusColor(tool.status)}`}
                    >
                      {getStatusIcon(tool.status)}
                      {tool.status}
                    </span>
                    <span className={`text-xs font-medium ${getConditionColor(tool.condition)}`}>
                      {tool.condition}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {tool.id} • {tool.category}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {tool.location}
                    </div>
                    {tool.assignedTo && (
                      <div className="text-muted-foreground">
                        Assigned to:{' '}
                        <span className="font-medium text-foreground">{tool.assignedTo}</span>
                      </div>
                    )}
                    {tool.calibrationDue && (
                      <div
                        className={
                          needsCalibration(tool.calibrationDue)
                            ? 'text-orange-600'
                            : 'text-muted-foreground'
                        }
                      >
                        {needsCalibration(tool.calibrationDue) ? '⚠️ ' : '📅 '}
                        Cal due: {new Date(tool.calibrationDue).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {tool.status === 'available' && (
                    <button className="px-3 py-1.5 text-sm bg-versuni-primary text-white rounded-md hover:bg-versuni-primary/90">
                      Check Out
                    </button>
                  )}
                  {tool.status === 'in-use' && (
                    <button className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                      Return
                    </button>
                  )}
                  {tool.status === 'missing' && (
                    <button className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
                      Report Found
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
