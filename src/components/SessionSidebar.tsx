import React, { useEffect, useState } from 'react';
import { Plus, MessageSquare, Trash2, Moon, Sun, User, Settings, MoreVertical, Loader2, Check } from 'lucide-react';
import { ChatSession } from '../types/chat';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { useToast } from '../hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SessionSidebarProps {
  currentSessionId?: string;
  onSessionSelect?: (sessionId: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SessionSidebar: React.FC<SessionSidebarProps> = ({
  currentSessionId,
  onSessionSelect,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const { sessions, currentSession, createSession, switchSession, deleteSession } = useChat();
  const { toast } = useToast();
  const { user } = useUser();
  const navigate = useNavigate();
  const [localSessions, setLocalSessions] = useState<ChatSession[]>(sessions);
  const [localCurrentSessionId, setLocalCurrentSessionId] = useState<string | null>(currentSessionId);
  const [isCreating, setIsCreating] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Synchroniser les sessions locales avec les props
  useEffect(() => {
    setLocalSessions(sessions);
  }, [sessions, forceUpdate]);

  // Synchroniser la session courante
  useEffect(() => {
    if (currentSessionId !== localCurrentSessionId) {
      setIsSwitching(true);
      console.log('SessionSidebar: Switching from', localCurrentSessionId, 'to', currentSessionId);
      
      setLocalCurrentSessionId(currentSessionId);
      
      setTimeout(() => {
        setIsSwitching(false);
        setForceUpdate(prev => prev + 1);
      }, 200);
    } else {
      setLocalCurrentSessionId(currentSessionId);
    }
  }, [currentSessionId, localCurrentSessionId]);

  const handleCreateSession = async () => {
    setIsCreating(true);
    try {
      const newSessionId = await createSession();
      if (newSessionId) {
        toast({
          title: "New conversation created",
          description: "Your new chat session is ready!",
          duration: 2000,
        });
        
        // Mise à jour immédiate
        setLocalSessions(sessions);
        setLocalCurrentSessionId(newSessionId);
        setForceUpdate(prev => prev + 1);
        
        if (onSessionSelect) {
          onSessionSelect(newSessionId);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new conversation",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSessionSelect = async (sessionId: string) => {
    if (sessionId === localCurrentSessionId) return;
    
    setIsSwitching(true);
    try {
      switchSession(sessionId);
      setLocalCurrentSessionId(sessionId);
      
      toast({
        title: "Switched conversation",
        description: "You're now in a different chat session",
        duration: 1500,
      });
      
      if (onSessionSelect) {
        onSessionSelect(sessionId);
      }
      
      // Forcer la mise à jour
      setTimeout(() => {
        setForceUpdate(prev => prev + 1);
        setIsSwitching(false);
      }, 100);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to switch conversation",
        variant: "destructive",
      });
      setIsSwitching(false);
    }
  };

  const handleDeleteSession = async (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      deleteSession(sessionId);
      
      // Mise à jour immédiate
      setLocalSessions(sessions.filter(s => s.id !== sessionId));
      
      if (sessionId === localCurrentSessionId) {
        setLocalCurrentSessionId(null);
      }
      
      setForceUpdate(prev => prev + 1);
      
      toast({
        title: "Conversation deleted",
        description: "The chat session has been removed",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return new Date(date).toLocaleDateString();
    }
  };

  const truncateTitle = (title: string, maxLength: number = 25) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  // Debug: afficher les informations de session
  console.log('SessionSidebar render:', {
    sessionsCount: localSessions.length,
    currentSessionId: localCurrentSessionId,
    forceUpdate
  });

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
          onClick={handleCreateSession}
          disabled={isCreating}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isCreating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          New Chat
        </Button>
      </div>

      {/* Sessions */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {localSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chat sessions yet</p>
              <p className="text-xs mt-1">Send a message to create your first chat</p>
            </div>
          ) : (
            <div className="space-y-2">
              {localSessions.map((session) => {
                const isActive = session.id === localCurrentSessionId;
                const isCurrentlySwitching = isSwitching && isActive;
                
                return (
                  <div
                    key={`${session.id}-${forceUpdate}`}
                    className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      isActive 
                        ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 shadow-sm'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => handleSessionSelect(session.id)}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l-lg"></div>
                    )}
                    
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className={`w-4 h-4 ${
                            isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                          }`} />
                          <h3 className={`text-sm font-medium truncate ${
                            isActive ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                          }`}>
                            {truncateTitle(session.title)}
                          </h3>
                          {isCurrentlySwitching && (
                            <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                          )}
                          {isActive && !isCurrentlySwitching && (
                            <Check className="w-3 h-3 text-blue-600" />
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{session.messages.length} messages</span>
                          <span>{formatDate(session.updatedAt)}</span>
                        </div>
                        
                        {session.modelId && (
                          <div className="mt-1">
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                              {session.modelId}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => handleDeleteSession(session.id, e)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
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
                {localSessions.length} conversations
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
