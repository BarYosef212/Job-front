import React, { useState } from 'react';
import { Box, Typography, Fab, Paper } from '@mui/material';
import { Add, Language } from '@mui/icons-material';
import { WebsiteList } from '../components/WebsiteList';
import { WebsiteForm } from '../components/WebsiteForm';
import { Website } from '../types/job';
import { JobStats } from '../components/JobStats';

export function WebsitesPage() {
  const [showWebsiteForm, setShowWebsiteForm] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<Website | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEditWebsite = (website: Website) => {
    setEditingWebsite(website);
    setShowWebsiteForm(true);
  };

  const handleCloseForm = () => {
    setShowWebsiteForm(false);
    setEditingWebsite(undefined);
  };

  const handleFormSuccess = () => {
    setRefreshKey((prev) => prev + 1);
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
          <WebsiteForm
            website={editingWebsite}
            onClose={handleCloseForm}
            onSuccess={handleFormSuccess}
          />
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
          <WebsiteList
            onEdit={handleEditWebsite}
            onRefresh={() => setRefreshKey((prev) => prev + 1)}
          />
        </Paper>
      )}

      {!showWebsiteForm && (
        <Fab
          color='primary'
          aria-label='add website'
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
          }}
          onClick={() => setShowWebsiteForm(true)}
        >
          <Add fontSize='large' />
        </Fab>
      )}
    </Box>
  );
}
