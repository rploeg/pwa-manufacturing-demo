import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Award,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { agentService } from '@/data/clients/agent';
import { Markdown } from '@/components/ui/markdown';

interface LineOEE {
  lineId: string;
  lineName: string;
  overallOEE: number;
  availability: number;
  performance: number;
  quality: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  microStops: number; // minutes per day
  bestPractices: string[];
  improvementOpportunities: string[];
}

interface BestPractice {
  id: string;
  title: string;
  description: string;
  category: 'availability' | 'performance' | 'quality';
  implementedBy: string[];
  impact: string;
  effort: 'low' | 'medium' | 'high';
  roi: number; // OEE points gained
}

interface CoachingRecommendation {
  lineId: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  recommendation: string;
  expectedGain: number; // OEE points
  timeline: string;
  resources: string[];
}

// Mock data: Line OEE performance
const linePerformance: LineOEE[] = [
  {
    lineId: 'line-b',
    lineName: 'Line-B',
    overallOEE: 86.2,
    availability: 94.5,
    performance: 93.8,
    quality: 97.2,
    target: 85.0,
    trend: 'up',
    microStops: 12,
    bestPractices: [
      'SMED changeover process',
      'Predictive maintenance on critical motors',
      'Operator-led quality checks',
    ],
    improvementOpportunities: [
      'Reduce micro-stops during product changes',
      'Optimize belt tracking adjustments',
    ],
  },
  {
    lineId: 'line-a',
    lineName: 'Line-A',
    overallOEE: 78.3,
    availability: 88.2,
    performance: 92.5,
    quality: 96.0,
    target: 85.0,
    trend: 'stable',
    microStops: 25,
    bestPractices: ['Daily team huddles', 'Visual management boards'],
    improvementOpportunities: [
      'Reduce unplanned downtime (availability issue)',
      'Adopt Line-B SMED practices',
      'Address micro-stops (hidden performance loss)',
    ],
  },
  {
    lineId: 'line-c',
    lineName: 'Line-C',
    overallOEE: 73.1,
    availability: 85.0,
    performance: 88.2,
    quality: 97.5,
    target: 85.0,
    trend: 'down',
    microStops: 35,
    bestPractices: ['Standard work documentation'],
    improvementOpportunities: [
      'Critical: Address slow cycle times (performance issue)',
      'Investigate frequent small stops',
      'Consider equipment upgrades or overhaul',
      'Cross-train operators with Line-B team',
    ],
  },
];

// Mock data: Best practice library
const bestPractices: BestPractice[] = [
  {
    id: 'bp-001',
    title: 'SMED Changeover Process',
    description:
      'Reduced changeover time from 45 min to 28 min through parallel activities, pre-staging, and quick-change fixtures.',
    category: 'availability',
    implementedBy: ['line-b'],
    impact: '+3.2% OEE gain',
    effort: 'medium',
    roi: 3.2,
  },
  {
    id: 'bp-002',
    title: 'Predictive Maintenance with Vibration Sensors',
    description:
      'Installed sensors on critical motors. Reduced unplanned downtime from 4hrs/week to 1.5hrs/week.',
    category: 'availability',
    implementedBy: ['line-b'],
    impact: '+2.8% OEE gain',
    effort: 'high',
    roi: 2.8,
  },
  {
    id: 'bp-003',
    title: 'Operator-Led In-Process Checks',
    description:
      'Operators perform quality checks every 50 units. Improved first-pass yield from 94.5% to 97.8%.',
    category: 'quality',
    implementedBy: ['line-b'],
    impact: '+1.5% OEE gain',
    effort: 'low',
    roi: 1.5,
  },
  {
    id: 'bp-004',
    title: 'Micro-Stop Tracking System',
    description:
      'Operators log stops <5min on tablet. Identified jam-prone areas and reduced micro-stops by 40%.',
    category: 'performance',
    implementedBy: ['line-b'],
    impact: '+2.1% OEE gain',
    effort: 'low',
    roi: 2.1,
  },
  {
    id: 'bp-005',
    title: 'Daily Start-up Checklist',
    description: 'Standardized startup procedure. Reduced first-hour defects and startup time.',
    category: 'availability',
    implementedBy: ['line-a', 'line-b'],
    impact: '+1.2% OEE gain',
    effort: 'low',
    roi: 1.2,
  },
];

