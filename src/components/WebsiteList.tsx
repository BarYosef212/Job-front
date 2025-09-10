import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Edit,
  Delete,
  Link,
  Schedule,
  CheckCircle,
  Cancel,
  Error,
} from '@mui/icons-material';
import { Website, WebsiteFilters } from '../types/job';
import {
  getAllWebsites,
  deleteWebsite,
  toggleWebsiteStatus,
  clearWebsiteErrors,
} from '../services/websiteService';
import { getScanningStatus } from '../services/jobService';
import { WebsiteFilters as WebsiteFiltersComponent } from './WebsiteFilters';
import { formatDistanceToNow } from 'date-fns';

interface WebsiteListProps {
  onEdit?: (website: Website) => void;
  onRefresh?: () => void;
}

export function WebsiteList({ onEdit, onRefresh }: WebsiteListProps) {
  const [allWebsites, setAllWebsites] = useState<Website[]>([]);
  const [filteredWebsites, setFilteredWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [filters, setFilters] = useState<WebsiteFilters>({
    search: '',
    isActive: undefined,
  });

  const fetchWebsites = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllWebsites(); // Fetch all websites without filters
      setAllWebsites(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Failed to fetch websites');
      console.error('Error fetching websites:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkScanningStatus = useCallback(async () => {
    try {
      const status = await getScanningStatus();
      setIsScanning(status.isScanning);
    } catch (error) {
      console.error('Error checking scanning status:', error);
    }
  }, []);

  // Filter websites on the frontend
  const applyFilters = useCallback(() => {
    let filtered = [...allWebsites];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (website) =>
          website.name.toLowerCase().includes(searchTerm) ||
          website.url.toLowerCase().includes(searchTerm),
      );
    }

    // Apply status filter
    if (filters.isActive !== undefined) {
      filtered = filtered.filter(
        (website) => website.isActive === filters.isActive,
      );
    }

    setFilteredWebsites(filtered);
  }, [allWebsites, filters]);

  useEffect(() => {
    fetchWebsites();
    checkScanningStatus();
  }, [fetchWebsites, checkScanningStatus]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Show error alert when websites have errors
  useEffect(() => {
    const websitesWithErrors = allWebsites.filter(
      (website) => website.lastError,
    );
    setShowErrorAlert(websitesWithErrors.length > 0);
  }, [allWebsites]);

  // Check scanning status periodically
  useEffect(() => {
    const interval = setInterval(checkScanningStatus, 2000); // Check every 2 seconds
    return () => clearInterval(interval);
  }, [checkScanningStatus]);

  const handleToggleStatus = useCallback(
    async (websiteId: string) => {
      try {
        await toggleWebsiteStatus(websiteId);
        await fetchWebsites(); // Refresh the list
        onRefresh?.();
      } catch (error) {
        console.error('Failed to toggle website status:', error);
      }
    },
    [fetchWebsites, onRefresh],
  );

  const handleDelete = useCallback(
    async (websiteId: string) => {
      if (window.confirm('Are you sure you want to delete this website?')) {
        try {
          await deleteWebsite(websiteId);
          await fetchWebsites(); // Refresh the list
          onRefresh?.();
        } catch (error) {
          console.error('Failed to delete website:', error);
        }
      }
    },
    [fetchWebsites, onRefresh],
  );

  const handleClearErrors = useCallback(
    async (websiteId: string) => {
      if (
        window.confirm(
          'Are you sure you want to clear all errors for this website?',
        )
      ) {
        try {
          await clearWebsiteErrors(websiteId);
          await fetchWebsites(); // Refresh the list
          onRefresh?.();
        } catch (error) {
          console.error('Failed to clear website errors:', error);
        }
      }
    },
    [fetchWebsites, onRefresh],
  );

  const handleFiltersChange = useCallback((newFilters: WebsiteFilters) => {
    setFilters(newFilters);
  }, []);

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='200px'
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity='error' sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (filteredWebsites.length === 0) {
    return (
      <Box>
        <WebsiteFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
        <Alert severity='info' sx={{ mb: 2 }}>
          {allWebsites.length === 0
            ? 'No websites found. Add a new website to get started.'
            : 'No websites match your current filters. Try adjusting your search criteria.'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <WebsiteFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {showErrorAlert && (
        <Alert
          severity='warning'
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setShowErrorAlert(false)}
        >
          <Typography variant='body2' sx={{ fontWeight: 600 }}>
            ⚠️ Some websites have scanning errors. Check the error details below
            and consider clearing them once resolved.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {filteredWebsites.map((website) => (
          <Grid item xs={12} md={6} key={website._id}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='flex-start'
                  mb={2}
                >
                  <Box flex={1}>
                    <Typography variant='h6' component='h2' gutterBottom>
                      {website.name}
                    </Typography>
                    <Box display='flex' alignItems='center' gap={1} mb={1}>
                      <Link fontSize='small' color='action' />
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ wordBreak: 'break-all' }}
                        component='a'
                        href={
                          website.url.startsWith('http')
                            ? website.url
                            : `https://${website.url}`
                        }
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {website.url}
                      </Typography>
                    </Box>

                    {website.lastScanned && (
                      <Box display='flex' alignItems='center' gap={1} mb={2}>
                        <Schedule fontSize='small' color='action' />
                        <Typography variant='body2' color='text.secondary'>
                          Last scanned:{' '}
                          {formatDistanceToNow(new Date(website.lastScanned), {
                            addSuffix: true,
                          })}
                        </Typography>
                      </Box>
                    )}

                    {website.lastError && (
                      <Box display='flex' alignItems='center' gap={1} mb={2}>
                        <Error fontSize='small' color='error' />
                        <Typography variant='body2' color='error.main'>
                          Last error:{' '}
                          {website.lastErrorAt
                            ? formatDistanceToNow(
                                new Date(website.lastErrorAt),
                                {
                                  addSuffix: true,
                                },
                              )
                            : 'Unknown time'}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Box display='flex' gap={1}>
                    <Tooltip
                      title={
                        website.isActive
                          ? 'Deactivate website'
                          : 'Activate website'
                      }
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={website.isActive}
                            onChange={() => handleToggleStatus(website._id)}
                            color='primary'
                            disabled={isScanning}
                          />
                        }
                        label=''
                      />
                    </Tooltip>
                    {onEdit && (
                      <Tooltip
                        title={
                          isScanning
                            ? 'Cannot edit during scan'
                            : 'Edit website'
                        }
                      >
                        <IconButton
                          onClick={() => onEdit(website)}
                          color='primary'
                          size='small'
                          disabled={isScanning}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}
                    {website.lastError && (
                      <Tooltip
                        title={
                          isScanning
                            ? 'Cannot clear errors during scan'
                            : 'Clear errors'
                        }
                      >
                        <IconButton
                          onClick={() => handleClearErrors(website._id)}
                          color='warning'
                          size='small'
                          disabled={isScanning}
                        >
                          <Error />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip
                      title={
                        isScanning
                          ? 'Cannot delete during scan'
                          : 'Delete website'
                      }
                    >
                      <IconButton
                        onClick={() => handleDelete(website._id)}
                        color='error'
                        size='small'
                        disabled={isScanning}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box display='flex' flexWrap='wrap' gap={1} mb={2}>
                  <Chip
                    label={website.isActive ? 'Active' : 'Inactive'}
                    size='small'
                    color={website.isActive ? 'success' : 'default'}
                    icon={website.isActive ? <CheckCircle /> : <Cancel />}
                  />
                  <Chip
                    label={`${website.keywords?.length || 0} keywords`}
                    size='small'
                    variant='outlined'
                  />
                  {website.lastError && (
                    <Chip
                      label='Has Error'
                      size='small'
                      color='error'
                      icon={<Error />}
                    />
                  )}
                </Box>

                {website.lastError && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant='caption'
                      color='error.main'
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Error Details:
                    </Typography>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: 'error.light',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'error.main',
                        mt: 0.5,
                      }}
                    >
                      <Typography
                        variant='caption'
                        color='error.dark'
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {website.lastError}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {website.keywords && website.keywords.length > 0 && (
                  <Box>
                    <Typography
                      variant='caption'
                      color='text.secondary'
                      gutterBottom
                    >
                      Keywords:
                    </Typography>
                    <Box display='flex' flexWrap='wrap' gap={0.5} mt={0.5}>
                      {website.keywords.slice(0, 5).map((keyword, index) => (
                        <Chip
                          key={index}
                          label={keyword}
                          size='small'
                          variant='outlined'
                        />
                      ))}
                      {website.keywords.length > 5 && (
                        <Typography variant='caption' color='text.secondary'>
                          +{website.keywords.length - 5} more
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
