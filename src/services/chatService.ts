
import { OllamaModel } from '../types/chat';

class ChatService {
  private readonly baseUrl = 'http://localhost:11434';

  async getAvailableModels(): Promise<OllamaModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error('Failed to fetch models from Ollama');
      }
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Error fetching models:', error);
      // Return mock data for development
      return [
        { name: 'llama2', size: 3800000000, digest: 'mock', modified_at: new Date().toISOString() },
        { name: 'codellama', size: 3800000000, digest: 'mock', modified_at: new Date().toISOString() },
        { name: 'mistral', size: 4100000000, digest: 'mock', modified_at: new Date().toISOString() },
      ];
    }
  }

  async sendMessage(message: string, model: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt: message,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Ollama');
      }

      const data = await response.json();
      return data.response || 'No response received';
    } catch (error) {
      console.error('Error sending message:', error);
      // Return mock response for development
      return `Mock response from ${model}: I received your message "${message}". This is a simulated response since Ollama is not available.`;
    }
  }
}

export const chatService = new ChatService();
