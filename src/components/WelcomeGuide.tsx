import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Bot, 
  Settings, 
  Download, 
  Upload, 
  Moon, 
  Sun,
  ChevronRight,
  X,
  Play,
  Zap,
  Shield,
  Save,
  Users,
  FileText
} from 'lucide-react';

interface WelcomeGuideProps {
  onClose: () => void;
  onStartChat: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const WelcomeGuide: React.FC<WelcomeGuideProps> = ({
  onClose,
  onStartChat,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to AI Chat",
      description: "Your personal AI assistant powered by local models",
      icon: <MessageSquare className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Local AI Chat Assistant
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Chat with AI models running locally on your computer. 
              No internet required, complete privacy, and full control.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Private</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">Your data stays on your device</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Zap className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900 dark:text-green-100">Fast</h3>
              <p className="text-sm text-green-700 dark:text-green-300">No network delays</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Settings className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">Customizable</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">Choose your AI model</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Getting Started",
      description: "Quick setup guide for your first chat",
      icon: <Play className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Prerequisites
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Install Ollama</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download and install Ollama from <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ollama.ai</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Download a Model</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Run: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">ollama pull llama2</code>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Start Chatting</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Select your model and start your first conversation!
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-600 dark:text-yellow-400 text-sm font-semibold">!</span>
              </div>
              <div>
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                  Important Note
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Make sure Ollama is running in the background before using this app. 
                  You can start it by running <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">ollama serve</code> in your terminal.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Features Overview",
      description: "Discover what you can do with this app",
      icon: <FileText className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-base">Multiple Conversations</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create and manage multiple chat sessions. Each conversation is saved automatically.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-base">Model Selection</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose from different AI models. Switch between them for different tasks.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Save className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-base">Auto-Save</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All your conversations are automatically saved to your browser's local storage.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-base">Export/Import</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Export your conversations as JSON files or import them from other sessions.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">💡</span>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Pro Tips
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Use the dark mode toggle for better eye comfort</li>
                  <li>• Create separate conversations for different topics</li>
                  <li>• Export important conversations as backup</li>
                  <li>• Try different models for various tasks</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStartChat();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {steps[currentStep].icon}
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {steps[currentStep].title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {steps[currentStep].description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={onToggleDarkMode}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {steps[currentStep].content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <Button
                onClick={prevStep}
                variant="outline"
              >
                Previous
              </Button>
            )}
            
            <Button
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Chatting
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 