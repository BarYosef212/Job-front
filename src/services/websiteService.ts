import axios from 'axios';
import { Website, WebsiteFilters } from '../types/job';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple website service functions
export const getWebsites = async (filters?: WebsiteFilters) => {
  const params = new URLSearchParams();

  if (filters?.search) params.append('search', filters.search);
  if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());

  const response = await api.get(`/websites?${params.toString()}`);
  return response.data;
};

// Get all websites without any filters (for frontend filtering)
export const getAllWebsites = async () => {
  const response = await api.get('/websites');
  return response.data;
};

export const getWebsite = async (id: string) => {
  const response = await api.get(`/websites/${id}`);
  return response.data;
};

export const createWebsite = async (data: {
  name: string;
  url: string;
  keywords?: string[];
  isActive?: boolean;
}) => {
  const response = await api.post('/websites', data);
  return response.data;
};

export const updateWebsite = async (id: string, data: Partial<Website>) => {
  const response = await api.put(`/websites/${id}`, data);
  return response.data;
};

export const deleteWebsite = async (id: string) => {
  await api.delete(`/websites/${id}`);
};

export const toggleWebsiteStatus = async (id: string) => {
  const response = await api.patch(`/websites/${id}/toggle`);
  return response.data;
};

export const clearWebsiteErrors = async (id: string) => {
  const response = await api.patch(`/websites/${id}/clear-errors`);
  return response.data;
};

// Legacy object-based service (for backward compatibility)
export const websiteService = {
  getWebsites,
  getAllWebsites,
  getWebsite,
  createWebsite,
  updateWebsite,
  deleteWebsite,
  toggleWebsiteStatus,
  clearWebsiteErrors,
};