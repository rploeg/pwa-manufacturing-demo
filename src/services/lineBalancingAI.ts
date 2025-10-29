/**
 * Line Balancing AI Service
 * Workload optimization with bottleneck detection and task redistribution
 */

export interface WorkStation {
  id: string;
  name: string;
  operatorId: string;
  operatorName: string;
  tasks: Task[];
  totalCycleTime: number; // seconds
  utilization: number; // percentage
  isBottleneck: boolean;
}

export interface Task {
  id: string;
  name: string;
  cycleTime: number; // seconds
  skillRequired: string;
  complexity: 'simple' | 'moderate' | 'complex';
  canBeReassigned: boolean;
}

export interface LineBalance {
  lineId: string;
  lineName: string;
  targetCycleTime: number; // seconds (takt time)
  workStations: WorkStation[];
  overallEfficiency: number; // percentage
  bottlenecks: Bottleneck[];
  recommendations: BalanceRecommendation[];
  simulatedImprovements: {
    currentThroughput: number; // units/hour
    optimizedThroughput: number; // units/hour
    improvement: number; // percentage
  };
}

export interface Bottleneck {
  stationId: string;
  stationName: string;
  cycleTime: number;
  excessTime: number; // seconds over takt time
  impactOnThroughput: number; // percentage
  severity: 'minor' | 'moderate' | 'severe';
}

export interface BalanceRecommendation {
  id: string;
  type: 'redistribute-task' | 'add-operator' | 'simplify-process' | 'parallel-work';
  priority: 'low' | 'medium' | 'high';
  description: string;
  fromStation?: string;
  toStation?: string;
  taskIds?: string[];
  expectedImprovement: number; // percentage
  implementationComplexity: 'easy' | 'moderate' | 'complex';
  estimatedCost: number; // USD
  timeToImplement: string;
}

export interface SimulationResult {
  scenario: string;
  changes: string[];
  beforeMetrics: {
    cycleTime: number;
    throughput: number;
    efficiency: number;
  };
  afterMetrics: {
    cycleTime: number;
    throughput: number;
    efficiency: number;
  };
  improvements: {
    cycleTimeReduction: number;
    throughputIncrease: number;
    efficiencyGain: number;
  };
  feasibility: 'high' | 'medium' | 'low';
}

class LineBalancingAIService {
  private recommendationIdCounter = 1;

