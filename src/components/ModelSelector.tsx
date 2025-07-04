
import React from 'react';
import { ChevronDown, Cpu } from 'lucide-react';
import { OllamaModel } from '../types/chat';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ModelSelectorProps {
  models: OllamaModel[];
  selectedModel: string | null;
  onSelectModel: (model: string) => void;
  isLoading?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onSelectModel,
  isLoading = false,
}) => {
  const formatModelSize = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)}GB`;
  };

  return (
    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            AI Chat Assistant
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by Ollama
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Model:
          </span>
          
          <Select
            value={selectedModel || ''}
            onValueChange={onSelectModel}
            disabled={isLoading || models.length === 0}
          >
            <SelectTrigger className="w-64 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
              <SelectValue 
                placeholder={isLoading ? 'Loading models...' : 'Select a model'} 
              />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl">
              {models.map((model) => (
                <SelectItem 
                  key={model.name} 
                  value={model.name}
                  className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <div className="flex items-center justify-between w-full py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">{model.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {formatModelSize(model.size)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
