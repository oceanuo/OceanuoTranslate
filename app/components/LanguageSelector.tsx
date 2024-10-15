import { useState, useRef, useEffect } from 'react';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
  autoDetect?: boolean;
  searchPlaceholder?: string;
}

export default function LanguageSelector({ 
  value, 
  onChange, 
  placeholder, 
  options, 
  autoDetect = false,
  searchPlaceholder = "Search"
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleDropdown = () => setIsOpen(!isOpen);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const displayValue = value === 'auto' ? 'Automatic detection' : value;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 cursor-pointer flex justify-between items-center"
        onClick={handleToggleDropdown}
      >
        <span>{displayValue || placeholder}</span>
        <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg overflow-hidden">
          <div className="p-2">
            <input
              ref={inputRef}
              type="text"
              className="w-full p-2 border rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <ul className="max-h-60 overflow-auto py-1">
            {autoDetect && (
              <li
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                onClick={() => {
                  onChange('auto');
                  setIsOpen(false);
                  setSearch('');
                }}
              >
                Automatic detection
              </li>
            )}
            {filteredOptions
              .filter(option => option !== 'auto') // Remove 'auto' from the main list
              .map((option, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearch('');
                  }}
                >
                  {option}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