  /**
   * Analyze line balance and identify bottlenecks
   */
  async analyzeLineBalance(
    lineId: string,
    lineName: string,
    demandRate: number // units per hour
  ): Promise<LineBalance> {
    await new Promise((resolve) => setTimeout(resolve, 700));

    // Calculate takt time
    const targetCycleTime = 3600 / demandRate; // seconds per unit

    // Mock workstations with realistic task distribution
    const workStations: WorkStation[] = [
      {
        id: 'WS-1',
        name: 'Material Prep',
        operatorId: 'OP-001',
        operatorName: 'John Smith',
        tasks: [
          {
            id: 'T1',
            name: 'Retrieve materials',
            cycleTime: 15,
            skillRequired: 'Basic',
            complexity: 'simple',
            canBeReassigned: true,
          },
          {
            id: 'T2',
            name: 'Inspect quality',
            cycleTime: 20,
            skillRequired: 'QC',
            complexity: 'moderate',
            canBeReassigned: false,
          },
          {
            id: 'T3',
            name: 'Stage for assembly',
            cycleTime: 10,
            skillRequired: 'Basic',
            complexity: 'simple',
            canBeReassigned: true,
          },
        ],
        totalCycleTime: 45,
        utilization: 0,
        isBottleneck: false,
      },
      {
        id: 'WS-2',
        name: 'Sub-Assembly',
        operatorId: 'OP-002',
        operatorName: 'Maria Garcia',
        tasks: [
          {
            id: 'T4',
            name: 'Component alignment',
            cycleTime: 25,
            skillRequired: 'Assembly',
            complexity: 'moderate',
            canBeReassigned: false,
          },
          {
            id: 'T5',
            name: 'Fastening',
            cycleTime: 35,
            skillRequired: 'Assembly',
            complexity: 'moderate',
            canBeReassigned: true,
          },
          {
            id: 'T6',
            name: 'Torque verification',
            cycleTime: 15,
            skillRequired: 'QC',
            complexity: 'simple',
            canBeReassigned: true,
          },
        ],
        totalCycleTime: 75,
        utilization: 0,
        isBottleneck: false,
      },
      {
        id: 'WS-3',
        name: 'Main Assembly',
        operatorId: 'OP-003',
        operatorName: 'David Lee',
        tasks: [
          {
            id: 'T7',
            name: 'Housing installation',
            cycleTime: 30,
            skillRequired: 'Assembly',
            complexity: 'complex',
            canBeReassigned: false,
          },
          {
            id: 'T8',
            name: 'Wiring connection',
            cycleTime: 40,
            skillRequired: 'Electrical',
            complexity: 'complex',
            canBeReassigned: false,
          },
          {
            id: 'T9',
            name: 'Cable management',
            cycleTime: 20,
            skillRequired: 'Assembly',
            complexity: 'moderate',
            canBeReassigned: true,
          },
        ],
        totalCycleTime: 90,
        utilization: 0,
        isBottleneck: false,
      },
      {
        id: 'WS-4',
        name: 'Testing',
        operatorId: 'OP-004',
        operatorName: 'Sarah Johnson',
        tasks: [
          {
            id: 'T10',
            name: 'Functional test',
            cycleTime: 35,
            skillRequired: 'Testing',
            complexity: 'moderate',
            canBeReassigned: false,
          },
          {
            id: 'T11',
            name: 'Safety check',
            cycleTime: 15,
            skillRequired: 'QC',
            complexity: 'simple',
            canBeReassigned: true,
          },
          {
            id: 'T12',
            name: 'Documentation',
            cycleTime: 10,
            skillRequired: 'Basic',
            complexity: 'simple',
            canBeReassigned: true,
          },
        ],
        totalCycleTime: 60,
        utilization: 0,
        isBottleneck: false,
      },
      {
        id: 'WS-5',
        name: 'Packaging',
        operatorId: 'OP-005',
        operatorName: 'Mike Chen',
        tasks: [
          {
            id: 'T13',
            name: 'Final inspection',
            cycleTime: 15,
            skillRequired: 'QC',
            complexity: 'simple',
            canBeReassigned: true,
          },
          {
            id: 'T14',
            name: 'Pack unit',
            cycleTime: 25,
            skillRequired: 'Basic',
            complexity: 'simple',
            canBeReassigned: true,
          },
          {
            id: 'T15',
            name: 'Label and palletize',
            cycleTime: 15,
            skillRequired: 'Basic',
            complexity: 'simple',
            canBeReassigned: true,
          },
        ],
        totalCycleTime: 55,
        utilization: 0,
        isBottleneck: false,
      },
    ];

    // Calculate utilization and identify bottlenecks
    workStations.forEach((station) => {
      station.utilization = (station.totalCycleTime / targetCycleTime) * 100;
      station.isBottleneck = station.totalCycleTime > targetCycleTime;
    });

    const maxCycleTime = Math.max(...workStations.map((ws) => ws.totalCycleTime));
    const overallEfficiency = (targetCycleTime / maxCycleTime) * 100;

    // Identify bottlenecks
    const bottlenecks: Bottleneck[] = workStations
      .filter((ws) => ws.isBottleneck)
      .map((ws) => {
        const excessTime = ws.totalCycleTime - targetCycleTime;
        const impactOnThroughput = ((ws.totalCycleTime - targetCycleTime) / targetCycleTime) * 100;

        let severity: 'minor' | 'moderate' | 'severe' = 'minor';
        if (impactOnThroughput > 30) severity = 'severe';
        else if (impactOnThroughput > 15) severity = 'moderate';

        return {
          stationId: ws.id,
          stationName: ws.name,
          cycleTime: ws.totalCycleTime,
          excessTime,
          impactOnThroughput,
          severity,
        };
      });

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      workStations,
      bottlenecks,
      targetCycleTime
    );

    // Calculate improvements
    const currentThroughput = 3600 / maxCycleTime;
    const optimizedThroughput = demandRate * 1.18; // 18% improvement potential
    const improvement = ((optimizedThroughput - currentThroughput) / currentThroughput) * 100;

