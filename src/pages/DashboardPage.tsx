import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Container,
} from '@mui/material';
import {
  Language,
  Work,
  TrendingUp,
  Refresh,
  Add,
  Search,
  Settings,
} from '@mui/icons-material';
import { JobStats } from '../components/JobStats';

interface DashboardPageProps {
  onNavigate?: (tabIndex: number) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'websites':
        onNavigate?.(2); // Websites tab
        break;
      case 'jobs':
        onNavigate?.(1); // Jobs tab
        break;
      case 'settings':
        onNavigate?.(3); // Settings tab
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4 }}>
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
          Welcome to Job Scanner
        </Typography>
        <Typography
          variant='h6'
          color='text.secondary'
          sx={{ maxWidth: '600px', lineHeight: 1.6 }}
        >
          Monitor and manage job opportunities across multiple websites with our
          intelligent scraping system.
        </Typography>
      </Box>

      <JobStats />

      <Box sx={{ mt: 6 }}>
        <Typography variant='h4' gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow:
                    '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
                },
              }}
              onClick={() => handleQuickAction('websites')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      mr: 2,
                    }}
                  >
                    <Language fontSize='large' />
                  </Box>
                  <Typography variant='h6' sx={{ fontWeight: 600 }}>
                    Manage Websites
                  </Typography>
                </Box>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  paragraph
                  sx={{ mb: 3, lineHeight: 1.6 }}
                >
                  Add, edit, or remove websites for job scraping. Configure
                  keywords and monitoring settings.
                </Typography>
                <Button
                  variant='contained'
                  fullWidth
                  startIcon={<Add />}
                  onClick={() => handleQuickAction('websites')}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1.5,
                  }}
                >
                  Go to Websites
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow:
                    '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
                },
              }}
              onClick={() => handleQuickAction('jobs')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: 'secondary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      mr: 2,
                    }}
                  >
                    <Work fontSize='large' />
                  </Box>
                  <Typography variant='h6' sx={{ fontWeight: 600 }}>
                    View Jobs
                  </Typography>
                </Box>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  paragraph
                  sx={{ mb: 3, lineHeight: 1.6 }}
                >
                  Browse and filter scraped job data. Search through thousands
                  of job opportunities.
                </Typography>
                <Button
                  variant='contained'
                  fullWidth
                  startIcon={<Search />}
                  onClick={() => handleQuickAction('jobs')}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1.5,
                    bgcolor: 'secondary.main',
                    '&:hover': {
                      bgcolor: 'secondary.dark',
                    },
                  }}
                >
                  Go to Jobs
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow:
                    '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
                },
              }}
              onClick={() => handleQuickAction('settings')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: 'success.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      mr: 2,
                    }}
                  >
                    <Settings fontSize='large' />
                  </Box>
                  <Typography variant='h6' sx={{ fontWeight: 600 }}>
                    Settings
                  </Typography>
                </Box>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  paragraph
                  sx={{ mb: 3, lineHeight: 1.6 }}
                >
                  Configure keywords vocabulary and scraping intervals for your
                  job monitoring system.
                </Typography>
                <Button
                  variant='outlined'
                  fullWidth
                  startIcon={<Settings />}
                  onClick={() => handleQuickAction('settings')}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1.5,
                    borderColor: 'success.main',
                    color: 'success.main',
                    '&:hover': {
                      borderColor: 'success.dark',
                      bgcolor: 'success.light',
                      color: 'white',
                    },
                  }}
                >
                  Go to Settings
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
