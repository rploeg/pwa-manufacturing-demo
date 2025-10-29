import { useState } from 'react';
import { Package, Search, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TraceRecord {
  batch: string;
  product: string;
  status: 'ok' | 'quarantine' | 'recall';
  quantity: number;
  materials: string[];
  date: string;
  shift: string;
}

export function TraceabilityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [traceDirection, setTraceDirection] = useState<'forward' | 'backward'>('backward');
  const [selectedRecord, setSelectedRecord] = useState<TraceRecord | null>(null);
  const [records] = useState<TraceRecord[]>([
    {
      batch: 'BATCH-2024-001523',
      product: 'Air Fryer HD9650',
      status: 'ok',
      quantity: 850,
      materials: ['PCB-A45', 'Heater-H890', 'Basket-B234', 'Cable-C567'],
      date: '2024-01-15',
      shift: 'Day Shift',
    },
    {
      batch: 'BATCH-2024-001524',
      product: 'Air Fryer HD9650',
      status: 'ok',
      quantity: 820,
      materials: ['PCB-A45', 'Heater-H890', 'Basket-B234', 'Cable-C568'],
      date: '2024-01-15',
      shift: 'Afternoon Shift',
    },
    {
      batch: 'BATCH-2024-001489',
      product: 'Coffee Maker EP5447',
      status: 'quarantine',
      quantity: 45,
      materials: ['PCB-B78', 'Pump-P456', 'Boiler-B789', 'Grinder-G234'],
      date: '2024-01-12',
      shift: 'Day Shift',
    },
    {
      batch: 'BATCH-2024-001367',
      product: 'Vacuum Cleaner XC8347',
      status: 'recall',
      quantity: 320,
      materials: ['Motor-M345', 'Filter-F678', 'Hose-H123', 'PCB-C89'],
      date: '2024-01-08',
      shift: 'Night Shift',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'quarantine':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'recall':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="w-4 h-4" />;
      case 'quarantine':
        return <AlertCircle className="w-4 h-4" />;
      case 'recall':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const filteredRecords = records.filter(
    (record) =>
      record.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.materials.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Product Traceability</h1>
        <p className="text-muted-foreground">
          Track batch and material genealogy across the supply chain
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Search by Batch / Product / Material
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="e.g. BATCH-2024-001523, PCB-A45..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Trace Direction</label>
            <div className="flex gap-2">
              <button
                onClick={() => setTraceDirection('backward')}
                className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                  traceDirection === 'backward'
                    ? 'bg-versuni-primary text-white border-versuni-primary'
                    : 'bg-white hover:bg-accent'
                }`}
              >
                ⬅️ Backward (Source)
              </button>
              <button
                onClick={() => setTraceDirection('forward')}
                className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                  traceDirection === 'forward'
                    ? 'bg-versuni-primary text-white border-versuni-primary'
                    : 'bg-white hover:bg-accent'
                }`}
              >
                Forward (Destination) ➡️
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Batches</div>
          <div className="text-2xl font-bold">1,523</div>
          <div className="text-xs text-green-600 mt-1">This month</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground mb-1">Active Products</div>
          <div className="text-2xl font-bold">2,035</div>
          <div className="text-xs text-blue-600 mt-1">In circulation</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground mb-1">Quarantined</div>
          <div className="text-2xl font-bold">45</div>
          <div className="text-xs text-orange-600 mt-1">Under investigation</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground mb-1">Recalled</div>
          <div className="text-2xl font-bold">320</div>
          <div className="text-xs text-red-600 mt-1">Last 30 days</div>
        </div>
      </div>

      {/* Batch Records */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Package className="w-5 h-5 text-versuni-primary" />
            Batch Records ({filteredRecords.length})
          </h2>
        </div>
        <div className="divide-y">
          {filteredRecords.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No records found matching your search</p>
            </div>
          ) : (
            filteredRecords.map((record, idx) => (
              <div key={idx} className="p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono font-bold text-lg">{record.batch}</span>
                      <span
                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(record.status)}`}
                      >
                        {getStatusIcon(record.status)}
                        {record.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Product:</span>
                        <span>{record.product}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Quantity:</span>
                        <span>{record.quantity} units</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Date:</span>
                        <span>{record.date}</span>
                        <span className="mx-2">•</span>
                        <span>{record.shift}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}>
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>
                </div>

                {/* Material Genealogy */}
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <div className="text-xs font-medium text-gray-700 mb-2">
                    Material Genealogy ({record.materials.length} components)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {record.materials.map((material, midx) => (
                      <span
                        key={midx}
                        className="px-2 py-1 bg-white border rounded-md text-xs font-mono hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
                        title={`Click to trace ${material}`}
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Trace Path Visualization (Example for recalled batch) */}
                {record.status === 'recall' && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="text-xs font-medium text-red-900 mb-2">
                      🚨 Recall Trace Path
                    </div>
                    <div className="text-xs text-red-700 space-y-1">
                      <div>→ Motor-M345 sourced from Supplier-A (Batch S-2024-789)</div>
                      <div>→ Assembled on Line-C (Operator: ID-456)</div>
                      <div>
                        → QC Passed (Inspector: ID-123) - Note: motor vibration not detected
                      </div>
                      <div>→ Shipped to Distribution Center DC-North (320 units)</div>
                      <div className="font-medium mt-2">🔍 Root Cause: Motor bearing defect</div>
                    </div>
                  </div>
                )}

                {record.status === 'quarantine' && (
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                    <div className="text-xs font-medium text-orange-900 mb-1">
                      ⚠️ Investigation in Progress
                    </div>
                    <div className="text-xs text-orange-700">
                      Potential quality issue detected. Batch held pending analysis.
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-card border rounded-lg hover:bg-accent transition-colors text-left">
          <div className="font-medium mb-1">🔍 Initiate Recall</div>
          <div className="text-sm text-muted-foreground">
            Start recall process for a batch or material
          </div>
        </button>
        <button className="p-4 bg-card border rounded-lg hover:bg-accent transition-colors text-left">
          <div className="font-medium mb-1">📊 Genealogy Report</div>
          <div className="text-sm text-muted-foreground">
            Generate detailed material trace report
          </div>
        </button>
        <button className="p-4 bg-card border rounded-lg hover:bg-accent transition-colors text-left">
          <div className="font-medium mb-1">⚙️ Configure Tracking</div>
          <div className="text-sm text-muted-foreground">Set up material tracking rules</div>
        </button>
      </div>

      {/* Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedRecord.batch}</h2>
                <p className="text-muted-foreground">{selectedRecord.product}</p>
              </div>
              <Button variant="outline" onClick={() => setSelectedRecord(null)}>
                Close
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status and Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(selectedRecord.status)}`}
                  >
                    {getStatusIcon(selectedRecord.status)}
                    <span className="font-medium capitalize">{selectedRecord.status}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Quantity</div>
                  <div className="text-xl font-bold">{selectedRecord.quantity} units</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Production Date</div>
                  <div className="font-medium">{selectedRecord.date}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Shift</div>
                  <div className="font-medium">{selectedRecord.shift}</div>
                </div>
              </div>

              {/* Material Genealogy */}
              <div>
                <h3 className="font-semibold mb-3">Material Genealogy</h3>
                <div className="space-y-2">
                  {selectedRecord.materials.map((material, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-medium">{material}</span>
                        <Button variant="ghost" size="sm">
                          Trace Material
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>→ Supplier: Supplier-{String.fromCharCode(65 + idx)}</div>
                        <div>→ Received: {selectedRecord.date}</div>
                        <div>→ Lot: LOT-2024-{1000 + idx}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Production Details */}
              <div>
                <h3 className="font-semibold mb-3">Production Details</h3>
                <div className="border rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Production Line:</span>
                    <span className="font-medium">Line-A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Operator ID:</span>
                    <span className="font-medium">OP-{Math.floor(Math.random() * 1000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">QC Inspector:</span>
                    <span className="font-medium">QC-{Math.floor(Math.random() * 100)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cycle Time:</span>
                    <span className="font-medium">2.3 min/unit</span>
                  </div>
                </div>
              </div>

              {/* Distribution */}
              <div>
                <h3 className="font-semibold mb-3">Distribution</h3>
                <div className="border rounded-lg p-4 text-sm">
                  <div className="mb-2 text-muted-foreground">Shipped to:</div>
                  <div className="space-y-1">
                    <div>📦 Distribution Center North - 40%</div>
                    <div>📦 Distribution Center South - 35%</div>
                    <div>📦 Direct Retail - 25%</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1">Export Full Report</Button>
                <Button variant="outline" className="flex-1">
                  Print Label
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
