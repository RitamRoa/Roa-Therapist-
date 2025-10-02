import { Preferences } from '@capacitor/preferences';
import { Conversation } from './gemini';

export interface UserMemory {
  challenges: string;
  patterns: string;
  preferences: string;
  insights: string[];
  lastUpdated: number;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  lastMessageAt: number;
  messageCount: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tasks: Task[];
  createdAt: number;
  updatedAt: number;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export class StorageService {
  private readonly CONVERSATIONS_KEY = 'conversations';
  private readonly MEMORY_KEY = 'user_memory';
  private readonly SESSIONS_KEY = 'chat_sessions';
  private readonly ACTIVE_SESSION_KEY = 'active_session_id';
  private readonly NOTES_KEY = 'user_notes';

  async saveConversation(conversation: Conversation): Promise<void> {
    try {
      const conversations = await this.getAllConversations();
      conversations.unshift(conversation); // Add to beginning
      
      // Keep only last 50 conversations
      const limited = conversations.slice(0, 50);
      
      await Preferences.set({
        key: this.CONVERSATIONS_KEY,
        value: JSON.stringify(limited),
      });
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  async getAllConversations(): Promise<Conversation[]> {
    try {
      const { value } = await Preferences.get({ key: this.CONVERSATIONS_KEY });
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  }

  async getConversation(id: string): Promise<Conversation | null> {
    try {
      const conversations = await this.getAllConversations();
      return conversations.find(conv => conv.id === id) || null;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  async deleteConversation(id: string): Promise<void> {
    try {
      const conversations = await this.getAllConversations();
      const filtered = conversations.filter(conv => conv.id !== id);
      await Preferences.set({
        key: this.CONVERSATIONS_KEY,
        value: JSON.stringify(filtered),
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }

  async clearAllConversations(): Promise<void> {
    try {
      await Preferences.remove({ key: this.CONVERSATIONS_KEY });
    } catch (error) {
      console.error('Error clearing conversations:', error);
    }
  }

  async getUserMemory(): Promise<UserMemory> {
    try {
      const { value } = await Preferences.get({ key: this.MEMORY_KEY });
      if (value) {
        return JSON.parse(value);
      }
      
      // Default memory
      return {
        challenges: 'work overload, toxic relationships',
        patterns: 'tends to overcommit, difficulty setting boundaries',
        preferences: 'direct communication, practical advice',
        insights: [],
        lastUpdated: Date.now(),
      };
    } catch (error) {
      console.error('Error getting user memory:', error);
      return {
        challenges: 'work overload, toxic relationships',
        patterns: 'tends to overcommit, difficulty setting boundaries',
        preferences: 'direct communication, practical advice',
        insights: [],
        lastUpdated: Date.now(),
      };
    }
  }

  async saveUserMemory(memory: UserMemory): Promise<void> {
    try {
      memory.lastUpdated = Date.now();
      await Preferences.set({
        key: this.MEMORY_KEY,
        value: JSON.stringify(memory),
      });
    } catch (error) {
      console.error('Error saving user memory:', error);
    }
  }

  async addInsight(insight: string): Promise<void> {
    try {
      const memory = await this.getUserMemory();
      memory.insights.unshift(insight);
      memory.insights = memory.insights.slice(0, 20); // Keep last 20 insights
      await this.saveUserMemory(memory);
    } catch (error) {
      console.error('Error adding insight:', error);
    }
  }

  async clearMemory(): Promise<void> {
    try {
      await Preferences.remove({ key: this.MEMORY_KEY });
    } catch (error) {
      console.error('Error clearing memory:', error);
    }
  }

  // Chat Session Management
  async getAllSessions(): Promise<ChatSession[]> {
    try {
      const { value } = await Preferences.get({ key: this.SESSIONS_KEY });
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  }

  async saveSession(session: ChatSession): Promise<void> {
    try {
      const sessions = await this.getAllSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.unshift(session);
      }
      
      await Preferences.set({
        key: this.SESSIONS_KEY,
        value: JSON.stringify(sessions),
      });
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      const sessions = await this.getAllSessions();
      const filtered = sessions.filter(s => s.id !== sessionId);
      
      await Preferences.set({
        key: this.SESSIONS_KEY,
        value: JSON.stringify(filtered),
      });

      // Also delete conversations for this session
      const conversations = await this.getAllConversations();
      const filteredConvs = conversations.filter(c => c.sessionId !== sessionId);
      
      await Preferences.set({
        key: this.CONVERSATIONS_KEY,
        value: JSON.stringify(filteredConvs),
      });
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  }

  async getActiveSessionId(): Promise<string | null> {
    try {
      const { value } = await Preferences.get({ key: this.ACTIVE_SESSION_KEY });
      return value;
    } catch (error) {
      console.error('Error getting active session:', error);
      return null;
    }
  }

  async setActiveSessionId(sessionId: string): Promise<void> {
    try {
      await Preferences.set({
        key: this.ACTIVE_SESSION_KEY,
        value: sessionId,
      });
    } catch (error) {
      console.error('Error setting active session:', error);
    }
  }

  async getSessionConversations(sessionId: string): Promise<Conversation[]> {
    try {
      const conversations = await this.getAllConversations();
      return conversations.filter(c => c.sessionId === sessionId);
    } catch (error) {
      console.error('Error getting session conversations:', error);
      return [];
    }
  }

  // Notes management
  async getAllNotes(): Promise<Note[]> {
    try {
      const { value } = await Preferences.get({ key: this.NOTES_KEY });
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  }

  async saveNote(note: Note): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const existingIndex = notes.findIndex(n => n.id === note.id);
      
      if (existingIndex >= 0) {
        notes[existingIndex] = note;
      } else {
        notes.unshift(note);
      }

      await Preferences.set({
        key: this.NOTES_KEY,
        value: JSON.stringify(notes),
      });
    } catch (error) {
      console.error('Error saving note:', error);
    }
  }

  async deleteNote(noteId: string): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const filtered = notes.filter(n => n.id !== noteId);
      
      await Preferences.set({
        key: this.NOTES_KEY,
        value: JSON.stringify(filtered),
      });
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }

  async getNote(noteId: string): Promise<Note | null> {
    try {
      const notes = await this.getAllNotes();
      return notes.find(n => n.id === noteId) || null;
    } catch (error) {
      console.error('Error getting note:', error);
      return null;
    }
  }
}
