import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Clock,
  TrendingDown,
  TrendingUp,
  PlayCircle,
  StopCircle,
  CheckCircle,
  ArrowRight,
  Target,
  Zap,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { agentService } from '@/data/clients/agent';
import { Markdown } from '@/components/ui/markdown';

interface ChangeoverRecord {
  id: string;
  lineId: string;
  lineName: string;
  fromProduct: string;
  toProduct: string;
  date: Date;
  operator: string;
  totalTime: number; // minutes
  targetTime: number; // minutes
  internalTime: number; // minutes (machine must be stopped)
  externalTime: number; // minutes (can be done while running)
  status: 'completed' | 'in-progress' | 'planned';
  improvements?: string[];
}

interface SMEDActivity {
  id: string;
  name: string;
  type: 'internal' | 'external';
  currentDuration: number; // minutes
  targetDuration: number; // minutes
  canParallelize: boolean;
  improvements: string[];
}

// Mock data: Changeover history
const changeoverHistory: ChangeoverRecord[] = [
  {
    id: 'co-001',
    lineId: 'line-b',
    lineName: 'Line-B',
    fromProduct: 'Coffee Maker 12-cup',
    toProduct: 'Coffee Maker 10-cup',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    operator: 'Mike Chen',
    totalTime: 28,
    targetTime: 25,
    internalTime: 18,
    externalTime: 10,
    status: 'completed',
    improvements: ['Pre-staged tooling', 'Used quick-change fixtures'],
  },
  {
    id: 'co-002',
    lineId: 'line-a',
    lineName: 'Line-A',
    fromProduct: 'Blender 500W',
    toProduct: 'Blender 750W',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    operator: 'Sarah Johnson',
    totalTime: 45,
    targetTime: 30,
    internalTime: 35,
    externalTime: 10,
    status: 'completed',
  },
  {
    id: 'co-003',
    lineId: 'line-b',
    lineName: 'Line-B',
    fromProduct: 'Coffee Maker 10-cup',
    toProduct: 'Coffee Maker 12-cup',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    operator: 'Mike Chen',
    totalTime: 32,
    targetTime: 25,
    internalTime: 22,
    externalTime: 10,
    status: 'completed',
  },
  {
    id: 'co-004',
    lineId: 'line-c',
    lineName: 'Line-C',
    fromProduct: 'Toaster 2-slice',
    toProduct: 'Toaster 4-slice',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    operator: 'John Smith',
    totalTime: 52,
    targetTime: 35,
    internalTime: 40,
    externalTime: 12,
    status: 'completed',
  },
];

// Mock data: SMED analysis for Coffee Maker changeover
const smedActivities: SMEDActivity[] = [
  {
    id: 'act-001',
    name: 'Remove old die from press',
    type: 'internal',
    currentDuration: 8,
    targetDuration: 5,
    canParallelize: false,
    improvements: ['Use quick-release clamps instead of bolts', 'Add lifting assist device'],
  },
  {
    id: 'act-002',
    name: 'Install new die in press',
    type: 'internal',
    currentDuration: 7,
    targetDuration: 5,
    canParallelize: false,
    improvements: ['Pre-heat die to operating temp', 'Standardize die cart height'],
  },
  {
    id: 'act-003',
    name: 'Adjust die position',
    type: 'internal',
    currentDuration: 6,
    targetDuration: 2,
    canParallelize: false,
    improvements: ['Add position pins for precise alignment', 'Use laser alignment tool'],
  },
  {
    id: 'act-004',
    name: 'Change conveyor guides',
    type: 'internal',
    currentDuration: 4,
    targetDuration: 2,
    canParallelize: true,
    improvements: ['Use snap-in guides', 'Color-code by product'],
  },
  {
    id: 'act-005',
    name: 'Update PLC parameters',
    type: 'internal',
    currentDuration: 3,
    targetDuration: 1,
    canParallelize: true,
    improvements: ['Use recipe management system', 'Barcode scan to auto-load settings'],
  },
  {
    id: 'act-006',
    name: 'First article inspection',
    type: 'internal',
    currentDuration: 5,
    targetDuration: 3,
    canParallelize: false,
    improvements: ['Use go/no-go gauges', 'Pre-define acceptance criteria'],
  },
  {
    id: 'act-007',
    name: 'Pre-stage new die',
    type: 'external',
    currentDuration: 5,
    targetDuration: 5,
    canParallelize: false,
    improvements: ['Already optimized - done during previous run'],
  },
  {
    id: 'act-008',
    name: 'Pre-stage tools and fixtures',
    type: 'external',
    currentDuration: 3,
    targetDuration: 3,
    canParallelize: false,
    improvements: ['Shadow board system working well'],
  },
  {
    id: 'act-009',
    name: 'Prepare material for new product',
    type: 'external',
    currentDuration: 2,
    targetDuration: 2,
    canParallelize: false,
    improvements: ['JIT delivery from warehouse'],
  },
];

