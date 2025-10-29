/**
 * Intelligent Scheduling AI Service
 * Multi-constraint optimization for production scheduling
 */

export interface ScheduleConstraint {
  id: string;
  type: 'skill' | 'material' | 'equipment' | 'deadline' | 'changeover';
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  impact: number; // 0-100
}

export interface ScheduleJob {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  duration: number; // minutes
  deadline: Date;
  priority: 'critical' | 'high' | 'medium' | 'low';
  requiredSkills: string[];
  requiredMaterials: Array<{ id: string; quantity: number }>;
  linePreference?: string;
  setupTime: number; // minutes for changeover
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'delayed';
  scheduledStart?: Date;
  scheduledEnd?: Date;
  assignedLine?: string;
  assignedOperators?: string[];
}

export interface OptimizedSchedule {
  id: string;
  timestamp: Date;
  jobs: ScheduleJob[];
  efficiency: number; // 0-100
  utilizationRate: number; // 0-100
  onTimeDelivery: number; // percentage
  totalChangeoverTime: number; // minutes
  constraints: ScheduleConstraint[];
  conflicts: Array<{
    type: string;
    severity: 'warning' | 'critical';
    description: string;
    affectedJobs: string[];
    resolution: string;
  }>;
  recommendations: string[];
  kpis: {
    avgWaitTime: number;
    maxLateness: number;
    capacityUtilization: number;
    skillMatchScore: number;
  };
}

export interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  changes: Array<{
    type: 'add-job' | 'remove-job' | 'change-priority' | 'delay' | 'material-shortage';
    jobId?: string;
    details: string;
  }>;
  impact: {
    scheduleEfficiency: number; // change in %
    onTimeDelivery: number; // change in %
    utilizationRate: number; // change in %
    recommendation: string;
  };
}

class IntelligentSchedulingAIService {
  private scheduleIdCounter = 1;
  private scenarioIdCounter = 1;

