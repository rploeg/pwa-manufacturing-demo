import { agentClient } from './http';
import { env } from '../config';
import type { AgentDefinition, AgentInvokeRequest, AgentResponse, StreamChunk } from '../types';

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
    const response = await agentClient.post<AgentResponse>(env.orchestratorEndpoint, request);
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

    // Generate contextual response based on query - order matters, check most specific first!
    if (
      userQuery.includes('safety') ||
      userQuery.includes('incident') ||
      userQuery.includes('near-miss') ||
      userQuery.includes('workplace safety')
    ) {
      response =
        '**Safety Analysis:**\n\n**Pattern Identification:**\nReviewing the 4 recent incidents, I notice concerning patterns:\n- 2 incidents involve slip/trip hazards (water spill, chemical spill)\n- 2 incidents relate to PPE compliance\n- All incidents occurred during day shift, suggesting possible training gaps\n\n**High-Priority Actions:**\n1. **Immediate:** Address the chemical spill - requires specialized cleanup and proper PPE\n2. **Urgent:** Replace expired forklift certifications (2 operators)\n3. **Critical:** Fix the water leak creating slip hazards in Assembly Area\n\n**Preventive Measures:**\n- Install non-slip mats in high-traffic wet areas\n- Implement daily pre-shift safety walkthroughs\n- Add chemical containment barriers near storage areas\n- Enhance lockout/tagout signage and procedures\n\n**Compliance Priorities:**\n1. Renew expired training certifications (forklift, LOTO)\n2. Update hazardous waste manifest (2 days overdue)\n3. Schedule PPE compliance audits for all shifts\n4. Review environmental permit renewals\n\n**Training Needs:**\n- Chemical spill response and cleanup procedures\n- Proper PPE selection and usage by job task\n- Slip/trip/fall prevention awareness\n- Lockout/tagout refresher training\n\nThese patterns suggest systemic issues that can be addressed through improved training, better maintenance, and enhanced safety protocols.';
    } else if (
      userQuery.includes('changeover') ||
      userQuery.includes('smed') ||
      userQuery.includes('setup') ||
      userQuery.includes('product changeover')
    ) {
      response =
        '**SMED Changeover Analysis:**\n\n**Quick Wins (Internal → External Conversion):**\n1. **Pre-stage new dies** - Move this 5-min activity to be done during previous run (save 5 min)\n2. **Tool prep** - Create shadow boards so tools are ready before changeover starts\n3. **Quality checks** - Move first article inspection procedures to external checklist\n\n**Parallelization Opportunities:**\n- While operator A removes old die, operator B can prep new die and tools\n- Quality and maintenance can inspect parts simultaneously\n- Material staging can happen while machine is still running previous job\n\n**Process Standardization:**\n- Create visual work instructions for each changeover type\n- Implement standard work sequence: Remove → Clean → Install → Adjust → Verify\n- Document best practices from top performing operators\n- Use color-coding for different die/tool sets\n\n**Tooling/Equipment Improvements:**\n- Quick-change fixture systems (replace threaded bolts with cam locks)\n- Height-adjustable die carts for ergonomic loading\n- Torque-limiting tools for consistent fastening\n- RFID tags on dies for automatic setup parameter loading\n\n**Training Recommendations:**\n- Cross-train all operators on SMED principles\n- Shadow best-performer (23 min average) to learn techniques\n- Practice changeovers during planned downtime\n- Implement changeover competitions to drive improvement\n\n**Expected Impact:** These improvements could reduce average changeover from 28 minutes to 18-20 minutes (35% improvement).';
    } else if (
      userQuery.includes('oee') &&
      (userQuery.includes('coach') ||
        userQuery.includes('benchmark') ||
        userQuery.includes('comparison'))
    ) {
      response =
        '**OEE Coaching Analysis:**\n\n**Gap Analysis:**\nLine-B (88.2% OEE) outperforms Line-A (79.1%) and Line-C (81.6%) by 7-9 points. Key differences:\n- Line-B has better availability (92.1% vs 85-87%)\n- Line-B operators follow standardized startup procedures\n- Line-B uses predictive maintenance, others use reactive\n\n**Transfer Opportunities:**\n1. **From Line-B to others:** SMED changeover techniques, 5S organization, operator-led quality checks\n2. **Line-B best practice:** Pre-shift equipment walkarounds catch 60% of issues before they cause downtime\n3. **Micro-stop tracking:** Line-B records all stops >1 min, others only track >5 min\n\n**Priority Actions by Line:**\n- **Line-A:** Focus on availability - implement TPM program (expected +3.5% OEE)\n- **Line-C:** Focus on quality - operator training on SPC techniques (expected +1.5% OEE)\n- **Line-B:** Focus on performance - address micro-stops (expected +1.8% OEE)\n\n**Quick Wins:**\n1. Share Line-B startup checklist across all lines (immediate 2% availability gain)\n2. Implement micro-stop tracking on all lines (visibility drives improvement)\n3. Cross-training sessions: Line-B operators coach others monthly\n\n**Long-Term Strategy:**\n- Establish OEE improvement teams per line with monthly targets\n- Implement visual management boards showing real-time OEE by component\n- Create best practice library with photos/videos of optimal techniques\n- Link operator bonuses to sustained OEE improvements';
    } else if (
      userQuery.includes('production') &&
      (userQuery.includes('plan') ||
        userQuery.includes('schedul') ||
        userQuery.includes('capacity'))
    ) {
      response =
        '**Production Planning Optimization:**\n\n**Schedule Optimization:**\n- Current on-time delivery: 80% (4/5 orders)\n- Opportunity: Sequence orders to minimize changeovers\n- Recommendation: Group similar SKUs together (Coffee Maker 10-cup → 12-cup has fastest changeover)\n- Could reduce total changeover time from 3.2 hours to 2.1 hours\n\n**Capacity Balancing:**\nLine utilization is uneven:\n- Line-A: 78% (underutilized, can take more work)\n- Line-B: 92% (near capacity, bottleneck risk)\n- Line-C: 85% (balanced)\n\n**Actions:**\n1. Move SKU-003 (Toaster) from Line-B to Line-A\n2. Balance production to target 82-85% across all lines\n3. Reserve Line-B for complex/high-priority items\n\n**Rush Order Handling:**\n- Insert rush orders on Line-A (has most available capacity)\n- If urgent and requires Line-B, batch with similar SKUs to minimize changeover penalty\n- Build 1-day safety stock of top 3 SKUs to buffer against rush orders\n\n**Bottleneck Analysis:**\n- Current constraint: Line-B capacity (limited by OEE, not equipment speed)\n- Secondary constraint: Changeover time between product families\n- Recommendation: Improve Line-B OEE from 88% to 92% = +8 hours/week capacity\n\n**Resource Allocation:**\n- Add 1 operator to day shift for Line-A to increase throughput\n- Stage materials for next 2 orders (not just next order)\n- Schedule changeovers at shift end to utilize both shifts\n- Cross-train operators so any line can run any product';
    } else if (userQuery.includes('oee')) {
      response =
        'Based on the current production data, Line B is showing an OEE of 72.3%. The main factors affecting efficiency are:\n\n1. **Availability**: 85.2% (downtime due to maintenance)\n2. **Performance**: 89.4% (running slower than target)\n3. **Quality**: 94.9% (some defects detected)\n\nRecommendations:\n- Schedule preventive maintenance during planned downtime\n- Investigate speed loss causes\n- Review quality control procedures';
    } else if (userQuery.includes('downtime') || userQuery.includes('stop')) {
      response =
        'Analyzing recent downtime events for Line B:\n\n**Last 24 hours:**\n- 3 unplanned stops totaling 47 minutes\n- Primary causes: seal mechanism jam (2), temperature deviation (1)\n\n**Root cause analysis suggests:**\n- Seal cartridge nearing end of life (replace within 2 days)\n- Temperature sensor calibration needed\n- Consider predictive maintenance implementation\n\nWould you like me to create maintenance work orders?';
    } else if (userQuery.includes('quality') || userQuery.includes('defect')) {
      response =
        'Quality metrics for today:\n\n**Overall pass rate**: 97.2%\n**Defects detected**: 12 units\n- Minor: 8 (labeling misalignment)\n- Major: 3 (seal defects)\n- Critical: 1 (packaging damage)\n\n**Recommended actions:**\n- Adjust label applicator alignment\n- Inspect seal mechanism on Filler-3\n- Review packaging process at end of line\n\nI can help create quality inspection checklists if needed.';
    } else if (userQuery.includes('maintenance') || userQuery.includes('pm')) {
      response =
        'Current maintenance status:\n\n**Open work orders**: 3\n- WO-001: Seal mechanism replacement (HIGH priority, due in 1 hour)\n- WO-002: Belt alignment (MEDIUM priority, due in 4 hours)\n- WO-003: Bearing replacement (HIGH priority, due in 8 hours)\n\n**PM tasks overdue**: 1\n- Conveyor Belt 1: Weekly tension check (1 day overdue)\n\nRecommendation: Address PM-003 immediately to prevent further delays.';
    } else if (userQuery.includes('temperature') || userQuery.includes('trend')) {
      response =
        'Temperature trend analysis for the past 8 hours:\n\n📊 **Current readings:**\n- Filler-1: 68.2°C (normal range: 65-70°C)\n- Filler-2: 71.4°C ⚠️ (above target)\n- Filler-3: 66.8°C (optimal)\n\n**Trend:** Filler-2 showing gradual increase (+2.3°C over 8 hours)\n\n**Recommendation:** Monitor Filler-2 closely. If temp exceeds 72°C, initiate cooling protocol and check ventilation system.';
    } else {
      response =
        "I'm the Orchestrator agent, powered by Azure AI Foundry. I can help you with:\n\n✅ OEE analysis and production metrics\n✅ Downtime root cause analysis\n✅ Quality control and defect tracking\n✅ Maintenance scheduling and work orders\n✅ Digital twin monitoring\n✅ Predictive maintenance insights\n\nWhat would you like to know about your production line?";
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
      await new Promise((resolve) => setTimeout(resolve, 30 + Math.random() * 40));
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
    const response = await agentClient.get<AgentDefinition>(`${env.agentEndpoint}/${agentId}`);
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
