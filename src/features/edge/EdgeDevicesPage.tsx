import { useState } from 'react';
import {
  Server,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Cpu,
  Activity,
} from 'lucide-react';

interface EdgeDevice {
  id: string;
  name: string;
  type: 'gateway' | 'plc' | 'sensor-hub' | 'edge-server';
  status: 'online' | 'offline' | 'warning';
  cpu: number;
  memory: number;
  uptime: string;
  lastUpdate: string;
  firmwareVersion: string;
  needsUpdate: boolean;
  location: string;
}

export function EdgeDevicesPage() {
  const [devices] = useState<EdgeDevice[]>([
    {
      id: 'edge-01',
      name: 'Production Line Gateway',
      type: 'gateway',
      status: 'online',
      cpu: 34,
      memory: 62,
      uptime: '45 days',
      lastUpdate: '2 minutes ago',
      firmwareVersion: '2.4.1',
      needsUpdate: false,
      location: 'Line 1',
    },
    {
      id: 'plc-02',
      name: 'CNC Controller PLC',
      type: 'plc',
      status: 'online',
      cpu: 28,
      memory: 45,
      uptime: '120 days',
      lastUpdate: '1 minute ago',
      firmwareVersion: '1.8.3',
      needsUpdate: true,
      location: 'Cell A',
    },
    {
      id: 'edge-03',
      name: 'Quality Inspection Hub',
      type: 'sensor-hub',
      status: 'warning',
      cpu: 78,
      memory: 89,
      uptime: '12 days',
      lastUpdate: '45 minutes ago',
      firmwareVersion: '3.1.0',
      needsUpdate: false,
      location: 'QC Station',
    },
    {
      id: 'edge-04',
      name: 'Assembly Line Edge Server',
      type: 'edge-server',
      status: 'online',
      cpu: 52,
      memory: 71,
      uptime: '89 days',
      lastUpdate: '3 minutes ago',
      firmwareVersion: '4.2.5',
      needsUpdate: false,
      location: 'Line 2',
    },
    {
      id: 'sensor-05',
      name: 'Environmental Sensor Network',
      type: 'sensor-hub',
      status: 'offline',
      cpu: 0,
      memory: 0,
      uptime: '0 days',
      lastUpdate: '2 hours ago',
      firmwareVersion: '2.1.4',
      needsUpdate: true,
      location: 'Warehouse',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-orange-600 bg-orange-50';
      case 'offline':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'offline':
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'gateway':
        return <Wifi className="w-5 h-5" />;
      case 'plc':
        return <Cpu className="w-5 h-5" />;
      case 'sensor-hub':
        return <Activity className="w-5 h-5" />;
      case 'edge-server':
        return <Server className="w-5 h-5" />;
    }
  };

  const onlineCount = devices.filter((d) => d.status === 'online').length;
  const warningCount = devices.filter((d) => d.status === 'warning').length;
  const offlineCount = devices.filter((d) => d.status === 'offline').length;
  const updateCount = devices.filter((d) => d.needsUpdate).length;

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Edge Devices</h1>
        <p className="text-muted-foreground">Monitor and manage OT/IT infrastructure</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-muted-foreground">Online</span>
          </div>
          <div className="text-2xl font-bold">{onlineCount}</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-muted-foreground">Warning</span>
          </div>
          <div className="text-2xl font-bold">{warningCount}</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-muted-foreground">Offline</span>
          </div>
          <div className="text-2xl font-bold">{offlineCount}</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-muted-foreground">Updates Needed</span>
          </div>
          <div className="text-2xl font-bold">{updateCount}</div>
        </div>
      </div>

      {/* Devices List */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Devices</h2>
          <button className="px-3 py-1.5 text-sm bg-versuni-primary text-white rounded-md hover:bg-versuni-primary/90">
            Add Device
          </button>
        </div>
        <div className="divide-y">
          {devices.map((device) => (
            <div key={device.id} className="p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent rounded-lg">{getDeviceIcon(device.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{device.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1 ${getStatusColor(device.status)}`}
                    >
                      {getStatusIcon(device.status)}
                      {device.status}
                    </span>
                    {device.needsUpdate && (
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-600">
                        Update Available
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {device.location} • {device.type} • {device.id}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">CPU Usage</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
                          <div
                            className={`h-full ${device.cpu > 80 ? 'bg-red-600' : device.cpu > 60 ? 'bg-orange-600' : 'bg-green-600'}`}
                            style={{ width: `${device.cpu}%` }}
                          />
                        </div>
                        <span className="font-medium">{device.cpu}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Memory</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
                          <div
                            className={`h-full ${device.memory > 80 ? 'bg-red-600' : device.memory > 60 ? 'bg-orange-600' : 'bg-green-600'}`}
                            style={{ width: `${device.memory}%` }}
                          />
                        </div>
                        <span className="font-medium">{device.memory}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Uptime</div>
                      <div className="font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {device.uptime}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Firmware</div>
                      <div className="font-medium">{device.firmwareVersion}</div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-muted-foreground">
                    Last update: {device.lastUpdate}
                  </div>
                </div>
                <div className="flex gap-2">
                  {device.needsUpdate && (
                    <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Update
                    </button>
                  )}
                  {device.status === 'offline' && (
                    <button className="px-3 py-1.5 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700">
                      Diagnose
                    </button>
                  )}
                  <button className="px-3 py-1.5 text-sm border rounded-md hover:bg-accent">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