  /**
   * Optimize production schedule with multi-constraint solving
   */
  async optimizeSchedule(
    jobs: ScheduleJob[],
    availableLines: Array<{ id: string; name: string; capabilities: string[] }>,
    operators: Array<{ id: string; name: string; skills: string[]; shift: string }>,
    horizon: number = 24 // hours
  ): Promise<OptimizedSchedule> {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Sort jobs by priority and deadline
    const sortedJobs = [...jobs].sort((a, b) => {
      const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityWeight[a.priority];
      const bPriority = priorityWeight[b.priority];

      if (aPriority !== bPriority) return bPriority - aPriority;
      return a.deadline.getTime() - b.deadline.getTime();
    });

    // Schedule jobs
    const now = new Date();
    let currentTime = new Date(now);
    const scheduledJobs: ScheduleJob[] = [];
    let totalChangeoverTime = 0;
    const conflicts: OptimizedSchedule['conflicts'] = [];

    for (const job of sortedJobs) {
      // Find available line
      const availableLine = availableLines[Math.floor(Math.random() * availableLines.length)];

      // Check skill availability
      const hasSkills = operators.some((op) =>
        job.requiredSkills.every((skill) => op.skills.includes(skill))
      );

      if (!hasSkills) {
        conflicts.push({
          type: 'skill-mismatch',
          severity: 'warning',
          description: `No operators with required skills for ${job.productName}`,
          affectedJobs: [job.id],
          resolution: 'Consider training or rescheduling',
        });
      }

      // Add setup time
      const setupTime = job.setupTime || 15;
      currentTime = new Date(currentTime.getTime() + setupTime * 60000);
      totalChangeoverTime += setupTime;

      const scheduledStart = new Date(currentTime);
      const scheduledEnd = new Date(currentTime.getTime() + job.duration * 60000);

      scheduledJobs.push({
        ...job,
        status: 'scheduled',
        scheduledStart,
        scheduledEnd,
        assignedLine: availableLine.id,
        assignedOperators: operators
          .filter((op) => job.requiredSkills.some((skill) => op.skills.includes(skill)))
          .slice(0, 2)
          .map((op) => op.id),
      });

      currentTime = scheduledEnd;

      // Check deadline
      if (scheduledEnd > job.deadline) {
        conflicts.push({
          type: 'deadline-miss',
          severity: 'critical',
          description: `${job.productName} will miss deadline by ${Math.round((scheduledEnd.getTime() - job.deadline.getTime()) / 60000)} minutes`,
          affectedJobs: [job.id],
          resolution: 'Increase priority or add resources',
        });
      }
    }

    // Calculate KPIs
    const totalDuration = scheduledJobs.reduce((sum, job) => sum + job.duration, 0);
    const totalTime = (currentTime.getTime() - now.getTime()) / 60000;
    const utilizationRate = (totalDuration / totalTime) * 100;

    const onTimeJobs = scheduledJobs.filter((job) => job.scheduledEnd! <= job.deadline).length;
    const onTimeDelivery = (onTimeJobs / scheduledJobs.length) * 100;

    const efficiency = Math.min(100, (utilizationRate + onTimeDelivery) / 2);

    const avgWaitTime = totalChangeoverTime / scheduledJobs.length;
    const maxLateness = Math.max(
      0,
      ...scheduledJobs.map((job) =>
        job.scheduledEnd! > job.deadline
          ? (job.scheduledEnd!.getTime() - job.deadline.getTime()) / 60000
          : 0
      )
    );

    const skillMatchScore =
      (scheduledJobs.filter((job) => job.assignedOperators?.length).length / scheduledJobs.length) *
      100;

    const recommendations: string[] = [];
    if (utilizationRate < 70) {
      recommendations.push('Low line utilization - consider consolidating schedules');
    }
    if (conflicts.filter((c) => c.severity === 'critical').length > 0) {
      recommendations.push('Critical conflicts detected - immediate attention required');
    }
    if (totalChangeoverTime > totalTime * 0.2) {
      recommendations.push('High changeover time - optimize product sequencing');
    }
    if (skillMatchScore < 80) {
      recommendations.push('Skill gaps identified - schedule training or hire');
    }

    return {
      id: `schedule-${this.scheduleIdCounter++}`,
      timestamp: now,
      jobs: scheduledJobs,
      efficiency: Math.round(efficiency),
      utilizationRate: Math.round(utilizationRate),
      onTimeDelivery: Math.round(onTimeDelivery),
      totalChangeoverTime,
      constraints: [],
      conflicts,
      recommendations,
      kpis: {
        avgWaitTime: Math.round(avgWaitTime),
        maxLateness: Math.round(maxLateness),
        capacityUtilization: Math.round(utilizationRate),
        skillMatchScore: Math.round(skillMatchScore),
      },
    };
  }

  /**
   * Generate what-if scenarios
   */
  async generateWhatIfScenarios(currentSchedule: OptimizedSchedule): Promise<WhatIfScenario[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    return [
      {
        id: `scenario-${this.scenarioIdCounter++}`,
        name: 'Rush Order Added',
        description: 'High-priority order added with 4-hour deadline',
        changes: [
          {
            type: 'add-job',
            details: 'New rush order: 500 units, 4-hour deadline',
          },
        ],
        impact: {
          scheduleEfficiency: -8,
          onTimeDelivery: -12,
          utilizationRate: +5,
          recommendation: 'Reschedule 2 low-priority jobs to accommodate rush order',
        },
      },
      {
        id: `scenario-${this.scenarioIdCounter++}`,
        name: 'Line 2 Breakdown',
        description: 'Line 2 unavailable for 3 hours due to maintenance',
        changes: [
          {
            type: 'delay',
            details: 'Line 2 offline: 3 hours',
          },
        ],
        impact: {
          scheduleEfficiency: -15,
          onTimeDelivery: -20,
          utilizationRate: -10,
          recommendation: 'Shift 3 jobs to Line 1, extend shift by 2 hours',
        },
      },
      {
        id: `scenario-${this.scenarioIdCounter++}`,
        name: 'Material Shortage',
        description: 'Key ingredient delayed by 6 hours',
        changes: [
          {
            type: 'material-shortage',
            details: 'Material M-123 delayed: 6 hours',
          },
        ],
        impact: {
          scheduleEfficiency: -10,
          onTimeDelivery: -15,
          utilizationRate: -5,
          recommendation: 'Use alternative material or reschedule dependent jobs',
        },
      },
      {
        id: `scenario-${this.scenarioIdCounter++}`,
        name: 'Additional Operator',
        description: 'Hire one additional multi-skilled operator',
        changes: [
          {
            type: 'add-job',
            details: 'New operator with 3 core skills',
          },
        ],
        impact: {
          scheduleEfficiency: +12,
          onTimeDelivery: +8,
          utilizationRate: +15,
          recommendation: 'Reduce skill gaps and enable parallel processing',
        },
      },
    ];
  }

