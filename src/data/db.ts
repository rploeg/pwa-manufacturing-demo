import Dexie, { type Table } from 'dexie';
import type {
  AgentMessage,
  HandoverNote,
  ScenarioRun,
  TwinNode,
  WorkOrder,
  QualityChecklist,
} from './types';

// ============================================================================
// IndexedDB Database for Offline-First Storage
// ============================================================================

export class VersuniFrontlineDB extends Dexie {
  // Tables
  messages!: Table<AgentMessage & { conversationId: string }, string>;
  conversations!: Table<
    { id: string; title: string; agentId?: string; createdAt: Date; updatedAt: Date },
    string
  >;
  handovers!: Table<HandoverNote, string>;
  scenarios!: Table<ScenarioRun, string>;
  twins!: Table<TwinNode & { cachedAt: Date }, string>;
  workOrders!: Table<WorkOrder, string>;
  qualityChecklists!: Table<QualityChecklist, string>;
  offlineQueue!: Table<
    {
      id: string;
      endpoint: string;
      method: string;
      body: unknown;
      createdAt: Date;
      retries: number;
    },
    string
  >;

  constructor() {
    super('VersuniFrontlineDB');
    this.version(1).stores({
      messages: 'id, conversationId, timestamp, role, agentId',
      conversations: 'id, createdAt, updatedAt, agentId',
      handovers: 'id, lineId, shift, createdAt, status',
      scenarios: 'id, templateId, startedAt, completedAt, status',
      twins: 'id, type, parentId, cachedAt',
      workOrders: 'id, machineId, status, priority, createdAt, dueDate',
      qualityChecklists: 'id, lineId, skuId, status, startedAt, completedAt',
      offlineQueue: 'id, createdAt, retries',
    });
  }
}

export const db = new VersuniFrontlineDB();

// Helper functions for common operations
export const dbHelpers = {
  // Add a message to a conversation
  async addMessage(conversationId: string, message: AgentMessage): Promise<void> {
    await db.messages.add({ ...message, conversationId });
  },

  // Get all messages for a conversation
  async getConversationMessages(conversationId: string): Promise<AgentMessage[]> {
    const messages = await db.messages
      .where('conversationId')
      .equals(conversationId)
      .sortBy('timestamp');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return messages.map(({ conversationId: _cid, ...msg }) => msg);
  },

  // Create or update conversation
  async upsertConversation(
    id: string,
    title: string,
    agentId?: string
  ): Promise<void> {
    const now = new Date();
    const existing = await db.conversations.get(id);
    if (existing) {
      await db.conversations.update(id, { title, agentId, updatedAt: now });
    } else {
      await db.conversations.add({ id, title, agentId, createdAt: now, updatedAt: now });
    }
  },

  // Cache twin node
  async cacheTwin(node: TwinNode): Promise<void> {
    await db.twins.put({ ...node, cachedAt: new Date() });
  },

  // Get cached twin (if fresh enough)
  async getCachedTwin(nodeId: string, maxAgeMs = 5 * 60 * 1000): Promise<TwinNode | null> {
    const cached = await db.twins.get(nodeId);
    if (!cached) return null;
    const age = Date.now() - cached.cachedAt.getTime();
    if (age > maxAgeMs) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { cachedAt: _ca, ...node } = cached;
    return node;
  },

  // Queue an offline request
  async queueOfflineRequest(
    endpoint: string,
    method: string,
    body: unknown
  ): Promise<void> {
    await db.offlineQueue.add({
      id: crypto.randomUUID(),
      endpoint,
      method,
      body,
      createdAt: new Date(),
      retries: 0,
    });
  },

  // Get pending offline requests
  async getPendingOfflineRequests() {
    return db.offlineQueue.toArray();
  },

  // Remove offline request after successful sync
  async removeOfflineRequest(id: string): Promise<void> {
    await db.offlineQueue.delete(id);
  },
};
