/**
 * Computer Vision AI Service
 * Mock implementation of AI-powered visual defect detection
 * In production, this would integrate with Azure AI Vision or Custom Vision API
 */

export type DefectType =
  | 'scratch'
  | 'dent'
  | 'misalignment'
  | 'color-variance'
  | 'contamination'
  | 'label-defect'
  | 'seal-defect'
  | 'dimension-error';

export type DefectSeverity = 'minor' | 'major' | 'critical';

export interface BoundingBox {
  x: number; // percentage from left
  y: number; // percentage from top
  width: number; // percentage of image width
  height: number; // percentage of image height
}

export interface DetectedDefect {
  type: DefectType;
  confidence: number; // 0-1
  boundingBox: BoundingBox;
  severity: DefectSeverity;
  description: string;
  aiModel: 'YOLOv8' | 'ResNet50' | 'EfficientNet' | 'CustomVision';
}

export interface VisionInspectionResult {
  id: string;
  imageUrl: string;
  timestamp: Date;
  defectsDetected: DetectedDefect[];
  overallPass: boolean;
  processingTimeMs: number;
  imageResolution: { width: number; height: number };
  qualityScore: number; // 0-100
}

export interface InspectionConfig {
  minConfidence: number; // 0-1, minimum confidence to report defect
  enabledDefectTypes: DefectType[];
  maxDefectsToReport: number;
  autoRejectOnCritical: boolean;
}

class VisionAIService {
  private defaultConfig: InspectionConfig = {
    minConfidence: 0.75,
    enabledDefectTypes: [
      'scratch',
      'dent',
      'misalignment',
      'color-variance',
      'contamination',
      'label-defect',
      'seal-defect',
      'dimension-error',
    ],
    maxDefectsToReport: 10,
    autoRejectOnCritical: true,
  };

  /**
   * Analyze an image for defects
   * In production, this would call Azure AI Vision API
   */
  async analyzeImage(
    imageUrl: string,
    config: Partial<InspectionConfig> = {}
  ): Promise<VisionInspectionResult> {
    const mergedConfig = { ...this.defaultConfig, ...config };
    const startTime = Date.now();

    // Simulate API processing delay
    await this.simulateProcessing();

    // Mock defect detection based on image characteristics
    const defects = this.mockDefectDetection(imageUrl, mergedConfig);

    const processingTime = Date.now() - startTime;

    // Calculate overall quality score
    const qualityScore = this.calculateQualityScore(defects);
    const overallPass = this.determinePassFail(defects, mergedConfig);

    return {
      id: `vision-${Date.now()}`,
      imageUrl,
      timestamp: new Date(),
      defectsDetected: defects,
      overallPass,
      processingTimeMs: processingTime,
      imageResolution: { width: 1920, height: 1080 },
      qualityScore,
    };
  }

  /**
   * Simulate real-time camera feed analysis
   */
  async *analyzeStream(
    streamId: string,
    config: Partial<InspectionConfig> = {}
  ): AsyncGenerator<VisionInspectionResult> {
    // In production, this would process video stream frames
    let frameCount = 0;

    while (frameCount < 100) {
      // Simulate frame capture
      const frameUrl = `stream://${streamId}/frame-${frameCount}`;

      // Analyze frame
      const result = await this.analyzeImage(frameUrl, config);

      yield result;

      // Wait for next frame (30 FPS = ~33ms)
      await new Promise((resolve) => setTimeout(resolve, 33));
      frameCount++;
    }
  }

  /**
   * Get defect statistics over time
   */
  getDefectTrends(results: VisionInspectionResult[], timeRangeHours: number = 24) {
    const cutoff = Date.now() - timeRangeHours * 60 * 60 * 1000;
    const recentResults = results.filter((r) => r.timestamp.getTime() > cutoff);

    const defectsByType: Record<DefectType, number> = {} as Record<DefectType, number>;
    const defectsBySeverity: Record<DefectSeverity, number> = {
      minor: 0,
      major: 0,
      critical: 0,
    };

    recentResults.forEach((result) => {
      result.defectsDetected.forEach((defect) => {
        defectsByType[defect.type] = (defectsByType[defect.type] || 0) + 1;
        defectsBySeverity[defect.severity]++;
      });
    });

    const totalInspections = recentResults.length;
    const totalDefects = recentResults.reduce((sum, r) => sum + r.defectsDetected.length, 0);
    const passRate = (recentResults.filter((r) => r.overallPass).length / totalInspections) * 100;

    return {
      totalInspections,
      totalDefects,
      passRate,
      defectsByType,
      defectsBySeverity,
      avgQualityScore: recentResults.reduce((sum, r) => sum + r.qualityScore, 0) / totalInspections,
    };
  }

