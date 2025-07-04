import React, { useState, useRef } from 'react';
import { useUser } from '../hooks/useUser';
import { useChat } from '../hooks/useChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Settings as SettingsIcon, Download, Upload, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, updatePreferences, importData, exportData } = useUser();
  const { sessions } = useChat();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isImporting, setIsImporting] = useState(false);

  const handleThemeChange = (theme: string) => {
    updatePreferences({ theme: theme as 'light' | 'dark' | 'auto' });
    toast({
      title: "Theme Updated",
      description: `Theme changed to ${theme}`,
    });
  };

  const handleLanguageChange = (language: string) => {
    updatePreferences({ language });
    toast({
      title: "Language Updated",
      description: `Language changed to ${language}`,
    });
  };

  const handleAutoSaveChange = (enabled: boolean) => {
    updatePreferences({ autoSave: enabled });
    toast({
      title: "Auto Save Updated",
      description: `Auto save ${enabled ? 'enabled' : 'disabled'}`,
    });
  };



  const handleMaxConversationsChange = (value: string) => {
    const max = parseInt(value);
    if (!isNaN(max) && max > 0) {
      updatePreferences({ maxConversations: max });
      toast({
        title: "Max Conversations Updated",
        description: `Maximum conversations set to ${max}`,
      });
    }
  };

  const handleExportFormatChange = (format: string) => {
    updatePreferences({ exportFormat: format as 'json' | 'txt' | 'md' });
    toast({
      title: "Export Format Updated",
      description: `Export format changed to ${format.toUpperCase()}`,
    });
  };

  const handleExportData = () => {
    try {
      exportData(sessions);
      toast({
        title: "Export Successful",
        description: "Your data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importData(file);
      toast({
        title: "Import Successful",
        description: "Your data has been imported successfully. Please refresh the page.",
      });
      // Reload the page to reflect imported data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import data. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      toast({
        title: "Data Cleared",
        description: "All data has been cleared. The page will reload.",
      });
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Chat
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <SettingsIcon className="h-6 w-6" />
            Settings
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={user.preferences.theme} onValueChange={handleThemeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={user.preferences.language} onValueChange={handleLanguageChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Chat Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Chat Settings</CardTitle>
              <CardDescription>
                Configure chat behavior and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Save Conversations</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save conversations to local storage
                  </p>
                </div>
                <Switch
                  checked={user.preferences.autoSave}
                  onCheckedChange={handleAutoSaveChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Think Tags Control</Label>
                  <p className="text-sm text-muted-foreground">
                    Individual toggle buttons for each message with think tags
                  </p>
                </div>
                <div className="text-xs text-muted-foreground px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                  Per Message
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxConversations">Maximum Conversations</Label>
                <Input
                  id="maxConversations"
                  type="number"
                  value={user.preferences.maxConversations}
                  onChange={(e) => handleMaxConversationsChange(e.target.value)}
                  min="1"
                  max="1000"
                />
                <p className="text-sm text-muted-foreground">
                  Maximum number of conversations to keep in storage
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export, import, and manage your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exportFormat">Export Format</Label>
                <Select value={user.preferences.exportFormat} onValueChange={handleExportFormatChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="txt">Plain Text</SelectItem>
                    <SelectItem value="md">Markdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleExportData} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {isImporting ? 'Importing...' : 'Import Data'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Danger Zone</Label>
                <Button
                  variant="destructive"
                  onClick={handleClearData}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All Data
                </Button>
                <p className="text-sm text-muted-foreground">
                  This will permanently delete all conversations and settings
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>
                Overview of your chat activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{sessions.length}</p>
                  <p className="text-sm text-muted-foreground">Total Conversations</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {sessions.reduce((total, session) => total + session.messages.length, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Messages</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Storage Usage</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((sessions.length / user.preferences.maxConversations) * 100, 100)}%`
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {sessions.length} / {user.preferences.maxConversations} conversations
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings; 