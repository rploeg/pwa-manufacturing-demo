// ============================================================================
// Type Definitions - Agent Service
// ============================================================================

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agentId?: string;
  agentName?: string;
  toolCalls?: AgentToolCall[];
  metadata?: Record<string, unknown>;
}

export interface AgentToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}

export interface AgentChoice {
  message: AgentMessage;
  finishReason: 'stop' | 'length' | 'tool_calls' | 'content_filter';
}

export interface AgentResponse {
  id: string;
  choices: AgentChoice[];
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AgentInvokeRequest {
  messages: AgentMessage[];
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
  tools?: AgentTool[];
}

export interface AgentTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  tools: AgentTool[];
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
}

export interface StreamChunk {
  delta: string;
  agentId?: string;
  done: boolean;
}

// ============================================================================
// Type Definitions - Digital Twin
// ============================================================================

export type TwinNodeType = 'site' | 'line' | 'machine' | 'sensor';

export interface TwinNode {
  id: string;
  name: string;
  type: TwinNodeType;
  parentId?: string;
  properties: TwinProperty[];
  children?: TwinNode[];
  metadata?: Record<string, unknown>;
}

export interface TwinProperty {
  key: string;
  value: string | number | boolean;
  unit?: string;
  timestamp?: Date;
}

export interface LiveMetric {
  nodeId: string;
  key: string;
  value: number;
  unit: string;
  timestamp: Date;
  status: 'ok' | 'warning' | 'error';
}

export interface Alarm {
  id: string;
  nodeId: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

// ============================================================================
// Type Definitions - Manufacturing
// ============================================================================

export interface WorkOrder {
  id: string;
  type: 'corrective' | 'preventive' | 'predictive';
  machineId: string;
  machineName: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  estimatedDuration?: number;
  actualDuration?: number;
  parts?: SparePart[];
  steps?: SOPStep[];
}

export interface PMTask {
  id: string;
  machineId: string;
  machineName: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'cycle-based';
  cycleThreshold?: number;
  currentCycles?: number;
  lastCompleted?: Date;
  nextDue: Date;
  estimatedDuration: number;
  steps: SOPStep[];
  parts?: SparePart[];
}

export interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  unit: string;
  inStock: number;
  location?: string;
  reorderPoint?: number;
}

export interface SOPStep {
  id: string;
  order: number;
  title: string;
  description: string;
  completed: boolean;
  safetyNote?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface QualityChecklist {
  id: string;
  templateId: string;
  skuId: string;
  skuName: string;
  lineId: string;
  lineName: string;
  inspectorId: string;
  inspectorName: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'in-progress' | 'passed' | 'failed';
  checks: QualityCheck[];
  defects: Defect[];
  notes?: string;
}

export interface QualityCheck {
  id: string;
  order: number;
  title: string;
  description: string;
  type: 'visual' | 'measurement' | 'functional';
  result?: 'pass' | 'fail' | 'na';
  measurement?: number;
  unit?: string;
  lowerLimit?: number;
  upperLimit?: number;
  notes?: string;
  photoUrls?: string[];
  audioUrl?: string;
}

export interface Defect {
  id: string;
  category: string;
  subcategory?: string;
  severity: 'minor' | 'major' | 'critical';
  description: string;
  quantity: number;
  location?: string;
  photoUrls?: string[];
  timestamp: Date;
}

// ============================================================================
// Type Definitions - Handover & Knowledge
// ============================================================================

export interface HandoverNote {
  id: string;
  shift: string;
  lineId: string;
  lineName: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  audioUrl?: string;
  audioDuration?: number;
  transcript?: string;
  summary?: string;
  actionItems: ActionItem[];
  tags: string[];
  status: 'draft' | 'pending-review' | 'published';
}

export interface ActionItem {
  id: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: Date;
  status: 'open' | 'in-progress' | 'completed';
  completedAt?: Date;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: 'sop' | 'troubleshooting' | 'note' | 'fix';
  tags: string[];
  machineIds?: string[];
  issueTypes?: string[];
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  helpful: number;
}

// ============================================================================
// Type Definitions - Scenarios
// ============================================================================

export interface ScenarioTemplate {
  id: string;
  name: string;
  description: string;
  category: 'quality' | 'maintenance' | 'downtime' | 'safety' | 'analysis';
  icon: string;
  steps: ScenarioStep[];
  estimatedDuration: number;
}

export interface ScenarioStep {
  id: string;
  order: number;
  title: string;
  description: string;
  agentId?: string;
  prompt?: string;
  inputs?: ScenarioInput[];
  type: 'agent' | 'form' | 'review';
}

export interface ScenarioInput {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
  required: boolean;
  options?: { label: string; value: string }[];
}

export interface ScenarioRun {
  id: string;
  templateId: string;
  templateName: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed';
  currentStep: number;
  totalSteps: number;
  inputs: Record<string, unknown>;
  results: ScenarioStepResult[];
  summary?: string;
}

export interface ScenarioStepResult {
  stepId: string;
  stepTitle: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  data?: unknown;
  error?: string;
}

// ============================================================================
// Type Definitions - UI & Navigation
// ============================================================================

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

export interface Breakpoint {
  phone: boolean;
  tablet: boolean;
  desktop: boolean;
}

export interface FeatureFlags {
  voiceHandover: boolean;
  digitalTwin: boolean;
  multiAgent: boolean;
  offlineMode: boolean;
}
