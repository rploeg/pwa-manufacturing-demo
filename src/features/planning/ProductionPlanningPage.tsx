import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  Package,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Layers,
  Users,
  Zap,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { agentService } from '@/data/clients/agent';

interface ProductionOrder {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  dueDate: Date;
  priority: 'rush' | 'normal' | 'low';
  customer: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'delayed';
  assignedLine?: string;
  startTime?: Date;
  endTime?: Date;
  changeoverTime?: number; // minutes
}

interface LineCapacity {
  lineId: string;
  lineName: string;
  availableHours: number;
  scheduledHours: number;
  utilizationPercent: number;
  oee: number;
  effectiveCapacity: number; // units/day accounting for OEE
  currentLoad: number; // units scheduled
}

interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  impact: string;
  result: 'positive' | 'negative' | 'neutral';
}

// Mock data: Production orders
const productionOrders: ProductionOrder[] = [
  {
    id: 'PO-001',
    sku: 'SKU-001',
    productName: 'Coffee Maker 12-cup',
    quantity: 500,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    priority: 'rush',
    customer: 'RetailCo',
    status: 'scheduled',
    assignedLine: 'line-b',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 8),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 16),
    changeoverTime: 28,
  },
  {
    id: 'PO-002',
    sku: 'SKU-002',
    productName: 'Blender 750W',
    quantity: 800,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    priority: 'normal',
    customer: 'DistributorA',
    status: 'scheduled',
    assignedLine: 'line-a',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 + 1000 * 60 * 60 * 10),
    changeoverTime: 45,
  },
  {
    id: 'PO-003',
    sku: 'SKU-003',
    productName: 'Toaster 4-slice',
    quantity: 600,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    priority: 'normal',
    customer: 'ChainStore',
    status: 'scheduled',
    assignedLine: 'line-c',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 12),
    changeoverTime: 52,
  },
  {
    id: 'PO-004',
    sku: 'SKU-001',
    productName: 'Coffee Maker 10-cup',
    quantity: 400,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
    priority: 'low',
    customer: 'OnlineRetail',
    status: 'scheduled',
    assignedLine: 'line-b',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 7),
    changeoverTime: 28,
  },
  {
    id: 'PO-005',
    sku: 'SKU-002',
    productName: 'Blender 500W',
    quantity: 700,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    priority: 'normal',
    customer: 'DistributorB',
    status: 'scheduled',
    assignedLine: 'line-a',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4 + 1000 * 60 * 60 * 9),
    changeoverTime: 45,
  },
];

// Mock data: Line capacity
const lineCapacities: LineCapacity[] = [
  {
    lineId: 'line-a',
    lineName: 'Line-A',
    availableHours: 160, // next 7 days
    scheduledHours: 135,
    utilizationPercent: 84,
    oee: 78.3,
    effectiveCapacity: 940, // units/day with OEE
    currentLoad: 1500,
  },
  {
    lineId: 'line-b',
    lineName: 'Line-B',
    availableHours: 160,
    scheduledHours: 148,
    utilizationPercent: 93,
    oee: 86.2,
    effectiveCapacity: 1030,
    currentLoad: 900,
  },
  {
    lineId: 'line-c',
    lineName: 'Line-C',
    availableHours: 160,
    scheduledHours: 112,
    utilizationPercent: 70,
    oee: 73.1,
    effectiveCapacity: 875,
    currentLoad: 600,
  },
];

// Mock data: What-if scenarios
const whatIfScenarios: WhatIfScenario[] = [
  {
    id: 'scenario-001',
    name: 'Line-A Breakdown (4 hours)',
    description: 'Line-A unexpected downtime during PO-002 production',
    impact: 'PO-002 delayed by 6 hours (with rescheduling). Affects 1 downstream order.',
    result: 'negative',
  },
  {
    id: 'scenario-002',
    name: '10% OEE Improvement on Line-C',
    description: 'Implement Line-B best practices on Line-C',
    impact: '+87 units/day capacity = Can accept 2 additional rush orders this week',
    result: 'positive',
  },
  {
    id: 'scenario-003',
    name: 'Rush Order: 300 units SKU-001',
    description: 'Customer requests expedited order, needs delivery in 48 hours',
    impact: 'Can accommodate on Line-B by shifting PO-004 by 1 day (still on-time)',
    result: 'positive',
  },
  {
    id: 'scenario-004',
    name: 'Material Delay: SKU-002 components',
    description: 'Supplier reports 2-day delay on Blender motors',
    impact: 'Reschedule PO-002 and PO-005, utilize freed capacity for SKU-001/003',
    result: 'neutral',
  },
];

