import { mediaClient } from './http';
import { env } from '../config';
import type { HandoverNote, ActionItem } from '../types';
import { knowledgeService } from './knowledge';

// Mock data for demo mode
const mockNotes: HandoverNote[] = [
  {
    id: 'note-1',
    shift: 'Morning',
    lineId: 'line-1',
    lineName: 'Line 1 - Coffee Makers',
    authorId: 'user-1',
    authorName: 'John Doe',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    transcript: 'Morning shift handover. Line 1 running smoothly at 85% OEE. Minor issue with Filler-2 temperature running slightly high at 71 degrees. Maintenance team notified. Quality checks all passing. Next shift should monitor temperature closely.',
    summary: 'Line 1 operational at 85% OEE. Filler-2 temperature slightly elevated (71°C), maintenance aware. Quality metrics good.',
    actionItems: [
      {
        id: 'action-1',
        description: 'Monitor Filler-2 temperature',
        priority: 'medium',
        status: 'open',
      },
      {
        id: 'action-2',
        description: 'Check cooling system',
        priority: 'high',
        assignedTo: 'Maintenance Team',
        status: 'in-progress',
      },
    ],
    tags: ['temperature', 'oee', 'quality'],
    status: 'published',
  },
  {
    id: 'note-2',
    shift: 'Afternoon',
    lineId: 'line-2',
    lineName: 'Line 2 - Blenders',
    authorId: 'user-2',
    authorName: 'Jane Smith',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    transcript: 'Afternoon shift update for Line 2. Production rate is lower than target due to belt alignment issue on Assembly-1. Technician adjusted tension but recommend full inspection. Completed 850 units today, target was 1000. No quality issues reported.',
    summary: 'Line 2 below target (850/1000 units) due to belt alignment issue on Assembly-1. Needs full inspection.',
    actionItems: [
      {
        id: 'action-3',
        description: 'Schedule full belt inspection',
        priority: 'high',
        assignedTo: 'Tech-B',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
        status: 'open',
      },
    ],
    tags: ['production', 'maintenance', 'belt'],
    status: 'published',
  },
];

// ============================================================================
// Handover Service Client
// ============================================================================

export class HandoverClient {
  private useMocks = env.useMocks;

