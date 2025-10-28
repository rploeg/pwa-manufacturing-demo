import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Plus, Filter, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import type { QualityChecklist, Defect } from '@/data/types';

// Mock data
const mockChecklists: QualityChecklist[] = [
  {
    id: '1',
    templateId: 'tpl-visual-001',
    skuId: 'sku-001',
    skuName: 'Premium Juice 1L',
    lineId: 'line-3',
    lineName: 'Line 3',
    inspectorId: 'user-1',
    inspectorName: 'John Doe',
    startedAt: new Date('2024-01-15T08:30:00'),
    status: 'in-progress',
    checks: [
      {
        id: 'c1',
        order: 1,
        title: 'Check seal integrity',
        description: 'Inspect seal for gaps',
        type: 'visual',
        result: 'pass',
      },
      {
        id: 'c2',
        order: 2,
        title: 'Inspect packaging alignment',
        description: 'Verify label placement',
        type: 'visual',
        result: 'pass',
      },
      {
        id: 'c3',
        order: 3,
        title: 'Verify label placement',
        description: 'Check label position',
        type: 'visual',
        result: 'fail',
      },
      {
        id: 'c4',
        order: 4,
        title: 'Check for dents/damage',
        description: 'Visual inspection',
        type: 'visual',
      },
    ],
    defects: [],
  },
  {
    id: '2',
    templateId: 'tpl-dim-001',
    skuId: 'sku-002',
    skuName: 'Standard Juice 500ml',
    lineId: 'line-2',
    lineName: 'Line 2',
    inspectorId: 'user-2',
    inspectorName: 'Jane Smith',
    startedAt: new Date('2024-01-15T07:00:00'),
    completedAt: new Date('2024-01-15T07:45:00'),
    status: 'passed',
    checks: [
      {
        id: 'c1',
        order: 1,
        title: 'Measure width',
        description: 'Width measurement',
        type: 'measurement',
        result: 'pass',
        measurement: 102.3,
        unit: 'mm',
        lowerLimit: 100,
        upperLimit: 105,
      },
      {
        id: 'c2',
        order: 2,
        title: 'Measure height',
        description: 'Height measurement',
        type: 'measurement',
        result: 'pass',
        measurement: 205.1,
        unit: 'mm',
        lowerLimit: 200,
        upperLimit: 210,
      },
    ],
    defects: [],
  },
];

const mockDefects: Defect[] = [
  {
    id: '1',
    category: 'Labeling',
    severity: 'minor',
    description: 'Label misalignment on 3 units',
    quantity: 3,
    timestamp: new Date('2024-01-15T08:45:00'),
  },
  {
    id: '2',
    category: 'Sealing',
    severity: 'major',
    description: 'Seal defect - air leak detected',
    quantity: 1,
    timestamp: new Date('2024-01-15T06:30:00'),
  },
  {
    id: '3',
    category: 'Packaging',
    severity: 'critical',
    description: 'Packaging torn on corner',
    quantity: 1,
    timestamp: new Date('2024-01-15T09:00:00'),
  },
];

