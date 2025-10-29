/**
 * Yield Prediction & Loss Prevention AI Service
 * Predicts production yield and provides early warnings for quality issues
 */

export interface MaterialBatch {
  batchId: string;
  materialName: string;
  supplier: string;
  receivedDate: Date;
  expiryDate: Date;
  qualityScore: number; // 0-100
  testResults: {
    moisture?: number;
    purity?: number;
    viscosity?: number;
    ph?: number;
  };
  predictedYield: number; // percentage
  riskLevel: 'low' | 'medium' | 'high';
}

export interface YieldPrediction {
  lineId: string;
  lineName: string;
  productId: string;
  productName: string;
  timestamp: Date;
  currentYield: number; // percentage
  predictedYield: number; // percentage
  targetYield: number; // percentage
  confidence: number; // 0-1
  trend: 'improving' | 'stable' | 'degrading';
  estimatedLoss: {
    units: number;
    costUSD: number;
    materialWaste: number; // kg
  };
  recommendations: string[];
  alerts: YieldAlert[];
}

export interface YieldAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  type: 'yield-drop' | 'quality-risk' | 'material-issue' | 'process-drift';
  message: string;
  timestamp: Date;
  recommendation: string;
  estimatedImpact: number; // USD
}

export interface YieldAnalytics {
  averageYield: number;
  yieldTrend: Array<{ timestamp: Date; yield: number }>;
  topLossCauses: Array<{ cause: string; percentage: number; costUSD: number }>;
  bestPerformingBatches: MaterialBatch[];
  worstPerformingBatches: MaterialBatch[];
  potentialSavings: number; // USD
}

class YieldPredictionAIService {
  private alertIdCounter = 1;

  /**
   * Predict yield for current production run
   */
  async predictYield(
    lineId: string,
    lineName: string,
    productId: string,
    productName: string,
    currentParams: {
      speed: number;
      temperature: number;
      materialBatchId: string;
      runTime: number; // minutes
      currentDefectRate: number;
    }
  ): Promise<YieldPrediction> {
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Mock yield calculation based on parameters
    const baseYield = 94.5;
    const speedFactor = currentParams.speed > 2400 ? -2 : 0.5;
    const tempFactor = Math.abs(currentParams.temperature - 72) * -0.3;
    const defectFactor = currentParams.currentDefectRate * -50;

    const currentYield = Math.max(
      75,
      Math.min(99, baseYield + speedFactor + tempFactor + defectFactor)
    );

    const predictedYield = currentYield - (Math.random() * 2 - 1); // Slight prediction variance
    const targetYield = 95.0;

    const trend: 'improving' | 'stable' | 'degrading' =
      predictedYield > currentYield + 0.5
        ? 'improving'
        : predictedYield < currentYield - 0.5
          ? 'degrading'
          : 'stable';

    // Calculate losses
    const yieldGap = Math.max(0, targetYield - predictedYield);
    const estimatedUnits = 10000; // per shift
    const lostUnits = (estimatedUnits * yieldGap) / 100;
    const costPerUnit = 2.5;
    const materialWastePerUnit = 0.8; // kg

    const recommendations: string[] = [];
    const alerts: YieldAlert[] = [];

    // Generate recommendations based on conditions
    if (currentParams.speed > 2400) {
      recommendations.push('Reduce line speed by 50 RPM to improve quality and yield');
      alerts.push({
        id: `alert-${this.alertIdCounter++}`,
        severity: 'warning',
        type: 'process-drift',
        message: 'Line speed exceeds optimal range',
        timestamp: new Date(),
        recommendation: 'Reduce to 2350 RPM for optimal yield',
        estimatedImpact: lostUnits * costPerUnit * 0.4,
      });
    }

    if (Math.abs(currentParams.temperature - 72) > 3) {
      recommendations.push(`Adjust temperature to 72°C (currently ${currentParams.temperature}°C)`);
      alerts.push({
        id: `alert-${this.alertIdCounter++}`,
        severity: 'warning',
        type: 'process-drift',
        message: 'Temperature deviation detected',
        timestamp: new Date(),
        recommendation: 'Return to optimal 72°C setpoint',
        estimatedImpact: lostUnits * costPerUnit * 0.3,
      });
    }

    if (currentParams.currentDefectRate > 0.03) {
      recommendations.push('High defect rate detected - check material batch quality');
      alerts.push({
        id: `alert-${this.alertIdCounter++}`,
        severity: 'critical',
        type: 'quality-risk',
        message: `Defect rate at ${(currentParams.currentDefectRate * 100).toFixed(1)}%`,
        timestamp: new Date(),
        recommendation: 'Inspect incoming materials and adjust process parameters',
        estimatedImpact: lostUnits * costPerUnit * 0.6,
      });
    }

    if (predictedYield < 90) {
      alerts.push({
        id: `alert-${this.alertIdCounter++}`,
        severity: 'critical',
        type: 'yield-drop',
        message: `Predicted yield below 90% (${predictedYield.toFixed(1)}%)`,
        timestamp: new Date(),
        recommendation: 'Immediate intervention required - review all process parameters',
        estimatedImpact: lostUnits * costPerUnit,
      });
    }

    if (recommendations.length === 0) {
      recommendations.push('Production parameters within optimal range');
    }

    return {
      lineId,
      lineName,
      productId,
      productName,
      timestamp: new Date(),
      currentYield,
      predictedYield,
      targetYield,
      confidence: 0.87,
      trend,
      estimatedLoss: {
        units: Math.round(lostUnits),
        costUSD: Math.round(lostUnits * costPerUnit),
        materialWaste: Math.round(lostUnits * materialWastePerUnit * 10) / 10,
      },
      recommendations,
      alerts,
    };
  }

