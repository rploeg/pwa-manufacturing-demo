import { http, HttpResponse, delay } from 'msw';
import { env } from '@/data/config';
import type { AgentDefinition, AgentResponse, TwinNode, HandoverNote } from '@/data/types';

// Mock data
const mockAgents: AgentDefinition[] = [
  {
    id: 'orchestrator',
    name: 'Orchestrator Agent',
    description: 'Routes queries to specialized agents',
    capabilities: ['routing', 'aggregation'],
    tools: [],
    inputSchema: {},
    outputSchema: {},
  },
  {
    id: 'data-agent',
    name: 'Data Agent',
    description: 'Manufacturing KPIs and metrics',
    capabilities: ['oee', 'throughput', 'quality-metrics'],
    tools: [{ name: 'get_kpis', description: 'Get manufacturing KPIs', inputSchema: {} }],
    inputSchema: {},
    outputSchema: {},
  },
  {
    id: 'quality-agent',
    name: 'Quality Agent',
    description: 'Quality checks and defect tracking',
    capabilities: ['defect-taxonomy', 'spc-alerts', 'quality-checklists'],
    tools: [],
    inputSchema: {},
    outputSchema: {},
  },
];

const mockTwinHierarchy: TwinNode = {
  id: 'site-1',
  name: 'Factory Amsterdam',
  type: 'site',
  properties: [{ key: 'location', value: 'Amsterdam, NL' }],
  children: [
    {
      id: 'line-b',
      name: 'Line-B',
      type: 'line',
      parentId: 'site-1',
      properties: [{ key: 'status', value: 'running' }],
      children: [
        {
          id: 'filler-3',
          name: 'Filler-3',
          type: 'machine',
          parentId: 'line-b',
          properties: [
            { key: 'temperature', value: 78, unit: '°C' },
            { key: 'pressure', value: 2.3, unit: 'bar' },
          ],
        },
      ],
    },
  ],
};

export const handlers = [
  // Agent list
  http.get(`${env.agentBase}${env.agentEndpoint}`, async () => {
    await delay(200);
    return HttpResponse.json(mockAgents);
  }),

  // Single agent
  http.get(`${env.agentBase}${env.agentEndpoint}/:agentId`, async ({ params }) => {
    await delay(200);
    const agent = mockAgents.find((a) => a.id === params.agentId);
    if (!agent) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(agent);
  }),

  // Agent invoke (non-streaming)
  http.post(`${env.agentBase}${env.agentEndpoint}/:agentId/invoke`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { messages: Array<{ content: string }> };
    const userMessage = body.messages[body.messages.length - 1]?.content || '';

    const response: AgentResponse = {
      id: crypto.randomUUID(),
      choices: [
        {
          message: {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: `Mock response to: "${userMessage}". In production, this would be handled by Azure AI Foundry Agent Service.`,
            timestamp: new Date(),
          },
          finishReason: 'stop',
        },
      ],
      usage: {
        promptTokens: 50,
        completionTokens: 30,
        totalTokens: 80,
      },
    };

    return HttpResponse.json(response);
  }),

  // Orchestrator invoke
  http.post(`${env.agentBase}${env.orchestratorEndpoint}`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { messages: Array<{ content: string }> };
    const userMessage = body.messages[body.messages.length - 1]?.content || '';

    const response: AgentResponse = {
      id: crypto.randomUUID(),
      choices: [
        {
          message: {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: `Orchestrated response: "${userMessage}". Multiple agents would collaborate here.`,
            timestamp: new Date(),
          },
          finishReason: 'stop',
        },
      ],
    };

    return HttpResponse.json(response);
  }),

  // Digital Twin search
  http.get(`${env.twinBase}/twins/search`, async () => {
    await delay(300);
    // Simple mock: return all nodes
    return HttpResponse.json([mockTwinHierarchy]);
  }),

  // Digital Twin node
  http.get(`${env.twinBase}/twins/:nodeId`, async ({ params }) => {
    await delay(200);
    if (params.nodeId === 'site-1') {
      return HttpResponse.json(mockTwinHierarchy);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Handover upload
  http.post(`${env.mediaBase}/media/upload`, async () => {
    await delay(1000);
    return HttpResponse.json({ url: 'mock://audio-file.wav' });
  }),

  // Handover transcribe
  http.post(`${env.mediaBase}/handover/transcribe`, async () => {
    await delay(2000);
    return HttpResponse.json({
      transcript:
        'Morning shift had issues with Filler-3 temperature. Need to check sensor calibration. Line-B OEE was 82% today.',
    });
  }),

  // Handover summarize
  http.post(`${env.mediaBase}/handover/summarize`, async () => {
    await delay(1500);
    return HttpResponse.json({
      summary:
        'Filler-3 temperature sensor requires calibration. Line-B achieved 82% OEE for the shift.',
      actionItems: [
        {
          id: crypto.randomUUID(),
          description: 'Calibrate Filler-3 temperature sensor',
          priority: 'high' as const,
          assignedTo: 'Maintenance Team',
          status: 'open' as const,
        },
      ],
    });
  }),

  // Handover notes
  http.get(`${env.mediaBase}/handover/notes`, async () => {
    await delay(300);
    const mockNotes: HandoverNote[] = [
      {
        id: '1',
        shift: 'morning',
        lineId: 'line-b',
        lineName: 'Line-B',
        authorId: 'user1',
        authorName: 'John Doe',
        createdAt: new Date(),
        summary: 'Routine shift, minor temperature issue on Filler-3',
        actionItems: [],
        tags: ['routine', 'temperature'],
        status: 'published',
      },
    ];
    return HttpResponse.json(mockNotes);
  }),
];
