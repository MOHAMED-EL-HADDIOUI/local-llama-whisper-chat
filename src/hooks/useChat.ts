import { useState, useEffect, useCallback } from 'react';
import { ChatState, ChatSession, Message, OllamaModel } from '../types/chat';
import { chatService } from '../services/chatService';

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    sessions: [],
    currentSessionId: null,
    availableModels: [],
    selectedModel: null,
    isLoading: false,
    isTyping: false,
  });

  // Load sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    const savedCurrentSessionId = localStorage.getItem('currentSessionId');
    const savedSelectedModel = localStorage.getItem('selectedModel');
    
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
      setState(prev => ({
        ...prev,
        sessions,
        currentSessionId: savedCurrentSessionId,
        selectedModel: savedSelectedModel,
      }));
    }
  }, []);

  // Load available models
  const loadModels = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const models = await chatService.getAvailableModels();
      setState(prev => ({ 
        ...prev, 
        availableModels: models,
        selectedModel: prev.selectedModel || (models.length > 0 ? models[0].name : null),
        isLoading: false 
      }));
    } catch (error) {
      console.error('Failed to load models:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Auto-create a conversation on first load if none exists
  useEffect(() => {
    if (
      state.sessions.length === 0 &&
      state.availableModels.length > 0 &&
      !state.isLoading
    ) {
      const modelName = state.selectedModel || state.availableModels[0].name;
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: `New Chat (${modelName})`,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        modelId: modelName,
      };
      setState(prev => ({
        ...prev,
        sessions: [newSession],
        currentSessionId: newSession.id,
        selectedModel: modelName,
      }));
      localStorage.setItem('chatSessions', JSON.stringify([newSession]));
      localStorage.setItem('currentSessionId', newSession.id);
      localStorage.setItem('selectedModel', modelName);
    }
  }, [state.sessions.length, state.availableModels, state.selectedModel, state.isLoading]);

  // Save sessions to localStorage
  const saveSessions = useCallback((sessions: ChatSession[]) => {
    // Sanitize sessions/messages to avoid circular structure
    const safeSessions = sessions.map(session => ({
      ...session,
      messages: session.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        role: msg.role,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp,
        modelUsed: msg.modelUsed,
      })),
      createdAt: session.createdAt instanceof Date ? session.createdAt.toISOString() : session.createdAt,
      updatedAt: session.updatedAt instanceof Date ? session.updatedAt.toISOString() : session.updatedAt,
    }));
    try {
      localStorage.setItem('chatSessions', JSON.stringify(safeSessions));
    } catch (err) {
      console.error('Failed to save sessions:', err, safeSessions);
    }
  }, []);

  // Create new session
  const createSession = useCallback((modelName?: string) => {
    const model = modelName || state.selectedModel || state.availableModels[0]?.name || 'default';
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `New Chat (${model})`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      modelId: model,
    };
    const updatedSessions = [newSession, ...state.sessions];
    setState(prev => ({ 
      ...prev, 
      sessions: updatedSessions,
      currentSessionId: newSession.id,
      selectedModel: model
    }));
    saveSessions(updatedSessions);
    localStorage.setItem('currentSessionId', newSession.id);
    localStorage.setItem('selectedModel', model);
    return newSession.id;
  }, [state.sessions, state.selectedModel, state.availableModels, saveSessions]);

  // Switch session
  const switchSession = useCallback((sessionId: string) => {
    setState(prev => ({ ...prev, currentSessionId: sessionId }));
    localStorage.setItem('currentSessionId', sessionId);
  }, []);

  // Delete session
  const deleteSession = useCallback((sessionId: string) => {
    const updatedSessions = state.sessions.filter(s => s.id !== sessionId);
    const newCurrentId = state.currentSessionId === sessionId 
      ? (updatedSessions.length > 0 ? updatedSessions[0].id : null)
      : state.currentSessionId;
    setState(prev => ({ 
      ...prev, 
      sessions: updatedSessions,
      currentSessionId: newCurrentId 
    }));
    saveSessions(updatedSessions);
    if (newCurrentId) {
      localStorage.setItem('currentSessionId', newCurrentId);
    } else {
      localStorage.removeItem('currentSessionId');
    }
  }, [state.sessions, state.currentSessionId, saveSessions]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!state.selectedModel || !content.trim()) return;
    let sessionId = state.currentSessionId;
    // Si pas de session courante, en créer une pour le modèle sélectionné
    if (!sessionId) {
      sessionId = createSession(state.selectedModel);
    }
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
      modelUsed: state.selectedModel,
    };
    // Add user message
    setState(prev => {
      const updatedSessions = prev.sessions.map(session => 
        session.id === sessionId 
          ? { 
              ...session, 
              messages: [...session.messages, userMessage],
              title: session.messages.length === 0 ? content.slice(0, 30) + '...' : session.title,
              updatedAt: new Date()
            }
          : session
      );
      saveSessions(updatedSessions);
      return { ...prev, sessions: updatedSessions, isTyping: true };
    });
    try {
      const response = await chatService.sendMessage(content, state.selectedModel);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        modelUsed: state.selectedModel,
      };
      setState(prev => {
        const updatedSessions = prev.sessions.map(session => 
          session.id === sessionId 
            ? { 
                ...session, 
                messages: [...session.messages, assistantMessage],
                updatedAt: new Date()
              }
            : session
        );
        saveSessions(updatedSessions);
        return { ...prev, sessions: updatedSessions, isTyping: false };
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setState(prev => ({ ...prev, isTyping: false }));
    }
  }, [state.selectedModel, state.currentSessionId, createSession, saveSessions]);

  // Select model
  const selectModel = useCallback((modelName: string) => {
    // Si on change de modèle, créer une nouvelle session liée à ce modèle
    if (state.selectedModel && state.selectedModel !== modelName && state.currentSessionId) {
      createSession(modelName);
    } else {
      setState(prev => ({ ...prev, selectedModel: modelName }));
      localStorage.setItem('selectedModel', modelName);
    }
  }, [state.selectedModel, state.currentSessionId, createSession]);

  const currentSession = state.sessions.find(s => s.id === state.currentSessionId);

  return {
    ...state,
    currentSession,
    loadModels,
    createSession,
    switchSession,
    deleteSession,
    sendMessage,
    selectModel,
    exportData: (sessions: ChatSession[]) => {
      const { useUser } = require('./useUser');
      const { exportData } = useUser();
      exportData(sessions);
    },
  };
};
