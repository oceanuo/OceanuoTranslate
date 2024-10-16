"use client";

import { useEffect, useState } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  useEffect(() => {
    // Apply theme whenever it changes
    if (theme) {
      applyTheme(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const applyTheme = (newTheme: string) => {
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (theme === null) {
    // Return null or a loading indicator while the theme is being determined
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {children}
    </div>
  );
}
