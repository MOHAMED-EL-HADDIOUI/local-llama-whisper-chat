export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  autoSave: boolean;
  defaultModel?: string;
  maxConversations: number;
  exportFormat: 'json' | 'txt' | 'md';
}

export interface ConversationExport {
  id: string;
  title: string;
  modelId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    modelUsed?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ExportData {
  user: Omit<UserProfile, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
  };
  conversations: ConversationExport[];
  exportDate: string;
  version: string;
} 