  /**
   * Evaluate material batch quality and predict yield impact
   */
  async evaluateMaterialBatch(
    batchId: string,
    materialName: string,
    supplier: string,
    testResults: MaterialBatch['testResults']
  ): Promise<MaterialBatch> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Calculate quality score based on test results
    let qualityScore = 100;
    let predictedYield = 96;

    if (testResults.moisture !== undefined) {
      const moistureDeviation = Math.abs(testResults.moisture - 5.0); // Target: 5%
      qualityScore -= moistureDeviation * 5;
      predictedYield -= moistureDeviation * 0.8;
    }

    if (testResults.purity !== undefined) {
      const purityGap = Math.max(0, 99.5 - testResults.purity); // Target: >99.5%
      qualityScore -= purityGap * 10;
      predictedYield -= purityGap * 1.2;
    }

    if (testResults.viscosity !== undefined) {
      const viscosityDeviation = Math.abs(testResults.viscosity - 45); // Target: 45 cP
      qualityScore -= viscosityDeviation * 2;
      predictedYield -= viscosityDeviation * 0.3;
    }

    if (testResults.ph !== undefined) {
      const phDeviation = Math.abs(testResults.ph - 7.0); // Target: neutral
      qualityScore -= phDeviation * 3;
      predictedYield -= phDeviation * 0.5;
    }

    qualityScore = Math.max(0, Math.min(100, qualityScore));
    predictedYield = Math.max(75, Math.min(99, predictedYield));

    const riskLevel: 'low' | 'medium' | 'high' =
      qualityScore >= 90 ? 'low' : qualityScore >= 75 ? 'medium' : 'high';

    const receivedDate = new Date();
    receivedDate.setDate(receivedDate.getDate() - Math.floor(Math.random() * 30));

    const expiryDate = new Date(receivedDate);
    expiryDate.setDate(expiryDate.getDate() + 180); // 6 months shelf life

