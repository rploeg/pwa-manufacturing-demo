import { agentClient } from './http';
import { env } from '../config';
import type {
  AgentDefinition,
  AgentInvokeRequest,
  AgentResponse,
  StreamChunk,
} from '../types';

// ============================================================================
// Agent Service Client
// ============================================================================

export class AgentServiceClient {
  /**
   * Invoke a single agent
   */
  async invoke(agentId: string, request: AgentInvokeRequest): Promise<AgentResponse> {
    const response = await agentClient.post<AgentResponse>(
      `${env.agentEndpoint}/${agentId}/invoke`,
      request
    );
    return response.data;
  }

  /**
   * Invoke orchestrator (multi-agent)
   */
  async invokeOrchestrator(request: AgentInvokeRequest): Promise<AgentResponse> {
    const response = await agentClient.post<AgentResponse>(
      env.orchestratorEndpoint,
      request
    );
    return response.data;
  }

  /**
   * Stream response from single agent using SSE
   */
  async *streamAgent(
    agentId: string,
    request: AgentInvokeRequest,
    signal?: AbortSignal
  ): AsyncGenerator<StreamChunk> {
    const url = `${env.agentBase}${env.agentEndpoint}/${agentId}/invoke`;
    yield* this.streamSSE(url, { ...request, stream: true }, signal);
  }

  /**
   * Stream response from orchestrator using SSE
   */
  async *streamOrchestrator(
    request: AgentInvokeRequest,
    signal?: AbortSignal
  ): AsyncGenerator<StreamChunk> {
    // Mock implementation for demo purposes
    // In production, uncomment the line below:
    // const url = `${env.agentBase}${env.orchestratorEndpoint}`;
    // yield* this.streamSSE(url, { ...request, stream: true }, signal);
    
    yield* this.mockStreamResponse(request, signal);
  }

