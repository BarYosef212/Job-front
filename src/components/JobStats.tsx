import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  DataObject,
  Language,
  CheckCircle,
  TrendingUp,
  Error,
} from '@mui/icons-material';
import { JobStats as JobStatsType } from '../types/job';
import { getStats, getJobs } from '../services/jobService';
import { getWebsites } from '../services/websiteService';

export function JobStats() {
  const [stats, setStats] = useState<JobStatsType | null>(null);
  const [websites, setWebsites] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, websitesData, jobsData] = await Promise.all([
          getStats().catch(() => null),
          getWebsites().catch(() => []),
          getJobs().catch(() => []),
        ]);

        setStats(statsData);
        setWebsites(Array.isArray(websitesData) ? websitesData : []);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total jobs from the jobs data
  const totalJobs = jobs.reduce((sum, job) => sum + (job.data?.length || 0), 0);

  // Calculate scanned websites from jobs data
  const scannedWebsites = jobs.length;

  // Calculate websites with errors
  const websitesWithErrors = websites.filter(
    (website) => website.lastError,
  ).length;

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='200px'
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Jobs',
      value: totalJobs.toLocaleString(),
      icon: <DataObject />,
      color: 'primary' as const,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      description: 'Job positions found',
    },
    {
      title: 'Total Websites',
      value:
        stats?.totalWebsites?.toLocaleString() || websites.length.toString(),
      icon: <Language />,
      color: 'secondary' as const,
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      description: 'Configured websites',
    },
    {
      title: 'Active Websites',
      value:
        stats?.activeWebsites?.toLocaleString() ||
        websites.filter((w) => w.isActive).length.toString(),
      icon: <CheckCircle />,
      color: 'success' as const,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      description: 'Currently monitoring',
    },
    {
      title: 'Websites with Errors',
      value: websitesWithErrors.toString(),
      icon: <Error />,
      color: 'error' as const,
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      description: 'Need attention',
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant='h5' sx={{ fontWeight: 600 }}>
          Statistics Overview
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow:
                    '0 8px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: stat.gradient,
                }}
              />
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      background: stat.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      mr: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant='h3'
                      component='div'
                      sx={{
                        fontWeight: 700,
                        background: stat.gradient,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        lineHeight: 1,
                        mb: 0.5,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant='h6'
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 0.5,
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{ fontSize: '0.875rem' }}
                    >
                      {stat.description}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label={`${totalJobs} total positions from ${scannedWebsites} websites`}
          color='primary'
          variant='outlined'
          sx={{
            fontWeight: 500,
            '& .MuiChip-label': {
              fontSize: '0.875rem',
            },
          }}
        />
        {stats?.totalJobDocuments && stats.totalJobDocuments > 0 && (
          <Chip
            label={`${stats.totalJobDocuments} scan results`}
            color='info'
            variant='outlined'
            sx={{
              fontWeight: 500,
              '& .MuiChip-label': {
                fontSize: '0.875rem',
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
}
