export interface Job {
  _id: string;
  data: string;
  websiteId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Website {
  _id: string;
  name: string;
  url: string;
  isActive: boolean;
  keywords?: string[];
  lastScanned?: string;
  lastError?: string;
  lastErrorAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  search: string;
  websiteId: string;
  isActive: boolean | undefined;
}

export interface WebsiteFilters {
  search: string;
  isActive: boolean | undefined;
}

export interface JobStats {
  totalJobs: number;
  totalWebsites: number;
  activeWebsites: number;
  recentJobs: number;
  scannedWebsites?: number;
  totalJobDocuments?: number;
}

export interface JobPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface WebsitePagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}