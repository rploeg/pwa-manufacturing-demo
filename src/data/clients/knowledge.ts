import { mediaClient } from './http';
import { env } from '../config';
import type { KnowledgeArticle } from '../types';

// Mock data for demo mode
const mockArticles: KnowledgeArticle[] = [
  {
    id: 'kb-001',
    title: 'Filler-3 Seal Mechanism Jam - Troubleshooting Guide',
    content: `# Filler-3 Seal Mechanism Jam - Troubleshooting

## Symptoms
- Sealing mechanism stops responding during operation
- Audible clicking or grinding noise
- Unit fault indicator displays error code E-301

## Root Causes
1. **Seal cartridge wear** - Most common after 10,000 cycles
2. **Misalignment** - Check alignment pins and guides
3. **Foreign object** - Inspect for debris in seal path

## Resolution Steps

### Step 1: Safety First
- Lock out/tag out machine power
- Release pneumatic pressure
- Allow heating elements to cool (30 min)

### Step 2: Visual Inspection
- Remove seal housing cover (4x M6 bolts)
- Inspect seal cartridge for cracks, wear, or deformation
- Check O-rings for damage

### Step 3: Clear Jam
- Manually cycle the seal mechanism (use hand crank)
- Remove any debris or foreign objects
- Clean seal surfaces with approved solvent

### Step 4: Test & Verify
- Reassemble housing
- Perform dry cycle test (no product)
- Monitor for smooth operation

## Parts Required
- Seal cartridge: P/N 12345 (if replacement needed)
- O-ring kit: P/N 12346
- Approved cleaning solvent

## Prevention
- Lubricate seal mechanism every 2,000 cycles
- Inspect seal cartridge weekly
- Replace seal cartridge at 12,000 cycles (preventive)

## Related Documents
- SOP-101: Seal Mechanism Maintenance
- Drawing: FILLER-3-SEAL-ASM-001`,
    category: 'troubleshooting',
    tags: ['filler-3', 'seal', 'jam', 'e-301'],
    machineIds: ['filler-3'],
    issueTypes: ['mechanical-failure', 'jam'],
    authorId: 'user-1',
    authorName: 'John Smith',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    views: 127,
    helpful: 43,
  },
  {
    id: 'kb-002',
    title: 'Standard Operating Procedure: Shift Startup Checklist',
    content: `# SOP-001: Shift Startup Checklist

## Purpose
To ensure safe and efficient production startup at the beginning of each shift.

## Scope
Applies to all production lines during shift changeover.

## Procedure

### 1. Safety Check (5 minutes)
- [ ] Verify all guards and safety devices are in place
- [ ] Check emergency stop buttons (test functionality)
- [ ] Inspect work area for hazards
- [ ] Review lockout/tagout status

### 2. Machine Inspection (10 minutes)
- [ ] Visual inspection of all equipment
- [ ] Check fluid levels (hydraulic, coolant, lubricants)
- [ ] Verify all sensors and indicators operational
- [ ] Test interlocks and safety switches

### 3. Production Preparation (15 minutes)
- [ ] Review production schedule and targets
- [ ] Verify raw materials available and correct
- [ ] Check quality inspection equipment calibration
- [ ] Confirm work instructions at each station

### 4. System Startup (10 minutes)
- [ ] Power on control systems
- [ ] Run equipment warm-up cycle
- [ ] Perform first piece inspection
- [ ] Document all checks in shift log

## Sign-off
Shift Leader Signature: _____________ Date: _______`,
    category: 'sop',
    tags: ['startup', 'checklist', 'safety', 'procedure'],
    authorId: 'user-2',
    authorName: 'Sarah Johnson',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    views: 342,
    helpful: 156,
  },
  {
    id: 'kb-003',
    title: 'Belt Tension Adjustment - Maintenance Fix',
    content: `# Belt Tension Adjustment Guide

## When to Adjust
- Belt slippage detected
- Unusual squealing noise
- Inconsistent feed rates
- After 500 hours of operation (preventive)

## Tools Required
- Belt tension gauge (BTG-100)
- 13mm wrench
- Allen key set
- Safety gloves

## Procedure

### 1. Preparation
- Stop machine and lockout power
- Allow all moving parts to come to complete stop
- Clean belt and pulley surfaces

### 2. Measure Current Tension
- Use tension gauge at belt midpoint
- Target: 40-50 lbs (1780-2225 N)
- Record current reading

### 3. Adjust Tension
- Loosen motor mounting bolts (4x M12)
- Adjust tensioner screw clockwise to increase tension
- Re-measure tension after each 1/4 turn
- Maintain even tension across belt width

### 4. Verification
- Re-tighten mounting bolts to 85 Nm
- Run test cycle at low speed
- Check alignment and tracking
- Final tension check at operating speed

## Documentation
Record in maintenance log:
- Date and time
- Initial and final tension readings
- Technician name
- Any additional observations`,
    category: 'fix',
    tags: ['belt', 'tension', 'maintenance', 'adjustment'],
    machineIds: ['assembly-1'],
    issueTypes: ['mechanical-adjustment'],
    authorId: 'user-3',
    authorName: 'Mike Chen',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    views: 89,
    helpful: 34,
  },
];