  /**
   * Detect scheduling conflicts in real-time
   */
  async detectConflicts(
    schedule: OptimizedSchedule,
    realTimeEvents: Array<{
      type: 'delay' | 'breakdown' | 'absence' | 'rush-order';
      details: string;
    }>
  ): Promise<
    Array<{
      severity: 'critical' | 'warning';
      message: string;
      affectedJobs: number;
      recommendation: string;
    }>
  > {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const conflicts = realTimeEvents.map((event) => {
      switch (event.type) {
        case 'delay':
          return {
            severity: 'warning' as const,
            message: `Production delay detected: ${event.details}`,
            affectedJobs: 2,
            recommendation: 'Notify downstream operations, consider overtime',
          };
        case 'breakdown':
          return {
            severity: 'critical' as const,
            message: `Equipment breakdown: ${event.details}`,
            affectedJobs: 4,
            recommendation: 'Emergency maintenance, reschedule to alternate line',
          };
        case 'absence':
          return {
            severity: 'warning' as const,
            message: `Operator absence: ${event.details}`,
            affectedJobs: 1,
            recommendation: 'Reassign tasks to available operators with matching skills',
          };
        case 'rush-order':
          return {
            severity: 'critical' as const,
            message: `Rush order received: ${event.details}`,
            affectedJobs: 3,
            recommendation: 'Reprioritize schedule, consider expedited processing',
          };
        default:
          return {
            severity: 'warning' as const,
            message: 'Unknown event type',
            affectedJobs: 0,
            recommendation: 'Investigate and update schedule',
          };
      }
    });

    return conflicts;
  }

  /**
   * Optimize changeover sequence to minimize setup time
   */
  async optimizeChangeoverSequence(
    products: Array<{ id: string; name: string; family: string }>
  ): Promise<{
    originalSequence: string[];
    optimizedSequence: string[];
    timeSaved: number; // minutes
    recommendation: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Group by product family for minimal changeover
    const grouped = products.reduce(
      (acc, prod) => {
        if (!acc[prod.family]) acc[prod.family] = [];
        acc[prod.family].push(prod.id);
        return acc;
      },
      {} as Record<string, string[]>
    );

    const optimizedSequence = Object.values(grouped).flat();
    const originalSequence = products.map((p) => p.id);

    // Estimate time saved
    const avgChangeoverSameFamily = 10; // minutes
    const avgChangeoverDiffFamily = 25; // minutes

    const originalTime = products.length * avgChangeoverDiffFamily;
    const optimizedTime =
      Object.keys(grouped).length * avgChangeoverDiffFamily +
      (products.length - Object.keys(grouped).length) * avgChangeoverSameFamily;

    const timeSaved = originalTime - optimizedTime;

    return {
      originalSequence,
      optimizedSequence,
      timeSaved: Math.round(timeSaved),
      recommendation: `Group products by family to save ${Math.round(timeSaved)} minutes per schedule cycle`,
    };
  }
}

export const intelligentSchedulingAI = new IntelligentSchedulingAIService();
