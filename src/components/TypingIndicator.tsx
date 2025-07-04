
import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-4 justify-start">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
        <Bot className="w-5 h-5 text-white" />
      </div>
      
      <div className="bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 px-6 py-4 rounded-2xl rounded-bl-lg shadow-lg backdrop-blur-sm max-w-[80%]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">AI is thinking...</span>
        </div>
      </div>
    </div>
  );
};