  /**
   * Upload audio file
   */
  async uploadAudio(file: Blob, metadata: Record<string, string>): Promise<string> {
    if (this.useMocks) {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // Return mock URL
      return `blob:mock-audio-${Date.now()}`;
    }

    const formData = new FormData();
    formData.append('audio', file);
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await mediaClient.post<{ url: string }>('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  }

  /**
   * Transcribe audio
   */
  async transcribe(audioUrl: string): Promise<string> {
    if (this.useMocks) {
      // Simulate transcription delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Return mock transcript
      return 'This is the morning shift handover for Line 3. We had a good production run with OEE at 82%. There was a minor seal jam around 10 AM which caused a 15 minute downtime. The maintenance team replaced the seal cartridge and the line is back to normal operation. Quality checks are all passing. The next shift should keep an eye on the seal mechanism and report any unusual sounds. We completed 920 units today against a target of 1000.';
    }

    const response = await mediaClient.post<{ transcript: string }>('/handover/transcribe', {
      audioUrl,
    });
    return response.data.transcript;
  }

  /**
   * Summarize transcript and extract action items (local logic for mock mode)
   */
  async summarize(
    transcript: string,
    context: { lineId: string; shift: string }
  ): Promise<{ summary: string; actionItems: ActionItem[] }> {
    if (this.useMocks) {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Local summarization logic - extract key information
      const summary = this.generateLocalSummary(transcript, context);
      const actionItems = this.extractLocalActionItems(transcript);

      return { summary, actionItems };
    }

    const response = await mediaClient.post<{
      summary: string;
      actionItems: ActionItem[];
    }>('/handover/summarize', {
      transcript,
      context,
    });
    return response.data;
  }

  /**
   * Generate summary locally without AI service
   */
  private generateLocalSummary(transcript: string, context: { lineId: string; shift: string }): string {
    const lower = transcript.toLowerCase();
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Extract key metrics
    const oeeMatch = lower.match(/oee\s+(?:at|is|was)?\s*(\d+(?:\.\d+)?)\s*%?/i);
    const oee = oeeMatch ? oeeMatch[1] : null;
    
    const unitsMatch = lower.match(/(\d+)\s+units?/i);
    const units = unitsMatch ? unitsMatch[1] : null;
    
    const targetMatch = lower.match(/target\s+(?:of|was)?\s*(\d+)/i);
    const target = targetMatch ? targetMatch[1] : null;
    
    // Extract issues/problems
    const issues: string[] = [];
    const issueKeywords = ['issue', 'problem', 'jam', 'downtime', 'failure', 'malfunction', 'defect', 'error'];
    
    sentences.forEach(sentence => {
      const sentLower = sentence.toLowerCase();
      if (issueKeywords.some(keyword => sentLower.includes(keyword))) {
        issues.push(sentence.trim());
      }
    });
    
    // Extract quality/status mentions
    const qualityGood = lower.match(/quality\s+(?:checks?|metrics?)?\s+(?:are|is)?\s*(?:all\s+)?(?:passing|good|normal|acceptable)/i);
    
    // Build summary
    let summaryParts: string[] = [];
    
    // Line and shift info
    summaryParts.push(`${context.shift} shift`);
    
    // OEE if found
    if (oee) {
      summaryParts.push(`${oee}% OEE`);
    }
    
    // Production if found
    if (units && target) {
      summaryParts.push(`${units}/${target} units`);
    } else if (units) {
      summaryParts.push(`${units} units produced`);
    }
    
    // Key issue (first one, shortened)
    if (issues.length > 0) {
      const issueText = issues[0];
      const shortIssue = issueText.length > 80 ? issueText.substring(0, 77) + '...' : issueText;
      summaryParts.push(shortIssue);
    }
    
    // Quality status
    if (qualityGood) {
      summaryParts.push('Quality checks passed');
    }
    
    return summaryParts.join('. ') + '.';
  }

  /**
   * Extract action items locally without AI service
   */
  private extractLocalActionItems(transcript: string): ActionItem[] {
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const actionItems: ActionItem[] = [];
    
    // Keywords that indicate action items
    const actionKeywords = [
      { words: ['should', 'monitor', 'watch', 'keep an eye'], priority: 'medium' as const },
      { words: ['must', 'need to', 'require', 'urgent', 'immediately'], priority: 'high' as const },
      { words: ['investigate', 'check', 'inspect', 'review'], priority: 'medium' as const },
      { words: ['schedule', 'plan', 'arrange'], priority: 'low' as const },
      { words: ['replace', 'repair', 'fix'], priority: 'high' as const },
    ];
    
    sentences.forEach(sentence => {
      const sentLower = sentence.toLowerCase();
      
      for (const { words, priority } of actionKeywords) {
        if (words.some(word => sentLower.includes(word))) {
          // Extract the action part
          let actionText = sentence.trim();
          
          // Clean up common prefixes
          actionText = actionText
            .replace(/^(the )?next shift (should|must|needs? to|will) /i, '')
            .replace(/^(we|they|someone) (should|must|needs? to|will) /i, '')
            .replace(/^please /i, '');
          
          // Capitalize first letter
          actionText = actionText.charAt(0).toUpperCase() + actionText.slice(1);
          
          // Limit length
          if (actionText.length > 100) {
            actionText = actionText.substring(0, 97) + '...';
          }
          
          actionItems.push({
            id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            description: actionText,
            priority,
            status: 'open',
          });
          
          break; // Only match first keyword per sentence
        }
      }
    });
    
    // If no action items found, extract issues as actions
    if (actionItems.length === 0) {
      const issueKeywords = ['issue', 'problem', 'jam', 'downtime'];
      sentences.forEach(sentence => {
        const sentLower = sentence.toLowerCase();
        if (issueKeywords.some(keyword => sentLower.includes(keyword))) {
          actionItems.push({
            id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            description: `Follow up: ${sentence.trim()}`,
            priority: 'medium',
            status: 'open',
          });
        }
      });
    }
    
    // Limit to max 3 action items
    return actionItems.slice(0, 3);
  }

  /**
   * Save handover note
   */
  async saveNote(note: Omit<HandoverNote, 'id'>): Promise<HandoverNote> {
    if (this.useMocks) {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newNote: HandoverNote = {
        ...note,
        id: `note-${Date.now()}`,
      };
      
      mockNotes.unshift(newNote);
      
      // Automatically create knowledge base article from handover note
      await this.createKnowledgeArticleFromHandover(newNote);
      
      return newNote;
    }

    const response = await mediaClient.post<HandoverNote>('/handover/notes', note);
    return response.data;
  }

  /**
   * Create a knowledge base article from a handover note
   */
  private async createKnowledgeArticleFromHandover(note: HandoverNote): Promise<void> {
    try {
      // Build markdown content from the handover note
      const content = this.buildKnowledgeContent(note);
      
      // Extract tags from the transcript and action items
      const tags = this.extractTags(note);
      
      // Determine machine IDs from line name
      const machineIds = note.lineId ? [note.lineId] : undefined;
      
      // Create the knowledge article
      await knowledgeService.createArticle({
        title: `Shift Handover: ${note.lineName} - ${note.shift} (${note.createdAt.toLocaleDateString()})`,
        content,
        category: 'note',
        tags,
        machineIds,
        authorId: note.authorId,
        authorName: note.authorName,
      });
    } catch (error) {
      console.error('Failed to create knowledge article from handover:', error);
      // Don't throw - handover save should succeed even if knowledge article creation fails
    }
  }

  /**
   * Build rich markdown content from handover note
   */
  private buildKnowledgeContent(note: HandoverNote): string {
    const sections: string[] = [];
    
    // Header
    sections.push(`# Shift Handover: ${note.lineName}`);
    sections.push('');
    sections.push(`**Shift:** ${note.shift}`);
    sections.push(`**Date:** ${note.createdAt.toLocaleString()}`);
    sections.push(`**Recorded by:** ${note.authorName}`);
    sections.push('');
    
    // Summary
    sections.push('## Summary');
    sections.push(note.summary || 'No summary available.');
    sections.push('');
    
    // Full transcript
    sections.push('## Full Transcript');
    sections.push(note.transcript || 'No transcript available.');
    sections.push('');
    
    // Action items
    if (note.actionItems && note.actionItems.length > 0) {
      sections.push('## Action Items');
      note.actionItems.forEach((item, index) => {
        const priority = item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '🟡' : '🟢';
        const assignee = item.assignedTo ? ` (Assigned to: ${item.assignedTo})` : '';
        const dueDate = item.dueDate ? ` - Due: ${new Date(item.dueDate).toLocaleDateString()}` : '';
        sections.push(`${index + 1}. ${priority} ${item.description}${assignee}${dueDate}`);
      });
      sections.push('');
    }
    
    // Tags section
    if (note.tags && note.tags.length > 0) {
      sections.push('## Tags');
      sections.push(note.tags.map(tag => `\`${tag}\``).join(' '));
      sections.push('');
    }
    
    // Footer
    sections.push('---');
    sections.push('*This knowledge article was automatically generated from a shift handover recording.*');
    
    return sections.join('\n');
  }

  /**
   * Extract meaningful tags from handover note
   */
  private extractTags(note: HandoverNote): string[] {
    const tags = new Set<string>();
    
    // Add existing tags
    if (note.tags) {
      note.tags.forEach(tag => tags.add(tag));
    }
    
    // Add shift as tag
    tags.add(note.shift.toLowerCase());
    
    // Add line name variations
    if (note.lineName) {
      tags.add(note.lineName.toLowerCase().replace(/\s+/g, '-'));
    }
    
    // Extract keywords from transcript and summary
    const text = `${note.transcript} ${note.summary}`.toLowerCase();
    
    const keywords = [
      'oee', 'downtime', 'quality', 'maintenance', 'temperature', 'speed',
      'jam', 'issue', 'problem', 'failure', 'repair', 'inspection',
      'belt', 'seal', 'motor', 'sensor', 'pump', 'valve',
      'production', 'units', 'target', 'defect', 'scrap',
    ];
    
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        tags.add(keyword);
      }
    });
    