// Mock data: Coaching recommendations
const coachingRecommendations: CoachingRecommendation[] = [
  {
    lineId: 'line-c',
    priority: 'high',
    category: 'Performance',
    recommendation:
      'Investigate slow cycle times - currently running 12% below standard. Likely causes: worn belts, misalignment, or outdated control logic.',
    expectedGain: 4.5,
    timeline: '2-3 weeks',
    resources: ['Maintenance technician', 'Controls engineer', '$2,500 budget for parts'],
  },
  {
    lineId: 'line-a',
    priority: 'high',
    category: 'Availability',
    recommendation:
      'Adopt Line-B SMED practices to reduce changeover time. Current 45 min vs Line-B 28 min.',
    expectedGain: 3.2,
    timeline: '4 weeks',
    resources: [
      'SMED training (2 days)',
      'Line-B operator as coach',
      'Quick-change fixtures ($1,200)',
    ],
  },
  {
    lineId: 'line-c',
    priority: 'high',
    category: 'Performance',
    recommendation:
      'Implement micro-stop tracking (like Line-B). Estimate 35 min/day of hidden losses.',
    expectedGain: 2.5,
    timeline: '1 week',
    resources: ['Tablet app setup', 'Operator training (1 hour)'],
  },
  {
    lineId: 'line-a',
    priority: 'medium',
    category: 'Availability',
    recommendation: 'Install vibration sensors on primary drive motors for predictive maintenance.',
    expectedGain: 2.8,
    timeline: '6 weeks',
    resources: ['3 vibration sensors ($900 each)', 'Maintenance analytics software', 'Training'],
  },
  {
    lineId: 'line-c',
    priority: 'medium',
    category: 'Quality',
    recommendation: 'Cross-train operators with Line-B quality best practices.',
    expectedGain: 1.0,
    timeline: '2 weeks',
    resources: ['Line-B operator shadowing', 'Updated quality checksheets'],
  },
];

