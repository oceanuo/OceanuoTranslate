"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LanguageSelector from '../components/LanguageSelector';
import openAIModels from '../Resources/model/openai.json';
import groqModels from '../Resources/model/groq.json';
import { useSettings } from '../hooks/useSettings';
import VisibilityIcon from '../../assets/Visibility.svg';
import VisibilityOffIcon from '../../assets/VisibilityOff.svg';
import { defaultSettings } from '../hooks/useSettings';

export default function Settings() {
  const router = useRouter();
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [models, setModels] = useState(openAIModels);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (localSettings.modelProvider === 'OpenAI') {
      setModels(openAIModels);
      setLocalSettings(prev => ({ 
        ...prev, 
        apiHost: 'https://api.openai.com/v1',
        model: openAIModels.includes(prev.model) ? prev.model : 'gpt-4o-mini'
      }));
    } else if (localSettings.modelProvider === 'Groq') {
      setModels(groqModels);
      setLocalSettings(prev => ({ 
        ...prev, 
        apiHost: 'https://api.groq.com/openai/v1',
        model: groqModels.includes(prev.model) ? prev.model : groqModels[0]
      }));
    } else if (localSettings.modelProvider === 'Deepl') {
      setModels([]);
      setLocalSettings(prev => ({
        ...prev,
        apiHost: '',
        model: '',
        apiKey: ''
      }));
    }
  }, [localSettings.modelProvider]);

  const handleInputChange = (key: string, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    router.push('/');
  };

  const handleRestoreDefaults = () => {
    setLocalSettings(defaultSettings);
    setModels(openAIModels);
  };

  const formatLabel = (key: string) => {
    if (key === 'apiKey') return 'API Key';
    if (key === 'apiHost') return 'API Host';
    return key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase());
  };

  const inputClasses = "w-full p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Settings</h1>
      
      <div className="space-y-6">
        {Object.entries(localSettings).map(([key, value]) => {
          if (localSettings.modelProvider === 'Deepl' && ['apiKey', 'apiHost', 'model', 'temperature', 'topP', 'presencePenalty', 'frequencyPenalty', 'systemPrompt'].includes(key)) {
            return null;
          }
          return (
            <div key={key} className="flex flex-col">
              <label className="mb-2 font-semibold">
                {key === 'modelProvider' ? 'Translation Service:' : formatLabel(key) + ':'}
              </label>
              {key === 'theme' || key === 'modelProvider' || key === 'model' ? (
                <LanguageSelector
                  value={value}
                  onChange={(newValue) => handleInputChange(key, newValue)}
                  placeholder={`Select ${key === 'modelProvider' ? 'Translation Service' : formatLabel(key)}`}
                  options={key === 'theme' ? ['light', 'dark', 'system'] : 
                           key === 'modelProvider' ? ['OpenAI', 'Groq', 'Deepl'] : 
                           models}
                  searchPlaceholder={`Search ${key === 'modelProvider' ? 'Translation Service' : formatLabel(key)}`}
                />
              ) : key === 'systemPrompt' ? (
                <textarea
                  value={value}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  rows={3}
                  className={inputClasses}
                />
              ) : key === 'apiKey' ? (
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={value}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className={inputClasses + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showApiKey ? (
                      <VisibilityOffIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <VisibilityIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              ) : (
                <input
                  type={['temperature', 'topP', 'presencePenalty', 'frequencyPenalty'].includes(key) ? 'number' : 'text'}
                  value={value}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  min={['temperature', 'topP'].includes(key) ? 0 : -2}
                  max={['temperature', 'topP'].includes(key) ? 1 : 2}
                  step={0.1}
                  className={inputClasses}
                />
              )}
              {key === 'apiHost' && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {value}/chat/completions
                </p>
              )}
            </div>
          );
        })}

        <div className="flex justify-between mt-8 space-x-4">
          <button 
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            Save
          </button>
          <button 
            onClick={() => router.push('/')}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
          <button 
            onClick={handleRestoreDefaults}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
          >
            Restore Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
