import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Container,
  Paper,
} from '@mui/material';
import { Refresh, Search } from '@mui/icons-material';
import { JobList } from '../components/JobList';
import { JobFilters } from '../components/JobFilters';
import { JobStats } from '../components/JobStats';
import { JobFilters as JobFiltersType } from '../types/job';
import { getJobs } from '../services/jobService';

export function JobsPage() {
  const [jobFilters, setJobFilters] = useState<JobFiltersType>({
    search: '',
    websiteId: '',
    isActive: true,
  });
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleJobFiltersChange = (filters: JobFiltersType) => {
    setJobFilters(filters);
  };

  const handleScanJobs = async () => {
    try {
      setScanning(true);
      setScanResult(null);
      const response = await fetch('http://localhost:3001/api/jobs/scan-jobs');
      const result = await response.json();
      setScanResult(result);
      window.location.reload();
    } catch (error) {
      console.error('Error scanning jobs:', error);
      setScanResult({ error: 'Failed to scan jobs' });
    } finally {
      setScanning(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant='h3'
              component='h1'
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Job Management
            </Typography>
            <Typography
              variant='h6'
              color='text.secondary'
              sx={{ maxWidth: '600px', lineHeight: 1.6 }}
            >
              View and manage scraped job data from your configured websites.
              Filter jobs by website, search terms, and status.
            </Typography>
          </Box>
          <Button
            variant='contained'
            size='large'
            startIcon={scanning ? <CircularProgress size={20} /> : <Search />}
            onClick={handleScanJobs}
            disabled={scanning}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(99, 102, 241, 0.5)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {scanning ? 'Scanning...' : 'Scan Jobs'}
          </Button>
        </Box>

        {scanResult && (
          <Alert
            severity={scanResult.error ? 'error' : 'success'}
            sx={{
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-message': {
                fontWeight: 500,
              },
            }}
          >
            {scanResult.error
              ? scanResult.error
              : scanResult.message || 'Jobs scanned successfully!'}
          </Alert>
        )}
      </Box>

      <JobStats />

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          mb: 3,
        }}
      >
        <JobFilters
          filters={jobFilters}
          onFiltersChange={handleJobFiltersChange}
        />
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <JobList
          filters={jobFilters}
          onRefresh={() => window.location.reload()}
        />
      </Paper>
    </Box>
  );
}
