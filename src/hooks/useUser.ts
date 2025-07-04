import { useState, useEffect, useCallback } from 'react';
import { UserProfile, UserPreferences, ExportData } from '../types/user';
import { ChatSession } from '../types/chat';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en',
  autoSave: true,
  maxConversations: 50,
  exportFormat: 'json',
};

const DEFAULT_USER: UserProfile = {
  id: 'default-user',
  name: 'User',
  preferences: DEFAULT_PREFERENCES,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useUser = () => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('userProfile');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser({
        ...parsedUser,
        createdAt: new Date(parsedUser.createdAt),
        updatedAt: new Date(parsedUser.updatedAt),
      });
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage
  const saveUser = useCallback((userData: UserProfile) => {
    localStorage.setItem('userProfile', JSON.stringify(userData));
  }, []);

  // Update user profile
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };
    setUser(updatedUser);
    saveUser(updatedUser);
  }, [user, saveUser]);

  // Update user preferences
  const updatePreferences = useCallback((preferences: Partial<UserPreferences>) => {
    const updatedPreferences = {
      ...user.preferences,
      ...preferences,
    };
    updateProfile({ preferences: updatedPreferences });
  }, [user.preferences, updateProfile]);

  // Export all data
  const exportData = useCallback((sessions: ChatSession[]) => {
    const exportData: ExportData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      conversations: sessions.map(session => ({
        id: session.id,
        title: session.title,
        modelId: session.modelId || 'unknown',
        messages: session.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.toISOString(),
          modelUsed: msg.modelUsed,
        })),
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
      })),
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [user]);

  // Import data
  const importData = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data: ExportData = JSON.parse(e.target?.result as string);
          
          // Update user profile
          if (data.user) {
            const importedUser = {
              ...data.user,
              createdAt: new Date(data.user.createdAt),
              updatedAt: new Date(data.user.updatedAt),
            };
            setUser(importedUser);
            saveUser(importedUser);
          }

          // Import conversations
          if (data.conversations) {
            const importedSessions: ChatSession[] = data.conversations.map(conv => ({
              id: conv.id,
              title: conv.title,
              modelId: conv.modelId,
              messages: conv.messages.map(msg => ({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                content: msg.content,
                role: msg.role,
                timestamp: new Date(msg.timestamp),
                modelUsed: msg.modelUsed,
              })),
              createdAt: new Date(conv.createdAt),
              updatedAt: new Date(conv.updatedAt),
            }));

            localStorage.setItem('chatSessions', JSON.stringify(importedSessions));
          }

          resolve(true);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, [saveUser]);

  return {
    user,
    isLoading,
    updateProfile,
    updatePreferences,
    exportData,
    importData,
  };
}; 