import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  OpenInNew,
  Schedule,
  DataObject,
  Language,
  ExpandMore,
  Work,
  LocationOn,
} from '@mui/icons-material';
import { Job, JobFilters } from '../types/job';
import { getJobs } from '../services/jobService';
import { formatDistanceToNow } from 'date-fns';

interface JobListProps {
  filters: JobFilters;
  onRefresh?: () => void;
}

interface JobData {
  _id: string;
  data: string[];
  websiteId: {
    _id: string;
    name: string;
    url: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function JobList({ filters, onRefresh }: JobListProps) {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs(filters);
      setJobs(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleUpdateJob = async (jobId: string, updates: any) => {
    try {
      console.log('Update job:', jobId, updates);
      onRefresh?.();
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  };

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='300px'
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={40} />
          <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
            Loading jobs...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity='error' sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (jobs.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <Work sx={{ fontSize: 40, color: 'grey.400' }} />
        </Box>
        <Typography variant='h6' color='text.secondary' gutterBottom>
          No jobs found
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Try adjusting your filters or scan for new jobs.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} key={job._id}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow:
                    '0 8px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='flex-start'
                  mb={3}
                >
                  <Box flex={1}>
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
                        <Language />
                      </Box>
                      <Box>
                        <Typography
                          variant='h5'
                          component='h2'
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          {job.websiteId.name}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {job.data.length} job
                          {job.data.length !== 1 ? 's' : ''} found
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Schedule fontSize='small' color='action' />
                        <Typography variant='body2' color='text.secondary'>
                          Scanned{' '}
                          {formatDistanceToNow(new Date(job.createdAt), {
                            addSuffix: true,
                          })}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <DataObject fontSize='small' color='action' />
                        <Typography variant='body2' color='text.secondary'>
                          {job.data.length} positions
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box display='flex' gap={1}>
                    <Tooltip title='Open website'>
                      <IconButton
                        size='medium'
                        onClick={() => window.open(job.websiteId.url, '_blank')}
                        sx={{
                          bgcolor: 'primary.light',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'primary.main',
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        <OpenInNew />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    paragraph
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                    }}
                  >
                    <strong>Website URL:</strong>
                  </Typography>
                  <Typography
                    component='a'
                    href={
                      job.websiteId.url.startsWith('http')
                        ? job.websiteId.url
                        : `https://${job.websiteId.url}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      wordBreak: 'break-all',
                      display: 'block',
                      '&:hover': {
                        color: 'primary.dark',
                      },
                    }}
                  >
                    {job.websiteId.url}
                  </Typography>
                </Box>

                <Accordion
                  sx={{
                    boxShadow: 'none',
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': {
                      margin: 0,
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls='job-content'
                    id='job-header'
                    sx={{
                      bgcolor: 'grey.50',
                      borderRadius: 2,
                      mb: 1,
                      '&.Mui-expanded': {
                        minHeight: 48,
                      },
                    }}
                  >
                    <Typography
                      variant='subtitle1'
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontWeight: 600,
                        color: 'text.primary',
                      }}
                    >
                      <Work fontSize='small' />
                      View Found Jobs ({job.data.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <List dense>
                      {job.data.map((jobTitle, index) => (
                        <React.Fragment key={index}>
                          <ListItem sx={{ py: 1.5 }}>
                            <ListItemText
                              primary={
                                <Typography
                                  variant='body2'
                                  sx={{
                                    fontWeight: 500,
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {jobTitle}
                                </Typography>
                              }
                            />
                          </ListItem>
                          {index < job.data.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>

                <Box display='flex' flexWrap='wrap' gap={1} mt={3}>
                  <Chip
                    label={`Job ID: ${job._id.slice(-8)}`}
                    size='small'
                    variant='outlined'
                    color='primary'
                    sx={{ fontWeight: 500 }}
                  />
                  <Chip
                    label={`Website: ${job.websiteId.name}`}
                    size='small'
                    variant='outlined'
                    color='secondary'
                    sx={{ fontWeight: 500 }}
                  />
                  <Chip
                    label={`${job.data.length} positions`}
                    size='small'
                    variant='filled'
                    color='success'
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
