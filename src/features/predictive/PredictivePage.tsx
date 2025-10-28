import { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  Clock,
  Target,
  Brain,
  Activity,
  Wrench,
  Calendar,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface PredictiveInsight {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: 'failure-prediction' | 'anomaly-detection' | 'degradation' | 'optimization';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  title: string;
  description: string;
  prediction: string;
  timeToFailure?: string;
  recommendedAction: string;
  estimatedDowntime?: string;
  costImpact?: string;
  mlModel: string;
  dataPoints: number;
  timestamp: Date;
  metrics?: { name: string; value: number; unit: string; trend: 'up' | 'down' | 'stable' }[];
}

const mockInsights: PredictiveInsight[] = [
  {
    id: 'pred-1',
    equipmentId: 'bearing-pump-2',
    equipmentName: 'Hydraulic Pump 2 - Bearing',
    type: 'failure-prediction',
    severity: 'critical',
    confidence: 94.2,
    title: 'Bearing Failure Predicted',
    description: 'Vibration analysis indicates bearing degradation beyond normal operating parameters',
    prediction: 'Bearing failure expected within 48-72 hours if not addressed',
    timeToFailure: '48-72 hours',
    recommendedAction: 'Schedule immediate bearing replacement. Order part P/N 67890. Estimated 3-hour maintenance window.',
    estimatedDowntime: '3 hours',
    costImpact: '$2,400 (planned) vs $15,000 (unplanned failure)',
    mlModel: 'Random Forest Classifier',
    dataPoints: 15840,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    metrics: [
      { name: 'Vibration', value: 8.2, unit: 'mm/s', trend: 'up' },
      { name: 'Temperature', value: 78, unit: '°C', trend: 'up' },
      { name: 'Operating Hours', value: 8420, unit: 'hrs', trend: 'up' },
    ],
  },
  {
    id: 'pred-2',
    equipmentId: 'motor-filler-2',
    equipmentName: 'Filler-2 Drive Motor',
    type: 'degradation',
    severity: 'medium',
    confidence: 87.5,
    title: 'Motor Performance Degradation',
    description: 'Current draw increasing steadily over 14 days. Motor efficiency declining.',
    prediction: 'Motor winding degradation. Performance will drop 15% in next 30 days.',
    timeToFailure: '25-35 days',
    recommendedAction: 'Schedule motor inspection during next planned maintenance window. Check windings and bearings.',
    estimatedDowntime: '4 hours',
    costImpact: '$3,800 (preventive) vs $22,000 (emergency replacement)',
    mlModel: 'LSTM Neural Network',
    dataPoints: 20160,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    metrics: [
      { name: 'Current Draw', value: 24.8, unit: 'A', trend: 'up' },
      { name: 'Efficiency', value: 87.2, unit: '%', trend: 'down' },
      { name: 'Temperature', value: 72, unit: '°C', trend: 'up' },
    ],
  },
  {
    id: 'pred-3',
    equipmentId: 'belt-conveyor-1',
    equipmentName: 'Conveyor Belt 1',
    type: 'anomaly-detection',
    severity: 'low',
    confidence: 76.8,
    title: 'Belt Tension Anomaly Detected',
    description: 'Belt tension showing irregular patterns. Not critical yet but trending outside normal range.',
    prediction: 'Belt may require adjustment within 7-10 days to prevent uneven wear.',
    timeToFailure: '7-10 days',
    recommendedAction: 'Add belt tension check to next routine inspection. Monitor daily until adjusted.',
    estimatedDowntime: '30 minutes',
    costImpact: '$150 (adjustment) vs $4,200 (belt replacement)',
    mlModel: 'Isolation Forest',
    dataPoints: 10080,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    metrics: [
      { name: 'Tension', value: 142, unit: 'N', trend: 'down' },
      { name: 'Vibration', value: 3.1, unit: 'mm/s', trend: 'up' },
      { name: 'Speed Variance', value: 2.4, unit: '%', trend: 'up' },
    ],
  },
  {
    id: 'pred-4',
    equipmentId: 'valve-filler-3',
    equipmentName: 'Filler-3 Control Valve',
    type: 'optimization',
    severity: 'medium',
    confidence: 91.3,
    title: 'Valve Response Time Increasing',
    description: 'Valve actuation time has increased 23% over baseline. Affecting fill accuracy.',
    prediction: 'Valve seal degradation. Will impact product quality if not serviced.',
    timeToFailure: '14-21 days',
    recommendedAction: 'Replace valve seals during weekend maintenance. Recalibrate after replacement.',
    estimatedDowntime: '2 hours',
    costImpact: '$850 (seal replacement) vs $8,500 (valve replacement)',
    mlModel: 'Gradient Boosting',
    dataPoints: 43200,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    metrics: [
      { name: 'Response Time', value: 187, unit: 'ms', trend: 'up' },
      { name: 'Cycle Count', value: 124500, unit: 'cycles', trend: 'up' },
      { name: 'Pressure Drop', value: 2.8, unit: 'bar', trend: 'up' },
    ],
  },
];

export function PredictivePage() {
  const { toast } = useToast();
  const [insights] = useState<PredictiveInsight[]>(mockInsights);
  const [selectedInsight, setSelectedInsight] = useState<PredictiveInsight | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const handleCreateWorkOrder = (insight: PredictiveInsight) => {
    toast({
      title: 'Work order created',
      description: `Preventive maintenance scheduled for ${insight.equipmentName}`,
    });
    setSelectedInsight(null);
  };

  const handleSnooze = (_insight: PredictiveInsight) => {
    toast({
      title: 'Insight snoozed',
      description: 'You will be reminded in 24 hours',
    });
    setSelectedInsight(null);
  };

  const getSeverityColor = (severity: PredictiveInsight['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-300';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-300';
    }
  };

  const getTypeIcon = (type: PredictiveInsight['type']) => {
    switch (type) {
      case 'failure-prediction': return <AlertTriangle className="w-5 h-5" />;
      case 'anomaly-detection': return <Activity className="w-5 h-5" />;
      case 'degradation': return <TrendingUp className="w-5 h-5" />;
      case 'optimization': return <Target className="w-5 h-5" />;
    }
  };

  const getTypeName = (type: PredictiveInsight['type']) => {
    switch (type) {
      case 'failure-prediction': return 'Failure Prediction';
      case 'anomaly-detection': return 'Anomaly Detection';
      case 'degradation': return 'Degradation Analysis';
      case 'optimization': return 'Performance Optimization';
    }
  };

  const filteredInsights = filterSeverity === 'all' 
    ? insights 
    : insights.filter(i => i.severity === filterSeverity);

  const criticalCount = insights.filter(i => i.severity === 'critical').length;
  const avgConfidence = insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length;
  const totalCostAvoidance = insights.reduce((sum, i) => {
    const match = i.costImpact?.match(/\$([0-9,]+)/g);
    if (match && match.length === 2) {
      const preventive = parseInt(match[0].replace(/[$,]/g, ''));
      const unplanned = parseInt(match[1].replace(/[$,]/g, ''));
      return sum + (unplanned - preventive);
    }
    return sum;
  }, 0);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-bold">Predictive Maintenance</h1>
        </div>
        <p className="text-muted-foreground">
          AI-powered insights to prevent failures before they happen
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Insights</p>
              <p className="text-2xl font-bold">{insights.length}</p>
            </div>
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Confidence</p>
              <p className="text-2xl font-bold">{avgConfidence.toFixed(1)}%</p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cost Avoidance</p>
              <p className="text-2xl font-bold">${(totalCostAvoidance / 1000).toFixed(0)}k</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter by severity:</span>
          <div className="flex gap-2">
            {['all', 'critical', 'high', 'medium', 'low'].map((severity) => (
              <button
                key={severity}
                onClick={() => setFilterSeverity(severity)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterSeverity === severity
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => (
          <Card
            key={insight.id}
            className={`p-4 border-l-4 cursor-pointer hover:shadow-lg transition-shadow ${
              getSeverityColor(insight.severity)
            }`}
            onClick={() => setSelectedInsight(insight)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${getSeverityColor(insight.severity)}`}>
                    {getTypeIcon(insight.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{insight.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(insight.severity)}`}>
                        {insight.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.equipmentName}</p>
                  </div>
                </div>

                <p className="text-sm mb-3">{insight.description}</p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    <span>{insight.mlModel}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{insight.timeToFailure || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span>{insight.confidence.toFixed(1)}% confidence</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Confidence:</span>
                  <Progress value={insight.confidence} className="flex-1 max-w-xs" />
                  <span className="text-xs font-medium">{insight.confidence.toFixed(1)}%</span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${getSeverityColor(selectedInsight.severity)}`}>
                  {getTypeIcon(selectedInsight.type)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedInsight.title}</h2>
                  <p className="text-muted-foreground">{selectedInsight.equipmentName}</p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => setSelectedInsight(null)}>
                Close
              </Button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(selectedInsight.severity)}`}>
                {selectedInsight.severity.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-600">
                {getTypeName(selectedInsight.type)}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                {selectedInsight.confidence.toFixed(1)}% Confidence
              </span>
            </div>

            {/* Prediction */}
            <Card className="p-4 mb-4 bg-muted/30">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Prediction
              </h3>
              <p className="text-sm">{selectedInsight.prediction}</p>
            </Card>

            {/* Metrics */}
            {selectedInsight.metrics && (
              <Card className="p-4 mb-4">
                <h3 className="font-semibold mb-3">Current Metrics</h3>
                <div className="grid grid-cols-3 gap-4">
                  {selectedInsight.metrics.map((metric, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className="text-xs text-muted-foreground">{metric.unit}</div>
                      <div className="text-xs font-medium mt-1">{metric.name}</div>
                      <div className={`text-xs mt-1 flex items-center justify-center gap-1 ${
                        metric.trend === 'up' ? 'text-red-600' : metric.trend === 'down' ? 'text-green-600' : 'text-muted-foreground'
                      }`}>
                        {metric.trend === 'up' && '↑'}
                        {metric.trend === 'down' && '↓'}
                        {metric.trend === 'stable' && '→'}
                        {metric.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Time to Failure</span>
                </div>
                <p className="text-lg font-semibold">{selectedInsight.timeToFailure || 'Unknown'}</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Wrench className="w-4 h-4" />
                  <span className="text-sm font-medium">Estimated Downtime</span>
                </div>
                <p className="text-lg font-semibold">{selectedInsight.estimatedDowntime || 'N/A'}</p>
              </Card>

              <Card className="p-4 col-span-2">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Cost Impact</span>
                </div>
                <p className="text-lg font-semibold">{selectedInsight.costImpact}</p>
              </Card>
            </div>

            {/* Recommended Action */}
            <Card className="p-4 mb-4 bg-green-50 border-green-200">
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-green-700">
                <Target className="w-4 h-4" />
                Recommended Action
              </h3>
              <p className="text-sm">{selectedInsight.recommendedAction}</p>
            </Card>

            {/* ML Model Info */}
            <Card className="p-4 mb-6 bg-purple-50 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">ML Model</span>
                  </div>
                  <p className="text-sm font-semibold">{selectedInsight.mlModel}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Data Points</div>
                  <p className="text-sm font-semibold">{selectedInsight.dataPoints.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                className="flex-1" 
                onClick={() => handleCreateWorkOrder(selectedInsight)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Create Work Order
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSnooze(selectedInsight)}
              >
                <Clock className="w-4 h-4 mr-2" />
                Snooze 24h
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedInsight(null)}
              >
                Dismiss
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
