import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Sparkles,
  TrendingUp,
  Zap,
  ThermometerSun,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Activity,
  ArrowUp,
  ArrowDown,
  Loader2,
} from 'lucide-react';
import { optimizationAI, type OptimizationRecommendation } from '@/services/optimizationAI';

export default function OptimizationPage() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [overallImpact, setOverallImpact] = useState<number>(0);

  // Sample machine data
  const sampleMachines = [
    {
      id: 'line-1-molding',
      name: 'Line 1 - Molding Machine',
      parameters: { speed: 2250, temperature: 75, pressure: 88, oee: 0.78, quality: 0.94 },
    },
    {
      id: 'line-2-assembly',
      name: 'Line 2 - Assembly Robot',
      parameters: { speed: 2450, temperature: 68, pressure: 102, oee: 0.82, quality: 0.91 },
    },
    {
      id: 'line-3-packaging',
      name: 'Line 3 - Packaging Unit',
      parameters: { speed: 2100, temperature: 70, pressure: 93, oee: 0.85, quality: 0.97 },
    },
  ];

  const analyzeProduction = async () => {
    setIsAnalyzing(true);
    try {
      const allRecommendations: OptimizationRecommendation[] = [];

      // Analyze each machine
      for (const machine of sampleMachines) {
        const result = await optimizationAI.analyzeProductionParameters(
          machine.id,
          machine.name,
          machine.parameters
        );
        allRecommendations.push(...result.recommendations);
      }

      setRecommendations(allRecommendations);

      // Calculate overall impact
      const impact = optimizationAI.calculateCumulativeImpact(allRecommendations);
      setOverallImpact(impact.totalOeeGain);

      toast({
        title: 'Analysis Complete',
        description: `Found ${allRecommendations.length} optimization opportunities`,
      });
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: 'Failed to analyze production parameters',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    // Auto-run analysis on mount
    analyzeProduction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getParameterIcon = (parameter: string) => {
    switch (parameter.toLowerCase()) {
      case 'speed':
        return <Gauge className="w-4 h-4" />;
      case 'temperature':
        return <ThermometerSun className="w-4 h-4" />;
      case 'pressure':
        return <Activity className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const implementRecommendation = (_recId: string) => {
    toast({
      title: 'Recommendation Implemented',
      description: 'Parameter adjustment scheduled for next maintenance window',
    });
    // In a real system, this would trigger parameter updates
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          AI Production Optimization
        </h1>
        <p className="text-muted-foreground">
          Real-time AI recommendations to improve OEE, quality, and efficiency
        </p>
      </div>

      {/* Overall Impact Summary */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Optimization Potential</h3>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-3xl font-bold text-primary">+{overallImpact.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Estimated OEE Gain</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{recommendations.length}</p>
                <p className="text-sm text-muted-foreground">Recommendations</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  $
                  {recommendations
                    .reduce((sum, rec) => sum + rec.estimatedImpact.costSavings, 0)
                    .toFixed(0)}
                  /hr
                </p>
                <p className="text-sm text-muted-foreground">Cost Savings</p>
              </div>
            </div>
          </div>
          <Button onClick={analyzeProduction} disabled={isAnalyzing} size="lg">
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Re-analyze
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Quick Wins Section */}
      {recommendations.filter((r) => r.priority === 'high' && r.implementationComplexity === 'easy')
        .length > 0 && (
        <Card className="p-6 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-600" />
            Quick Wins (High Impact, Easy Implementation)
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            These recommendations can be implemented immediately with minimal effort
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations
              .filter((r) => r.priority === 'high' && r.implementationComplexity === 'easy')
              .map((rec) => (
                <Card key={rec.id} className="p-3 bg-white dark:bg-gray-950">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {getParameterIcon(rec.parameter)}
                      <span className="font-semibold text-sm">{rec.equipment}</span>
                    </div>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      +{rec.estimatedImpact.oeeGain.toFixed(1)}% OEE
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {rec.parameter}: {rec.currentValue} → {rec.recommendedValue} {rec.unit}
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => implementRecommendation(rec.id)}
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Implement
                  </Button>
                </Card>
              ))}
          </div>
        </Card>
      )}

      {/* All Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">All Recommendations</h3>
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50 text-green-500" />
            <p>No optimization opportunities found. All parameters are optimal!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Icon and Priority */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      {getParameterIcon(rec.parameter)}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(rec.priority)}`}
                    >
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-base">{rec.equipment}</h4>
                        <p className="text-sm text-muted-foreground">
                          {rec.parameter} Optimization
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          +{rec.estimatedImpact.oeeGain.toFixed(1)}% OEE
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(rec.confidence * 100).toFixed(0)}% confidence
                        </p>
                      </div>
                    </div>

                    {/* Current vs Recommended */}
                    <div className="flex items-center gap-4 mb-3 p-3 bg-accent/50 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Current</p>
                        <p className="text-lg font-bold">
                          {rec.currentValue} {rec.unit}
                        </p>
                      </div>
                      <div className="text-primary">
                        {rec.recommendedValue > rec.currentValue ? (
                          <ArrowUp className="w-5 h-5" />
                        ) : (
                          <ArrowDown className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Recommended</p>
                        <p className="text-lg font-bold text-primary">
                          {rec.recommendedValue} {rec.unit}
                        </p>
                      </div>
                    </div>

                    {/* Reasoning */}
                    <p className="text-sm mb-3">{rec.reasoning}</p>

                    {/* Impact Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-xs text-muted-foreground">Quality</p>
                          <p className="text-sm font-semibold">
                            +{rec.estimatedImpact.qualityImprovement.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-xs text-muted-foreground">Savings</p>
                          <p className="text-sm font-semibold">
                            ${rec.estimatedImpact.costSavings.toFixed(0)}/hr
                          </p>
                        </div>
                      </div>
                      {rec.estimatedImpact.energySavings && (
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">Energy</p>
                            <p className="text-sm font-semibold">
                              {rec.estimatedImpact.energySavings.toFixed(1)} kWh/hr
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <div>
                          <p className="text-xs text-muted-foreground">Risk</p>
                          <p className="text-sm font-semibold capitalize">{rec.predictedRisk}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button onClick={() => implementRecommendation(rec.id)} size="sm">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Implement
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
