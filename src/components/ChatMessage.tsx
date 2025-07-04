import React, { useState } from 'react';
import { Message } from '../types/chat';
import { User, Bot, Eye, EyeOff } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { Button } from '@/components/ui/button';

interface ChatMessageProps {
  message: Message;
  isFirst?: boolean;
  isLast?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isFirst = false, isLast = false }) => {
  const isUser = message.role === 'user';
  const { user } = useUser();
  const [showThinkTags, setShowThinkTags] = useState(false);
  
  // Check if message contains think tags
  const hasThinkTags = /<think>.*?<\/think>/gs.test(message.content);
  
  // Function to process content and handle think tags
  const processContent = (content: string) => {
    if (!showThinkTags) {
      // Remove think tags when hidden
      return content.replace(/<think>.*?<\/think>/gs, '');
    }
    return content;
  };
  
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-blue-500" />
        </div>
      )}
      
      <div className={`max-w-2xl min-w-0 flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full`}>
        <div
          className={`px-4 py-3 sm:px-6 sm:py-4 rounded-2xl shadow-md ${
            isUser
              ? 'bg-blue-50 text-gray-900 rounded-br-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-md'
          } w-full break-words`}
          style={{ wordBreak: 'break-word' }}
        >
          <div className="text-base sm:text-base leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto">
            {processContent(message.content)}
          </div>
          {/* Think Tags Toggle Button - Only show for assistant messages with think tags */}
          {!isUser && hasThinkTags && (
            <div className="mt-3 flex items-center gap-2 border-t border-gray-200/50 dark:border-gray-600/50 pt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowThinkTags(!showThinkTags)}
                className="h-7 px-3 text-xs hover:bg-gray-200/80 dark:hover:bg-gray-700/80 rounded-lg transition-all"
              >
                {showThinkTags ? (
                  <>
                    <EyeOff className="w-3 h-3 mr-1" />
                    Hide Think
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    Show Think
                  </>
                )}
              </Button>
            </div>
          )}
          
          {message.modelUsed && !isUser && (
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                {message.modelUsed}
              </span>
            </div>
          )}
        </div>
        <div className={`mt-2 text-xs text-gray-400 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {/* Avatar à droite pour l'utilisateur */}
      {isUser && (
        <div className="flex-shrink-0 w-9 h-9 bg-blue-200 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
      )}
    </div>
  );
};
