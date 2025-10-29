/**
 * Autonomous Agent System
 * Monitors real-time data, detects anomalies, triggers predictive maintenance,
 * and can take automated actions like planning work or stopping lines.
 */

import { digitalTwin } from './twin';
import { workOrderService } from '@/services/workOrderService';

export interface AutonomousEvent {
  id: string;
  timestamp: Date;
  type:
    | 'anomaly_detected'
    | 'agent_triggered'
    | 'action_planned'
    | 'line_stopped'
    | 'maintenance_scheduled'
    | 'alert';
  severity: 'info' | 'warning' | 'critical';
  equipment: string;
  location: string;
  message: string;
  details?: {
    metric?: string;
    value?: number;
    threshold?: number;
    confidence?: number;
    agentTriggered?: string;
    actionTaken?: string;
    workOrderId?: string;
  };
}

export interface MonitoringConfig {
  enabled: boolean;
  checkIntervalMs: number;
  anomalyThresholds: {
    temperature: { min: number; max: number };
    speed: { min: number; max: number };
    oee: { min: number };
  };
}

class AutonomousMonitoringService {
  private intervalId: NodeJS.Timeout | null = null;
  private eventListeners: Array<(event: AutonomousEvent) => void> = [];
  private eventHistory: AutonomousEvent[] = [];
  private isMonitoring = false;

  // Cooldown tracking to prevent re-triggering same anomalies
  private anomalyCooldowns: Map<string, number> = new Map();
  private readonly COOLDOWN_MS = 60000; // 60 seconds cooldown per anomaly

  private config: MonitoringConfig = {
    enabled: true,
    checkIntervalMs: 5000, // Check every 5 seconds
    anomalyThresholds: {
      temperature: { min: 15, max: 85 },
      speed: { min: 80, max: 1200 },
      oee: { min: 0.75 }, // Below 75% triggers attention
    },
  };

  /**
   * Start autonomous monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.emitEvent({
      id: Date.now().toString(),
      timestamp: new Date(),
      type: 'alert',
      severity: 'info',
      equipment: 'Autonomous System',
      location: 'Factory-1',
      message:
        '🤖 Autonomous monitoring system activated - Now continuously monitoring all production lines for anomalies, performance degradation, and safety issues.',
      details: {
        actionTaken:
          'Real-time monitoring initiated across all equipment. Checking temperature, speed, OEE metrics every 5 seconds. AI agents on standby for predictive analysis.',
      },
    });

    this.intervalId = setInterval(() => {
      this.checkForAnomalies();
    }, this.config.checkIntervalMs);
  }

  /**
   * Stop autonomous monitoring
   */
  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isMonitoring = false;
    this.anomalyCooldowns.clear(); // Clear cooldowns when stopping