    return {
      lineId,
      lineName,
      targetCycleTime,
      workStations,
      overallEfficiency,
      bottlenecks,
      recommendations,
      simulatedImprovements: {
        currentThroughput: Math.round(currentThroughput),
        optimizedThroughput: Math.round(optimizedThroughput),
        improvement: Math.round(improvement * 10) / 10,
      },
    };
  }

  /**
   * Simulate line balance changes
   */
  async simulateBalanceChange(
    lineBalance: LineBalance,
    changes: BalanceRecommendation[]
  ): Promise<SimulationResult> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentMaxCycle = Math.max(...lineBalance.workStations.map((ws) => ws.totalCycleTime));
    const currentThroughput = 3600 / currentMaxCycle;
    const currentEfficiency = lineBalance.overallEfficiency;

    // Simulate improvements
    const totalImprovement = changes.reduce((sum, change) => sum + change.expectedImprovement, 0);
    const newMaxCycle = currentMaxCycle * (1 - totalImprovement / 100);
    const newThroughput = 3600 / newMaxCycle;
    const newEfficiency = (lineBalance.targetCycleTime / newMaxCycle) * 100;

    const changeDescriptions = changes.map((c) => c.description);

    return {
      scenario: `Apply ${changes.length} optimization${changes.length > 1 ? 's' : ''}`,
      changes: changeDescriptions,
      beforeMetrics: {
        cycleTime: Math.round(currentMaxCycle),
        throughput: Math.round(currentThroughput),
        efficiency: Math.round(currentEfficiency),
      },
      afterMetrics: {
        cycleTime: Math.round(newMaxCycle),
        throughput: Math.round(newThroughput),
        efficiency: Math.round(newEfficiency),
      },
      improvements: {
        cycleTimeReduction: Math.round(((currentMaxCycle - newMaxCycle) / currentMaxCycle) * 100),
        throughputIncrease: Math.round(
          ((newThroughput - currentThroughput) / currentThroughput) * 100
        ),
        efficiencyGain: Math.round(newEfficiency - currentEfficiency),
      },
      feasibility: changes.every((c) => c.implementationComplexity === 'easy')
        ? 'high'
        : changes.some((c) => c.implementationComplexity === 'complex')
          ? 'low'
          : 'medium',
    };
  }

  /**
   * Get operator-to-station matching recommendations
   */
  async getOperatorMatching(workStations: WorkStation[]): Promise<{
    currentMatching: Array<{ operator: string; station: string; efficiency: number }>;
    optimizedMatching: Array<{ operator: string; station: string; efficiency: number }>;
    improvementPotential: number;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const currentMatching = workStations.map((ws) => ({
      operator: ws.operatorName,
      station: ws.name,
      efficiency: 75 + Math.random() * 20,
    }));

    const optimizedMatching = workStations.map((ws) => ({
      operator: ws.operatorName,
      station: ws.name,
      efficiency: 85 + Math.random() * 12,
    }));

    const currentAvg =
      currentMatching.reduce((sum, m) => sum + m.efficiency, 0) / currentMatching.length;
    const optimizedAvg =
      optimizedMatching.reduce((sum, m) => sum + m.efficiency, 0) / optimizedMatching.length;
    const improvementPotential = optimizedAvg - currentAvg;

    return {
      currentMatching,
      optimizedMatching,
      improvementPotential: Math.round(improvementPotential * 10) / 10,
    };
  }

  // Helper method to generate recommendations
  private generateRecommendations(
    workStations: WorkStation[],
    bottlenecks: Bottleneck[],
    targetCycleTime: number
  ): BalanceRecommendation[] {
    const recommendations: BalanceRecommendation[] = [];

    bottlenecks.forEach((bottleneck) => {
      const station = workStations.find((ws) => ws.id === bottleneck.stationId);
      if (!station) return;

      // Find reassignable tasks
      const reassignableTasks = station.tasks.filter((t) => t.canBeReassigned);

      if (reassignableTasks.length > 0) {
        // Find underutilized stations
        const underutilized = workStations.find(
          (ws) => ws.totalCycleTime < targetCycleTime * 0.8 && ws.id !== station.id
        );

        if (underutilized) {
          recommendations.push({
            id: `REC-${this.recommendationIdCounter++}`,
            type: 'redistribute-task',
            priority: bottleneck.severity === 'severe' ? 'high' : 'medium',
            description: `Move "${reassignableTasks[0].name}" from ${station.name} to ${underutilized.name}`,
            fromStation: station.id,
            toStation: underutilized.id,
            taskIds: [reassignableTasks[0].id],
            expectedImprovement: (reassignableTasks[0].cycleTime / station.totalCycleTime) * 100,
            implementationComplexity: 'easy',
            estimatedCost: 500,
            timeToImplement: '1-2 days',
          });
        }
      }

      // If severe bottleneck, recommend adding operator
      if (bottleneck.severity === 'severe') {
        recommendations.push({
          id: `REC-${this.recommendationIdCounter++}`,
          type: 'add-operator',
          priority: 'high',
          description: `Add parallel operator at ${station.name} to split workload`,
          fromStation: station.id,
          expectedImprovement: 45,
          implementationComplexity: 'moderate',
          estimatedCost: 50000,
          timeToImplement: '1-2 weeks',
        });
      }

      // Process simplification recommendations
      const complexTasks = station.tasks.filter((t) => t.complexity === 'complex');
      if (complexTasks.length > 0) {
        recommendations.push({
          id: `REC-${this.recommendationIdCounter++}`,
          type: 'simplify-process',
          priority: 'medium',
          description: `Simplify "${complexTasks[0].name}" using poka-yoke or automation`,
          fromStation: station.id,
          taskIds: [complexTasks[0].id],
          expectedImprovement: 20,
          implementationComplexity: 'complex',
          estimatedCost: 15000,
          timeToImplement: '4-6 weeks',
        });
      }
    });

    return recommendations.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return b.expectedImprovement - a.expectedImprovement;
    });
  }
}

export const lineBalancingAI = new LineBalancingAIService();