// ============================================================================
// Knowledge Base Client
// ============================================================================

export class KnowledgeClient {
  private useMocks = env.useMocks;

  /**
   * Search knowledge base
   */
  async search(
    query: string,
    filters?: {
      category?: string;
      tags?: string[];
      machineIds?: string[];
    }
  ): Promise<KnowledgeArticle[]> {
    if (this.useMocks) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      let results = [...mockArticles];

      // Filter by category
      if (filters?.category && filters.category !== 'all') {
        results = results.filter((a) => a.category === filters.category);
      }

      // Filter by tags
      if (filters?.tags && filters.tags.length > 0) {
        results = results.filter((a) => filters.tags!.some((tag) => a.tags.includes(tag)));
      }

      // Filter by machine IDs
      if (filters?.machineIds && filters.machineIds.length > 0) {
        results = results.filter(
          (a) => a.machineIds && filters.machineIds!.some((id) => a.machineIds!.includes(id))
        );
      }

      // Search by query
      if (query && query.trim()) {
        const searchLower = query.toLowerCase();
        results = results.filter(
          (a) =>
            a.title.toLowerCase().includes(searchLower) ||
            a.content.toLowerCase().includes(searchLower) ||
            a.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }

      return results;
    }

    const response = await mediaClient.get<KnowledgeArticle[]>('/knowledge/search', {
      params: { query, ...filters },
    });
    return response.data;
  }

  /**
   * Get article by ID
   */
  async getArticle(id: string): Promise<KnowledgeArticle> {
    if (this.useMocks) {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const article = mockArticles.find((a) => a.id === id);
      if (!article) {
        throw new Error(`Article ${id} not found`);
      }

      // Increment view count
      article.views++;

      return article;
    }

    const response = await mediaClient.get<KnowledgeArticle>(`/knowledge/articles/${id}`);
    return response.data;
  }

  /**
   * Create knowledge article
   */
  async createArticle(
    article: Omit<KnowledgeArticle, 'id' | 'views' | 'helpful' | 'createdAt' | 'updatedAt'>
  ): Promise<KnowledgeArticle> {
    if (this.useMocks) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const newArticle: KnowledgeArticle = {
        ...article,
        id: `kb-${Date.now()}`,
        views: 0,
        helpful: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockArticles.unshift(newArticle);
      return newArticle;
    }

    const response = await mediaClient.post<KnowledgeArticle>('/knowledge/articles', article);
    return response.data;
  }

  /**
   * Mark article as helpful
   */
  async markHelpful(id: string): Promise<void> {
    if (this.useMocks) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const article = mockArticles.find((a) => a.id === id);
      if (article) {
        article.helpful++;
      }
      return;
    }

    await mediaClient.post(`/knowledge/articles/${id}/helpful`);
  }

  /**
   * Get all articles (for knowledge base)
   */
  async getAllArticles(): Promise<KnowledgeArticle[]> {
    if (this.useMocks) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return [...mockArticles];
    }

    const response = await mediaClient.get<KnowledgeArticle[]>('/knowledge/articles');
    return response.data;
  }
}

export const knowledgeService = new KnowledgeClient();
