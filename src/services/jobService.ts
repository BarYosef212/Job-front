import axios from 'axios';
import { Job, JobFilters } from '../types/job';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple job service functions
export const getJobs = async (filters?: JobFilters) => {
  try {
    const response = await api.get('/jobs');
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }


};

export const getJob = async (id: string) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

export const createJob = async (data: {
  data: string;
  websiteId: string;
}) => {
  const response = await api.post('/jobs', data);
  return response.data;
};

export const updateJob = async (id: string, data: Partial<Job>) => {
  const response = await api.put(`/jobs/${id}`, data);
  return response.data;
};

export const deleteJob = async (id: string) => {
  await api.delete(`/jobs/${id}`);
};

export const getStats = async () => {
  const response = await api.get('/jobs/stats/overview');
  return response.data;
};

export const getScanningStatus = async (): Promise<{ isScanning: boolean }> => {
  const response = await api.get('/jobs/scanning-status');
  return response.data;
};

// Legacy object-based service (for backward compatibility)
export const jobService = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getStats,
  getScanningStatus,
};