  /**
   * Mock defect detection based on image URL patterns
   * Simulates ML model predictions
   */
  private mockDefectDetection(imageUrl: string, config: InspectionConfig): DetectedDefect[] {
    const defects: DetectedDefect[] = [];

    // Simulate random defect detection with weighted probabilities
    const random = this.seededRandom(imageUrl);

    // 70% chance of finding at least one defect
    if (random() > 0.3) {
      const defectCount = Math.floor(random() * 3) + 1; // 1-3 defects

      for (let i = 0; i < defectCount; i++) {
        const defectType = this.randomDefectType(random, config.enabledDefectTypes);
        const severity = this.randomSeverity(random);
        const confidence = 0.75 + random() * 0.24; // 75-99% confidence

        if (confidence >= config.minConfidence) {
          defects.push({
            type: defectType,
            confidence,
            boundingBox: {
              x: random() * 80, // 0-80%
              y: random() * 80, // 0-80%
              width: 5 + random() * 15, // 5-20%
              height: 5 + random() * 15, // 5-20%
            },
            severity,
            description: this.getDefectDescription(defectType, severity),
            aiModel: this.randomModel(random),
          });
        }
      }
    }

    return defects.slice(0, config.maxDefectsToReport);
  }

  /**
   * Calculate quality score based on defects
   */
  private calculateQualityScore(defects: DetectedDefect[]): number {
    if (defects.length === 0) return 100;

    let score = 100;

    defects.forEach((defect) => {
      const impact = {
        critical: 30,
        major: 15,
        minor: 5,
      }[defect.severity];

      score -= impact * defect.confidence;
    });

    return Math.max(0, Math.round(score));
  }

  /**
   * Determine pass/fail based on defects
   */
  private determinePassFail(defects: DetectedDefect[], config: InspectionConfig): boolean {
    if (config.autoRejectOnCritical) {
      const hasCritical = defects.some((d) => d.severity === 'critical');
      if (hasCritical) return false;
    }

    // Pass if quality score > 80
    const qualityScore = this.calculateQualityScore(defects);
    return qualityScore >= 80;
  }

  /**
   * Get human-readable defect description
   */
  private getDefectDescription(type: DefectType, severity: DefectSeverity): string {
    const descriptions: Record<DefectType, Record<DefectSeverity, string>> = {
      scratch: {
        minor: 'Surface scratch detected - cosmetic only',
        major: 'Deep scratch visible - may affect function',
        critical: 'Severe scratch through protective coating',
      },
      dent: {
        minor: 'Minor dent detected - within tolerance',
        major: 'Noticeable dent - functional impact possible',
        critical: 'Severe dent - structural integrity compromised',
      },
      misalignment: {
        minor: 'Slight misalignment detected',
        major: 'Component misalignment - affects assembly',
        critical: 'Critical misalignment - product unusable',
      },
      'color-variance': {
        minor: 'Minor color variation from specification',
        major: 'Noticeable color difference',
        critical: 'Severe color deviation - wrong material suspected',
      },
      contamination: {
        minor: 'Small contamination spot detected',
        major: 'Foreign material contamination',
        critical: 'Severe contamination - safety risk',
      },
      'label-defect': {
        minor: 'Label slightly off-center',
        major: 'Label misplaced or damaged',
        critical: 'Label missing or completely illegible',
      },
      'seal-defect': {
        minor: 'Minor seal imperfection',
        major: 'Seal integrity questionable',
        critical: 'Seal failure - leak risk',
      },
      'dimension-error': {
        minor: 'Dimension slightly out of spec',
        major: 'Dimension exceeds tolerance',
        critical: 'Critical dimension error - part rejection',
      },
    };

    return descriptions[type][severity];
  }

  /**
   * Simulate processing delay
   */
  private async simulateProcessing(): Promise<void> {
    // Simulate 100-500ms processing time
    const delay = 100 + Math.random() * 400;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Seeded random number generator for consistent mock data
   */
  private seededRandom(seed: string): () => number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash = hash & hash;
    }

    let state = Math.abs(hash);
    return () => {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    };
  }

  /**
   * Random defect type selector
   */
  private randomDefectType(random: () => number, enabled: DefectType[]): DefectType {
    return enabled[Math.floor(random() * enabled.length)];
  }

  /**
   * Random severity selector (weighted toward minor)
   */
  private randomSeverity(random: () => number): DefectSeverity {
    const value = random();
    if (value < 0.6) return 'minor';
    if (value < 0.9) return 'major';
    return 'critical';
  }

  /**
   * Random AI model selector
   */
  private randomModel(
    random: () => number
  ): 'YOLOv8' | 'ResNet50' | 'EfficientNet' | 'CustomVision' {
    const models: Array<'YOLOv8' | 'ResNet50' | 'EfficientNet' | 'CustomVision'> = [
      'YOLOv8',
      'ResNet50',
      'EfficientNet',
      'CustomVision',
    ];
    return models[Math.floor(random() * models.length)];
  }
}

export const visionAI = new VisionAIService();