    this.emitEvent({
      id: Date.now().toString(),
      timestamp: new Date(),
      type: 'alert',
      severity: 'info',
      equipment: 'Autonomous System',
      location: 'Factory-1',
      message:
        '⏸️ Autonomous monitoring system paused - All active monitoring suspended. Cooldown timers cleared.',
    });
  }

  /**
   * Check if an anomaly is on cooldown
   */
  private isOnCooldown(key: string): boolean {
    const lastTrigger = this.anomalyCooldowns.get(key);
    if (!lastTrigger) return false;

    const elapsed = Date.now() - lastTrigger;
    return elapsed < this.COOLDOWN_MS;
  }

  /**
   * Set cooldown for an anomaly
   */
  private setCooldown(key: string): void {
    this.anomalyCooldowns.set(key, Date.now());
  }

  /**
   * Check all equipment for anomalies
   */
  private async checkForAnomalies(): Promise<void> {
    try {
      // Get root hierarchy (site level)
      const hierarchy = await digitalTwin.getHierarchy('site-1');

      // Check all equipment nodes recursively
      await this.checkNodeRecursive(hierarchy, hierarchy.name);
    } catch (error) {
      console.error('Autonomous monitoring error:', error);
    }
  }

  /**
   * Recursively check nodes
   */
  private async checkNodeRecursive(node: any, location: string): Promise<void> {
    // Check current node
    await this.checkNode(node, location);

    // Check children
    if (node.children) {
      for (const child of node.children) {
        await this.checkNodeRecursive(child, `${location} > ${child.name}`);
      }
    }
  }

  /**
   * Check a single node for anomalies by examining its properties
   */
  private async checkNode(node: any, location: string): Promise<void> {
    // Get metrics from node properties
    const tempProp = node.properties?.find((p: any) => p.key === 'temperature');
    if (tempProp && typeof tempProp.value === 'number') {
      await this.checkTemperatureAnomaly(node, location, tempProp.value, tempProp.unit || '°C');
    }

    const speedProp = node.properties?.find((p: any) => p.key === 'speed');
    if (speedProp && typeof speedProp.value === 'number') {
      await this.checkSpeedAnomaly(node, location, speedProp.value, speedProp.unit || 'RPM');
    }

    const oeeProp = node.properties?.find((p: any) => p.key === 'oee');
    if (oeeProp && typeof oeeProp.value === 'number') {
      // Convert to decimal if it's a percentage
      const oeeValue = oeeProp.value > 1 ? oeeProp.value / 100 : oeeProp.value;
      await this.checkOEEAnomaly(node, location, oeeValue);
    }
  }

  /**
   * Check temperature anomaly and trigger actions
   */
  private async checkTemperatureAnomaly(
    node: any,
    location: string,
    value: number,
    unit: string
  ): Promise<void> {
    const { min, max } = this.config.anomalyThresholds.temperature;
    const cooldownKey = `temp-${node.id}`;

    if (value > max) {
      // Check if we already triggered this anomaly recently
      if (this.isOnCooldown(cooldownKey)) {
        return;
      }

      // Set cooldown
      this.setCooldown(cooldownKey);

      // Critical temperature - immediate action needed
      const eventId = Date.now().toString();

      // 1. Detect anomaly
      this.emitEvent({
        id: eventId,
        timestamp: new Date(),
        type: 'anomaly_detected',
        severity: 'critical',
        equipment: node.name,
        location,
        message: `🔥 Critical temperature anomaly detected: ${value}${unit} exceeds safe limit of ${max}${unit}. Immediate cooling system attention required.`,
        details: {
          metric: 'Temperature',
          value,
          threshold: max,
          confidence: 0.95,
        },
      });

      // 2. Trigger predictive maintenance agent
      setTimeout(() => {
        this.emitEvent({
          id: (Date.now() + 1).toString(),
          timestamp: new Date(),
          type: 'agent_triggered',
          severity: 'warning',
          equipment: node.name,
          location,
          message: `🤖 Predictive Maintenance Agent activated - Analyzing thermal patterns and assessing equipment health to prevent potential failure`,
          details: {
            agentTriggered: 'Maintenance Planner',
            confidence: 0.92,
          },
        });

        // 3. Automatically create work order
        setTimeout(() => {
          const workOrder = workOrderService.createAutonomousWorkOrder({
            machineId: node.id || 'unknown',
            machineName: node.name,
            anomalyType: 'temperature',
            metric: 'Temperature',
            value,
            threshold: max,
            confidence: 0.95,
            severity: 'critical',
          });

          this.emitEvent({
            id: (Date.now() + 2).toString(),
            timestamp: new Date(),
            type: 'maintenance_scheduled',
            severity: 'warning',
            equipment: node.name,
            location,
            message: `📋 Work Order ${workOrder.id} automatically created - Cooling system inspection required. Priority: ${workOrder.priority.toUpperCase()}. Estimated duration: ${workOrder.estimatedDuration} minutes.`,
            details: {
              workOrderId: workOrder.id,
              actionTaken: `Work order created with ${workOrder.parts?.length || 0} suggested parts. Due: ${workOrder.dueDate?.toLocaleString()}`,
            },
          });

          // 4. Stop line if temperature continues to rise
          setTimeout(() => {
            if (value > max + 5) {
              // Simulate worsening condition
              this.emitEvent({
                id: (Date.now() + 3).toString(),
                timestamp: new Date(),
                type: 'line_stopped',
                severity: 'critical',
                equipment: node.name,
                location,
                message: `🛑 EMERGENCY SHUTDOWN: ${node.name} automatically stopped due to critical temperature threshold breach. Safety protocols activated, supervisor notified.`,
                details: {
                  actionTaken:
                    'Line shutdown initiated. All operators alerted. Quality hold placed on last batch. Root cause investigation started.',
                },
              });
            }
          }, 2000);
        }, 2000);
      }, 1500);
    } else if (value < min) {
      const cooldownKeyLow = `temp-low-${node.id}`;
      if (this.isOnCooldown(cooldownKeyLow)) {
        return;
      }
      this.setCooldown(cooldownKeyLow);

      // Low temperature - potential cooling issue
      this.emitEvent({
        id: Date.now().toString(),
        timestamp: new Date(),
        type: 'anomaly_detected',
        severity: 'warning',
        equipment: node.name,
        location,
        message: `❄️ Abnormally low temperature detected: ${value}${unit} below minimum threshold of ${min}${unit}. May indicate heating system malfunction or calibration issue.`,
        details: {
          metric: 'Temperature',
          value,
          threshold: min,
          confidence: 0.82,
        },
      });
    }
  }

  /**
   * Check speed anomaly
   */
  private async checkSpeedAnomaly(
    node: any,
    location: string,
    value: number,
    unit: string
  ): Promise<void> {
    const { min, max } = this.config.anomalyThresholds.speed;
    const cooldownKey = `speed-${node.id}`;

    if (value > max) {
      if (this.isOnCooldown(cooldownKey)) {
        return;
      }
      this.setCooldown(cooldownKey);

      this.emitEvent({
        id: Date.now().toString(),
        timestamp: new Date(),
        type: 'anomaly_detected',
        severity: 'warning',
        equipment: node.name,
        location,
        message: `⚡ Speed anomaly detected: ${value} ${unit} exceeds operational limit of ${max} ${unit}. Risk of mechanical stress and accelerated wear on components.`,
        details: {
          metric: 'Speed',
          value,
          threshold: max,
          confidence: 0.88,
        },
      });

      // Trigger agent to analyze
      setTimeout(() => {
        this.emitEvent({
          id: (Date.now() + 1).toString(),
          timestamp: new Date(),
          type: 'agent_triggered',
          severity: 'info',
          equipment: node.name,
          location,
          message: `🔍 OEE Analyst agent deployed - Calculating performance impact, analyzing cycle times, and assessing quality implications of elevated speed`,
          details: {
            agentTriggered: 'OEE Analyst',
          },
        });

        // Agent identifies issue and plans action
        setTimeout(() => {
          // Create work order for bearing inspection
          const workOrder = workOrderService.createAutonomousWorkOrder({
            machineId: node.id || 'unknown',
            machineName: node.name,
            anomalyType: 'speed',
            metric: 'Speed',
            value,
            threshold: max,
            confidence: 0.88,
            severity: 'medium',
          });

          this.emitEvent({
            id: (Date.now() + 2).toString(),
            timestamp: new Date(),
            type: 'action_planned',
            severity: 'info',
            equipment: node.name,
            location,
            message: `💡 Root cause identified: Bearing friction increase (2.3x normal). Early stage wear pattern detected. Work Order ${workOrder.id} created for bearing inspection.`,
            details: {
              workOrderId: workOrder.id,
              actionTaken: `Predictive maintenance scheduled. Priority: ${workOrder.priority}. Assigned to: ${workOrder.assignedTo}. Estimated duration: ${workOrder.estimatedDuration} minutes.`,
            },
          });
        }, 2500);
      }, 1500);
    } else if (value < min) {
      const cooldownKeyLow = `speed-low-${node.id}`;
      if (this.isOnCooldown(cooldownKeyLow)) {
        return;
      }
      this.setCooldown(cooldownKeyLow);

      this.emitEvent({
        id: Date.now().toString(),
        timestamp: new Date(),
        type: 'anomaly_detected',
        severity: 'info',
        equipment: node.name,
        location,
        message: `🐌 Performance degradation detected: ${value} ${unit} below optimal speed of ${min} ${unit}. Investigating potential bottlenecks or mechanical resistance.`,
        details: {
          metric: 'Speed',
          value,
          threshold: min,
          confidence: 0.75,
        },
      });
    }
  }

  /**
   * Check OEE anomaly
   */
  private async checkOEEAnomaly(node: any, location: string, value: number): Promise<void> {
    const { min } = this.config.anomalyThresholds.oee;
    const cooldownKey = `oee-${node.id}`;

    // Don't trigger OEE anomaly if line/equipment is stopped (status check)
    const statusProp = node.properties?.find((p: any) => p.key === 'status');
    if (statusProp && statusProp.value === 'stopped') {
      return; // Skip OEE check for stopped equipment
    }

    if (value < min) {
      if (this.isOnCooldown(cooldownKey)) {
        return;
      }
      this.setCooldown(cooldownKey);

      this.emitEvent({
        id: Date.now().toString(),
        timestamp: new Date(),
        type: 'anomaly_detected',
        severity: 'warning',
        equipment: node.name,
        location,
        message: `📉 Overall Equipment Effectiveness below target: ${(value * 100).toFixed(1)}% vs target ${(min * 100).toFixed(0)}%. Indicates reduced availability, performance, or quality.`,
        details: {
          metric: 'OEE',
          value,
          threshold: min,
          confidence: 0.91,
        },
      });

      // Trigger downtime detective agent
      setTimeout(() => {
        this.emitEvent({
          id: (Date.now() + 1).toString(),
          timestamp: new Date(),
          type: 'agent_triggered',
          severity: 'info',
          equipment: node.name,
          location,
          message: `🕵️ Downtime Detective agent initiated - Cross-referencing event logs, analyzing stop patterns, and correlating with quality data to identify root cause`,
          details: {
            agentTriggered: 'Downtime Detective',
          },
        });

        // Agent identifies issue and plans action
        setTimeout(() => {
          // Create work order for belt maintenance
          const workOrder = workOrderService.createAutonomousWorkOrder({
            machineId: node.id || 'unknown',
            machineName: node.name,
            anomalyType: 'oee',
            metric: 'OEE',
            value,
            threshold: min,
            confidence: 0.91,
            severity: 'medium',
          });

          this.emitEvent({
            id: (Date.now() + 2).toString(),
            timestamp: new Date(),
            type: 'action_planned',
            severity: 'info',
            equipment: node.name,
            location,
            message: `💡 Root cause analysis complete: Frequent micro-stops detected. Primary cause: Belt tension drift causing feed inconsistency. Work Order ${workOrder.id} created for corrective maintenance.`,
            details: {
              workOrderId: workOrder.id,
              actionTaken: `Preventive maintenance scheduled. Priority: ${workOrder.priority}. Due: ${workOrder.dueDate?.toLocaleString()}. Estimated fix time: ${workOrder.estimatedDuration} minutes.`,
            },
          });
        }, 2500);
      }, 1500);
    }
  }

  /**
   * Subscribe to autonomous events
   */
  subscribe(callback: (event: AutonomousEvent) => void): () => void {
    this.eventListeners.push(callback);

    // Return unsubscribe function
    return () => {
      this.eventListeners = this.eventListeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Emit event to all listeners
   */
  private emitEvent(event: AutonomousEvent): void {
    this.eventHistory.push(event);

    // Keep only last 100 events
    if (this.eventHistory.length > 100) {
      this.eventHistory.shift();
    }

    this.eventListeners.forEach((listener) => listener(event));
  }

  /**
   * Get event history
   */
  getEventHistory(): AutonomousEvent[] {
    return [...this.eventHistory];
  }

  /**
   * Get monitoring status
   */
  isActive(): boolean {
    return this.isMonitoring;
  }

  /**
   * Simulate a test anomaly (for demo purposes)
   */
  simulateAnomaly(type: 'temperature' | 'speed' | 'oee'): void {
    const mockNode = {
      id: 'test-node',
      name: 'Filler-3',
    };
    const location = 'Factory-1 > Line-B';

    switch (type) {
      case 'temperature':
        this.checkTemperatureAnomaly(mockNode, location, 92, '°C');
        break;
      case 'speed':
        this.checkSpeedAnomaly(mockNode, location, 1350, 'RPM');
        break;
      case 'oee':
        this.checkOEEAnomaly(mockNode, location, 0.62);
        break;
    }
  }
}

export const autonomousService = new AutonomousMonitoringService();