    // Add 'shift-handover' as category tag
    tags.add('shift-handover');
    
    return Array.from(tags).slice(0, 10); // Limit to 10 tags
  }

  /**
   * Get handover notes
   */
  async getNotes(filters: {
    lineId?: string;
    shift?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<HandoverNote[]> {
    if (this.useMocks) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      let filtered = [...mockNotes];
      
      if (filters.lineId) {
        filtered = filtered.filter(n => n.lineId === filters.lineId);
      }
      
      if (filters.shift) {
        filtered = filtered.filter(n => n.shift === filters.shift);
      }
      
      if (filters.dateFrom) {
        filtered = filtered.filter(n => n.createdAt >= filters.dateFrom!);
      }
      
      if (filters.dateTo) {
        filtered = filtered.filter(n => n.createdAt <= filters.dateTo!);
      }
      
      return filtered;
    }

    const response = await mediaClient.get<HandoverNote[]>('/handover/notes', {
      params: filters,
    });
    return response.data;
  }

  /**
   * Update action item
   */
  async updateActionItem(noteId: string, itemId: string, updates: Partial<ActionItem>): Promise<void> {
    if (this.useMocks) {
      // Simulate update delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const note = mockNotes.find(n => n.id === noteId);
      if (note) {
        const item = note.actionItems.find(a => a.id === itemId);
        if (item) {
          Object.assign(item, updates);
          if (updates.status === 'completed') {
            item.completedAt = new Date();
          }
        }
      }
      return;
    }

    await mediaClient.patch(`/handover/notes/${noteId}/actions/${itemId}`, updates);
  }
}

export const handoverService = new HandoverClient();
