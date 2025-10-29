import { useState, useEffect, useRef } from 'react';
import {
  Search,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Thermometer,
  Zap,
  Gauge,
  Activity,
  Bot,
  Send,
  User,
  Loader2,
  Sparkles,
  Layers,
  Grid3X3,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Markdown } from '@/components/ui/markdown';
import { TwinTreeNode } from './TwinTreeNode';
import { TwinVisualization3DWrapper } from './components/TwinVisualization3DWrapper';
import { digitalTwin } from '@/data/clients/twin';
import { agentService } from '@/data/clients/agent';
import type { TwinNode, LiveMetric, Alarm, AgentMessage } from '@/data/types';

export function TwinPage() {
  const [twinHierarchy, setTwinHierarchy] = useState<TwinNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<TwinNode | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [liveMetrics, setLiveMetrics] = useState<LiveMetric[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view3D, setView3D] = useState(false);

  // Agent panel state
  const [showAgentPanel, setShowAgentPanel] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('oee-analyst');
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [agentInput, setAgentInput] = useState('');
  const [isAgentStreaming, setIsAgentStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    loadTwinHierarchy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedNode) {
      loadNodeDetails(selectedNode.id);
      // Subscribe to live metrics
      const cleanup = digitalTwin.subscribeLive(
        selectedNode.id,
        (metric: LiveMetric) => {
          setLiveMetrics((prev) => {
            const filtered = prev.filter((m) => m.key !== metric.key);
            return [...filtered, metric];
          });
        },
        (alarm: Alarm) => {
          setAlarms((prev) => [...prev, alarm]);
        },
        (error: Error) => {
          console.error('WebSocket error:', error);
        }
      );
      return cleanup;
    }
  }, [selectedNode]);

  const loadTwinHierarchy = async () => {
    try {
      setIsLoading(true);
      // Use search to get all nodes
      const nodes = await digitalTwin.search('');
      setTwinHierarchy(nodes);
      // Auto-expand first level
      if (nodes.length > 0) {
        setExpandedIds(new Set(nodes.map((n: TwinNode) => n.id)));
        // Auto-select first node
        selectFirstNode(nodes);
      }
    } catch (error) {
      console.error('Failed to load twin hierarchy:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectFirstNode = (nodes: TwinNode[]) => {
    if (nodes.length > 0) {
      const first = nodes[0];
      if (first.children && first.children.length > 0) {
        setSelectedNode(first.children[0]);
      } else {
        setSelectedNode(first);
      }
    }
  };

  const loadNodeDetails = async (nodeId: string) => {
    try {
      const node = await digitalTwin.getNode(nodeId);
      setSelectedNode(node);

      // Load alarms for this node
      const nodeAlarms = await digitalTwin.getAlarms(nodeId);
      setAlarms(nodeAlarms);
    } catch (error) {
      console.error('Failed to load node details:', error);
    }
  };

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAcknowledgeAlarm = async (alarmId: string) => {
    try {
      await digitalTwin.acknowledgeAlarm(alarmId, 'current-user');
      setAlarms((prev) => prev.filter((a) => a.id !== alarmId));
    } catch (error) {
      console.error('Failed to acknowledge alarm:', error);
    }
  };

  const getMetricIcon = (key: string) => {
    if (key.includes('temp')) return <Thermometer className="w-4 h-4" />;
    if (key.includes('speed')) return <Gauge className="w-4 h-4" />;
    if (key.includes('power')) return <Zap className="w-4 h-4" />;
    return <TrendingUp className="w-4 h-4" />;
  };

  const getMetricColor = (status: LiveMetric['status']) => {
    switch (status) {
      case 'ok':
        return 'text-green-500';
      case 'warning':
        return 'text-amber-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  // Agent functions
  const handleAskAgent = async (agentId: string, question?: string) => {
    const nodeContext = selectedNode
      ? `Current node: ${selectedNode.name} (${selectedNode.type})\n` +
        `Properties: ${selectedNode.properties.map((p) => `${p.key}=${p.value}${p.unit || ''}`).join(', ')}\n` +
        `Live metrics: ${liveMetrics.map((m) => `${m.key}=${m.value.toFixed(1)}${m.unit}`).join(', ')}\n` +
        `Alarms: ${alarms.length} active`
      : '';

    const defaultQuestions: Record<string, string> = {
      'oee-analyst': `Why is the OEE low for ${selectedNode?.name || 'this equipment'}? ${nodeContext}`,
      'maintenance-planner': `What predictive maintenance should I schedule for ${selectedNode?.name || 'this equipment'}? ${nodeContext}`,
      'downtime-detective': `Analyze recent downtime patterns for ${selectedNode?.name || 'this equipment'}. ${nodeContext}`,
    };

    const userMessage: AgentMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: question || defaultQuestions[agentId] || `Analyze ${selectedNode?.name}`,
      timestamp: new Date(),
    };

    setAgentMessages((prev) => [...prev, userMessage]);
    setAgentInput('');
    setIsAgentStreaming(true);
    setShowAgentPanel(true);

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: AgentMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      agentId,
    };

    setAgentMessages((prev) => [...prev, assistantMessage]);

    try {
      abortControllerRef.current = new AbortController();

      const stream = agentService.streamOrchestrator({
        messages: [...agentMessages, userMessage],
        maxTokens: 1000,
      });

      for await (const chunk of stream) {
        if (chunk.done) break;

        setAgentMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content: msg.content + chunk.delta } : msg
          )
        );
      }
    } catch (error) {
      console.error('Agent error:', error);
      setAgentMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: 'Sorry, I encountered an error. Please try again.' }
            : msg
        )
      );
    } finally {
      setIsAgentStreaming(false);
    }
  };

  const handleSendToAgent = async () => {
    if (!agentInput.trim() || isAgentStreaming) return;
    await handleAskAgent(selectedAgent, agentInput);
  };

  // Auto-scroll agent messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentMessages]);

  return (
    <div className="h-full flex flex-col md:flex-row">
      {/* Left Panel - Tree Navigation */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r bg-background overflow-y-auto">
        <div className="p-4 border-b sticky top-0 bg-background z-10">
          <h2 className="font-semibold mb-3">Digital Twin</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search equipment..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="p-2">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading hierarchy...</div>
          ) : (
            twinHierarchy.map((node) => (
              <TwinTreeNode
                key={node.id}
                node={node}
                level={0}
                selectedId={selectedNode?.id || null}
                expandedIds={expandedIds}
                onSelect={(id) => {
                  const findNode = (nodes: TwinNode[]): TwinNode | null => {
                    for (const n of nodes) {
                      if (n.id === id) return n;
                      if (n.children) {
                        const found = findNode(n.children);
                        if (found) return found;
                      }
                    }
                    return null;
                  };
                  const node = findNode(twinHierarchy);
                  if (node) setSelectedNode(node);
                }}
                onToggle={handleToggle}
              />
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Details */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {!selectedNode ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Select a node from the tree to view details</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Node Header with 3D Toggle */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <span className="capitalize">{selectedNode.type}</span>
                </div>
                <h1 className="text-3xl font-bold">{selectedNode.name}</h1>
              </div>

              {/* 3D View Toggle */}
              {selectedNode.type === 'site' && (
                <div className="flex gap-2">
                  <Button
                    variant={!view3D ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setView3D(false)}
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    Grid View
                  </Button>
                  <Button
                    variant={view3D ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setView3D(true)}
                  >
                    <Layers className="w-4 h-4 mr-2" />
                    3D View
                  </Button>
                </div>
              )}
            </div>

            {/* 3D Visualization */}
            {view3D && selectedNode.type === 'site' && selectedNode.children && (
              <div className="relative">
                <TwinVisualization3DWrapper
                  nodes={selectedNode.children.flatMap((line) => line.children || [])}
                  onNodeClick={(node: TwinNode) => setSelectedNode(node)}
                />
              </div>
            )}

            {/* Alarms */}
            {alarms.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Active Alarms ({alarms.length})
                </h3>
                <div className="space-y-2">
                  {alarms.map((alarm) => (
                    <div
                      key={alarm.id}
                      className="flex items-start justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div
                          className={`font-medium ${
                            alarm.severity === 'critical'
                              ? 'text-red-600'
                              : alarm.severity === 'warning'
                                ? 'text-amber-600'
                                : 'text-blue-600'
                          }`}
                        >
                          {alarm.message}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Severity: {alarm.severity}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(alarm.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAcknowledgeAlarm(alarm.id)}
                      >
                        Acknowledge
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Properties */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedNode.properties.map((prop) => (
                  <div key={prop.key} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{prop.key}</span>
                    <span className="text-sm font-medium">
                      {prop.value.toString()} {prop.unit && prop.unit}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Live Metrics */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Live Metrics
              </h3>
              {liveMetrics.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No live metrics available for this node
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveMetrics.map((metric) => (
                    <div key={metric.key} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          {getMetricIcon(metric.key)}
                          <span className="text-xs">{metric.key}</span>
                        </div>
                        <CheckCircle className={`w-4 h-4 ${getMetricColor(metric.status)}`} />
                      </div>
                      <div className="text-2xl font-bold">
                        {metric.value.toFixed(1)}
                        <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(metric.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* AI Agent Quick Actions */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Ask AI Agent
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get insights about {selectedNode.name} from specialist agents
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-3 flex flex-col items-start gap-1"
                  onClick={() => {
                    setSelectedAgent('oee-analyst');
                    handleAskAgent('oee-analyst');
                  }}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    OEE Analyst
                  </div>
                  <span className="text-xs text-muted-foreground">Why is OEE low?</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 flex flex-col items-start gap-1"
                  onClick={() => {
                    setSelectedAgent('maintenance-planner');
                    handleAskAgent('maintenance-planner');
                  }}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="w-4 h-4" />
                    Maintenance Planner
                  </div>
                  <span className="text-xs text-muted-foreground">Predictive maintenance</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 flex flex-col items-start gap-1"
                  onClick={() => {
                    setSelectedAgent('downtime-detective');
                    handleAskAgent('downtime-detective');
                  }}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <Activity className="w-4 h-4" />
                    Downtime Detective
                  </div>
                  <span className="text-xs text-muted-foreground">Analyze downtime</span>
                </Button>
              </div>
            </Card>

            {/* Agent Chat Panel */}
            {showAgentPanel && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-500" />
                    {selectedAgent === 'oee-analyst' && 'OEE Analyst'}
                    {selectedAgent === 'maintenance-planner' && 'Maintenance Planner'}
                    {selectedAgent === 'downtime-detective' && 'Downtime Detective'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowAgentPanel(false)}>
                    Close
                  </Button>
                </div>

                {/* Messages */}
                <div className="border rounded-lg mb-4 h-96 overflow-y-auto p-4 space-y-4 bg-muted/30">
                  {agentMessages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Ask a question to get started</p>
                    </div>
                  ) : (
                    agentMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-purple-600" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background border'
                          }`}
                        >
                          {msg.role === 'user' ? (
                            <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                          ) : (
                            <div className="text-sm">
                              <Markdown>{msg.content}</Markdown>
                              {isAgentStreaming &&
                                msg.id === agentMessages[agentMessages.length - 1]?.id && (
                                  <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                                )}
                            </div>
                          )}
                        </div>
                        {msg.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    value={agentInput}
                    onChange={(e) => setAgentInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendToAgent()}
                    placeholder="Ask a follow-up question..."
                    disabled={isAgentStreaming}
                  />
                  <Button
                    onClick={handleSendToAgent}
                    disabled={!agentInput.trim() || isAgentStreaming}
                  >
                    {isAgentStreaming ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </Card>
            )}

            {/* Child Nodes */}
            {selectedNode.children && selectedNode.children.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">
                  Child Equipment ({selectedNode.children.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedNode.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setSelectedNode(child)}
                      className="p-3 border rounded-lg text-left hover:bg-muted transition-colors"
                    >
                      <div className="font-medium">{child.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{child.type}</div>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
