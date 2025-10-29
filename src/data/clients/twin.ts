import { twinClient } from './http';
import { env } from '../config';
import type { TwinNode, LiveMetric, Alarm } from '../types';

// Mock data for demo mode
const mockTwinHierarchy: TwinNode = {
  id: 'site-1',
  name: 'Contoso Factory - Netherlands',
  type: 'site',
  properties: [
    { key: 'location', value: 'Amsterdam' },
    { key: 'totalLines', value: 4 },
  ],
  children: [
    {
      id: 'line-1',
      name: 'Line 1 - Coffee Makers',
      type: 'line',
      parentId: 'site-1',
      properties: [
        { key: 'status', value: 'running' },
        { key: 'oee', value: 85.3, unit: '%' },
      ],
      children: [
        {
          id: 'filler-1',
          name: 'Filler-1',
          type: 'machine',
          parentId: 'line-1',
          properties: [
            { key: 'status', value: 'running' },
            { key: 'speed', value: 120, unit: 'units/min' },
            { key: 'temperature', value: 68.2, unit: '°C' },
          ],
          children: [
            {
              id: 'temp-sensor-1',
              name: 'Temperature Sensor',
              type: 'sensor',
              parentId: 'filler-1',
              properties: [
                { key: 'value', value: 68.2, unit: '°C' },
                { key: 'status', value: 'normal' },
              ],
            },
          ],
        },
        {
          id: 'filler-2',
          name: 'Filler-2',
          type: 'machine',
          parentId: 'line-1',
          properties: [
            { key: 'status', value: 'warning' },
            { key: 'speed', value: 115, unit: 'units/min' },
            { key: 'temperature', value: 87.4, unit: '°C' },
          ],
        },
      ],
    },
    {
      id: 'line-2',
      name: 'Line 2 - Blenders',
      type: 'line',
      parentId: 'site-1',
      properties: [
        { key: 'status', value: 'running' },
        { key: 'oee', value: 78.2, unit: '%' },
      ],
      children: [
        {
          id: 'assembly-1',
          name: 'Assembly-1',
          type: 'machine',
          parentId: 'line-2',
          properties: [
            { key: 'status', value: 'running' },
            { key: 'speed', value: 90, unit: 'units/min' },
          ],
        },
      ],
    },
    {
      id: 'line-3',
      name: 'Line 3 - Juicers',
      type: 'line',
      parentId: 'site-1',
      properties: [
        { key: 'status', value: 'stopped' },
        { key: 'oee', value: 0, unit: '%' },
        { key: 'lastStop', value: '10 minutes ago' },
      ],
    },
  ],
};

const mockAlarms: Alarm[] = [
  {
    id: 'alarm-1',
    nodeId: 'filler-2',
    severity: 'warning',
    message: 'Temperature above target',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    acknowledged: false,
  },
  {
    id: 'alarm-2',
    nodeId: 'line-3',
    severity: 'critical',
    message: 'Production line stopped',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    acknowledged: false,
  },
];

// ============================================================================
// Digital Twin Client
// ============================================================================

export class DigitalTwinClient {
  private useMocks = env.useMocks;

  /**
   * Search for twin nodes
   */
  async search(query: string): Promise<TwinNode[]> {
    if (this.useMocks) {
      // Return full hierarchy for empty query, otherwise filter
      if (!query || query === '') {
        return [mockTwinHierarchy];
      }
      return this.searchInNode(mockTwinHierarchy, query.toLowerCase());
    }

    const response = await twinClient.get<TwinNode[]>('/twins/search', {
      params: { q: query },
    });
    return response.data;
  }

  private searchInNode(node: TwinNode, query: string): TwinNode[] {
    const results: TwinNode[] = [];
    if (node.name.toLowerCase().includes(query)) {
      results.push(node);
    }
    if (node.children) {
      for (const child of node.children) {
        results.push(...this.searchInNode(child, query));
      }
    }
    return results;
  }

