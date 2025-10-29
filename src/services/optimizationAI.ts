/**
 * Production Parameter Optimization AI Service
 * Mock AI service that provides real-time optimization recommendations
 * for production parameters to improve OEE, quality, and efficiency
 */

export interface OptimizationRecommendation {
  id: string;
  timestamp: Date;
  equipment: string;
  parameter: string;
  currentValue: number;
  recommendedValue: number;
  unit: string;
  confidence: number;
  estimatedImpact: {
    oeeGain: number; // percentage points
    qualityImprovement: number; // percentage
    costSavings: number; // USD per hour
    energySavings?: number; // kWh per hour
  };
  reasoning: string;
  priority: 'low' | 'medium' | 'high';
  implementationComplexity: 'easy' | 'moderate' | 'complex';
  predictedRisk: 'low' | 'medium' | 'high';
}

export interface ParameterOptimization {
  machineId: string;
  machineName: string;
  recommendations: OptimizationRecommendation[];
  overallOeeImpact: number;
  lastAnalyzed: Date;
}

class OptimizationAIService {
  private recommendationIdCounter = 1;

  /**
   * Analyze production parameters and generate optimization recommendations
   */
  async analyzeProductionParameters(
    machineId: string,
    machineName: string,
    currentParameters: {
      speed?: number;
      temperature?: number;
      pressure?: number;
      oee?: number;
      quality?: number;
    }
  ): Promise<ParameterOptimization> {
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 800));

    const recommendations: OptimizationRecommendation[] = [];
    let totalOeeImpact = 0;

    // Speed optimization
    if (currentParameters.speed) {
      const speedRec = this.generateSpeedRecommendation(
        machineId,
        machineName,
        currentParameters.speed,
        currentParameters.quality || 0.95
      );
      if (speedRec) {
        recommendations.push(speedRec);
        totalOeeImpact += speedRec.estimatedImpact.oeeGain;
      }
    }

    // Temperature optimization
    if (currentParameters.temperature) {
      const tempRec = this.generateTemperatureRecommendation(
        machineId,
        machineName,
        currentParameters.temperature,
        currentParameters.quality || 0.95
      );
      if (tempRec) {
        recommendations.push(tempRec);
        totalOeeImpact += tempRec.estimatedImpact.oeeGain;
      }
    }

    // Pressure optimization
    if (currentParameters.pressure) {
      const pressureRec = this.generatePressureRecommendation(
        machineId,
        machineName,
        currentParameters.pressure
      );
      if (pressureRec) {
        recommendations.push(pressureRec);
        totalOeeImpact += pressureRec.estimatedImpact.oeeGain;
      }
    }

    // Sort by priority and estimated impact
    recommendations.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityWeight[a.priority];
      const bPriority = priorityWeight[b.priority];
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      return b.estimatedImpact.oeeGain - a.estimatedImpact.oeeGain;
    });

    return {
      machineId,
      machineName,
      recommendations,
      overallOeeImpact: totalOeeImpact,
      lastAnalyzed: new Date(),
    };
  }

  private generateSpeedRecommendation(
    machineId: string,
    machineName: string,
    currentSpeed: number,
    currentQuality: number
  ): OptimizationRecommendation | null {
    // Mock logic: Suggest speed increase if quality is high and speed is below optimal
    const optimalSpeed = 2400; // RPM
    const speedDifference = optimalSpeed - currentSpeed;

    if (speedDifference > 50 && currentQuality > 0.96) {
      // Can safely increase speed
      const recommendedSpeed = currentSpeed + Math.min(speedDifference * 0.3, 100);
      const speedIncrease = ((recommendedSpeed - currentSpeed) / currentSpeed) * 100;

      return {
        id: `opt-${this.recommendationIdCounter++}`,
        timestamp: new Date(),
        equipment: machineName,
        parameter: 'Speed',
        currentValue: currentSpeed,
        recommendedValue: Math.round(recommendedSpeed),
        unit: 'RPM',
        confidence: 0.89,
        estimatedImpact: {
          oeeGain: speedIncrease * 0.7, // ~70% of speed increase translates to OEE gain
          qualityImprovement: -0.5, // Slight quality reduction acceptable
          costSavings: (speedIncrease / 100) * 45, // ~$45/hr per 1% speed increase
          energySavings: undefined,
        },
        reasoning: `High quality rate (${(currentQuality * 100).toFixed(1)}%) indicates capacity for ${speedIncrease.toFixed(1)}% speed increase. Predictive model shows minimal quality impact with ${speedIncrease.toFixed(1)}% throughput gain.`,
        priority: 'high',
        implementationComplexity: 'easy',
        predictedRisk: 'low',
      };
    } else if (speedDifference < -100 && currentQuality < 0.94) {
      // Running too fast, quality suffering
      const recommendedSpeed = currentSpeed - 80;
      const speedDecrease = ((currentSpeed - recommendedSpeed) / currentSpeed) * 100;

      return {
        id: `opt-${this.recommendationIdCounter++}`,
        timestamp: new Date(),
        equipment: machineName,
        parameter: 'Speed',
        currentValue: currentSpeed,
        recommendedValue: Math.round(recommendedSpeed),
        unit: 'RPM',
        confidence: 0.92,
        estimatedImpact: {
          oeeGain: 3.2, // Quality improvement offsets speed reduction
          qualityImprovement: 4.5, // Significant quality gain
          costSavings: 28, // Reduced defect costs
          energySavings: 2.3,
        },
        reasoning: `Quality rate below target (${(currentQuality * 100).toFixed(1)}%). Analysis shows ${speedDecrease.toFixed(1)}% speed reduction yields ${4.5}% quality improvement, improving overall OEE by ${3.2}%.`,
        priority: 'high',
        implementationComplexity: 'easy',
        predictedRisk: 'low',
      };
    }

    return null;
  }

  private generateTemperatureRecommendation(
    machineId: string,
    machineName: string,
    currentTemp: number,
    currentQuality: number
  ): OptimizationRecommendation | null {
    // Mock logic: Optimize temperature for quality
    const optimalTemp = 72; // °C
    const tempDifference = Math.abs(optimalTemp - currentTemp);

    if (tempDifference > 3 && currentQuality < 0.97) {
      const recommendedTemp = currentTemp + (optimalTemp > currentTemp ? 2 : -2);
      const qualityGain = tempDifference * 0.8;

      return {
        id: `opt-${this.recommendationIdCounter++}`,
        timestamp: new Date(),
        equipment: machineName,
        parameter: 'Temperature',
        currentValue: currentTemp,
        recommendedValue: recommendedTemp,
        unit: '°C',
        confidence: 0.87,
        estimatedImpact: {
          oeeGain: qualityGain * 0.4,
          qualityImprovement: qualityGain,
          costSavings: 15,
          energySavings: Math.abs(recommendedTemp - currentTemp) * 0.8,
        },
        reasoning: `Temperature ${tempDifference.toFixed(1)}°C from optimal. Moving toward ${optimalTemp}°C target improves thermal stability, reducing defect rate by estimated ${qualityGain.toFixed(1)}%.`,
        priority: tempDifference > 5 ? 'high' : 'medium',
        implementationComplexity: 'easy',
        predictedRisk: 'low',
      };
    }

    return null;
  }

  private generatePressureRecommendation(
    machineId: string,
    machineName: string,
    currentPressure: number
  ): OptimizationRecommendation | null {
    // Mock logic: Optimize pressure for efficiency
    const optimalPressure = 95; // PSI
    const pressureDifference = Math.abs(optimalPressure - currentPressure);

    if (pressureDifference > 5) {
      const recommendedPressure = currentPressure + (optimalPressure > currentPressure ? 3 : -3);
      const efficiencyGain = pressureDifference * 0.6;

      return {
        id: `opt-${this.recommendationIdCounter++}`,
        timestamp: new Date(),
        equipment: machineName,
        parameter: 'Pressure',
        currentValue: currentPressure,
        recommendedValue: recommendedPressure,
        unit: 'PSI',
        confidence: 0.84,
        estimatedImpact: {
          oeeGain: efficiencyGain * 0.3,
          qualityImprovement: 1.2,
          costSavings: 12,
          energySavings: pressureDifference * 0.5,
        },
        reasoning: `Pressure ${pressureDifference.toFixed(1)} PSI from optimal setpoint. Adjustment reduces energy consumption while maintaining process stability. Estimated ${efficiencyGain.toFixed(1)}% efficiency improvement.`,
        priority: 'medium',
        implementationComplexity: 'moderate',
        predictedRisk: 'low',
      };
    }

    return null;
  }

  /**
   * Get quick win recommendations (easy to implement, high impact)
   */
  async getQuickWins(
    recommendations: OptimizationRecommendation[]
  ): Promise<OptimizationRecommendation[]> {
    return recommendations.filter(
      (rec) =>
        rec.implementationComplexity === 'easy' &&
        rec.priority === 'high' &&
        rec.estimatedImpact.oeeGain > 2
    );
  }

  /**
   * Calculate cumulative impact of implementing multiple recommendations
   */
  calculateCumulativeImpact(recommendations: OptimizationRecommendation[]): {
    totalOeeGain: number;
    totalQualityGain: number;
    totalCostSavings: number;
    totalEnergySavings: number;
    averageConfidence: number;
  } {
    const totalOeeGain = recommendations.reduce((sum, rec) => sum + rec.estimatedImpact.oeeGain, 0);
    const totalQualityGain = recommendations.reduce(
      (sum, rec) => sum + rec.estimatedImpact.qualityImprovement,
      0
    );
    const totalCostSavings = recommendations.reduce(
      (sum, rec) => sum + rec.estimatedImpact.costSavings,
      0
    );
    const totalEnergySavings = recommendations.reduce(
      (sum, rec) => sum + (rec.estimatedImpact.energySavings || 0),
      0
    );
    const averageConfidence =
      recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length;

    return {
      totalOeeGain,
      totalQualityGain,
      totalCostSavings,
      totalEnergySavings,
      averageConfidence,
    };
  }
}

export const optimizationAI = new OptimizationAIService();
