import { useState, useEffect } from 'react';
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Droplet,
  Gauge,
  DollarSign,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import {
  yieldPredictionAI,
  type YieldPrediction,
  type YieldAnalytics,
  type MaterialBatch,
} from '@/services/yieldPredictionAI';

export function YieldPredictionPage() {
  const { toast } = useToast();
  const [prediction, setPrediction] = useState<YieldPrediction | null>(null);
  const [analytics, setAnalytics] = useState<YieldAnalytics | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<MaterialBatch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'prediction' | 'analytics' | 'materials'>(
    'prediction'
  );

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [predData, analyticsData] = await Promise.all([
        yieldPredictionAI.predictYield('line-1', 'Line 1', 'prod-001', 'Premium Juice 1L', {
          speed: 2350,
          temperature: 71.5,
          materialBatchId: 'BATCH-2024-A123',
          runTime: 180,
          currentDefectRate: 0.028,
        }),
        yieldPredictionAI.getYieldAnalytics('line-1', 7),
      ]);

      setPrediction(predData);
      setAnalytics(analyticsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load yield data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'degrading':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <BarChart3 className="w-5 h-5 text-blue-600" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Yield Prediction & Loss Prevention</h1>
          <p className="text-muted-foreground">
            AI-powered yield forecasting and real-time loss prevention
          </p>
        </div>
        <Button onClick={loadData} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'prediction' ? 'default' : 'outline'}
          onClick={() => setActiveTab('prediction')}
        >
          Live Prediction
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'outline'}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </Button>
        <Button
          variant={activeTab === 'materials' ? 'default' : 'outline'}
          onClick={() => setActiveTab('materials')}
        >
          Material Batches
        </Button>
      </div>

      {/* Live Prediction Tab */}
      {activeTab === 'prediction' && prediction && (
        <div className="space-y-6">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Current Yield</span>
                {getTrendIcon(prediction.trend)}
              </div>
              <div className="text-3xl font-bold">{prediction.currentYield.toFixed(1)}%</div>
              <Progress value={prediction.currentYield} className="mt-2" />
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Predicted Yield</span>
                <Gauge className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold">{prediction.predictedYield.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                Confidence: {(prediction.confidence * 100).toFixed(0)}%
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Estimated Loss</span>
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-3xl font-bold">${prediction.estimatedLoss.costUSD}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {prediction.estimatedLoss.units} units
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Material Waste</span>
                <Droplet className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-3xl font-bold">{prediction.estimatedLoss.materialWaste} kg</div>
              <div className="text-xs text-muted-foreground mt-1">Per shift estimate</div>
            </Card>
          </div>

          {/* Alerts */}
          {prediction.alerts.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Active Alerts ({prediction.alerts.length})
              </h2>
              <div className="space-y-3">
                {prediction.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'critical'
                        ? 'border-red-500 bg-red-50'
                        : alert.severity === 'warning'
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              alert.severity === 'critical'
                                ? 'bg-red-200 text-red-700'
                                : alert.severity === 'warning'
                                  ? 'bg-yellow-200 text-yellow-700'
                                  : 'bg-blue-200 text-blue-700'
                            }`}
                          >
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className="font-semibold">{alert.message}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.recommendation}</p>
                        <div className="text-xs text-muted-foreground">
                          Impact: ${Math.round(alert.estimatedImpact).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recommendations */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              AI Recommendations
            </h2>
            <div className="space-y-2">
              {prediction.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-accent rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-2">7-Day Average Yield</div>
              <div className="text-3xl font-bold">{analytics.averageYield}%</div>
              <Progress value={analytics.averageYield} className="mt-2" />
            </Card>

            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-2">Potential Savings</div>
              <div className="text-3xl font-bold text-green-600">
                ${analytics.potentialSavings.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">By closing yield gap</div>
            </Card>

            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-2">Trend</div>
              <div className="flex items-center gap-2">
                {analytics.yieldTrend[analytics.yieldTrend.length - 1].yield >
                analytics.yieldTrend[0].yield ? (
                  <>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">Improving</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-8 h-8 text-red-600" />
                    <span className="text-2xl font-bold text-red-600">Declining</span>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* Top Loss Causes */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Top Loss Causes</h2>
            <div className="space-y-3">
              {analytics.topLossCauses.map((cause, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{cause.cause}</span>
                    <div className="text-sm">
                      <span className="font-semibold">{cause.percentage}%</span>
                      <span className="text-muted-foreground ml-2">
                        ${cause.costUSD.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Progress value={cause.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          {/* Yield Trend Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">7-Day Yield Trend</h2>
            <div className="h-64 flex items-end gap-1">
              {analytics.yieldTrend.map((point, idx) => {
                const height = (point.yield / 100) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-versuni-primary rounded-t transition-all hover:opacity-80 cursor-pointer relative group"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs px-2 py-1 rounded">
                        {point.yield.toFixed(1)}%
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {point.timestamp.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Material Batches Tab */}
      {activeTab === 'materials' && analytics && (
        <div className="space-y-6">
          {/* Best Performing */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Best Performing Batches
            </h2>
            <div className="space-y-3">
              {analytics.bestPerformingBatches.map((batch) => (
                <div
                  key={batch.batchId}
                  className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => setSelectedBatch(batch)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{batch.batchId}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(batch.riskLevel)}`}
                        >
                          {batch.riskLevel} risk
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {batch.materialName} • {batch.supplier}
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Quality:</span>
                          <span className="font-medium ml-1">{batch.qualityScore}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Yield:</span>
                          <span className="font-medium ml-1">{batch.predictedYield}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Moisture:</span>
                          <span className="font-medium ml-1">{batch.testResults.moisture}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Purity:</span>
                          <span className="font-medium ml-1">{batch.testResults.purity}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Worst Performing */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              Needs Attention
            </h2>
            <div className="space-y-3">
              {analytics.worstPerformingBatches.map((batch) => (
                <div
                  key={batch.batchId}
                  className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => setSelectedBatch(batch)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{batch.batchId}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(batch.riskLevel)}`}
                        >
                          {batch.riskLevel} risk
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {batch.materialName} • {batch.supplier}
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Quality:</span>
                          <span className="font-medium ml-1">{batch.qualityScore}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Yield:</span>
                          <span className="font-medium ml-1">{batch.predictedYield}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Moisture:</span>
                          <span className="font-medium ml-1">{batch.testResults.moisture}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Purity:</span>
                          <span className="font-medium ml-1">{batch.testResults.purity}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Batch Detail Modal */}
          {selectedBatch && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Batch Details</h2>
                  <Button variant="ghost" onClick={() => setSelectedBatch(null)}>
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Batch ID</span>
                      <p className="font-semibold">{selectedBatch.batchId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Material</span>
                      <p className="font-semibold">{selectedBatch.materialName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Supplier</span>
                      <p className="font-semibold">{selectedBatch.supplier}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Quality Score</span>
                      <p className="font-semibold">{selectedBatch.qualityScore}/100</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Test Results</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedBatch.testResults.moisture && (
                        <div className="p-3 bg-accent rounded">
                          <span className="text-sm text-muted-foreground">Moisture</span>
                          <p className="text-lg font-bold">{selectedBatch.testResults.moisture}%</p>
                        </div>
                      )}
                      {selectedBatch.testResults.purity && (
                        <div className="p-3 bg-accent rounded">
                          <span className="text-sm text-muted-foreground">Purity</span>
                          <p className="text-lg font-bold">{selectedBatch.testResults.purity}%</p>
                        </div>
                      )}
                      {selectedBatch.testResults.viscosity && (
                        <div className="p-3 bg-accent rounded">
                          <span className="text-sm text-muted-foreground">Viscosity</span>
                          <p className="text-lg font-bold">
                            {selectedBatch.testResults.viscosity} cP
                          </p>
                        </div>
                      )}
                      {selectedBatch.testResults.ph && (
                        <div className="p-3 bg-accent rounded">
                          <span className="text-sm text-muted-foreground">pH</span>
                          <p className="text-lg font-bold">{selectedBatch.testResults.ph}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-muted-foreground">Predicted Yield</span>
                        <p className="text-2xl font-bold text-green-600">
                          {selectedBatch.predictedYield}%
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">Risk Level</span>
                        <p
                          className={`text-lg font-bold ${
                            selectedBatch.riskLevel === 'low'
                              ? 'text-green-600'
                              : selectedBatch.riskLevel === 'medium'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                          }`}
                        >
                          {selectedBatch.riskLevel.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
