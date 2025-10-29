/**
 * Work Order Service
 * Manages maintenance work orders with support for autonomous creation
 */

export type WorkOrderType = 'preventive' | 'corrective' | 'predictive' | 'emergency';
export type WorkOrderPriority = 'low' | 'normal' | 'high' | 'urgent';
export type WorkOrderStatus = 'open' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';

export interface WorkOrderPart {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  unit: string;
  inStock: boolean;
  estimatedCost: number;
}

export interface WorkOrder {
  id: string;
  type: WorkOrderType;
  machineId: string;
  machineName: string;
  title: string;
  description: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  assignedTo?: string;
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  estimatedDuration?: number; // minutes
  parts?: WorkOrderPart[];
  rootCause?: string;
  resolution?: string;
  createdBy: 'user' | 'autonomous-ai' | 'predictive-ai';
  aiConfidence?: number; // 0-1 if created by AI
  costEstimate?: number;
}

class WorkOrderService {
  private workOrders: WorkOrder[] = [];
  private listeners: Array<(workOrder: WorkOrder) => void> = [];

  /**
   * Create a new work order
   */
  createWorkOrder(params: Omit<WorkOrder, 'id' | 'createdAt' | 'status'>): WorkOrder {
    const workOrder: WorkOrder = {
      ...params,
      id: `WO-${Date.now()}`,
      createdAt: new Date(),
      status: 'open',
    };

    this.workOrders.push(workOrder);
    this.notifyListeners(workOrder);

    return workOrder;
  }

  /**
   * Create work order from autonomous anomaly detection
   */
  createAutonomousWorkOrder(params: {
    machineId: string;
    machineName: string;
    anomalyType: string;
    metric: string;
    value: number;
    threshold: number;
    confidence: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }): WorkOrder {
    const priorityMap: Record<string, WorkOrderPriority> = {
      low: 'normal',
      medium: 'high',
      high: 'high',
      critical: 'urgent',
    };

    const title = this.generateTitle(params.anomalyType, params.metric);
    const description = this.generateDescription(params);
    const estimatedDuration = this.estimateDuration(params.anomalyType);
    const parts = this.suggestParts(params.anomalyType, params.machineId);

    return this.createWorkOrder({
      type: 'predictive',
      machineId: params.machineId,
      machineName: params.machineName,
      title,
      description,
      priority: priorityMap[params.severity],
      createdBy: 'autonomous-ai',
      aiConfidence: params.confidence,
      estimatedDuration,
      parts,
      dueDate: this.calculateDueDate(params.severity),
      costEstimate: this.estimateCost(estimatedDuration, parts),
    });
  }

