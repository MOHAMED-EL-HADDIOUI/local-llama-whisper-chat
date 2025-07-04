import React from 'react';
import { Plus, MessageSquare, Trash2, Moon, Sun, User, Settings } from 'lucide-react';
import { ChatSession } from '../types/chat';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';

interface SessionSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onCreateSession: () => void;
  onSwitchSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SessionSidebar: React.FC<SessionSidebarProps> = ({
  sessions,
  currentSessionId,
  onCreateSession,
  onSwitchSession,
  onDeleteSession,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            AI Chat
          </h1>
          <Button
            onClick={onToggleDarkMode}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </Button>
        </div>
        
        <Button
          onClick={onCreateSession}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Sessions */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chat sessions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group border ${
                    currentSessionId === session.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 shadow-sm'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => onSwitchSession(session.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate leading-tight">
                        {session.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {session.messages.length} messages
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(session.updatedAt)}
                        </span>
                      </div>
                      {/* Model name */}
                      {session.modelId && (
                        <div className="mt-1">
                          <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            {session.modelId}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto w-auto hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {sessions.length} conversations
              </p>
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button
              onClick={() => navigate('/profile')}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Profile"
            >
              <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </Button>
            <Button
              onClick={() => navigate('/settings')}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
