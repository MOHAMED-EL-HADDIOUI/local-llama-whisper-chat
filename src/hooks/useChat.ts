import { useState, useEffect, useCallback, useRef } from 'react';
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

  // Use refs to avoid dependency issues in callbacks
  const stateRef = useRef(state);
  stateRef.current = state;

  // Load sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    const savedCurrentSessionId = localStorage.getItem('currentSessionId');
    const savedSelectedModel = localStorage.getItem('selectedModel');
    
    if (savedSessions) {
      try {
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
      } catch (error) {
        console.error('Error parsing saved sessions:', error);
        localStorage.removeItem('chatSessions');
      }
    }
  }, []);

  // Load available models
  const loadModels = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const models = await chatService.getAvailableModels();
      
      setState(prev => {
        // Si aucun modèle n'est sélectionné, sélectionner le premier
        let newSelectedModel = prev.selectedModel;
        if (!newSelectedModel && models.length > 0) {
          newSelectedModel = models[0].name;
          localStorage.setItem('selectedModel', newSelectedModel);
        }
        
        return { 
          ...prev, 
          availableModels: models,
          selectedModel: newSelectedModel,
          isLoading: false 
        };
      });
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
  const createSession = useCallback(() => {
    const currentState = stateRef.current;
    const model = currentState.selectedModel || currentState.availableModels[0]?.name || 'default';
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `New Chat (${model})`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      modelId: model,
    };
    
    const updatedSessions = [newSession, ...currentState.sessions];
    
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
  }, [saveSessions]);

  // Switch session
  const switchSession = useCallback((sessionId: string) => {
    const currentState = stateRef.current;
    const targetSession = currentState.sessions.find(s => s.id === sessionId);
    
    if (targetSession) {
      // Mise à jour immédiate de l'état
      setState(prev => ({ 
        ...prev, 
        currentSessionId: sessionId,
        selectedModel: targetSession.modelId || prev.selectedModel,
        isTyping: false // Réinitialiser l'état de frappe
      }));
      
      // Sauvegarder dans localStorage
      localStorage.setItem('currentSessionId', sessionId);
      if (targetSession.modelId) {
        localStorage.setItem('selectedModel', targetSession.modelId);
      }
      
      // Forcer plusieurs re-renders pour s'assurer que l'interface se met à jour
      setTimeout(() => {
        setState(prev => ({ ...prev }));
      }, 0);
      
      setTimeout(() => {
        setState(prev => ({ ...prev }));
      }, 50);
      
      setTimeout(() => {
        setState(prev => ({ ...prev }));
      }, 100);
    }
  }, []);

  // Delete session
  const deleteSession = useCallback((sessionId: string) => {
    const currentState = stateRef.current;
    const updatedSessions = currentState.sessions.filter(s => s.id !== sessionId);
    const newCurrentId = currentState.currentSessionId === sessionId 
      ? (updatedSessions.length > 0 ? updatedSessions[0].id : null)
      : currentState.currentSessionId;
    
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
  }, [saveSessions]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    const currentState = stateRef.current;
    if (!currentState.selectedModel || !content.trim()) return;
    
    let sessionId = currentState.currentSessionId;
    let shouldCreateSession = false;
    
    // Si pas de session courante, en créer une pour le modèle sélectionné
    if (!sessionId) {
      shouldCreateSession = true;
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
      modelUsed: currentState.selectedModel,
    };
    
    // Si on doit créer une session, le faire maintenant
    if (shouldCreateSession) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: content.slice(0, 30) + '...', // Titre basé sur le premier message
        messages: [userMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
        modelId: currentState.selectedModel,
      };
      
      const updatedSessions = [newSession, ...currentState.sessions];
      sessionId = newSession.id;
      
      // Mise à jour immédiate de l'état pour afficher la nouvelle session
      setState(prev => ({ 
        ...prev, 
        sessions: updatedSessions,
        currentSessionId: newSession.id,
        isTyping: true
      }));
      
      // Sauvegarder immédiatement pour persistance
      saveSessions(updatedSessions);
      localStorage.setItem('currentSessionId', newSession.id);
      
      // Forcer un re-render pour afficher la nouvelle session
      setTimeout(() => {
        setState(prev => ({ ...prev }));
      }, 0);
    } else {
      // Add user message to existing session
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
    }
    
    try {
      const response = await chatService.sendMessage(content, currentState.selectedModel);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        modelUsed: currentState.selectedModel,
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
  }, [saveSessions]);

  // Select model
  const selectModel = useCallback((modelName: string) => {
    const currentState = stateRef.current;
    
    // Mettre à jour le modèle sélectionné
    setState(prev => ({ ...prev, selectedModel: modelName }));
    localStorage.setItem('selectedModel', modelName);
    
    // Si on change de modèle et qu'il y a une session courante avec des messages,
    // créer une nouvelle session pour le nouveau modèle
    if (currentState.selectedModel && 
        currentState.selectedModel !== modelName && 
        currentState.currentSessionId) {
      
      const currentSession = currentState.sessions.find(s => s.id === currentState.currentSessionId);
      
      // Créer une nouvelle session seulement si la session courante a des messages
      if (currentSession && currentSession.messages.length > 0) {
        const newSession: ChatSession = {
          id: Date.now().toString(),
          title: `New Chat (${modelName})`,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          modelId: modelName,
        };
        
        const updatedSessions = [newSession, ...currentState.sessions];
        
        setState(prev => ({ 
          ...prev, 
          sessions: updatedSessions,
          currentSessionId: newSession.id,
          selectedModel: modelName
        }));
        
        saveSessions(updatedSessions);
        localStorage.setItem('currentSessionId', newSession.id);
      }
    }
  }, [saveSessions]);

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
  };
};
