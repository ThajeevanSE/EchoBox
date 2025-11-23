export const lightTheme = {
  background: '#f8fafc',
  card: '#ffffff',
  text: '#0f172a',
  secondaryText: '#475569',
  accent: '#0284c7',
  border: '#e2e8f0',
  warning: '#f97316',
  success: '#22c55e'
};

export const darkTheme = {
  background: '#020617',
  card: '#0f172a',
  text: '#f8fafc',
  secondaryText: '#cbd5f5',
  accent: '#38bdf8',
  border: '#1e293b',
  warning: '#fb8a24',
  success: '#34d399'
};

export type ThemeMode = 'light' | 'dark';

export const getTheme = (mode: ThemeMode) => (mode === 'dark' ? darkTheme : lightTheme);