    return {
      batchId,
      materialName,
      supplier,
      receivedDate,
      expiryDate,
      qualityScore: Math.round(qualityScore),
      testResults,
      predictedYield: Math.round(predictedYield * 10) / 10,
      riskLevel,
    };
  }

  /**
   * Get yield analytics and insights
   */
  async getYieldAnalytics(lineId: string, days: number = 7): Promise<YieldAnalytics> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate mock trend data
    const yieldTrend: Array<{ timestamp: Date; yield: number }> = [];
    let baseYield = 93;

    for (let i = days; i >= 0; i--) {
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - i);

      const variance = Math.random() * 4 - 2;
      const yieldValue = Math.max(88, Math.min(98, baseYield + variance));

      yieldTrend.push({
        timestamp,
        yield: Math.round(yieldValue * 10) / 10,
      });

      baseYield += (Math.random() - 0.5) * 0.5; // Slight drift
    }

    const averageYield =
      yieldTrend.reduce((sum, point) => sum + point.yield, 0) / yieldTrend.length;

    const topLossCauses = [
      { cause: 'Material quality variation', percentage: 35, costUSD: 12500 },
      { cause: 'Process parameter drift', percentage: 28, costUSD: 10000 },
      { cause: 'Equipment wear', percentage: 18, costUSD: 6400 },
      { cause: 'Operator error', percentage: 12, costUSD: 4300 },
      { cause: 'Environmental factors', percentage: 7, costUSD: 2500 },
    ];

    // Mock material batches
    const bestPerformingBatches: MaterialBatch[] = [
      {
        batchId: 'BATCH-2024-A123',
        materialName: 'Premium Resin',
        supplier: 'SupplierCo A',
        receivedDate: new Date('2024-10-15'),
        expiryDate: new Date('2025-04-15'),
        qualityScore: 98,
        testResults: { moisture: 4.8, purity: 99.8, viscosity: 44, ph: 7.0 },
        predictedYield: 97.5,
        riskLevel: 'low',
      },
      {
        batchId: 'BATCH-2024-A118',
        materialName: 'Premium Resin',
        supplier: 'SupplierCo B',
        receivedDate: new Date('2024-10-10'),
        expiryDate: new Date('2025-04-10'),
        qualityScore: 96,
        testResults: { moisture: 5.2, purity: 99.6, viscosity: 46, ph: 7.1 },
        predictedYield: 96.8,
        riskLevel: 'low',
      },
    ];

    const worstPerformingBatches: MaterialBatch[] = [
      {
        batchId: 'BATCH-2024-B089',
        materialName: 'Standard Resin',
        supplier: 'SupplierCo C',
        receivedDate: new Date('2024-09-20'),
        expiryDate: new Date('2025-03-20'),
        qualityScore: 72,
        testResults: { moisture: 7.2, purity: 98.2, viscosity: 52, ph: 6.5 },
        predictedYield: 88.5,
        riskLevel: 'high',
      },
      {
        batchId: 'BATCH-2024-B092',
        materialName: 'Standard Resin',
        supplier: 'SupplierCo D',
        receivedDate: new Date('2024-09-25'),
        expiryDate: new Date('2025-03-25'),
        qualityScore: 78,
        testResults: { moisture: 6.5, purity: 98.9, viscosity: 48, ph: 6.8 },
        predictedYield: 91.2,
        riskLevel: 'medium',
      },
    ];

    const targetYield = 95;
    const currentYield = averageYield;
    const yieldGap = Math.max(0, targetYield - currentYield);
    const dailyProduction = 10000;
    const costPerUnit = 2.5;
    const potentialSavings = Math.round(dailyProduction * (yieldGap / 100) * costPerUnit * days);

    return {
      averageYield: Math.round(averageYield * 10) / 10,
      yieldTrend,
      topLossCauses,
      bestPerformingBatches,
      worstPerformingBatches,
      potentialSavings,
    };
  }

  /**
   * Get real-time yield monitoring status
   */
  async getYieldStatus(lineId: string): Promise<{
    status: 'optimal' | 'warning' | 'critical';
    currentYield: number;
    targetYield: number;
    activeAlerts: number;
    message: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentYield = 92.5 + Math.random() * 4;
    const targetYield = 95.0;
    const gap = targetYield - currentYield;

    let status: 'optimal' | 'warning' | 'critical';
    let activeAlerts = 0;
    let message = '';

    if (gap <= 1) {
      status = 'optimal';
      message = 'Yield within target range';
    } else if (gap <= 3) {
      status = 'warning';
      activeAlerts = 1;
      message = 'Yield below target - monitoring';
    } else {
      status = 'critical';
      activeAlerts = 2;
      message = 'Significant yield loss detected';
    }

    return {
      status,
      currentYield: Math.round(currentYield * 10) / 10,
      targetYield,
      activeAlerts,
      message,
    };
  }
}

export const yieldPredictionAI = new YieldPredictionAIService();
