import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { ModelSelector } from './ModelSelector';
import { WelcomeGuide } from './WelcomeGuide';
import { useChat } from '../hooks/useChat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInterfaceProps {
  currentSessionId?: string;
  onSelectModel?: (modelName: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  currentSessionId, 
  onSelectModel,
  isDarkMode,
  onToggleDarkMode
}) => {
  const {
    currentSession,
    availableModels,
    selectedModel,
    isLoading,
    isTyping,
    loadModels,
    sendMessage,
    selectModel,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [localCurrentSession, setLocalCurrentSession] = useState(currentSession);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isSwitchingSession, setIsSwitchingSession] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() => {
    return localStorage.getItem('hasSeenWelcome') === 'true';
  });

  useEffect(() => {
    loadModels();
    
    // Montrer le guide d'accueil pour les nouveaux utilisateurs
    if (!hasSeenWelcome && availableModels.length === 0) {
      setShowWelcomeGuide(true);
    }
  }, [loadModels, hasSeenWelcome, availableModels.length]);

  // Synchroniser la session locale avec les props
  useEffect(() => {
    if (currentSessionId !== localCurrentSession?.id) {
      setIsSwitchingSession(true);
      console.log('Switching session from', localCurrentSession?.id, 'to', currentSessionId);
      
      // Mise à jour immédiate
      setLocalCurrentSession(currentSession);
      
      // Petit délai pour montrer l'indicateur de changement
      setTimeout(() => {
        setIsSwitchingSession(false);
        setForceUpdate(prev => prev + 1);
      }, 200);
    } else {
      setLocalCurrentSession(currentSession);
    }
    
    if (currentSession && currentSession.messages.length > 0) {
      setIsCreatingSession(false);
    }
  }, [currentSession, currentSessionId, localCurrentSession?.id]);

  // Forcer la mise à jour quand currentSession change
  useEffect(() => {
    setLocalCurrentSession(currentSession);
  }, [currentSession, forceUpdate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localCurrentSession?.messages, isTyping, currentSessionId, forceUpdate]);

  const handleModelSelect = (modelName: string) => {
    selectModel(modelName);
    if (onSelectModel) {
      onSelectModel(modelName);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!localCurrentSession) {
      setIsCreatingSession(true);
    }
    
    await sendMessage(content);
    
    // Forcer la mise à jour de l'interface après envoi
    setTimeout(() => {
      setLocalCurrentSession(currentSession);
      setIsCreatingSession(false);
      setForceUpdate(prev => prev + 1);
    }, 100);
  };

  const handleStartChat = () => {
    setShowWelcomeGuide(false);
    setHasSeenWelcome(true);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const handleCloseWelcome = () => {
    setShowWelcomeGuide(false);
    setHasSeenWelcome(true);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  // Debug: afficher les informations de session
  console.log('ChatInterface render:', {
    currentSessionId,
    localCurrentSessionId: localCurrentSession?.id,
    messagesCount: localCurrentSession?.messages?.length,
    forceUpdate
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900 min-h-0">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <ModelSelector
            models={availableModels}
            selectedModel={selectedModel}
            onSelectModel={handleModelSelect}
            isLoading={isLoading}
          />
          
          {/* Help Button */}
          <Button
            onClick={() => setShowWelcomeGuide(true)}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Show Help Guide"
          >
            <BookOpen className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </Button>
        </div>
      </div>

      {/* Scrollable Chat Window */}
      <div className="flex-1 flex flex-col relative min-h-0">
        <ScrollArea className="flex-1 px-2 sm:px-4 md:px-8 lg:px-32 xl:px-64 bg-white dark:bg-gray-900 min-h-0">
          {!localCurrentSession || localCurrentSession.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center max-w-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Welcome to AI Chat
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-4">
                  {selectedModel 
                    ? `Ready to chat with ${selectedModel}! Just type your message below and a new conversation will be created automatically.`
                    : 'Select a model above and start chatting with your local AI assistant. Your conversations will be saved automatically.'
                  }
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>{selectedModel ? 'Ready to chat' : 'Select a model first'}</span>
                </div>
                
                {selectedModel && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <Send className="w-4 h-4" />
                      <span className="text-sm font-medium">Tip:</span>
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                      Type your first message below to automatically create a new chat session.
                    </p>
                  </div>
                )}
                
                {/* Help Button for New Users */}
                {!hasSeenWelcome && (
                  <div className="mt-6">
                    <Button
                      onClick={() => setShowWelcomeGuide(true)}
                      variant="outline"
                      className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Show Getting Started Guide
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 pb-32">
              <div className="max-w-2xl mx-auto flex flex-col space-y-4">
                {localCurrentSession.messages.map((message, index) => (
                  <div
                    key={`${message.id}-${forceUpdate}`}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <ChatMessage 
                      message={message} 
                      isFirst={index === 0}
                      isLast={index === localCurrentSession.messages.length - 1}
                    />
                  </div>
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} className="h-8" />
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Session Creation Indicator */}
        {isCreatingSession && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Creating new conversation...</span>
          </div>
        )}

        {/* Session Switching Indicator */}
        {isSwitchingSession && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading conversation...</span>
          </div>
        )}

        {/* Sticky Input Bar */}
        <div className="sticky bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={!selectedModel || isTyping || isCreatingSession || isSwitchingSession}
          />
        </div>
      </div>

      {/* Welcome Guide Modal */}
      {showWelcomeGuide && (
        <WelcomeGuide
          onClose={handleCloseWelcome}
          onStartChat={handleStartChat}
          isDarkMode={isDarkMode}
          onToggleDarkMode={onToggleDarkMode}
        />
      )}
    </div>
  );
};

// Add fade-in animation
// In your global CSS (e.g., App.css or index.css):
// .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.4,0,0.2,1) both; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none; } }
