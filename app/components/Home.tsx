"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import TranslationBox from '@/app/components/TranslationBox';
import languages from '../Resources/language/language.json';
import TranslateButton from './TranslateButton';
import { useSettings } from '../hooks/useSettings';
import deepLLanguages from '../Resources/language/deepl_language.json';
import { useMediaQuery } from 'react-responsive';

export default function HomeClient() {
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { settings } = useSettings();

  const isMobile = useMediaQuery({ maxWidth: 798 });

  const handleSwapLanguages = () => {
    if (sourceLanguage !== 'auto' && targetLanguage !== 'auto') {
      setSourceLanguage(targetLanguage);
      setTargetLanguage(sourceLanguage);
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
  };

  const translate = async () => {
    if (isTranslating) {
      abortControllerRef.current?.abort();
      setIsTranslating(false);
      return;
    }

    if (!sourceText) return;

    setIsTranslating(true);
    setTranslatedText('');

    try {
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      if (settings.modelProvider === 'Deepl') {
        const response = await fetch(process.env.NEXT_PUBLIC_DEEPL_API_URL!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: sourceText,
            source_lang: sourceLanguage === 'auto' ? 'auto' : deepLLanguages.find(lang => lang.name === sourceLanguage)?.code || 'EN',
            target_lang: deepLLanguages.find(lang => lang.name === targetLanguage)?.code || 'EN'
          }),
          signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setTranslatedText(result.data);
      } else {
        // OpenAI/Groq translation logic
        const userPrompt = sourceLanguage === 'auto'
          ? `Translate the following source text to ${targetLanguage}. Output translation directly without any additional text.\nSource Text: ${sourceText}\n\nTranslated Text:`
          : `Translate the following source text from ${sourceLanguage} to ${targetLanguage}. Output translation directly without any additional text.\nSource Text: ${sourceText}\n\nTranslated Text:`;

        const response = await fetch(settings.apiHost + '/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.apiKey}`
          },
          body: JSON.stringify({
            model: settings.model,
            messages: [
              { role: "system", content: settings.systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: parseFloat(settings.temperature),
            top_p: parseFloat(settings.topP),
            presence_penalty: parseFloat(settings.presencePenalty),
            frequency_penalty: parseFloat(settings.frequencyPenalty),
            stream: true
          }),
          signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data:')) {
              const jsonData = line.slice(5).trim();
              if (jsonData === '[DONE]') break;
              try {
                const parsedData = JSON.parse(jsonData);
                const content = parsedData.choices[0]?.delta?.content || '';
                accumulatedText += content;
                setTranslatedText(accumulatedText);
              } catch (error) {
                console.error('Error parsing JSON:', error);
              }
            }
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Translation aborted');
      } else {
        console.error('Translation error:', error);
        setTranslatedText('An error occurred during translation.');
      }
    } finally {
      setIsTranslating(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-8 text-center text-gray-800 dark:text-gray-100">OceanuoTranslate</h1>
      
      {isMobile ? (
        // Mobile UI
        <div className="flex flex-col h-[calc(100vh-6rem)]">
          <div className="flex-grow flex flex-col space-y-4 mb-4">
            <TranslationBox
              value={sourceText}
              onChange={setSourceText}
              placeholder="Enter text to translate"
              readOnly={false}
            />
            <TranslationBox
              value={translatedText + (isTranslating ? '...' : '')}
              onChange={setTranslatedText}
              placeholder="Translation will appear here"
              readOnly={true}
            />
          </div>
          
          <div className="mt-auto space-y-3">
            <TranslateButton 
              onClick={translate} 
              isTranslating={isTranslating} 
              isMobile={true}
            />
            
            <div className="flex justify-between items-center">
              <LanguageSelector
                value={sourceLanguage}
                onChange={setSourceLanguage}
                placeholder="Source"
                options={settings.modelProvider === 'Deepl' ? deepLLanguages.map(lang => lang.name) : languages}
                autoDetect={true}
                searchPlaceholder="Search source language"
              />
              <button 
                onClick={handleSwapLanguages}
                disabled={sourceLanguage === 'auto' || targetLanguage === 'auto'}
                className={`mx-2 p-2 rounded-full ${sourceLanguage === 'auto' || targetLanguage === 'auto' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" className={`fill-current ${sourceLanguage === 'auto' || targetLanguage === 'auto' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>
                  <path d="M280-160 80-360l200-200 56 57-103 103h287v80H233l103 103-56 57Zm400-240-56-57 103-103H440v-80h287L624-743l56-57 200 200-200 200Z"/>
                </svg>
              </button>
              <LanguageSelector
                value={targetLanguage}
                onChange={setTargetLanguage}
                placeholder="Target"
                options={settings.modelProvider === 'Deepl' ? deepLLanguages.map(lang => lang.name) : languages}
                searchPlaceholder="Search target language"
              />
            </div>
            
            <Link href="/settings" className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-center text-base font-medium transition duration-300">
              Settings
            </Link>
          </div>
        </div>
      ) : (
        // Desktop UI (existing layout)
        <>
          <Link href="/settings" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mb-4 text-center transition duration-300">
            Settings
          </Link>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              <LanguageSelector
                value={sourceLanguage}
                onChange={setSourceLanguage}
                placeholder="Select source language"
                options={settings.modelProvider === 'Deepl' ? deepLLanguages.map(lang => lang.name) : languages}
                autoDetect={true}
                searchPlaceholder="Search source language"
              />
            </div>
            
            <button 
              onClick={handleSwapLanguages}
              disabled={sourceLanguage === 'auto' || targetLanguage === 'auto'}
              className={`mx-2 p-2 rounded-full ${sourceLanguage === 'auto' || targetLanguage === 'auto' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" className={`fill-current ${sourceLanguage === 'auto' || targetLanguage === 'auto' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>
                <path d="M280-160 80-360l200-200 56 57-103 103h287v80H233l103 103-56 57Zm400-240-56-57 103-103H440v-80h287L624-743l56-57 200 200-200 200Z"/>
              </svg>
            </button>
            
            <div className="flex-1">
              <LanguageSelector
                value={targetLanguage}
                onChange={setTargetLanguage}
                placeholder="Select target language"
                options={settings.modelProvider === 'Deepl' ? deepLLanguages.map(lang => lang.name) : languages}
                searchPlaceholder="Search target language"
              />
            </div>
          </div>
          
          <div className="flex flex-1 gap-1">
            <div className="flex-1">
              <TranslationBox
                value={sourceText}
                onChange={setSourceText}
                placeholder="Enter text to translate"
                readOnly={false}
              />
            </div>
            
            <div className="flex flex-col justify-center">
              <TranslateButton 
                onClick={translate} 
                isTranslating={isTranslating} 
                isMobile={false}
              />
            </div>
            
            <div className="flex-1">
              <TranslationBox
                value={translatedText + (isTranslating ? '...' : '')}
                onChange={setTranslatedText}
                placeholder="Translation will appear here"
                readOnly={true}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
