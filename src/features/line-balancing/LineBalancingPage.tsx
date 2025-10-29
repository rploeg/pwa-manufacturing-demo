import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, TrendingUp, Users, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  lineBalancingAI,
  type LineBalance,
  type SimulationResult,
} from '../../services/lineBalancingAI';

export const LineBalancingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stations' | 'simulation'>('overview');
  const [lineBalance, setLineBalance] = useState<LineBalance | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLineBalance();
  }, []);

  const loadLineBalance = async () => {
    setLoading(true);
    try {
      const balance = await lineBalancingAI.analyzeLineBalance(
        'LINE-01',
        'Assembly Line A',
        50 // Target: 50 units/hour
      );
      setLineBalance(balance);
    } catch (error) {
      console.error('Failed to load line balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulation = async () => {
    if (!lineBalance) return;

    const selectedRecs = lineBalance.recommendations.filter((rec) =>
      selectedRecommendations.includes(rec.id)
    );

    if (selectedRecs.length === 0) return;

    setLoading(true);
    try {
      const result = await lineBalancingAI.simulateBalanceChange(lineBalance, selectedRecs);
      setSimulationResult(result);
      setActiveTab('simulation');
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecommendation = (id: string) => {
    setSelectedRecommendations((prev) =>
      prev.includes(id) ? prev.filter((recId) => recId !== id) : [...prev, id]
    );
  };

  if (loading && !lineBalance) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-gray-600">Analyzing line balance...</p>
        </div>
      </div>
    );
  }

  if (!lineBalance) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-600">Failed to load line balance data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Line Balancing AI</h1>
        <p className="text-gray-600">Optimize workload distribution and eliminate bottlenecks</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall Efficiency</p>
              <p className="text-2xl font-bold text-gray-900">
                {lineBalance.overallEfficiency.toFixed(1)}%
              </p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bottlenecks</p>
              <p className="text-2xl font-bold text-red-600">{lineBalance.bottlenecks.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Throughput</p>
              <p className="text-2xl font-bold text-gray-900">
                {lineBalance.simulatedImprovements.currentThroughput} u/h
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Improvement Potential</p>
              <p className="text-2xl font-bold text-green-600">
                +{lineBalance.simulatedImprovements.improvement.toFixed(1)}%
              </p>
            </div>
            <Zap className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview' as const, label: 'Overview' },
            { id: 'stations' as const, label: 'Work Stations' },
            { id: 'simulation' as const, label: 'Simulation' },
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
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Bottlenecks */}
          {lineBalance.bottlenecks.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <h2 className="text-lg font-semibold">Identified Bottlenecks</h2>
              </div>
              <div className="space-y-3">
                {lineBalance.bottlenecks.map((bottleneck) => (
                  <div
                    key={bottleneck.stationId}
                    className="flex items-center justify-between p-4 bg-red-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{bottleneck.stationName}</p>
                      <p className="text-sm text-gray-600">
                        Cycle time: {bottleneck.cycleTime}s ({bottleneck.excessTime.toFixed(0)}s
                        over target)
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          bottleneck.severity === 'severe'
                            ? 'bg-red-100 text-red-800'
                            : bottleneck.severity === 'moderate'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {bottleneck.severity}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        -{bottleneck.impactOnThroughput.toFixed(1)}% throughput
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recommendations */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">AI Recommendations</h2>
            <div className="space-y-3">
              {lineBalance.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedRecommendations.includes(rec.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => toggleRecommendation(rec.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded mr-2 ${
                            rec.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : rec.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {rec.priority}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {rec.type.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="font-medium text-gray-900 mb-1">{rec.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>+{rec.expectedImprovement.toFixed(1)}% improvement</span>
                        <span>•</span>
                        <span>{rec.implementationComplexity} to implement</span>
                        <span>•</span>
                        <span>${(rec.estimatedCost / 1000).toFixed(1)}K cost</span>
                        <span>•</span>
                        <span>{rec.timeToImplement}</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedRecommendations.includes(rec.id)}
                      onChange={() => {}}
                      className="mt-1 h-5 w-5 text-blue-600"
                    />
                  </div>
                </div>
              ))}
            </div>
            {selectedRecommendations.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {selectedRecommendations.length} recommendation(s) selected
                </p>
                <Button onClick={handleSimulation} disabled={loading}>
                  {loading ? 'Simulating...' : 'Run Simulation'}
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'stations' && (
        <div className="space-y-4">
          {lineBalance.workStations.map((station) => (
            <Card key={station.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{station.name}</h3>
                  <p className="text-sm text-gray-600">
                    <Users className="inline h-4 w-4 mr-1" />
                    {station.operatorName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {station.utilization.toFixed(0)}%
                  </p>
                  <p className="text-sm text-gray-600">Utilization</p>
                  {station.isBottleneck && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800 mt-1">
                      Bottleneck
                    </span>
                  )}
                </div>
              </div>

              {/* Utilization bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      station.utilization > 100
                        ? 'bg-red-600'
                        : station.utilization > 90
                          ? 'bg-yellow-500'
                          : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(station.utilization, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>0%</span>
                  <span>Target: {lineBalance.targetCycleTime}s</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Tasks ({station.tasks.length})</h4>
                {station.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{task.name}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-600">
                        <span>{task.skillRequired}</span>
                        <span>•</span>
                        <span className="capitalize">{task.complexity}</span>
                        {task.canBeReassigned && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600">Can be reassigned</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{task.cycleTime}s</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="font-medium text-gray-900">Total Cycle Time</span>
                  <span className="text-lg font-bold text-gray-900">{station.totalCycleTime}s</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'simulation' && simulationResult && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Simulation Results</h2>
            <p className="text-gray-600 mb-4">{simulationResult.scenario}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Before</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cycle Time:</span>
                    <span className="font-medium">{simulationResult.beforeMetrics.cycleTime}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Throughput:</span>
                    <span className="font-medium">
                      {simulationResult.beforeMetrics.throughput} u/h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Efficiency:</span>
                    <span className="font-medium">
                      {simulationResult.beforeMetrics.efficiency}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">After</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cycle Time:</span>
                    <span className="font-medium text-green-600">
                      {simulationResult.afterMetrics.cycleTime}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Throughput:</span>
                    <span className="font-medium text-green-600">
                      {simulationResult.afterMetrics.throughput} u/h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Efficiency:</span>
                    <span className="font-medium text-green-600">
                      {simulationResult.afterMetrics.efficiency}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Improvements</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cycle Time:</span>
                    <span className="font-medium text-green-600">
                      -{simulationResult.improvements.cycleTimeReduction}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Throughput:</span>
                    <span className="font-medium text-green-600">
                      +{simulationResult.improvements.throughputIncrease}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Efficiency:</span>
                    <span className="font-medium text-green-600">
                      +{simulationResult.improvements.efficiencyGain}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-900 mb-3">Changes Applied</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {simulationResult.changes.map((change, index) => (
                  <li key={index}>{change}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded ${
                    simulationResult.feasibility === 'high'
                      ? 'bg-green-100 text-green-800'
                      : simulationResult.feasibility === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {simulationResult.feasibility} feasibility
                </span>
              </div>
              <Button variant="outline" onClick={() => setActiveTab('overview')}>
                Back to Overview
              </Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'simulation' && !simulationResult && (
        <Card className="p-12 text-center">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No simulation results yet</p>
          <Button onClick={() => setActiveTab('overview')}>Select Recommendations</Button>
        </Card>
      )}
    </div>
  );
};
