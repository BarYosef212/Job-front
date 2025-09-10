import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Fab, Paper, Alert } from '@mui/material';
import { Add, Language } from '@mui/icons-material';
import { WebsiteList } from '../components/WebsiteList';
import { WebsiteForm } from '../components/WebsiteForm';
import { Website } from '../types/job';
import { JobStats } from '../components/JobStats';
import { getScanningStatus } from '../services/jobService';

export function WebsitesPage() {
  const [showWebsiteForm, setShowWebsiteForm] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<Website | undefined>();
  const [isScanning, setIsScanning] = useState(false);

  const checkScanningStatus = useCallback(async () => {
    try {
      const status = await getScanningStatus();
      setIsScanning(status.isScanning);
    } catch (error) {
      console.error('Error checking scanning status:', error);
    }
  }, []);

  useEffect(() => {
    checkScanningStatus();
    const interval = setInterval(checkScanningStatus, 2000); // Check every 2 seconds
    return () => clearInterval(interval);
  }, [checkScanningStatus]);

  const handleEditWebsite = (website: Website) => {
    setEditingWebsite(website);
    setShowWebsiteForm(true);
  };

  const handleCloseForm = () => {
    setShowWebsiteForm(false);
    setEditingWebsite(undefined);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Language sx={{ mr: 1, color: 'primary.main' }} />
          <Typography
            variant='h3'
            component='h1'
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Website Management
          </Typography>
        </Box>
        <Typography
          variant='h6'
          color='text.secondary'
          sx={{ maxWidth: '600px', lineHeight: 1.6 }}
        >
          Manage websites for job scraping. Add new websites to start collecting
          job information automatically.
        </Typography>
      </Box>

      {isScanning && (
        <Alert
          severity='info'
          sx={{
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontWeight: 500,
            },
          }}
        >
          🔄 A job scan is currently in progress. Website management is
          temporarily disabled.
        </Alert>
      )}

      <JobStats />

      {showWebsiteForm ? (
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
          <WebsiteForm website={editingWebsite} onClose={handleCloseForm} />
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          <WebsiteList onEdit={handleEditWebsite} />
        </Paper>
      )}

      {!showWebsiteForm && (
        <Fab
          color='primary'
          aria-label={
            isScanning ? 'Cannot add website during scan' : 'add website'
          }
          disabled={isScanning}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 64,
            height: 64,
            boxShadow:
              '0 8px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
            '&:hover': {
              boxShadow:
                '0 12px 30px -5px rgb(0 0 0 / 0.15), 0 6px 8px -2px rgb(0 0 0 / 0.1)',
              transform: 'translateY(-2px)',
            },
            '&:disabled': {
              opacity: 0.5,
              transform: 'none',
            },
          }}
          onClick={() => setShowWebsiteForm(true)}
        >
          <Add fontSize='large' />
        </Fab>
      )}
    </Box>
  );
}