  /**
   * Get twin node by ID
   */
  async getNode(nodeId: string): Promise<TwinNode> {
    if (this.useMocks) {
      const node = this.findNodeById(mockTwinHierarchy, nodeId);
      if (!node) {
        throw new Error(`Node ${nodeId} not found`);
      }
      return node;
    }

    const response = await twinClient.get<TwinNode>(`/twins/${nodeId}`);
    return response.data;
  }

  private findNodeById(node: TwinNode, id: string): TwinNode | null {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = this.findNodeById(child, id);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Get node hierarchy (parent and children)
   */
  async getHierarchy(nodeId: string): Promise<TwinNode> {
    if (this.useMocks) {
      return this.getNode(nodeId);
    }

    const response = await twinClient.get<TwinNode>(`/twins/${nodeId}/hierarchy`);
    return response.data;
  }

  /**
   * Subscribe to live metrics via WebSocket
   */
  subscribeLive(
    nodeId: string,
    onMetric: (metric: LiveMetric) => void,
    onAlarm: (alarm: Alarm) => void,
    onError?: (error: Error) => void
  ): () => void {
    if (this.useMocks) {
      // Simulate live metrics with interval
      const interval = setInterval(() => {
        // Random metric updates
        const metrics: LiveMetric[] = [
          {
            nodeId,
            key: 'temperature',
            value: 68 + Math.random() * 4,
            unit: '°C',
            timestamp: new Date(),
            status: 'ok',
          },
          {
            nodeId,
            key: 'speed',
            value: 115 + Math.random() * 10,
            unit: 'units/min',
            timestamp: new Date(),
            status: 'ok',
          },
          {
            nodeId,
            key: 'oee',
            value: 75 + Math.random() * 15,
            unit: '%',
            timestamp: new Date(),
            status: 'ok',
          },
        ];

        // Send random metric
        onMetric(metrics[Math.floor(Math.random() * metrics.length)]);

        // Occasionally send alarm (5% chance)
        if (Math.random() < 0.05) {
          onAlarm({
            id: `alarm-${Date.now()}`,
            nodeId,
            severity: Math.random() > 0.7 ? 'critical' : 'warning',
            message: 'Simulated alert',
            timestamp: new Date(),
            acknowledged: false,
          });
        }
      }, 2000);

      return () => clearInterval(interval);
    }

    // Real WebSocket connection
    const wsUrl = twinClient.defaults.baseURL?.replace('http', 'ws').replace('https', 'wss');
    const ws = new WebSocket(`${wsUrl}/twins/${nodeId}/live`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'metric') {
          onMetric(data.payload as LiveMetric);
        } else if (data.type === 'alarm') {
          onAlarm(data.payload as Alarm);
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
      }
    };

    ws.onerror = (error) => {
      onError?.(new Error('WebSocket error'));
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }

  /**
   * Get alarms for a node
   */
  async getAlarms(nodeId: string, activeOnly = true): Promise<Alarm[]> {
    if (this.useMocks) {
      return mockAlarms.filter((a) => a.nodeId === nodeId && (!activeOnly || !a.acknowledged));
    }

    const response = await twinClient.get<Alarm[]>(`/twins/${nodeId}/alarms`, {
      params: { activeOnly },
    });
    return response.data;
  }

  /**
   * Acknowledge an alarm
   */
  async acknowledgeAlarm(alarmId: string, userId: string): Promise<void> {
    if (this.useMocks) {
      const alarm = mockAlarms.find((a) => a.id === alarmId);
      if (alarm) {
        alarm.acknowledged = true;
        alarm.acknowledgedBy = userId;
        alarm.acknowledgedAt = new Date();
      }
      return;
    }

    await twinClient.post(`/alarms/${alarmId}/acknowledge`, { userId });
  }
}

export const digitalTwin = new DigitalTwinClient();
