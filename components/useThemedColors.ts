import { useColorScheme } from 'react-native';

export function useThemedColors() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    text: isDark ? '#FFFFFF' : '#000000',
    background: isDark ? '#000000' : '#FFFFFF',
    border: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(128, 128, 128, 0.3)',
    placeholder: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(128, 128, 128, 0.5)',
    button: isDark ? '#FFFFFF' : '#000000',
    buttonText: isDark ? '#000000' : '#FFFFFF',
    buttonBackground: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    textSecondary: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    accent: isDark ? '#3b82f6' : '#2563eb',
    selected: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  };
}