/**
 * Maintenance Cost Optimization AI Service
 * Predictive cost-benefit analysis for maintenance decisions
 */

export interface MaintenanceTask {
  id: string;
  equipmentId: string;
  equipmentName: string;
  taskType: 'preventive' | 'corrective' | 'predictive' | 'emergency';
  description: string;
  scheduledDate?: Date;
  estimatedDuration: number; // hours
  estimatedCost: number; // USD
  priority: 'low' | 'medium' | 'high' | 'critical';
  spareParts: Array<{
    partId: string;
    partName: string;
    quantity: number;
    unitCost: number;
    leadTime: number; // days
    inStock: boolean;
  }>;
  laborCost: number;
  downtime: number; // hours
  downtimeCost: number; // USD per hour
}

export interface MaintenanceDecision {
  taskId: string;
  recommendation: 'execute-now' | 'defer' | 'schedule-optimal' | 'monitor';
  optimalDate?: Date;
  reasoning: string;
  costBenefit: {
    executionCost: number;
    deferralRisk: number; // USD
    downtimeCost: number;
    totalCost: number;
    potentialSavings: number;
  };
  roi: number; // percentage
  confidence: number; // 0-1
}

export interface SparePartForecast {
  partId: string;
  partName: string;
  currentStock: number;
  forecastedDemand: number;
  reorderPoint: number;
  optimalOrderQuantity: number;
  leadTime: number;
  totalCost: number;
  urgency: 'low' | 'medium' | 'high';
}

export interface MaintenanceBudget {
  period: string;
  totalBudget: number;
  allocated: number;
  spent: number;
  forecast: number;
  variance: number;
  recommendations: string[];
}

export interface LifeCycleCost {
  equipmentId: string;
  equipmentName: string;
  age: number; // years
  acquisitionCost: number;
  totalMaintenanceCost: number;
  averageAnnualCost: number;
  predictedRemainingLife: number; // years
  replacementRecommendation: {
    recommended: boolean;
    timeframe: string;
    reasoning: string;
    costComparison: {
      continueRepair: number;
      replace: number;
      savings: number;
    };
  };
}

class MaintenanceCostOptimizationService {
  /**
   * Analyze maintenance task and recommend optimal timing
   */
  async analyzeMaintenanceDecision(task: MaintenanceTask): Promise<MaintenanceDecision> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const executionCost = task.estimatedCost + task.laborCost;
    const downtimeCost = task.downtime * task.downtimeCost;

    // Calculate deferral risk based on equipment criticality and failure probability
    const failureProbability = this.calculateFailureProbability(task);
    const deferralRisk = failureProbability * downtimeCost * 3; // 3x cost for emergency repairs

    const totalCost = executionCost + downtimeCost;

    let recommendation: MaintenanceDecision['recommendation'];
    let optimalDate: Date | undefined;
    let reasoning: string;
    let potentialSavings = 0;

    if (task.taskType === 'emergency' || task.priority === 'critical') {
      recommendation = 'execute-now';
      reasoning =
        'Critical failure risk. Immediate action required to prevent catastrophic downtime.';
    } else if (deferralRisk < executionCost * 0.3) {
      recommendation = 'defer';
      optimalDate = new Date();
      optimalDate.setDate(optimalDate.getDate() + 30);
      reasoning = `Low failure risk. Deferring maintenance saves $${Math.round(executionCost * 0.2)} in opportunity cost.`;
      potentialSavings = executionCost * 0.2;
    } else if (task.taskType === 'predictive') {
      recommendation = 'schedule-optimal';
      optimalDate = this.calculateOptimalMaintenanceWindow(task);
      reasoning = `Schedule during next planned downtime window to minimize production impact. Saves $${Math.round(downtimeCost * 0.6)} in unplanned downtime costs.`;
      potentialSavings = downtimeCost * 0.6;
    } else {
      recommendation = 'execute-now';
      reasoning = 'Cost-benefit analysis favors immediate execution to prevent escalation.';
    }

    const roi = (potentialSavings / totalCost) * 100;

