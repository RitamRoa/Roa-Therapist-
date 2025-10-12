import { GoogleGenerativeAI } from '@google/generative-ai';
import { StorageService, ChatSession, Note, Task } from './storage';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  sessionId?: string;
  messages: Message[];
  summary?: string;
  timestamp: number;
}

const API_KEY = 'A;

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private storage: StorageService;
  private conversationHistory: Message[] = [];
  private userContext: string = '';
  private currentSessionId: string | null = null;

  constructor() {
    this.genAI = new GoogleGenerativeAI(API_KEY);
    // Using the stable Gemini 2.5 Flash model
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
    });
    this.storage = new StorageService();
    this.initializeContext();
  }

  private async initializeContext() {
    await this.refreshContext();
  }

  private async refreshContext() {
    // Load ALL previous conversations to build complete context
    const allConversations = await this.storage.getAllConversations();
    const memory = await this.storage.getUserMemory();
    const notes = await this.storage.getAllNotes();
    
    // Build notes context
    const notesContext = notes.length > 0 
      ? notes.map((note: Note) => {
          const tasksInfo = note.tasks.length > 0 
            ? `\nTasks: ${note.tasks.map((t: Task) => `- ${t.completed ? '✓' : '○'} ${t.text}`).join('\n')}`
            : '';
          return `\n📝 ${note.title}\n${note.content}${tasksInfo}`;
        }).join('\n')
      : 'No notes yet.';
    
    // Build user context from memory and ALL past conversations
    this.userContext = `
You are a therapist for the user RITAM RAO, your name is ROA-Therapist.
Ritam is at Comp Sci student at RV University, he has taken up a shit ton of workload. His friends includes almost 7 people who were his closest friends, who he thought would be forever. but lately it has not been so, he has been disappointed, broken and stressed with the way it has been going. It is very toxic internally, but when he meets them it is all fun and jolly. everyone has great egos (a bit him also) but neither of them understand him.
User's ongoing challenges: ${memory.challenges || 'work overload, toxic relationships'}
User's patterns: ${memory.patterns || 'difficulty setting boundaries'}
User's preferences: ${memory.preferences || 'direct communication, practical advice'}

User's Personal Notes & Tasks:
${notesContext}

COMPLETE conversation history across ALL chat sessions (last 30 messages):
${this.buildContextFromAllConversations(allConversations)}

Remember:
1. Always be empathetic and supportive and ask follow-up questions
2. Help them recognize patterns in their behavior
3. Encourage healthy boundaries
4. Validate their feelings
5. Provide actionable advice 
6. Judge only when necessary only when you think the user is actually at the wrong.
7. Remember details from ALL previous conversations across ALL chat sessions
8. Reference specific things the user has mentioned before
9. When relevant, reference their notes and tasks to show continuity and understanding. 
10. Let the text be human please remove em dashes and asterisks. 
`;

    // Get active session
    const activeSessionId = await this.storage.getActiveSessionId();
    if (activeSessionId) {
      this.currentSessionId = activeSessionId;
      const sessionConvs = await this.storage.getSessionConversations(activeSessionId);
      if (sessionConvs.length > 0) {
        // Load messages from all conversations in this session
        this.conversationHistory = sessionConvs.flatMap((c: Conversation) => c.messages);
      }
    }
  }

  private buildContextFromAllConversations(conversations: Conversation[]): string {
    if (conversations.length === 0) return 'No previous conversations';
    
    // Get last 30 messages from all conversations combined
    const allMessages = conversations
      .flatMap(conv => conv.messages)
      .slice(-30);
    
    return allMessages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      // Refresh context to include latest notes before processing message
      await this.refreshContext();

      // Add user message to history with unique ID
      const userTimestamp = Date.now();
      const userMsg: Message = {
        id: `user-${userTimestamp}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'user',
        content: userMessage,
        timestamp: userTimestamp,
      };
      this.conversationHistory.push(userMsg);

      // Build conversation history for context
      const recentHistory = this.conversationHistory
        .slice(-20) // Last 20 messages for immediate context
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n\n');

      // Build the full prompt with context and memory
      const fullPrompt = `${this.userContext}

Recent conversation in THIS session:
${recentHistory}

Current user message: ${userMessage}

Please respond naturally as if continuing this ongoing conversation. Reference specific things from earlier in our chat. Be empathetic, supportive, and show that you remember what we discussed. Keep the conversation flowing naturally.`;

      // Send to Gemini
      const result = await this.model.generateContent(fullPrompt);

      // Extract text from the model response with multiple fallbacks
      let text = '';
      try {
        const response = result.response;
        if (response) {
          // Preferred method: response.text() (may be sync or Promise)
          if (typeof response.text === 'function') {
            const maybeText = response.text();
            text = maybeText instanceof Promise ? await maybeText : maybeText;
          } else if (typeof response === 'string') {
            text = response;
          } else if ((response as any).outputText) {
            text = (response as any).outputText;
          }
        }
      } catch (ex) {
        console.error('Error while extracting text() from response', ex, { result });
      }

      // Additional fallbacks if text is still empty
      if (!text) {
        try {
          if (result && (result as any).outputText) {
            text = (result as any).outputText;
          } else if (result && Array.isArray((result as any).output)) {
            // Search for any textual content in result.output
            for (const outItem of (result as any).output) {
              if (!outItem || !outItem.content) continue;
              const content = outItem.content;
              // content may be an array of pieces
              if (Array.isArray(content)) {
                const piece = content.find((p: any) => p && (p.text || (p?.parts && p.parts.join)));
                if (piece) {
                  text = piece.text || (Array.isArray(piece.parts) ? piece.parts.join('') : '');
                  if (text) break;
                }
              } else if (typeof content === 'string') {
                text = content;
                break;
              }
            }
          } else if (result && (result as any).candidates && (result as any).candidates[0]) {
            const cand = (result as any).candidates[0];
            if (cand.content) {
              if (Array.isArray(cand.content)) {
                const t = cand.content.map((c: any) => c.text || (Array.isArray(c.parts) ? c.parts.join('') : '')).join('');
                if (t) text = t;
              } else if (typeof cand.content === 'string') {
                text = cand.content;
              }
            }
          }
        } catch (ex) {
          console.error('Fallback extraction failed', ex, { result });
        }
      }

      if (!text) {
        // If we still don't have text, log the raw result for debugging and use a friendly fallback reply
        try {
          console.error('Model returned no text. Full result object:', JSON.stringify(result, Object.getOwnPropertyNames(result)));
        } catch (logEx) {
          console.error('Model returned no text and failed to stringify result', logEx, result);
        }
        text = "I apologize, but I couldn't generate a response right now. Please try again in a moment.";
      }

      // Add assistant response to history with unique ID
      const assistantTimestamp = Date.now();
      const assistantMsg: Message = {
        id: `assistant-${assistantTimestamp}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: text,
        timestamp: assistantTimestamp,
      };
      this.conversationHistory.push(assistantMsg);

      // Save conversation
      await this.saveConversation();

      // Update user memory based on the conversation
      await this.updateUserMemory(userMessage);

      return text;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to get response. Please try again.');
    }
  }

  private async saveConversation() {
    const conversation: Conversation = {
      id: Date.now().toString(),
      messages: this.conversationHistory,
      timestamp: Date.now(),
      sessionId: this.currentSessionId || undefined,
    };
    
    await this.storage.saveConversation(conversation);
  }

  private async updateUserMemory(userMessage: string) {
    // Extract insights from the conversation
    const memory = await this.storage.getUserMemory();
    
    // Simple keyword-based insight extraction
    const lowerMessage = userMessage.toLowerCase();
    
    // Track challenges mentioned
    if (lowerMessage.includes('work') || lowerMessage.includes('busy') || lowerMessage.includes('overwhelm')) {
      if (!memory.challenges.includes('work stress')) {
        memory.challenges += ', work stress';
      }
    }
    
    if (lowerMessage.includes('friend') || lowerMessage.includes('toxic') || lowerMessage.includes('relationship')) {
      if (!memory.challenges.includes('relationship issues')) {
        memory.challenges += ', relationship issues';
      }
    }

    // Track patterns
    if (lowerMessage.includes('always') || lowerMessage.includes('every time')) {
      if (!memory.patterns.includes('recognizing patterns')) {
        memory.patterns += ', recognizing patterns';
      }
    }

    await this.storage.saveUserMemory(memory);
  }

  async clearHistory() {
    this.conversationHistory = [];
    await this.storage.clearAllConversations();
  }

  getConversationHistory(): Message[] {
    return this.conversationHistory;
  }

  async startNewConversation() {
    if (this.conversationHistory.length > 0) {
      await this.saveConversation();
    }
    this.conversationHistory = [];
  }

  // Session management methods
  async createNewSession(): Promise<string> {
    // Save current session if it has messages
    if (this.conversationHistory.length > 0) {
      await this.saveConversation();
    }

    // Create new session
    const sessionId = `session-${Date.now()}`;
    const session: ChatSession = {
      id: sessionId,
      title: 'New Chat',
      createdAt: Date.now(),
      lastMessageAt: Date.now(),
      messageCount: 0,
    };

    await this.storage.saveSession(session);
    await this.storage.setActiveSessionId(sessionId);
    this.currentSessionId = sessionId;
    this.conversationHistory = [];

    return sessionId;
  }

  async switchSession(sessionId: string) {
    // Save current session before switching
    if (this.conversationHistory.length > 0) {
      await this.saveConversation();
    }

    // Switch to new session
    this.currentSessionId = sessionId;
    await this.storage.setActiveSessionId(sessionId);

    // Load session conversations
    const conversations = await this.storage.getSessionConversations(sessionId);
    
    // Flatten all messages from conversations
    this.conversationHistory = conversations.flatMap((conv: Conversation) => conv.messages);
  }

  async getAllSessions(): Promise<ChatSession[]> {
    return await this.storage.getAllSessions();
  }

  async deleteSession(sessionId: string) {
    await this.storage.deleteSession(sessionId);
    
    // If deleted session was active, create a new one
    if (this.currentSessionId === sessionId) {
      await this.createNewSession();
    }
  }

  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  async updateSessionTitle(sessionId: string, title: string) {
    const sessions = await this.storage.getAllSessions();
    const session = sessions.find((s: ChatSession) => s.id === sessionId);
    
    if (session) {
      session.title = title;
      await this.storage.saveSession(session);
    }
  }

  // Public method to refresh context (useful when notes are updated)
  async refreshNotesContext() {
    await this.refreshContext();
  }
}

export default new GeminiService();
