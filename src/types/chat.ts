
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  modelUsed?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  modelId?: string;
}

export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
}

export interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  availableModels: OllamaModel[];
  selectedModel: string | null;
  isLoading: boolean;
  isTyping: boolean;
}