    return {
      taskId: task.id,
      recommendation,
      optimalDate,
      reasoning,
      costBenefit: {
        executionCost,
        deferralRisk,
        downtimeCost,
        totalCost,
        potentialSavings,
      },
      roi,
      confidence: 0.85,
    };
  }

  /**
   * Forecast spare parts demand
   */
  async forecastSparePartsDemand(
    _equipmentId: string,
    _horizon: number = 90 // days
  ): Promise<SparePartForecast[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Mock spare parts data
    const parts: SparePartForecast[] = [
      {
        partId: 'PART-001',
        partName: 'Heating Element',
        currentStock: 3,
        forecastedDemand: 5,
        reorderPoint: 4,
        optimalOrderQuantity: 6,
        leadTime: 14,
        totalCost: 1250,
        urgency: 'medium',
      },
      {
        partId: 'PART-002',
        partName: 'Motor Bearing',
        currentStock: 8,
        forecastedDemand: 3,
        reorderPoint: 5,
        optimalOrderQuantity: 10,
        leadTime: 7,
        totalCost: 850,
        urgency: 'low',
      },
      {
        partId: 'PART-003',
        partName: 'Control Board',
        currentStock: 1,
        forecastedDemand: 2,
        reorderPoint: 2,
        optimalOrderQuantity: 3,
        leadTime: 21,
        totalCost: 3200,
        urgency: 'high',
      },
      {
        partId: 'PART-004',
        partName: 'Pump Seal',
        currentStock: 5,
        forecastedDemand: 4,
        reorderPoint: 3,
        optimalOrderQuantity: 8,
        leadTime: 10,
        totalCost: 450,
        urgency: 'low',
      },
    ];

    return parts.map((part) => {
      const shortage = part.forecastedDemand - part.currentStock;
      let urgency: 'low' | 'medium' | 'high' = 'low';

      if (shortage > 0 && part.currentStock < part.reorderPoint) {
        urgency = 'high';
      } else if (part.currentStock <= part.reorderPoint) {
        urgency = 'medium';
      }

      return { ...part, urgency };
    });
  }

  /**
   * Analyze maintenance budget and optimize allocation
   */
  async analyzeMaintenanceBudget(period: string): Promise<MaintenanceBudget> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const totalBudget = 250000;
    const allocated = 185000;
    const spent = 142000;
    const forecast = 225000;
    const variance = totalBudget - forecast;

    const recommendations: string[] = [];

    if (forecast > totalBudget) {
      recommendations.push(
        `Budget overrun risk: ${Math.round(((forecast - totalBudget) / totalBudget) * 100)}%. Consider deferring non-critical tasks.`
      );
      recommendations.push(
        'Top 3 cost drivers: Emergency repairs (45%), spare parts inventory (28%), contractor labor (18%)'
      );
    }

    if (variance > 0) {
      recommendations.push(
        `Opportunity: $${variance.toLocaleString()} available. Invest in predictive maintenance to reduce future costs by 30%.`
      );
    }

    recommendations.push(
      'Shift from reactive (60%) to predictive (40%) maintenance saves $75K annually'
    );
    recommendations.push('Consolidate spare parts orders to reduce lead times and costs by 15%');

    return {
      period,
      totalBudget,
      allocated,
      spent,
      forecast,
      variance,
      recommendations,
    };
  }

  /**
   * Perform life cycle cost analysis
   */
  async analyzeLifeCycleCost(
    equipmentId: string,
    equipmentName: string,
    age: number,
    acquisitionCost: number = 250000,
    maintenanceCostHistory: number[] = [12000, 15000, 18000, 22000, 28000, 35000, 42000]
  ): Promise<LifeCycleCost> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const annualMaintenanceHistory = maintenanceCostHistory.length >= age 
      ? maintenanceCostHistory 
      : [...maintenanceCostHistory, ...Array(Math.max(0, age - maintenanceCostHistory.length)).fill(maintenanceCostHistory[maintenanceCostHistory.length - 1] * 1.1)];
    
    const totalMaintenanceCost = annualMaintenanceHistory.slice(0, age).reduce((sum, cost) => sum + cost, 0);
    const averageAnnualCost = totalMaintenanceCost / age;

    // Predict remaining life based on maintenance cost trend
    const costTrend = this.calculateCostTrend(annualMaintenanceHistory);
    const predictedRemainingLife = costTrend > 0.3 ? 3 : costTrend > 0.2 ? 5 : 8;

    // Calculate replacement recommendation
    const continueRepairCost = this.projectFutureMaintenanceCost(
      annualMaintenanceHistory,
      predictedRemainingLife
    );
    const replacementCost = 280000; // New equipment cost
    const replacementMaintenanceCost = 10000 * predictedRemainingLife; // Lower maintenance for new equipment
    const totalReplacementCost = replacementCost + replacementMaintenanceCost;

    const recommended = continueRepairCost > totalReplacementCost * 0.9;
    const savings = Math.max(0, continueRepairCost - totalReplacementCost);

    let timeframe = '';
    let reasoning = '';

    if (recommended) {
      if (predictedRemainingLife <= 2) {
        timeframe = 'Within 12 months';
        reasoning = `Equipment shows rapid maintenance cost escalation (${(costTrend * 100).toFixed(0)}% annual increase). Replacement saves $${Math.round(savings).toLocaleString()} over ${predictedRemainingLife} years.`;
      } else if (predictedRemainingLife <= 4) {
        timeframe = 'Within 24 months';
        reasoning = `Moderate cost increase trend. Plan replacement to avoid emergency situation. Total savings: $${Math.round(savings).toLocaleString()}.`;
      } else {
        timeframe = 'Within 36 months';
        reasoning = `Proactive replacement recommended. Current equipment viable but approaching end of economic life.`;
      }
    } else {
      timeframe = 'Not recommended';
      reasoning = `Continue current maintenance program. Equipment still economically viable with $${Math.round(-savings).toLocaleString()} advantage over replacement.`;
    }

    return {
      equipmentId,
      equipmentName,
      age,
      acquisitionCost,
      totalMaintenanceCost,
      averageAnnualCost,
      predictedRemainingLife,
      replacementRecommendation: {
        recommended,
        timeframe,
        reasoning,
        costComparison: {
          continueRepair: Math.round(continueRepairCost),
          replace: Math.round(totalReplacementCost),
          savings: Math.round(savings),
        },
      },
    };
  }

  /**
   * Get maintenance ROI analysis
   */
  async getMaintenanceROI(): Promise<{
    preventiveMaintenance: { cost: number; savings: number; roi: number };
    predictiveMaintenance: { cost: number; savings: number; roi: number };
    reactiveApproach: { cost: number; savings: number; roi: number };
  }> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      preventiveMaintenance: {
        cost: 120000,
        savings: 180000,
        roi: 50,
      },
      predictiveMaintenance: {
        cost: 95000,
        savings: 285000,
        roi: 200,
      },
      reactiveApproach: {
        cost: 200000,
        savings: 0,
        roi: -40,
      },
    };
  }

  // Helper methods
  private calculateFailureProbability(task: MaintenanceTask): number {
    let probability = 0.1; // Base 10%

    if (task.taskType === 'emergency') probability = 0.9;
    else if (task.priority === 'critical') probability = 0.7;
    else if (task.priority === 'high') probability = 0.5;
    else if (task.priority === 'medium') probability = 0.3;

    return probability;
  }

  private calculateOptimalMaintenanceWindow(_task: MaintenanceTask): Date {
    const optimal = new Date();
    // Find next weekend or low-production period
    const daysToWeekend = (6 - optimal.getDay() + 7) % 7 || 7;
    optimal.setDate(optimal.getDate() + daysToWeekend);
    return optimal;
  }

  private calculateCostTrend(history: number[]): number {
    if (history.length < 2) return 0;
    const recent = history.slice(-3);
    const older = history.slice(0, -3);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    return (recentAvg - olderAvg) / olderAvg;
  }

  private projectFutureMaintenanceCost(history: number[], years: number): number {
    const lastYear = history[history.length - 1];
    const growthRate = this.calculateCostTrend(history);
    let total = 0;

    for (let i = 0; i < years; i++) {
      total += lastYear * Math.pow(1 + growthRate, i + 1);
    }

    return total;
  }
}

export const maintenanceCostAI = new MaintenanceCostOptimizationService();
