import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { ModelSelector } from './ModelSelector';
import { useChat } from '../hooks/useChat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';

export const ChatInterface: React.FC<{ currentSessionId?: string }> = ({ currentSessionId }) => {
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

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isTyping, currentSessionId]);

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900 min-h-0">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <ModelSelector
          models={availableModels}
          selectedModel={selectedModel}
          onSelectModel={selectModel}
          isLoading={isLoading}
        />
      </div>

      {/* Scrollable Chat Window */}
      <div className="flex-1 flex flex-col relative min-h-0">
        <ScrollArea className="flex-1 px-2 sm:px-4 md:px-8 lg:px-32 xl:px-64 bg-white dark:bg-gray-900 min-h-0">
          {!currentSession || currentSession.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center max-w-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Welcome to AI Chat
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-4">
                  Select a model and start chatting with your local AI assistant. 
                  Your conversations will be saved automatically.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Ready to chat</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 pb-32">
              <div className="max-w-2xl mx-auto flex flex-col space-y-4">
                {currentSession.messages.map((message, index) => (
                  <div
                    key={message.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <ChatMessage 
                      message={message} 
                      isFirst={index === 0}
                      isLast={index === currentSession.messages.length - 1}
                    />
                  </div>
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} className="h-8" />
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Sticky Input Bar */}
        <div className="sticky bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <ChatInput
            onSendMessage={sendMessage}
            disabled={!selectedModel || isTyping}
          />
        </div>
      </div>
    </div>
  );
};

// Add fade-in animation
// In your global CSS (e.g., App.css or index.css):
// .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.4,0,0.2,1) both; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none; } }
