// Real-time updates simulation using interval polling
// In a real implementation, this would use WebSockets or Server-Sent Events

export interface RealtimeUpdate {
  id: string;
  type: 'quality' | 'maintenance' | 'production' | 'energy' | 'safety';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  data?: Record<string, unknown>;
}

type UpdateCallback = (update: RealtimeUpdate) => void;

class RealtimeService {
  private callbacks: UpdateCallback[] = [];
  private intervalId: number | null = null;
  private updateCounter = 0;

  // Simulated events that can occur
  private eventTemplates = [
    {
      type: 'quality' as const,
      severity: 'warning' as const,
      title: 'Quality Alert',
      getMessage: () =>
        `Line-${['A', 'B', 'C'][Math.floor(Math.random() * 3)]} defect rate at ${(Math.random() * 2 + 2).toFixed(1)}%`,
    },
    {
      type: 'maintenance' as const,
      severity: 'info' as const,
      title: 'Maintenance Reminder',
      getMessage: () =>
        `PM-${Math.floor(Math.random() * 100)
          .toString()
          .padStart(3, '0')} due in ${Math.floor(Math.random() * 3 + 1)} hours`,
    },
    {
      type: 'production' as const,
      severity: 'info' as const,
      title: 'Production Milestone',
      getMessage: () => `Line-A reached ${Math.floor(Math.random() * 1000 + 2000)} units today`,
    },
    {
      type: 'energy' as const,
      severity: 'warning' as const,
      title: 'Energy Alert',
      getMessage: () => `Power consumption ${Math.floor(Math.random() * 20 + 10)}% above baseline`,
    },
    {
      type: 'safety' as const,
      severity: 'critical' as const,
      title: 'Safety Alert',
      getMessage: () =>
        `Emergency stop activated on Line-${['A', 'B'][Math.floor(Math.random() * 2)]}`,
    },
    {
      type: 'production' as const,
      severity: 'critical' as const,
      title: 'Production Alert',
      getMessage: () =>
        `Downtime detected: ${['Filler-3', 'Conveyor-B2', 'Sealer-1'][Math.floor(Math.random() * 3)]} stopped`,
    },
    {
      type: 'energy' as const,
      severity: 'info' as const,
      title: 'AI Optimization',
      getMessage: () => `Energy saved: ${Math.floor(Math.random() * 50 + 20)} kWh this hour`,
    },
  ];

  subscribe(callback: UpdateCallback): () => void {
    this.callbacks.push(callback);

    // Start the simulation if this is the first subscriber
    if (this.callbacks.length === 1) {
      this.startSimulation();
    }

    // Return unsubscribe function
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);

      // Stop simulation if no more subscribers
      if (this.callbacks.length === 0) {
        this.stopSimulation();
      }
    };
  }

  private startSimulation() {
    // Generate an update every 15-45 seconds
    const scheduleNext = () => {
      const delay = Math.random() * 30000 + 15000; // 15-45 seconds
      this.intervalId = window.setTimeout(() => {
        this.generateUpdate();
        scheduleNext();
      }, delay);
    };

    scheduleNext();
  }

  private stopSimulation() {
    if (this.intervalId !== null) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  private generateUpdate() {
    const template = this.eventTemplates[Math.floor(Math.random() * this.eventTemplates.length)];

    const update: RealtimeUpdate = {
      id: `update-${Date.now()}-${this.updateCounter++}`,
      type: template.type,
      severity: template.severity,
      title: template.title,
      message: template.getMessage(),
      timestamp: new Date(),
    };

    // Notify all subscribers
    this.callbacks.forEach((callback) => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error in realtime update callback:', error);
      }
    });
  }

  // Method to manually trigger an update (for testing)
  triggerUpdate(
    type: RealtimeUpdate['type'],
    severity: RealtimeUpdate['severity'],
    title: string,
    message: string
  ) {
    const update: RealtimeUpdate = {
      id: `manual-${Date.now()}`,
      type,
      severity,
      title,
      message,
      timestamp: new Date(),
    };

    this.callbacks.forEach((callback) => callback(update));
  }
}

export const realtimeService = new RealtimeService();
