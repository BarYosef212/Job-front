export interface SettingsData {
  keywords: string[];
  scrapingInterval: number; // in minutes
  maxJobsPerWebsite: number;
  enableNotifications: boolean;
}

const defaultSettings: SettingsData = {
  keywords: [
    'student',
    'intern',
    'internship',
    'entry level',
    'junior',
    'graduate',
    'trainee',
    'part time',
    'remote',
    'work from home',
  ],
  scrapingInterval: 60, // 1 hour
  maxJobsPerWebsite: 50,
  enableNotifications: true,
};

const STORAGE_KEY = 'jobScannerSettings';

export const getSettings = (): SettingsData => {
  try {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      return { ...defaultSettings, ...JSON.parse(savedSettings) };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return defaultSettings;
};

export const saveSettings = (settings: SettingsData): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

export const resetSettings = (): SettingsData => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return defaultSettings;
  } catch (error) {
    console.error('Error resetting settings:', error);
    return defaultSettings;
  }
};

export const getKeywords = (): string[] => {
  return getSettings().keywords;
};

export const getScrapingInterval = (): number => {
  return getSettings().scrapingInterval;
};

export const getMaxJobsPerWebsite = (): number => {
  return getSettings().maxJobsPerWebsite;
};

export const isNotificationsEnabled = (): boolean => {
  return getSettings().enableNotifications;
};