  /**
   * Mock streaming response for demo
   */
  private async *mockStreamResponse(
    request: AgentInvokeRequest,
    signal?: AbortSignal
  ): AsyncGenerator<StreamChunk> {
    const lastMessage = request.messages[request.messages.length - 1];
    const userQuery = lastMessage.content.toLowerCase();

    let response = '';
    
    // Generate contextual response based on query
    if (userQuery.includes('oee')) {
      response = 'Based on the current production data, Line B is showing an OEE of 72.3%. The main factors affecting efficiency are:\n\n1. **Availability**: 85.2% (downtime due to maintenance)\n2. **Performance**: 89.4% (running slower than target)\n3. **Quality**: 94.9% (some defects detected)\n\nRecommendations:\n- Schedule preventive maintenance during planned downtime\n- Investigate speed loss causes\n- Review quality control procedures';
    } else if (userQuery.includes('downtime') || userQuery.includes('stop')) {
      response = 'Analyzing recent downtime events for Line B:\n\n**Last 24 hours:**\n- 3 unplanned stops totaling 47 minutes\n- Primary causes: seal mechanism jam (2), temperature deviation (1)\n\n**Root cause analysis suggests:**\n- Seal cartridge nearing end of life (replace within 2 days)\n- Temperature sensor calibration needed\n- Consider predictive maintenance implementation\n\nWould you like me to create maintenance work orders?';
    } else if (userQuery.includes('quality') || userQuery.includes('defect')) {
      response = 'Quality metrics for today:\n\n**Overall pass rate**: 97.2%\n**Defects detected**: 12 units\n- Minor: 8 (labeling misalignment)\n- Major: 3 (seal defects)\n- Critical: 1 (packaging damage)\n\n**Recommended actions:**\n- Adjust label applicator alignment\n- Inspect seal mechanism on Filler-3\n- Review packaging process at end of line\n\nI can help create quality inspection checklists if needed.';
    } else if (userQuery.includes('maintenance') || userQuery.includes('pm')) {
      response = 'Current maintenance status:\n\n**Open work orders**: 3\n- WO-001: Seal mechanism replacement (HIGH priority, due in 1 hour)\n- WO-002: Belt alignment (MEDIUM priority, due in 4 hours)\n- WO-003: Bearing replacement (HIGH priority, due in 8 hours)\n\n**PM tasks overdue**: 1\n- Conveyor Belt 1: Weekly tension check (1 day overdue)\n\nRecommendation: Address PM-003 immediately to prevent further delays.';
    } else if (userQuery.includes('temperature') || userQuery.includes('trend')) {
      response = 'Temperature trend analysis for the past 8 hours:\n\n📊 **Current readings:**\n- Filler-1: 68.2°C (normal range: 65-70°C)\n- Filler-2: 71.4°C ⚠️ (above target)\n- Filler-3: 66.8°C (optimal)\n\n**Trend:** Filler-2 showing gradual increase (+2.3°C over 8 hours)\n\n**Recommendation:** Monitor Filler-2 closely. If temp exceeds 72°C, initiate cooling protocol and check ventilation system.';
    } else {
      response = 'I\'m the Orchestrator agent, powered by Azure AI Foundry. I can help you with:\n\n✅ OEE analysis and production metrics\n✅ Downtime root cause analysis\n✅ Quality control and defect tracking\n✅ Maintenance scheduling and work orders\n✅ Digital twin monitoring\n✅ Predictive maintenance insights\n\nWhat would you like to know about your production line?';
    }

    // Simulate streaming by yielding word by word
    const words = response.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (signal?.aborted) {
        yield { delta: '', done: true };
        return;
      }

      const word = i === 0 ? words[i] : ' ' + words[i];
      yield { delta: word, done: false };
      
      // Add small delay to simulate network latency
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 40));
    }

    yield { delta: '', done: true };
  }

  /**
   * Generic SSE streaming helper
   */
  private async *streamSSE(
    url: string,
    body: unknown,
    signal?: AbortSignal
  ): AsyncGenerator<StreamChunk> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Response body is not readable');
    }

    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            yield { delta: '', done: true };
            return;
          }
          try {
            const chunk = JSON.parse(data) as StreamChunk;
            yield chunk;
          } catch (e) {
            console.error('Failed to parse SSE chunk:', e);
          }
        }
      }
    }
  }

  /**
   * Get agent definition
   */
  async getAgent(agentId: string): Promise<AgentDefinition> {
    const response = await agentClient.get<AgentDefinition>(
      `${env.agentEndpoint}/${agentId}`
    );
    return response.data;
  }

  /**
   * List all available agents
   */
  async listAgents(): Promise<AgentDefinition[]> {
    // Mock implementation for demo purposes
    // In production, uncomment the line below:
    // const response = await agentClient.get<AgentDefinition[]>(env.agentEndpoint);
    // return response.data;
    
    return [
      {
        id: 'orchestrator',
        name: 'Orchestrator',
        description: 'Routes queries to specialist agents',
        capabilities: ['routing', 'multi-agent coordination'],
        tools: [],
        inputSchema: {},
        outputSchema: {},
      },
      {
        id: 'oee-analyst',
        name: 'OEE Analyst',
        description: 'Analyzes Overall Equipment Effectiveness',
        capabilities: ['oee calculation', 'performance metrics'],
        tools: [],
        inputSchema: {},
        outputSchema: {},
      },
      {
        id: 'quality-inspector',
        name: 'Quality Inspector',
        description: 'Quality control and defect analysis',
        capabilities: ['defect detection', 'quality metrics'],
        tools: [],
        inputSchema: {},
        outputSchema: {},
      },
      {
        id: 'maintenance-planner',
        name: 'Maintenance Planner',
        description: 'Maintenance scheduling and work orders',
        capabilities: ['pm scheduling', 'work order management'],
        tools: [],
        inputSchema: {},
        outputSchema: {},
      },
      {
        id: 'downtime-detective',
        name: 'Downtime Detective',
        description: 'Root cause analysis for production stops',
        capabilities: ['root cause analysis', 'downtime tracking'],
        tools: [],
        inputSchema: {},
        outputSchema: {},
      },
    ];
  }
}

export const agentService = new AgentServiceClient();
