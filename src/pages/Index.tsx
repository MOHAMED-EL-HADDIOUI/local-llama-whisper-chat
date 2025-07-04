import React, { useState } from 'react';
import { SessionSidebar } from '../components/SessionSidebar';
import { ChatInterface } from '../components/ChatInterface';
import { useChat } from '../hooks/useChat';
import { useDarkMode } from '../hooks/useDarkMode';
import { useUser } from '../hooks/useUser';
import { Menu, ChevronLeft } from 'lucide-react';

const Index = () => {
  const {
    sessions,
    currentSessionId,
    createSession,
    switchSession,
    deleteSession,
  } = useChat();

  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user } = useUser();

  // Sidebar state (hidden by default on mobile)
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);

  // Responsive handler
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setShowSidebar(false);
      else setShowSidebar(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Wrapper to close sidebar on mobile when switching session
  const handleSwitchSession = (sessionId: string) => {
    switchSession(sessionId);
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      {/* Sidebar toggle button (mobile/desktop) */}
      {!showSidebar && (
        <button
          className="absolute top-4 left-4 z-30 md:hidden bg-white dark:bg-gray-900 rounded-full p-2 shadow-md border border-gray-200 dark:border-gray-700"
          onClick={() => setShowSidebar(true)}
          aria-label="Show history"
        >
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
      )}
      {/* Sidebar (history) */}
      <div
        className={`fixed md:static z-20 inset-y-0 left-0 transition-transform duration-300 md:translate-x-0 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg`}
        style={{ minWidth: 0 }}
      >
        <div className="md:hidden flex justify-end p-2">
          <button
            className="bg-white dark:bg-gray-900 rounded-full p-2 shadow border border-gray-200 dark:border-gray-700"
            onClick={() => setShowSidebar(false)}
            aria-label="Hide history"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
        </div>
        <SessionSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onCreateSession={createSession}
          onSwitchSession={handleSwitchSession}
          onDeleteSession={deleteSession}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 shadow-inner min-h-0">
        <ChatInterface currentSessionId={currentSessionId} />
      </div>
    </div>
  );
};

export default Index;