export default function OEECoachingPage() {
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'best-practices' | 'coaching'>('overview');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sortedLines = [...linePerformance].sort((a, b) => b.overallOEE - a.overallOEE);
  const topPerformer = sortedLines[0];
  const avgOEE =
    linePerformance.reduce((sum, line) => sum + line.overallOEE, 0) / linePerformance.length;

  const filteredRecommendations = selectedLine
    ? coachingRecommendations.filter((r) => r.lineId === selectedLine)
    : coachingRecommendations;

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAiAnalysis('');

    try {
      const prompt = `Analyze this OEE benchmarking data and provide coaching recommendations:

Overall Performance:
- Plant average OEE: ${avgOEE.toFixed(1)}%
- Top performer: ${topPerformer.lineName} at ${topPerformer.overallOEE}%
- Target: ${topPerformer.target}%

Line Performance:
${linePerformance
  .map(
    (line) => `
- ${line.lineName}: ${line.overallOEE}% OEE (Trend: ${line.trend})
  * Availability: ${line.availability}%
  * Performance: ${line.performance}%
  * Quality: ${line.quality}%
  * Micro-stops: ${line.microStops} min/day
  * Current practices: ${line.bestPractices.slice(0, 2).join(', ')}
  * Opportunities: ${line.improvementOpportunities.slice(0, 2).join(', ')}`
  )
  .join('\n')}

Best Practices Library:
${bestPractices
  .slice(0, 3)
  .map((bp) => `- ${bp.title} (${bp.category}, ${bp.impact}): ${bp.description}`)
  .join('\n')}

Current Coaching Recommendations:
${coachingRecommendations
  .slice(0, 3)
  .map(
    (rec) =>
      `- ${rec.lineId.toUpperCase()}: ${rec.recommendation} (Expected gain: ${rec.expectedGain}%, ${rec.timeline})`
  )
  .join('\n')}

Provide detailed coaching guidance:
1. Gap analysis: Why is there a performance gap between lines?
2. Transfer opportunities: What can underperforming lines learn from the top performer?
3. Priority actions: What should each line focus on first?
4. Quick wins: What changes can deliver immediate OEE gains?
5. Long-term strategy: What systemic improvements would benefit all lines?`;

      const stream = agentService.streamOrchestrator({
        messages: [
          { role: 'user', content: prompt, timestamp: new Date(), id: Date.now().toString() },
        ],
        maxTokens: 900,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        if (!chunk.done) {
          fullResponse += chunk.delta;
          setAiAnalysis(fullResponse);
        }
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      setAiAnalysis('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Trophy className="w-8 h-8 text-amber-500" />
          OEE Coaching & Benchmarking
        </h1>
        <p className="text-muted-foreground">
          Compare performance, share best practices, and drive continuous improvement
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={viewMode === 'overview' ? 'default' : 'outline'}
          onClick={() => setViewMode('overview')}
        >
          <Target className="w-4 h-4 mr-2" />
          Performance Overview
        </Button>
        <Button
          variant={viewMode === 'best-practices' ? 'default' : 'outline'}
          onClick={() => setViewMode('best-practices')}
        >
          <Award className="w-4 h-4 mr-2" />
          Best Practices
        </Button>
        <Button
          variant={viewMode === 'coaching' ? 'default' : 'outline'}
          onClick={() => setViewMode('coaching')}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Coaching Plans
        </Button>
      </div>

      {viewMode === 'overview' && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Plant Average OEE</span>
                <Target className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{avgOEE.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Target: 85%</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Top Performer</span>
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-bold">{topPerformer.lineName}</p>
              <p className="text-xs text-green-600">{topPerformer.overallOEE}% OEE</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Improvement Potential</span>
                <Zap className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-bold">+7.9%</p>
              <p className="text-xs text-muted-foreground">If all lines reach target</p>
            </Card>
          </div>

          {/* AI Analysis Card */}
          <Card className="p-6 mb-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  AI OEE Coaching Analysis
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Get AI-powered coaching recommendations based on line benchmarking
                </p>
              </div>
              <Button
                onClick={handleAIAnalysis}
                disabled={isAnalyzing}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </div>

            {aiAnalysis && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border">
                <Markdown>{aiAnalysis}</Markdown>
              </div>
            )}

            {!aiAnalysis && !isAnalyzing && (
              <div className="text-sm text-muted-foreground italic">
                Click "Analyze with AI" to get detailed coaching recommendations and best practice
                transfer opportunities.
              </div>
            )}
          </Card>

          {/* Line Comparison Cards */}
          <div className="space-y-4">
            {sortedLines.map((line, index) => {
              const isTopPerformer = index === 0;
              const gapToTarget = line.target - line.overallOEE;
              const gapToTop = topPerformer.overallOEE - line.overallOEE;

              return (
                <Card
                  key={line.lineId}
                  className={`p-6 ${isTopPerformer ? 'border-amber-500 border-2' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {isTopPerformer && <Trophy className="w-6 h-6 text-amber-500" />}
                      <div>
                        <h3 className="text-xl font-bold">{line.lineName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {line.trend === 'up' && (
                            <span className="text-green-600 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> Improving
                            </span>
                          )}
                          {line.trend === 'down' && (
                            <span className="text-red-600 flex items-center gap-1">
                              <TrendingDown className="w-3 h-3" /> Declining
                            </span>
                          )}
                          {line.trend === 'stable' && <span className="text-gray-600">Stable</span>}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">{line.overallOEE}%</p>
                      <p className="text-sm text-muted-foreground">OEE</p>
                      {gapToTarget < 0 ? (
                        <p className="text-xs text-green-600 mt-1">✓ Above target</p>
                      ) : (
                        <p className="text-xs text-amber-600 mt-1">
                          {gapToTarget.toFixed(1)}% below target
                        </p>
                      )}
                    </div>
                  </div>

                  {/* OEE Components */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Availability</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${line.availability}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{line.availability}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Performance</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${line.performance}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{line.performance}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Quality</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                          <div
                            className="h-full bg-purple-500"
                            style={{ width: `${line.quality}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{line.quality}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Micro-stops Alert */}
                  <div className="mb-4 p-3 bg-amber-50 rounded border border-amber-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <p className="text-sm">
                        <strong>Micro-stops:</strong> {line.microStops} min/day of hidden losses
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* What's Working */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        What's Working
                      </h4>
                      <ul className="text-sm space-y-1">
                        {line.bestPractices.map((practice, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-600">•</span>
                            <span>{practice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Opportunities */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                        Improvement Opportunities
                      </h4>
                      <ul className="text-sm space-y-1">
                        {line.improvementOpportunities.map((opp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>{opp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {!isTopPerformer && gapToTop > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-blue-900">
                        <strong>Gap to Top Performer:</strong> {gapToTop.toFixed(1)}% OEE points = ~
                        {Math.round(gapToTop * 8)} units/day potential gain
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}

      {viewMode === 'best-practices' && (
        <div className="space-y-4">
          <Card className="p-6 bg-amber-50 border-amber-200 mb-6">
            <div className="flex items-start gap-3">
              <Award className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Best Practice Library</h3>
                <p className="text-sm text-amber-800">
                  Proven improvements from {topPerformer.lineName}. These practices drove their OEE
                  from 78% to {topPerformer.overallOEE}% over 4 months.
                </p>
              </div>
            </div>
          </Card>

          {bestPractices.map((practice) => (
            <Card key={practice.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{practice.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        practice.category === 'availability'
                          ? 'bg-blue-100 text-blue-800'
                          : practice.category === 'performance'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {practice.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{practice.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Impact:</span>
                      <span className="font-semibold text-green-600 ml-1">{practice.impact}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Effort:</span>
                      <span
                        className={`font-semibold ml-1 ${
                          practice.effort === 'low'
                            ? 'text-green-600'
                            : practice.effort === 'medium'
                              ? 'text-amber-600'
                              : 'text-red-600'
                        }`}
                      >
                        {practice.effort}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Implemented by:</span>
                      <span className="font-semibold ml-1">
                        {practice.implementedBy
                          .map((id) => linePerformance.find((l) => l.lineId === id)?.lineName)
                          .join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="text-3xl font-bold text-green-600">+{practice.roi}%</div>
                  <p className="text-xs text-muted-foreground">OEE Gain</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {viewMode === 'coaching' && (
        <>
          {/* Line Filter */}
          <div className="mb-6 flex gap-2">
            <Button
              size="sm"
              variant={selectedLine === null ? 'default' : 'outline'}
              onClick={() => setSelectedLine(null)}
            >
              All Lines
            </Button>
            {linePerformance.map((line) => (
              <Button
                key={line.lineId}
                size="sm"
                variant={selectedLine === line.lineId ? 'default' : 'outline'}
                onClick={() => setSelectedLine(line.lineId)}
              >
                {line.lineName}
              </Button>
            ))}
          </div>

          {/* Coaching Recommendations */}
          <div className="space-y-4">
            {filteredRecommendations.map((rec, idx) => {
              const line = linePerformance.find((l) => l.lineId === rec.lineId);
              return (
                <Card
                  key={idx}
                  className={`p-5 ${
                    rec.priority === 'high'
                      ? 'border-red-500 border-2'
                      : rec.priority === 'medium'
                        ? 'border-amber-500 border-2'
                        : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{line?.lineName}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded font-semibold ${
                            rec.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : rec.priority === 'medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {rec.priority} priority
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
                          {rec.category}
                        </span>
                      </div>

                      <p className="text-sm mb-3">{rec.recommendation}</p>

                      <div className="flex flex-wrap gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Expected Gain:</span>
                          <span className="font-semibold text-green-600 ml-1">
                            +{rec.expectedGain}% OEE
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Timeline:</span>
                          <span className="font-semibold ml-1">{rec.timeline}</span>
                        </div>
                      </div>

                      <div className="text-sm">
                        <p className="text-muted-foreground mb-1">Required Resources:</p>
                        <ul className="space-y-1">
                          {rec.resources.map((resource, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-blue-600">•</span>
                              <span>{resource}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-3xl font-bold text-green-600">+{rec.expectedGain}%</div>
                      <p className="text-xs text-muted-foreground">Potential Gain</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ~{Math.round(rec.expectedGain * 8)} units/day
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Summary */}
          <Card className="p-6 mt-6 bg-green-50 border-green-200">
            <h3 className="font-semibold text-green-900 mb-3">Coaching Plan Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Total Potential Gain</p>
                <p className="text-2xl font-bold text-green-900">
                  +{filteredRecommendations.reduce((sum, r) => sum + r.expectedGain, 0).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">High Priority Actions</p>
                <p className="text-2xl font-bold text-green-900">
                  {filteredRecommendations.filter((r) => r.priority === 'high').length}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Est. Production Gain</p>
                <p className="text-2xl font-bold text-green-900">
                  +
                  {Math.round(
                    filteredRecommendations.reduce((sum, r) => sum + r.expectedGain, 0) * 8
                  )}{' '}
                  units/day
                </p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
