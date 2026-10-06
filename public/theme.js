(() => {
  'use strict';

  const STORAGE_KEY = 'theme';

  // sessionStorage can throw (blocked storage, some private modes); the toggle still works without it.
  const readChoice = () => {
    try {
      return sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  };

  const saveChoice = (value) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Not saved; the choice just lasts until the next page load.
    }
  };

  const prefersDark = () =>
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  // This file is loaded at the top of <body>, so the class is set before the page paints.
  // A choice made this session wins; otherwise follow the system setting.
  const saved = readChoice();
  document.body.classList.toggle('dark', saved ? saved === 'dark' : prefersDark());

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('theme-toggle');
    if (!button) return;

    const updateLabel = () => {
      button.textContent = document.body.classList.contains('dark') ? 'Light mode' : 'Dark mode';
    };

    updateLabel();
    button.addEventListener('click', () => {
      const dark = document.body.classList.toggle('dark');
      saveChoice(dark ? 'dark' : 'light');
      updateLabel();
    });
  });
})();
