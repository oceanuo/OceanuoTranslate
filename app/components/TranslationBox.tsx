import { useState } from 'react';
import CopyIcon from '../../assets/copy.svg';
import ClearIcon from '../../assets/clear.svg';
import CheckmarkIcon from '../../assets/checkmark.svg';

interface TranslationBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  readOnly: boolean;
}

export default function TranslationBox({ value, onChange, placeholder, readOnly }: TranslationBoxProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleClear = () => {
    onChange('');
    setClearSuccess(true);
    setTimeout(() => setClearSuccess(false), 2000);
  };

  return (
    <div className="relative w-full h-full flex-grow">
      <textarea 
        className="w-full h-full p-4 pb-12 border rounded-md resize-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
      />
      <div className="absolute bottom-3 right-3 flex space-x-2">
        <button
          onClick={handleCopy}
          className="p-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Copy"
        >
          {copySuccess ? <CheckmarkIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
        </button>
        <button
          onClick={handleClear}
          className="p-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Clear"
        >
          {clearSuccess ? <CheckmarkIcon className="w-5 h-5" /> : <ClearIcon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