export function QualityPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'checklists' | 'defects'>('checklists');
  const [selectedChecklist, setSelectedChecklist] = useState<QualityChecklist | null>(null);
  const [checklists, setChecklists] = useState<QualityChecklist[]>(mockChecklists);
  const [defects, setDefects] = useState<Defect[]>(mockDefects);

  const handleCheckResult = (
    checklistId: string,
    checkId: string,
    result: 'pass' | 'fail' | 'na'
  ) => {
    setChecklists((prev) =>
      prev.map((cl) =>
        cl.id === checklistId
          ? {
              ...cl,
              checks: cl.checks.map((check) =>
                check.id === checkId ? { ...check, result } : check
              ),
            }
          : cl
      )
    );
    toast({
      title: 'Check updated',
      description: `Result recorded as ${result.toUpperCase()}`,
    });
  };

  const handleMeasurement = (checklistId: string, checkId: string, value: number) => {
    setChecklists((prev) =>
      prev.map((cl) =>
        cl.id === checklistId
          ? {
              ...cl,
              checks: cl.checks.map((check) =>
                check.id === checkId
                  ? {
                      ...check,
                      measurement: value,
                      result:
                        check.lowerLimit && check.upperLimit
                          ? value >= check.lowerLimit && value <= check.upperLimit
                            ? 'pass'
                            : 'fail'
                          : undefined,
                    }
                  : check
              ),
            }
          : cl
      )
    );
  };

  const completedCount = checklists.filter(
    (c) => c.status === 'passed' || c.status === 'failed'
  ).length;
  const activeCount = checklists.filter((c) => c.status === 'in-progress').length;
  const passRate = 97.2;

  const handleNewChecklist = () => {
    const newChecklist: QualityChecklist = {
      id: `checklist-${Date.now()}`,
      templateId: 'tpl-visual-001',
      skuId: 'sku-001',
      skuName: 'Premium Juice 1L',
      lineId: 'line-1',
      lineName: 'Line 1',
      inspectorId: 'current-user',
      inspectorName: 'Current User',
      startedAt: new Date(),
      status: 'in-progress',
      checks: [
        {
          id: 'c1',
          order: 1,
          title: 'Visual inspection',
          description: 'Overall visual check',
          type: 'visual',
        },
        {
          id: 'c2',
          order: 2,
          title: 'Seal integrity',
          description: 'Check seal quality',
          type: 'visual',
        },
        {
          id: 'c3',
          order: 3,
          title: 'Label placement',
          description: 'Verify label position',
          type: 'visual',
        },
        {
          id: 'c4',
          order: 4,
          title: 'Package dimensions',
          description: 'Measure package',
          type: 'measurement',
          unit: 'mm',
          lowerLimit: 100,
          upperLimit: 110,
        },
      ],
      defects: [],
    };

    setChecklists((prev) => [newChecklist, ...prev]);
    setSelectedChecklist(newChecklist);
    toast({
      title: 'Checklist created',
      description: 'New quality inspection checklist started',
    });
  };

  const handleReportDefect = () => {
    const newDefect: Defect = {
      id: `defect-${Date.now()}`,
      category: 'Visual',
      severity: 'minor',
      description: 'New defect reported',
      quantity: 1,
      timestamp: new Date(),
    };

    setDefects((prev) => [newDefect, ...prev]);
    toast({
      title: 'Defect reported',
      description: 'New defect has been logged',
    });
  };

  const getSeverityColor = (severity: Defect['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'major':
        return 'text-amber-600 bg-amber-100';
      case 'minor':
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusColor = (status: QualityChecklist['status']) => {
    switch (status) {
      case 'passed':
        return 'text-green-600 bg-green-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
    }
  };

  const completedChecks = (checklist: QualityChecklist) =>
    checklist.checks.filter((c) => c.result).length;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Quality Control</h1>
        <p className="text-muted-foreground">Checklists, inspections, and defect tracking</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedCount}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Defects</p>
              <p className="text-2xl font-bold">{defects.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pass Rate</p>
              <p className="text-2xl font-bold">{passRate}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('checklists')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'checklists'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground'
          }`}
        >
          Checklists
        </button>
        <button
          onClick={() => setActiveTab('defects')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'defects'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground'
          }`}
        >
          Defects
        </button>
      </div>

      {/* Checklists Tab */}
      {activeTab === 'checklists' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">All checklists</span>
            </div>
            <Button onClick={handleNewChecklist}>
              <Plus className="w-4 h-4 mr-2" />
              New Checklist
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checklists.map((checklist) => (
              <Card key={checklist.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{checklist.skuName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {checklist.lineName} • {checklist.inspectorName}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(checklist.status)}`}
                  >
                    {checklist.status}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-medium">
                      {completedChecks(checklist)}/{checklist.checks.length}
                    </span>
                  </div>
                  <Progress value={(completedChecks(checklist) / checklist.checks.length) * 100} />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {new Date(checklist.startedAt).toLocaleTimeString()}
                  </span>
                  <Button
                    size="sm"
                    variant={checklist.status === 'in-progress' ? 'default' : 'outline'}
                    onClick={() => setSelectedChecklist(checklist)}
                  >
                    {checklist.status === 'passed' ? 'View' : 'Continue'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Defects Tab */}
      {activeTab === 'defects' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">All defects</span>
            </div>
            <Button onClick={handleReportDefect}>
              <Plus className="w-4 h-4 mr-2" />
              Report Defect
            </Button>
          </div>

          <div className="space-y-3">
            {defects.map((defect) => (
              <Card key={defect.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getSeverityColor(defect.severity)}`}>
                    {defect.severity === 'critical' && <XCircle className="w-5 h-5" />}
                    {defect.severity === 'major' && <AlertTriangle className="w-5 h-5" />}
                    {defect.severity === 'minor' && <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{defect.category}</h4>
                        {defect.subcategory && (
                          <p className="text-sm text-muted-foreground">{defect.subcategory}</p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(defect.severity)}`}
                      >
                        {defect.severity}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{defect.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Qty: {defect.quantity}</span>
                      {defect.location && <span>{defect.location}</span>}
                      <span>{new Date(defect.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Checklist Detail Modal */}
      {selectedChecklist && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedChecklist.skuName}</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedChecklist(null)}>
                Close
              </Button>
            </div>

            <div className="space-y-4">
              {selectedChecklist.checks.map((check) => (
                <div key={check.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {check.order}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium mb-2">{check.title}</p>
                      <p className="text-sm text-muted-foreground mb-3">{check.description}</p>

                      {check.type === 'visual' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={check.result === 'pass' ? 'default' : 'outline'}
                            onClick={() =>
                              handleCheckResult(selectedChecklist.id, check.id, 'pass')
                            }
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Pass
                          </Button>
                          <Button
                            size="sm"
                            variant={check.result === 'fail' ? 'destructive' : 'outline'}
                            onClick={() =>
                              handleCheckResult(selectedChecklist.id, check.id, 'fail')
                            }
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Fail
                          </Button>
                        </div>
                      )}

                      {check.type === 'measurement' && (
                        <div>
                          <input
                            type="number"
                            className="w-32 border rounded px-2 py-1 text-sm"
                            placeholder={`${check.lowerLimit}-${check.upperLimit}`}
                            defaultValue={check.measurement}
                            onChange={(e) =>
                              handleMeasurement(
                                selectedChecklist.id,
                                check.id,
                                parseFloat(e.target.value)
                              )
                            }
                          />
                          <span className="ml-2 text-sm text-muted-foreground">
                            {check.unit} (Range: {check.lowerLimit}-{check.upperLimit})
                          </span>
                          {check.measurement && check.result && (
                            <span
                              className={`ml-2 text-sm font-medium ${check.result === 'pass' ? 'text-green-600' : 'text-red-600'}`}
                            >
                              {check.result === 'pass' ? '✓ Within spec' : '✗ Out of spec'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedChecklist(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: 'Checklist completed',
                    description: 'Quality inspection results saved',
                  });
                  setSelectedChecklist(null);
                }}
              >
                Complete Checklist
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