export default function ChangeoverPage() {
  const [selectedLine, setSelectedLine] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'history' | 'smed'>('history');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredHistory =
    selectedLine === 'all'
      ? changeoverHistory
      : changeoverHistory.filter((co) => co.lineId === selectedLine);

  // Calculate metrics
  const avgChangeoverTime =
    filteredHistory.reduce((sum, co) => sum + co.totalTime, 0) / filteredHistory.length;
  const avgTargetTime =
    filteredHistory.reduce((sum, co) => sum + co.targetTime, 0) / filteredHistory.length;
  const bestTime = Math.min(...filteredHistory.map((co) => co.totalTime));
  const improvementRate = ((avgTargetTime - avgChangeoverTime) / avgTargetTime) * 100;

  const totalInternalTime = smedActivities
    .filter((a) => a.type === 'internal')
    .reduce((sum, a) => sum + a.currentDuration, 0);
  const totalExternalTime = smedActivities
    .filter((a) => a.type === 'external')
    .reduce((sum, a) => sum + a.currentDuration, 0);
  const potentialTimeSavings = smedActivities.reduce(
    (sum, a) => sum + (a.currentDuration - a.targetDuration),
    0
  );

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAiAnalysis('');

    try {
      const prompt = `You are a manufacturing efficiency expert specializing in SMED (Single-Minute Exchange of Die) methodology. Analyze the following PRODUCT CHANGEOVER data and provide optimization recommendations.

CHANGEOVER PERFORMANCE METRICS:
- Average changeover time: ${avgChangeoverTime.toFixed(1)} minutes
- Target changeover time: ${avgTargetTime.toFixed(1)} minutes
- Best achieved time: ${bestTime} minutes
- Total changeovers analyzed: ${filteredHistory.length}
- Gap to target: ${(avgChangeoverTime - avgTargetTime).toFixed(1)} minutes

SMED ACTIVITY BREAKDOWN:
- Internal activities (machine must be stopped): ${totalInternalTime} minutes
- External activities (can be done during production): ${totalExternalTime} minutes
- Total potential time savings: ${potentialTimeSavings} minutes

RECENT CHANGEOVER HISTORY:
${filteredHistory
  .slice(0, 4)
  .map(
    (co) => `
  * Line: ${co.lineName}
  * Products: ${co.fromProduct} → ${co.toProduct}
  * Time: ${co.totalTime} minutes (Target: ${co.targetTime} min)
  * Operator: ${co.operator}
  * Internal time: ${co.internalTime} min, External time: ${co.externalTime} min`
  )
  .join('\n')}

IMPROVEMENT OPPORTUNITIES (SMED Activities):
${smedActivities
  .filter((a) => a.currentDuration > a.targetDuration)
  .map(
    (a) => `
  * Activity: ${a.name}
  * Type: ${a.type} (${a.type === 'internal' ? 'machine stopped' : 'during production'})
  * Current: ${a.currentDuration} min → Target: ${a.targetDuration} min (Save ${a.currentDuration - a.targetDuration} min)
  * Can parallelize: ${a.canParallelize ? 'Yes' : 'No'}
  * Improvement ideas: ${a.improvements.join('; ')}`
  )
  .join('\n')}

Based on this CHANGEOVER data, provide specific SMED optimization recommendations:
1. Quick Wins: What internal activities can be converted to external (done while machine runs)?
2. Parallelization: Which activities can be performed simultaneously?
3. Standardization: How can we standardize the changeover process across operators?
4. Tooling/Equipment: What tools or fixtures can speed up changeovers?
5. Training: What operator training would reduce changeover times?

Focus on PRACTICAL changeover time reduction strategies using SMED principles.`;

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
        <h1 className="text-3xl font-bold mb-2">Changeover Optimization</h1>
        <p className="text-muted-foreground">
          SMED Analysis - Reduce setup time and maximize production efficiency
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={viewMode === 'history' ? 'default' : 'outline'}
          onClick={() => setViewMode('history')}
        >
          <Clock className="w-4 h-4 mr-2" />
          Changeover History
        </Button>
        <Button
          variant={viewMode === 'smed' ? 'default' : 'outline'}
          onClick={() => setViewMode('smed')}
        >
          <Target className="w-4 h-4 mr-2" />
          SMED Analysis
        </Button>
      </div>

      {viewMode === 'history' ? (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg Time</span>
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{avgChangeoverTime.toFixed(1)} min</p>
              <p className="text-xs text-muted-foreground">
                Target: {avgTargetTime.toFixed(1)} min
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Best Time</span>
                <Zap className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold">{bestTime} min</p>
              <p className="text-xs text-green-600">Line-B Record</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Improvement</span>
                {improvementRate < 0 ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                )}
              </div>
              <p className="text-2xl font-bold">{Math.abs(improvementRate).toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">vs Target</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Changeovers</span>
                <CheckCircle className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-bold">{filteredHistory.length}</p>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </Card>
          </div>

          {/* AI Analysis Card */}
          <Card className="p-6 mb-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  AI Changeover Analysis
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Get AI-powered recommendations to optimize your changeover process
                </p>
              </div>
              <Button
                onClick={handleAIAnalysis}
                disabled={isAnalyzing}
                className="bg-purple-600 hover:bg-purple-700"
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
                Click "Analyze with AI" to get detailed insights and recommendations based on your
                changeover data.
              </div>
            )}
          </Card>

          {/* Line Filter */}
          <div className="mb-4 flex gap-2">
            <Button
              size="sm"
              variant={selectedLine === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedLine('all')}
            >
              All Lines
            </Button>
            <Button
              size="sm"
              variant={selectedLine === 'line-a' ? 'default' : 'outline'}
              onClick={() => setSelectedLine('line-a')}
            >
              Line-A
            </Button>
            <Button
              size="sm"
              variant={selectedLine === 'line-b' ? 'default' : 'outline'}
              onClick={() => setSelectedLine('line-b')}
            >
              Line-B
            </Button>
            <Button
              size="sm"
              variant={selectedLine === 'line-c' ? 'default' : 'outline'}
              onClick={() => setSelectedLine('line-c')}
            >
              Line-C
            </Button>
          </div>

          {/* Changeover History Table */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Changeovers</h2>
            <div className="space-y-3">
              {filteredHistory.map((changeover) => {
                const variance = changeover.totalTime - changeover.targetTime;
                const variancePercent = (variance / changeover.targetTime) * 100;
                const isGood = variance <= 0;

                return (
                  <div key={changeover.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{changeover.lineName}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">
                            {changeover.date.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{changeover.fromProduct}</span>
                          <ArrowRight className="w-4 h-4" />
                          <span>{changeover.toProduct}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Operator: {changeover.operator}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-2xl font-bold">{changeover.totalTime}</p>
                            <p className="text-xs text-muted-foreground">minutes</p>
                          </div>
                          {isGood ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Clock className="w-5 h-5 text-amber-500" />
                          )}
                        </div>
                        <p
                          className={`text-sm mt-1 ${isGood ? 'text-green-600' : 'text-amber-600'}`}
                        >
                          {isGood ? '-' : '+'}
                          {Math.abs(variance).toFixed(1)} min ({isGood ? '' : '+'}
                          {variancePercent.toFixed(1)}%)
                        </p>
                      </div>
                    </div>

                    {/* Time breakdown */}
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Internal (machine stopped)
                        </p>
                        <p className="font-semibold">{changeover.internalTime} min</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">External (during run)</p>
                        <p className="font-semibold">{changeover.externalTime} min</p>
                      </div>
                    </div>

                    {changeover.improvements && changeover.improvements.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Improvements Applied:</p>
                        <div className="flex flex-wrap gap-2">
                          {changeover.improvements.map((imp, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                            >
                              {imp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      ) : (
        <>
          {/* SMED Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Internal Time</span>
                <StopCircle className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-2xl font-bold">{totalInternalTime} min</p>
              <p className="text-xs text-muted-foreground">Machine must be stopped</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">External Time</span>
                <PlayCircle className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold">{totalExternalTime} min</p>
              <p className="text-xs text-muted-foreground">Can do while running</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Potential Savings</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-bold">{potentialTimeSavings} min</p>
              <p className="text-xs text-green-600">
                {((potentialTimeSavings / (totalInternalTime + totalExternalTime)) * 100).toFixed(
                  0
                )}
                % reduction
              </p>
            </Card>
          </div>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Coffee Maker 10-cup → 12-cup Changeover Analysis
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <StopCircle className="w-5 h-5 text-red-500" />
                  Internal Activities (Machine Stopped)
                </h3>
                <div className="space-y-2">
                  {smedActivities
                    .filter((a) => a.type === 'internal')
                    .map((activity) => (
                      <div key={activity.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-medium">{activity.name}</p>
                            {activity.canParallelize && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                                Can parallelize
                              </span>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-semibold">
                              {activity.currentDuration} → {activity.targetDuration} min
                            </p>
                            <p className="text-xs text-green-600">
                              Save {activity.currentDuration - activity.targetDuration} min
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Improvements:</p>
                          <ul className="text-xs space-y-1">
                            {activity.improvements.map((imp, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-green-600">•</span>
                                <span>{imp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-green-500" />
                  External Activities (Can Do While Running)
                </h3>
                <div className="space-y-2">
                  {smedActivities
                    .filter((a) => a.type === 'external')
                    .map((activity) => (
                      <div key={activity.id} className="border rounded-lg p-3 bg-green-50">
                        <div className="flex items-start justify-between">
                          <p className="font-medium">{activity.name}</p>
                          <p className="font-semibold">{activity.currentDuration} min</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.improvements[0]}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Action Plan */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Recommended Action Plan
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-600">1.</span>
                <p>
                  <strong>Quick Win:</strong> Install quick-release clamps on die (save 3 min)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-600">2.</span>
                <p>
                  <strong>Medium Term:</strong> Implement position pins for alignment (save 4 min)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-600">3.</span>
                <p>
                  <strong>Long Term:</strong> Add recipe management system for PLC (save 2 min)
                </p>
              </div>
              <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                <p className="font-semibold text-blue-900">
                  Total Potential Savings: {potentialTimeSavings} minutes
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Target: 18 min (from current 33 min) - 45% reduction
                </p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
