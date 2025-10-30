import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, AlertCircle, Package, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  maintenanceCostAI,
  type MaintenanceTask,
  type MaintenanceDecision,
  type SparePartForecast,
  type MaintenanceBudget,
  type LifeCycleCost,
} from '../../services/maintenanceCostAI';

interface TaskWithDecision {
  task: MaintenanceTask;
  decision: MaintenanceDecision;
}

export const MaintenanceCostPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'decisions' | 'inventory' | 'budget' | 'lifecycle'>(
    'decisions'
  );
  const [decisions, setDecisions] = useState<TaskWithDecision[]>([]);
  const [sparePartsForecast, setSparePartsForecast] = useState<SparePartForecast[]>([]);
  const [budget, setBudget] = useState<MaintenanceBudget | null>(null);
  const [lifeCycleAnalysis, setLifeCycleAnalysis] = useState<LifeCycleCost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load maintenance decisions
      const mockTasks = [
        {
          id: 'MT-001',
          equipmentId: 'EQ-101',
          equipmentName: 'CNC Machine #1',
          taskType: 'preventive' as const,
          description: 'Spindle bearing replacement',
          scheduledDate: new Date('2024-02-15'),
          estimatedDuration: 8,
          estimatedCost: 15000,
          priority: 'high' as const,
          spareParts: [
            { partId: 'PART-001', partName: 'Bearing-A23', quantity: 2, unitCost: 450, leadTime: 7, inStock: true },
            { partId: 'PART-002', partName: 'Seal-B15', quantity: 4, unitCost: 85, leadTime: 3, inStock: true },
          ],
          laborCost: 2500,
          downtime: 8,
          downtimeCost: 1200,
        },
        {
          id: 'MT-002',
          equipmentId: 'EQ-102',
          equipmentName: 'Robot Arm #3',
          taskType: 'corrective' as const,
          description: 'Servo motor repair',
          scheduledDate: new Date('2024-02-20'),
          estimatedDuration: 4,
          estimatedCost: 8500,
          priority: 'medium' as const,
          spareParts: [
            { partId: 'PART-003', partName: 'Motor-C44', quantity: 1, unitCost: 3200, leadTime: 14, inStock: false },
          ],
          laborCost: 1800,
          downtime: 4,
          downtimeCost: 1200,
        },
      ];

      const decisionsData = await Promise.all(
        mockTasks.map(async (task) => {
          const decision = await maintenanceCostAI.analyzeMaintenanceDecision(task);
          return { task, decision };
        })
      );
      setDecisions(decisionsData);

      // Load spare parts forecast
      const spareParts = await maintenanceCostAI.forecastSparePartsDemand('EQ-101', 90);
      setSparePartsForecast(spareParts);

      // Load budget analysis
      const budgetData = await maintenanceCostAI.analyzeMaintenanceBudget('Q1-2024');
      setBudget(budgetData);

      // Load life cycle analysis
      const lifecycleData1 = await maintenanceCostAI.analyzeLifeCycleCost(
        'EQ-101',
        'CNC Machine #1',
        8,
        250000,
        [12000, 15000, 18000, 22000, 28000]
      );
      
      const lifecycleData2 = await maintenanceCostAI.analyzeLifeCycleCost(
        'EQ-105',
        'Injection Molder #2',
        12,
        180000,
        [8000, 10000, 14000, 18000, 24000, 32000]
      );
      
      setLifeCycleAnalysis([lifecycleData1, lifecycleData2]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && decisions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <DollarSign className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-gray-600">Analyzing maintenance costs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Maintenance Cost Optimization</h1>
        <p className="text-gray-600">AI-driven cost-benefit analysis and budget optimization</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Budget Utilization</p>
              <p className="text-2xl font-bold text-gray-900">
                {budget ? ((budget.spent / budget.totalBudget) * 100).toFixed(0) : '0'}%
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cost Savings YTD</p>
              <p className="text-2xl font-bold text-green-600">$47K</p>
            </div>
            <TrendingDown className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Decisions</p>
              <p className="text-2xl font-bold text-orange-600">{decisions.length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Parts at Risk</p>
              <p className="text-2xl font-bold text-red-600">
                {sparePartsForecast.filter((p) => p.urgency === 'high').length}
              </p>
            </div>
            <Package className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'decisions' as const, label: 'Maintenance Decisions' },
            { id: 'inventory' as const, label: 'Spare Parts' },
            { id: 'budget' as const, label: 'Budget Tracking' },
            { id: 'lifecycle' as const, label: 'Life Cycle Analysis' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'decisions' && (
        <div className="space-y-4">
          {decisions.map(({ task, decision }) => (
            <Card key={task.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {task.equipmentName}
                  </h3>
                  <p className="text-gray-600">{task.description}</p>
                  <div className="flex items-center mt-2 space-x-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        task.priority === 'high' || task.priority === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-gray-600">
                      Scheduled: {task.scheduledDate?.toLocaleDateString() || 'TBD'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${
                      decision.recommendation === 'execute-now'
                        ? 'bg-green-100 text-green-800'
                        : decision.recommendation === 'schedule-optimal'
                          ? 'bg-blue-100 text-blue-800'
                          : decision.recommendation === 'defer'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {decision.recommendation.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600 mb-1">Total Cost</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${decision.costBenefit.totalCost.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600 mb-1">Downtime Cost</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${decision.costBenefit.downtimeCost.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600 mb-1">Deferral Risk</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${decision.costBenefit.deferralRisk.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600 mb-1">Potential Savings</p>
                  <p className="text-lg font-semibold text-green-600">
                    ${decision.costBenefit.potentialSavings.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-700 mb-3">
                  <strong>AI Recommendation:</strong> {decision.reasoning}
                </p>
                {decision.optimalDate && (
                  <p className="text-sm text-gray-600">
                    <strong>Optimal Date:</strong> {decision.optimalDate.toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <Button 
                  variant="outline"
                  onClick={() => {
                    alert(`Deferred: ${decision.equipment} - ${decision.task}`);
                  }}
                >
                  Defer
                </Button>
                <Button
                  onClick={() => {
                    alert(`Scheduled: ${decision.equipment} - ${decision.task}\nOptimal Date: ${decision.optimalDate?.toLocaleDateString() || 'TBD'}`);
                  }}
                >
                  Schedule Maintenance
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {sparePartsForecast.map((part) => (
            <Card key={part.partId} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 mr-3">{part.partName}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        part.urgency === 'high'
                          ? 'bg-red-100 text-red-800'
                          : part.urgency === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {part.urgency} urgency
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Part ID: {part.partId}</p>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Current Stock</p>
                      <p className="text-lg font-semibold text-gray-900">{part.currentStock}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Forecast Demand</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {part.forecastedDemand} <span className="text-sm text-gray-500">units</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Reorder Point</p>
                      <p className="text-lg font-semibold text-orange-600">{part.reorderPoint}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Optimal Order</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {part.optimalOrderQuantity}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Lead Time</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {part.leadTime} days
                      </p>
                    </div>
                  </div>

                  {part.currentStock <= part.reorderPoint && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm text-red-800">
                        <strong>⚠️ Stock below reorder point!</strong> Order{' '}
                        {part.optimalOrderQuantity} units immediately to avoid stockout.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'budget' && budget && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Budget Overview - {budget.period}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${budget.totalBudget.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Allocated</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${budget.allocated.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Spent</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${budget.spent.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Forecast</p>
                <p className="text-2xl font-bold text-orange-600">
                  ${budget.forecast.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Budget Utilization (Spent / Total)</span>
                <span>{((budget.spent / budget.totalBudget) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${
                    (budget.spent / budget.totalBudget) * 100 > 100
                      ? 'bg-red-600'
                      : (budget.spent / budget.totalBudget) * 100 > 90
                        ? 'bg-yellow-500'
                        : 'bg-green-600'
                  }`}
                  style={{ width: `${Math.min((budget.spent / budget.totalBudget) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Variance (Budget - Forecast)</span>
                <span className={`font-bold ${budget.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {budget.variance >= 0 ? '+' : ''}${budget.variance.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-900 mb-3">AI Recommendations</h3>
              <ul className="space-y-2">
                {budget.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Spending Breakdown</h2>
            <div className="space-y-3">
              {[
                { category: 'Preventive Maintenance', amount: budget.spent * 0.45, color: 'bg-blue-600' },
                { category: 'Corrective Repairs', amount: budget.spent * 0.30, color: 'bg-purple-600' },
                { category: 'Spare Parts', amount: budget.spent * 0.15, color: 'bg-green-600' },
                { category: 'Emergency Services', amount: budget.spent * 0.10, color: 'bg-red-600' },
              ].map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.category}</span>
                    <span className="font-medium">${Math.round(item.amount).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full`}
                      style={{
                        width: `${(item.amount / budget.spent) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'lifecycle' && (
        <div className="space-y-4">
          {lifeCycleAnalysis.map((analysis) => (
            <Card key={analysis.equipmentId} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{analysis.equipmentName}</h3>
                  <p className="text-sm text-gray-600">
                    Age: {analysis.age} years | Acquired: $
                    {analysis.acquisitionCost.toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    analysis.replacementRecommendation.recommended && analysis.replacementRecommendation.timeframe.includes('12 months')
                      ? 'bg-red-100 text-red-800'
                      : analysis.replacementRecommendation.recommended
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {analysis.replacementRecommendation.recommended ? 'Replace Soon' : 'Keep Running'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-xs text-gray-600 mb-1">Total Maintenance Cost</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${analysis.totalMaintenanceCost.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Avg: ${Math.round(analysis.averageAnnualCost).toLocaleString()}/year
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-xs text-gray-600 mb-1">Continue Repair Cost</p>
                  <p className="text-xl font-bold text-orange-600">
                    ${analysis.replacementRecommendation.costComparison.continueRepair.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">Next {analysis.predictedRemainingLife} years</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-xs text-gray-600 mb-1">Replacement Cost</p>
                  <p className="text-xl font-bold text-blue-600">
                    ${analysis.replacementRecommendation.costComparison.replace.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    {analysis.replacementRecommendation.costComparison.savings > 0 
                      ? `Save $${analysis.replacementRecommendation.costComparison.savings.toLocaleString()}`
                      : 'More expensive'}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Recommendation: {analysis.replacementRecommendation.timeframe}
                  </p>
                  <p className="text-sm text-gray-700">
                    {analysis.replacementRecommendation.reasoning}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
