import { useState, useEffect } from 'react';
import deepLLanguages from '../Resources/language/deepl_language.json';

export const defaultSettings = {
  theme: 'system',
  modelProvider: 'OpenAI',
  apiKey: '',
  apiHost: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  temperature: '0',
  topP: '0',
  presencePenalty: '0',
  frequencyPenalty: '0',
  systemPrompt: 'You are a professional, authentic machine translation engine.',
};

export const useSettings = () => {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));
  };

  return { settings, updateSettings, deepLLanguages };
};
