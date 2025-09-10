import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface GeneralSettings {
  _id?: string;
  keywords: string[];
  interval: number; // in minutes
  createdAt?: string;
  updatedAt?: string;
}

export const getGeneralSettings = async (): Promise<GeneralSettings | null> => {
  try {
    const response = await api.get('/general');
    return response.data;
  } catch (error) {
    console.error('Error fetching general settings:', error);
    return null;
  }
};

export const updateGeneralSettings = async (settings: {
  keywords: string[];
  interval: number;
}): Promise<GeneralSettings> => {
  try {
    const response = await api.put('/general', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating general settings:', error);
    throw error;
  }
};
