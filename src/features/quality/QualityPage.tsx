import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Filter,
  TrendingUp,
  Camera,
  Upload,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { visionAI, type VisionInspectionResult } from '@/services/visionAI';
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
  const [activeTab, setActiveTab] = useState<'checklists' | 'defects' | 'vision-ai'>('checklists');
  const [selectedChecklist, setSelectedChecklist] = useState<QualityChecklist | null>(null);
  const [checklists, setChecklists] = useState<QualityChecklist[]>(mockChecklists);
  const [defects, setDefects] = useState<Defect[]>(mockDefects);

  // Vision AI state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [visionResult, setVisionResult] = useState<VisionInspectionResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  // Vision AI handlers
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create object URL for preview
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setIsAnalyzing(true);
    setVisionResult(null);

    try {
      // Analyze image with Vision AI
      const result = await visionAI.analyzeImage(imageUrl);
      setVisionResult(result);

      // Auto-create defects from critical findings
      if (!result.overallPass) {
        const criticalDefects = result.defectsDetected.filter((d) => d.severity === 'critical');
        criticalDefects.forEach((defect) => {
          const newDefect: Defect = {
            id: `defect-${Date.now()}-${Math.random()}`,
            category: defect.type,
            severity: defect.severity,
            description: `${defect.description} (AI detected - ${(defect.confidence * 100).toFixed(1)}% confidence)`,
            quantity: 1,
            timestamp: new Date(),
          };
          setDefects((prev) => [newDefect, ...prev]);
        });
      }

      toast({
        title: result.overallPass ? 'Inspection Passed' : 'Defects Detected',
        description: result.overallPass
          ? `Quality score: ${result.qualityScore}/100`
          : `${result.defectsDetected.length} defect(s) found`,
      });
    } catch (error) {
      console.error('Vision AI analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Could not analyze image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUseSampleImage = async (_sampleId: string) => {
    // Use a mock sample image URL
    const sampleUrl = `https://placeholder.com/sample-product-${Date.now()}.jpg`;
    setSelectedImage(sampleUrl);
    setIsAnalyzing(true);
    setVisionResult(null);

    try {
      const result = await visionAI.analyzeImage(sampleUrl);
      setVisionResult(result);

      toast({
        title: 'Sample Image Analyzed',
        description: `Quality score: ${result.qualityScore}/100`,
      });
    } catch (error) {
      console.error('Vision AI analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
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
        <button
          onClick={() => {
            setActiveTab('vision-ai');
          }}
          className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'vision-ai'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Vision AI
        </button>
      </div>

      {/* Vision AI Tab */}
      {activeTab === 'vision-ai' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI-Powered Visual Inspection</h2>
                <p className="text-sm text-muted-foreground">
                  Upload product images for automatic defect detection
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload Section */}
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">Click to upload image</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                  </label>
                </div>

                <Button
                  onClick={() => handleUseSampleImage('sample-1')}
                  variant="outline"
                  className="w-full"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Use Sample Image
                </Button>

                {isAnalyzing && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing image with AI...
                  </div>
                )}
              </div>

              {/* Results Section */}
              <div>
                {selectedImage && (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border">
                      <img src={selectedImage} alt="Inspection" className="w-full h-auto" />
                      {visionResult?.defectsDetected.map((defect, idx) => (
                        <div
                          key={idx}
                          className="absolute border-2 border-red-500"
                          style={{
                            left: `${defect.boundingBox.x}%`,
                            top: `${defect.boundingBox.y}%`,
                            width: `${defect.boundingBox.width}%`,
                            height: `${defect.boundingBox.height}%`,
                          }}
                        >
                          <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            {defect.type} ({(defect.confidence * 100).toFixed(0)}%)
                          </div>
                        </div>
                      ))}
                    </div>

                    {visionResult && (
                      <Card className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Quality Score</span>
                            <span className="text-2xl font-bold">
                              {visionResult.qualityScore}/100
                            </span>
                          </div>
                          <Progress value={visionResult.qualityScore} />
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Overall Result</span>
                            <span
                              className={`font-semibold ${visionResult.overallPass ? 'text-green-600' : 'text-red-600'}`}
                            >
                              {visionResult.overallPass ? 'PASS' : 'FAIL'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Processing Time</span>
                            <span>{visionResult.processingTimeMs}ms</span>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                )}

                {!selectedImage && !isAnalyzing && (
                  <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    <div>
                      <Camera className="w-16 h-16 mx-auto mb-3 opacity-50" />
                      <p>Upload an image to start inspection</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Defects Detected */}
            {visionResult && visionResult.defectsDetected.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">
                  Defects Detected ({visionResult.defectsDetected.length})
                </h3>
                <div className="space-y-2">
                  {visionResult.defectsDetected.map((defect, idx) => (
                    <Card
                      key={idx}
                      className={`p-3 border-l-4 ${
                        defect.severity === 'critical'
                          ? 'border-l-red-500 bg-red-50'
                          : defect.severity === 'major'
                            ? 'border-l-orange-500 bg-orange-50'
                            : 'border-l-yellow-500 bg-yellow-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm capitalize">
                              {defect.type.replace('-', ' ')}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                defect.severity === 'critical'
                                  ? 'bg-red-200 text-red-700'
                                  : defect.severity === 'major'
                                    ? 'bg-orange-200 text-orange-700'
                                    : 'bg-yellow-200 text-yellow-700'
                              }`}
                            >
                              {defect.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{defect.description}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>Confidence: {(defect.confidence * 100).toFixed(1)}%</span>
                            <span>Model: {defect.aiModel}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

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