  /**
   * Get all work orders
   */
  getAllWorkOrders(): WorkOrder[] {
    return [...this.workOrders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get work orders by status
   */
  getWorkOrdersByStatus(status: WorkOrderStatus): WorkOrder[] {
    return this.workOrders.filter((wo) => wo.status === status);
  }

  /**
   * Get work orders by machine
   */
  getWorkOrdersByMachine(machineId: string): WorkOrder[] {
    return this.workOrders.filter((wo) => wo.machineId === machineId);
  }

  /**
   * Get AI-created work orders
   */
  getAICreatedWorkOrders(): WorkOrder[] {
    return this.workOrders.filter(
      (wo) => wo.createdBy === 'autonomous-ai' || wo.createdBy === 'predictive-ai'
    );
  }

  /**
   * Update work order status
   */
  updateStatus(workOrderId: string, status: WorkOrderStatus): void {
    const workOrder = this.workOrders.find((wo) => wo.id === workOrderId);
    if (workOrder) {
      workOrder.status = status;
      if (status === 'completed') {
        workOrder.completedAt = new Date();
      }
      this.notifyListeners(workOrder);
    }
  }

  /**
   * Assign work order
   */
  assignWorkOrder(workOrderId: string, assignee: string): void {
    const workOrder = this.workOrders.find((wo) => wo.id === workOrderId);
    if (workOrder) {
      workOrder.assignedTo = assignee;
      workOrder.status = 'assigned';
      this.notifyListeners(workOrder);
    }
  }

  /**
   * Subscribe to work order events
   */
  subscribe(callback: (workOrder: WorkOrder) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  /**
   * Generate work order title from anomaly
   */
  private generateTitle(anomalyType: string, metric: string): string {
    const templates: Record<string, string> = {
      temperature: `${metric} Temperature Anomaly Detected`,
      vibration: `Abnormal ${metric} Vibration - Maintenance Required`,
      speed: `${metric} Speed Deviation - Performance Check Needed`,
      oee: `${metric} Performance Degradation - Root Cause Analysis`,
      pressure: `${metric} Pressure Anomaly - System Check Required`,
    };

    return templates[anomalyType] || `${metric} Anomaly - Inspection Required`;
  }

  /**
   * Generate detailed description
   */
  private generateDescription(params: {
    anomalyType: string;
    metric: string;
    value: number;
    threshold: number;
    confidence: number;
  }): string {
    return `AI-detected anomaly requires immediate attention.

📊 Detection Details:
• Metric: ${params.metric}
• Current Value: ${params.value}
• Threshold: ${params.threshold}
• AI Confidence: ${(params.confidence * 100).toFixed(1)}%

🔍 Recommended Actions:
${this.getRecommendedActions(params.anomalyType)}

⚠️ This work order was automatically created by the Autonomous Monitoring System based on real-time sensor data analysis.`;
  }

  /**
   * Get recommended actions based on anomaly type
   */
  private getRecommendedActions(anomalyType: string): string {
    const actions: Record<string, string> = {
      temperature:
        '1. Check cooling system operation\n2. Inspect thermal sensors\n3. Verify ambient conditions\n4. Clean heat exchangers if needed',
      vibration:
        '1. Inspect bearings for wear\n2. Check alignment and balance\n3. Tighten loose connections\n4. Replace worn components',
      speed:
        '1. Check motor and drive system\n2. Inspect belt tension and condition\n3. Verify control system settings\n4. Clean sensors and encoders',
      oee: '1. Analyze downtime root causes\n2. Review quality metrics\n3. Check equipment availability\n4. Optimize production parameters',
      pressure:
        '1. Inspect seals and gaskets\n2. Check for leaks\n3. Verify pump operation\n4. Clean or replace filters',
    };

    return (
      actions[anomalyType] ||
      '1. Perform visual inspection\n2. Run diagnostics\n3. Consult maintenance manual\n4. Contact support if needed'
    );
  }

  /**
   * Estimate maintenance duration
   */
  private estimateDuration(anomalyType: string): number {
    const durations: Record<string, number> = {
      temperature: 120, // 2 hours
      vibration: 180, // 3 hours
      speed: 90, // 1.5 hours
      oee: 240, // 4 hours (includes analysis)
      pressure: 150, // 2.5 hours
    };

    return durations[anomalyType] || 120;
  }

  /**
   * Suggest required parts
   */
  private suggestParts(anomalyType: string, machineId: string): WorkOrderPart[] {
    // Mock part suggestions based on anomaly type
    const partSuggestions: Record<string, Partial<WorkOrderPart>[]> = {
      temperature: [
        {
          name: 'Cooling Fan',
          partNumber: 'FAN-001',
          quantity: 1,
          unit: 'pcs',
          inStock: true,
          estimatedCost: 245,
        },
        {
          name: 'Thermal Sensor',
          partNumber: 'SENSOR-T01',
          quantity: 1,
          unit: 'pcs',
          inStock: true,
          estimatedCost: 89,
        },
      ],
      vibration: [
        {
          name: 'Bearing Set',
          partNumber: 'BEAR-X45',
          quantity: 2,
          unit: 'pcs',
          inStock: true,
          estimatedCost: 420,
        },
      ],
      speed: [
        {
          name: 'Drive Belt',
          partNumber: 'BELT-V12',
          quantity: 1,
          unit: 'pcs',
          inStock: true,
          estimatedCost: 125,
        },
      ],
    };

    const suggestions = partSuggestions[anomalyType] || [];
    return suggestions.map(
      (part, idx) =>
        ({
          id: `part-${machineId}-${idx}`,
          ...part,
        }) as WorkOrderPart
    );
  }

  /**
   * Calculate due date based on severity
   */
  private calculateDueDate(severity: string): Date {
    const hoursMap: Record<string, number> = {
      low: 168, // 7 days
      medium: 48, // 2 days
      high: 24, // 1 day
      critical: 4, // 4 hours
    };

    const hours = hoursMap[severity] || 48;
    return new Date(Date.now() + hours * 60 * 60 * 1000);
  }

  /**
   * Estimate total cost
   */
  private estimateCost(duration: number, parts?: WorkOrderPart[]): number {
    const laborRate = 75; // $ per hour
    const laborCost = (duration / 60) * laborRate;
    const partsCost =
      parts?.reduce((sum, part) => sum + part.estimatedCost * part.quantity, 0) || 0;

    return Math.round(laborCost + partsCost);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(workOrder: WorkOrder): void {
    this.listeners.forEach((listener) => listener(workOrder));
  }

  /**
   * Clear all work orders (for testing)
   */
  clearAll(): void {
    this.workOrders = [];
  }
}

export const workOrderService = new WorkOrderService();
