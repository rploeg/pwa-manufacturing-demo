import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Sparkles, Activity, Play, Pause, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { agentService } from '@/data/clients/agent';
import { autonomousService, type AutonomousEvent } from '@/data/clients/autonomous';
import type { AgentMessage, AgentDefinition } from '@/data/types';

export function ChatPage() {
  const [selectedAgent, setSelectedAgent] = useState<string>('orchestrator');
  const [agents, setAgents] = useState<AgentDefinition[]>([]);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  // Autonomous agent state
  const [showAutonomous, setShowAutonomous] = useState(false);
  const [autonomousActive, setAutonomousActive] = useState(false);
  const [autonomousEvents, setAutonomousEvents] = useState<AutonomousEvent[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const autonomousEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load available agents
  useEffect(() => {
    loadAgents();

    // Subscribe to autonomous events
    const unsubscribe = autonomousService.subscribe((event) => {
      setAutonomousEvents((prev) => [...prev, event]);
    });

    // Load event history
    setAutonomousEvents(autonomousService.getEventHistory());

    return () => {
      unsubscribe();
      if (autonomousService.isActive()) {
        autonomousService.stopMonitoring();
      }
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-scroll autonomous events
  useEffect(() => {
    autonomousEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [autonomousEvents]);

  const loadAgents = async () => {
    try {
      const agentList = await agentService.listAgents();
      setAgents(agentList);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: AgentMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    // Create assistant message placeholder
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: AgentMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      agentId: selectedAgent,
      agentName: agents.find((a) => a.id === selectedAgent)?.name || selectedAgent,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      abortControllerRef.current = new AbortController();

      // Use orchestrator for multi-agent routing
      const stream = agentService.streamOrchestrator({
        messages: [...messages, userMessage],
        maxTokens: 1000,
      });

      // Process SSE stream
      for await (const chunk of stream) {
        if (chunk.done) break;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content: msg.content + chunk.delta } : msg
          )
        );
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Stream aborted');
      } else {
        console.error('Streaming error:', error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: 'Sorry, I encountered an error. Please try again.' }
              : msg
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewConversation = () => {
    setMessages([]);
  };

  const toggleAutonomous = () => {
    if (autonomousActive) {
      autonomousService.stopMonitoring();
      setAutonomousActive(false);
    } else {
      autonomousService.startMonitoring();
      setAutonomousActive(true);
    }
  };

  const simulateAnomaly = (type: 'temperature' | 'speed' | 'oee') => {
    autonomousService.simulateAnomaly(type);
  };

  const quickPrompts = [
    'Trigger temperature anomaly on Filler-2',
    'What is the current OEE for Line-B?',
    'Show me open quality issues',
    'Analyze recent changeover performance',
  ];

  const agentDescriptions: Record<string, string> = {
    orchestrator: 'Routes your query to the right specialist agent',
    'data-agent': 'Manufacturing KPIs, OEE, throughput, quality metrics',
    'quality-agent': 'Defect tracking, SPC alerts, quality checklists',
    'maintenance-agent': 'PM schedules, work orders, equipment SOPs',
    'safety-agent': 'Near-miss logging, LOTO procedures',
    'knowledge-agent': 'SOPs, troubleshooting guides, semantic search',
    'handover-agent': 'Shift handover notes and summaries',
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold">AI Agents</h1>
              <p className="text-sm text-muted-foreground">
                Powered by Azure AI Foundry multi-agent system
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={showAutonomous ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowAutonomous(!showAutonomous)}
              >
                <Activity className="w-4 h-4 mr-2" />
                Autonomous Monitor
              </Button>
              <Button variant="outline" size="sm" onClick={startNewConversation}>
                New Chat
              </Button>
            </div>
          </div>

          {/* Agent Selector */}
          {!showAutonomous && (
            <>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                      selectedAgent === agent.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {agent.name}
                  </button>
                ))}
              </div>
              {selectedAgent && (
                <p className="text-xs text-muted-foreground mt-2">
                  {agentDescriptions[selectedAgent]}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex">
        {/* Chat Messages */}
        {!showAutonomous && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-5xl mx-auto">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">
                    Start a conversation with an AI agent
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Ask questions about production, quality, maintenance, or safety
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {quickPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInput(prompt)}
                        className="p-3 text-left border rounded-lg hover:bg-muted transition-colors text-sm"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-primary-foreground" />
                        </div>
                      )}
                      <Card
                        className={`p-3 max-w-[80%] ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.agentName && (
                          <div className="text-xs font-semibold mb-1 opacity-80">
                            {message.agentName}
                          </div>
                        )}
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                          {message.role === 'assistant' &&
                            message.content === '' &&
                            isStreaming && (
                              <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
                            )}
                        </div>
                      </Card>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Autonomous Agent Monitor */}
        {showAutonomous && (
          <div className="flex-1 overflow-y-auto p-4 bg-muted/30">
            <div className="max-w-5xl mx-auto">
              {/* Control Panel */}
              <Card className="p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${autonomousActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
                    />
                    <div>
                      <h3 className="font-semibold">Autonomous Monitoring System</h3>
                      <p className="text-xs text-muted-foreground">
                        {autonomousActive
                          ? 'Actively monitoring all production lines'
                          : 'System idle'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={autonomousActive ? 'destructive' : 'default'}
                    size="sm"
                    onClick={toggleAutonomous}
                  >
                    {autonomousActive ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Stop Monitoring
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Monitoring
                      </>
                    )}
                  </Button>
                </div>

                {/* Demo Triggers */}
                <div className="border-t pt-3">
                  <p className="text-xs text-muted-foreground mb-2">Test Scenarios (Demo):</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => simulateAnomaly('temperature')}
                      disabled={!autonomousActive}
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Trigger Temp Anomaly
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => simulateAnomaly('speed')}
                      disabled={!autonomousActive}
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Trigger Speed Issue
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => simulateAnomaly('oee')}
                      disabled={!autonomousActive}
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Trigger Low OEE
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Event Stream */}
              <div className="space-y-2">
                {autonomousEvents.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No events yet. Start monitoring to see autonomous agent activity.</p>
                  </div>
                ) : (
                  <>
                    {autonomousEvents.map((event) => (
                      <Card
                        key={event.id}
                        className={`p-3 border-l-4 ${
                          event.severity === 'critical'
                            ? 'border-l-red-500 bg-red-50 dark:bg-red-950/20'
                            : event.severity === 'warning'
                              ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                              : 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                  event.type === 'anomaly_detected'
                                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                    : event.type === 'agent_triggered'
                                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                                      : event.type === 'maintenance_scheduled'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                        : event.type === 'line_stopped'
                                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                          : event.type === 'action_planned'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                                }`}
                              >
                                {event.type.replace(/_/g, ' ').toUpperCase()}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {event.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm font-medium mb-1">{event.message}</p>
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">{event.equipment}</span>
                              {' • '}
                              <span>{event.location}</span>
                            </div>
                            {event.details && (
                              <div className="mt-2 text-xs space-y-0.5">
                                {event.details.metric && (
                                  <div>
                                    <span className="text-muted-foreground">Metric: </span>
                                    <span className="font-medium">
                                      {event.details.metric} = {event.details.value}{' '}
                                      {event.details.threshold &&
                                        `(threshold: ${event.details.threshold})`}
                                    </span>
                                  </div>
                                )}
                                {event.details.confidence && (
                                  <div>
                                    <span className="text-muted-foreground">Confidence: </span>
                                    <span className="font-medium">
                                      {(event.details.confidence * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                )}
                                {event.details.agentTriggered && (
                                  <div>
                                    <span className="text-muted-foreground">Agent: </span>
                                    <span className="font-medium">
                                      {event.details.agentTriggered}
                                    </span>
                                  </div>
                                )}
                                {event.details.actionTaken && (
                                  <div>
                                    <span className="text-muted-foreground">Action: </span>
                                    <span className="font-medium">{event.details.actionTaken}</span>
                                  </div>
                                )}
                                {event.details.workOrderId && (
                                  <div>
                                    <span className="text-muted-foreground">Work Order: </span>
                                    <span className="font-medium font-mono">
                                      {event.details.workOrderId}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                    <div ref={autonomousEndRef} />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input (only show for regular chat) */}
      {!showAutonomous && (
        <div className="p-4 border-t bg-background">
          <div className="max-w-5xl mx-auto flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              disabled={isStreaming}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!input.trim() || isStreaming} size="icon">
              {isStreaming ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      )}
    </div>
  );
}