export default function ProductionPlanningPage() {
  const [viewMode, setViewMode] = useState<'schedule' | 'capacity' | 'what-if'>('schedule');
  const [selectedLine, setSelectedLine] = useState<string>('all');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredOrders =
    selectedLine === 'all'
      ? productionOrders
      : productionOrders.filter((order) => order.assignedLine === selectedLine);

  // Calculate metrics
  const totalOrders = productionOrders.length;
  const rushOrders = productionOrders.filter((o) => o.priority === 'rush').length;
  const onTimeOrders = productionOrders.filter((o) => o.status !== 'delayed').length;
  const totalChangeoverTime = productionOrders.reduce((sum, o) => sum + (o.changeoverTime || 0), 0);
  const avgUtilization =
    lineCapacities.reduce((sum, l) => sum + l.utilizationPercent, 0) / lineCapacities.length;

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAiAnalysis('');

    try {
      const prompt = `Analyze this production planning data and provide optimization recommendations:

Current Schedule Summary:
- Total orders: ${totalOrders}
- Rush orders: ${rushOrders}
- On-time delivery: ${onTimeOrders}/${totalOrders} (${((onTimeOrders / totalOrders) * 100).toFixed(0)}%)
- Total changeover time: ${totalChangeoverTime} minutes
- Average line utilization: ${avgUtilization.toFixed(1)}%

Production Orders:
${productionOrders
  .map(
    (order) => `
- ${order.sku} (${order.productName}): ${order.quantity} units
  * Priority: ${order.priority}
  * Due: ${order.dueDate.toLocaleDateString()}
  * Assigned to: ${order.assignedLine || 'Not assigned'}
  * Status: ${order.status}
  * Customer: ${order.customer}`
  )
  .join('\n')}

Line Capacity:
${lineCapacities
  .map(
    (line) => `
- ${line.lineName}: ${line.utilizationPercent}% utilized
  * Available: ${line.availableHours} hrs
  * Scheduled: ${line.scheduledHours} hrs
  * OEE: ${line.oee}%
  * Current load: ${line.currentLoad}/${line.effectiveCapacity} units`
  )
  .join('\n')}

What-If Scenarios:
${whatIfScenarios.map((scenario) => `- ${scenario.name}: ${scenario.impact}`).join('\n')}

Provide production planning recommendations:
1. Schedule optimization: How can we improve on-time delivery while minimizing changeovers?
2. Capacity balancing: Are there opportunities to better balance workload across lines?
3. Rush order handling: How should we accommodate rush orders without disrupting the schedule?
4. Bottleneck analysis: What constraints limit our throughput?
5. Resource allocation: What staffing or material staging recommendations do you have?`;

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
          <Calendar className="w-8 h-8 text-purple-600" />
          Production Planning Assistant
        </h1>
        <p className="text-muted-foreground">
          Optimize scheduling, balance capacity, and scenario planning
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Orders</span>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{totalOrders}</p>
          <p className="text-xs text-muted-foreground">Next 7 days</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Rush Orders</span>
            <Zap className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold">{rushOrders}</p>
          <p className="text-xs text-red-600">High priority</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">On-Time %</span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{Math.round((onTimeOrders / totalOrders) * 100)}%</p>
          <p className="text-xs text-muted-foreground">
            {onTimeOrders}/{totalOrders} orders
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Utilization</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold">{avgUtilization.toFixed(0)}%</p>
          <p className="text-xs text-muted-foreground">Across all lines</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Changeover Time</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold">{Math.round(totalChangeoverTime / 60)}h</p>
          <p className="text-xs text-muted-foreground">{totalChangeoverTime} min total</p>
        </Card>
      </div>

      {/* AI Analysis Card */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              AI Production Planning Analysis
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Get AI-powered schedule optimization and capacity recommendations
            </p>
          </div>
          <Button
            onClick={handleAIAnalysis}
            disabled={isAnalyzing}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Optimize with AI
              </>
            )}
          </Button>
        </div>

        {aiAnalysis && (
          <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap">{aiAnalysis}</div>
            </div>
          </div>
        )}

        {!aiAnalysis && !isAnalyzing && (
          <div className="text-sm text-muted-foreground italic">
            Click "Optimize with AI" to get detailed schedule optimization, capacity balancing, and
            resource allocation recommendations.
          </div>
        )}
      </Card>

      {/* View Mode Toggle */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={viewMode === 'schedule' ? 'default' : 'outline'}
          onClick={() => setViewMode('schedule')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule
        </Button>
        <Button
          variant={viewMode === 'capacity' ? 'default' : 'outline'}
          onClick={() => setViewMode('capacity')}
        >
          <Layers className="w-4 h-4 mr-2" />
          Capacity
        </Button>
        <Button
          variant={viewMode === 'what-if' ? 'default' : 'outline'}
          onClick={() => setViewMode('what-if')}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          What-If Analysis
        </Button>
      </div>

      {viewMode === 'schedule' && (
        <>
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

          {/* Production Schedule */}
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const duration =
                order.endTime && order.startTime
                  ? (order.endTime.getTime() - order.startTime.getTime()) / (1000 * 60 * 60)
                  : 0;

              return (
                <Card
                  key={order.id}
                  className={`p-4 ${order.priority === 'rush' ? 'border-red-500 border-2' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{order.productName}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            order.priority === 'rush'
                              ? 'bg-red-100 text-red-800'
                              : order.priority === 'normal'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.priority}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            order.status === 'scheduled'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'in-progress'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'completed'
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-2">
                        <div>
                          <p className="text-muted-foreground">Order ID</p>
                          <p className="font-medium">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Quantity</p>
                          <p className="font-medium">{order.quantity} units</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Customer</p>
                          <p className="font-medium">{order.customer}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Due Date</p>
                          <p className="font-medium">{order.dueDate.toLocaleDateString()}</p>
                        </div>
                      </div>

                      {order.assignedLine && order.startTime && order.endTime && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <div>
                                <span className="text-muted-foreground">Line:</span>
                                <span className="font-semibold ml-1">
                                  {
                                    lineCapacities.find((l) => l.lineId === order.assignedLine)
                                      ?.lineName
                                  }
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Start:</span>
                                <span className="font-semibold ml-1">
                                  {order.startTime.toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Duration:</span>
                                <span className="font-semibold ml-1">{duration.toFixed(1)}h</span>
                              </div>
                              {order.changeoverTime && (
                                <div>
                                  <span className="text-muted-foreground">Changeover:</span>
                                  <span className="font-semibold ml-1 text-amber-600">
                                    {order.changeoverTime} min
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Optimization Insights */}
          <Card className="p-5 mt-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Schedule Optimization Insights
            </h3>
            <div className="text-sm space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <p>
                  <strong>Good:</strong> Orders grouped by product family minimizes changeovers (3
                  setups vs 5 random)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <p>
                  <strong>Good:</strong> Rush orders scheduled on Line-B (highest OEE) for
                  reliability
                </p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                <p>
                  <strong>Opportunity:</strong> Line-C underutilized (70%) - could absorb overflow
                  or pull-in orders
                </p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                <p>
                  <strong>Risk:</strong> Line-A at 84% utilization - minimal buffer for disruptions
                </p>
              </div>
            </div>
          </Card>
        </>
      )}

      {viewMode === 'capacity' && (
        <div className="space-y-4">
          {lineCapacities.map((line) => {
            const remainingHours = line.availableHours - line.scheduledHours;
            const remainingCapacity = line.effectiveCapacity - line.currentLoad;
            const isOverloaded = line.utilizationPercent > 95;
            const isUnderUtilized = line.utilizationPercent < 75;

            return (
              <Card
                key={line.lineId}
                className={`p-6 ${
                  isOverloaded
                    ? 'border-red-500 border-2'
                    : isUnderUtilized
                      ? 'border-blue-500 border-2'
                      : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{line.lineName}</h3>
                    <p className="text-sm text-muted-foreground">OEE: {line.oee}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">{line.utilizationPercent}%</p>
                    <p className="text-sm text-muted-foreground">Utilization</p>
                  </div>
                </div>

                {/* Utilization Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Capacity Utilization</span>
                    <span className="font-semibold">
                      {line.scheduledHours}h / {line.availableHours}h
                    </span>
                  </div>
                  <div className="h-4 bg-gray-200 rounded overflow-hidden">
                    <div
                      className={`h-full ${
                        isOverloaded
                          ? 'bg-red-500'
                          : line.utilizationPercent > 85
                            ? 'bg-amber-500'
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(line.utilizationPercent, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 border rounded">
                    <p className="text-xs text-muted-foreground mb-1">Effective Capacity</p>
                    <p className="text-xl font-bold">{line.effectiveCapacity}</p>
                    <p className="text-xs text-muted-foreground">units/day @ {line.oee}% OEE</p>
                  </div>
                  <div className="p-3 border rounded">
                    <p className="text-xs text-muted-foreground mb-1">Current Load</p>
                    <p className="text-xl font-bold">{line.currentLoad}</p>
                    <p className="text-xs text-muted-foreground">units scheduled</p>
                  </div>
                  <div className="p-3 border rounded">
                    <p className="text-xs text-muted-foreground mb-1">Remaining Capacity</p>
                    <p
                      className={`text-xl font-bold ${remainingCapacity > 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {remainingCapacity > 0 ? '+' : ''}
                      {remainingCapacity}
                    </p>
                    <p className="text-xs text-muted-foreground">{remainingHours}h available</p>
                  </div>
                </div>

                {isOverloaded && (
                  <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
                    <p className="text-sm text-red-900">
                      <strong>⚠️ Overloaded:</strong> Consider shifting orders to Line-C or
                      extending schedule
                    </p>
                  </div>
                )}
                {isUnderUtilized && (
                  <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <strong>💡 Opportunity:</strong> {remainingCapacity} units available - can
                      accept additional orders
                    </p>
                  </div>
                )}
              </Card>
            );
          })}

          {/* Resource Allocation */}
          <Card className="p-6 bg-purple-50 border-purple-200">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Resource Allocation Recommendations
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <p>
                  <strong>Labor:</strong> Assign 2 skilled operators to Line-A (high utilization,
                  quality-critical orders)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <p>
                  <strong>Materials:</strong> Pre-stage SKU-001 components on Line-B by 6am tomorrow
                  (rush order)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <p>
                  <strong>Tools:</strong> Quick-change fixtures needed on Line-A for PO-002 (45 min
                  changeover)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <p>
                  <strong>Opportunity:</strong> Train Line-C operators on SKU-002 to increase
                  flexibility
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {viewMode === 'what-if' && (
        <div className="space-y-4">
          <Card className="p-5 bg-blue-50 border-blue-200 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Scenario Planning</h3>
            <p className="text-sm text-blue-800">
              Evaluate production plan resilience against potential disruptions and opportunities
            </p>
          </Card>

          {whatIfScenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className={`p-5 ${
                scenario.result === 'negative'
                  ? 'border-red-300'
                  : scenario.result === 'positive'
                    ? 'border-green-300'
                    : 'border-gray-300'
              } border-2`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{scenario.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
                  <div className="p-3 rounded bg-gray-50">
                    <p className="text-sm">
                      <strong>Impact:</strong> {scenario.impact}
                    </p>
                  </div>
                </div>
                <div className="ml-4">
                  {scenario.result === 'positive' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-semibold">Positive</span>
                    </div>
                  )}
                  {scenario.result === 'negative' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-6 h-6" />
                      <span className="font-semibold">Risk</span>
                    </div>
                  )}
                  {scenario.result === 'neutral' && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <AlertCircle className="w-6 h-6" />
                      <span className="font-semibold">Manageable</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {/* Summary */}
          <Card className="p-6 bg-green-50 border-green-200">
            <h3 className="font-semibold text-green-900 mb-3">Resilience Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Schedule Robustness</p>
                <p className="text-2xl font-bold text-green-900">Good</p>
                <p className="text-xs text-green-800">Can handle 1 line disruption</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Growth Capacity</p>
                <p className="text-2xl font-bold text-green-900">+15%</p>
                <p className="text-xs text-green-800">If Line-C optimized</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Critical Risk</p>
                <p className="text-2xl font-bold text-amber-900">Line-A</p>
                <p className="text-xs text-amber-800">Minimal buffer for delays</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
