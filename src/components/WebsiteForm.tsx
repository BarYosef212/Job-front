import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  IconButton,
  Alert,
  FormControlLabel,
  Switch,
  Paper,
} from '@mui/material';
import { Add, Close, Language } from '@mui/icons-material';
import { Website } from '../types/job';
import { createWebsite, updateWebsite } from '../services/websiteService';

interface WebsiteFormProps {
  website?: Website;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function WebsiteForm({ website, onClose, onSuccess }: WebsiteFormProps) {
  const [formData, setFormData] = useState({
    name: website?.name || '',
    url: website?.url || '',
    isActive: website?.isActive ?? true,
    keywords: website?.keywords || [],
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }));
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((keyword) => keyword !== keywordToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (website) {
        await updateWebsite(website._id, formData);
      } else {
        await createWebsite({
          name: formData.name,
          url: formData.url,
          keywords: formData.keywords,
          isActive: formData.isActive,
        });
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError('Failed to save website');
      console.error('Error saving website:', err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name.trim() && formData.url.trim();

  return (
    <Box sx={{ p: 3 }}>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={3}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Language sx={{ color: 'primary.main' }} />
          <Typography variant='h5' sx={{ fontWeight: 600 }}>
            {website ? 'Edit Website' : 'Add New Website'}
          </Typography>
        </Box>
        {onClose && (
          <IconButton
            onClick={onClose}
            size='medium'
            sx={{
              bgcolor: 'grey.100',
              '&:hover': {
                bgcolor: 'grey.200',
              },
            }}
          >
            <Close />
          </IconButton>
        )}
      </Box>

      {error && (
        <Alert severity='error' sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Website Name'
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Website URL'
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              required
              disabled={loading}
              placeholder='https://example.com/jobs'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) =>
                      handleInputChange('isActive', e.target.checked)
                    }
                    disabled={loading}
                    color='primary'
                  />
                }
                label={
                  <Box>
                    <Typography variant='body1' sx={{ fontWeight: 500 }}>
                      Active
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Enable job scraping for this website
                    </Typography>
                  </Box>
                }
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6' sx={{ fontWeight: 600, mb: 2 }}>
              Keywords
            </Typography>
            <Box display='flex' gap={2} alignItems='flex-start' mb={2}>
              <TextField
                fullWidth
                label='Add Keyword'
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())
                }
                disabled={loading}
                placeholder='Enter a keyword and press Enter'
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                onClick={handleAddKeyword}
                disabled={!newKeyword.trim() || loading}
                startIcon={<Add />}
                variant='contained'
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  minWidth: '100px',
                  height: '56px',
                }}
              >
                Add
              </Button>
            </Box>
            {formData.keywords.length > 0 && (
              <Box display='flex' flexWrap='wrap' gap={1}>
                {formData.keywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    onDelete={() => handleRemoveKeyword(keyword)}
                    size='medium'
                    color='primary'
                    variant='outlined'
                    sx={{
                      fontWeight: 500,
                      '& .MuiChip-deleteIcon': {
                        color: 'primary.main',
                        '&:hover': {
                          color: 'primary.dark',
                        },
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Box
              display='flex'
              gap={2}
              justifyContent='flex-end'
              sx={{ pt: 2 }}
            >
              {onClose && (
                <Button
                  onClick={onClose}
                  disabled={loading}
                  variant='outlined'
                  size='large'
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 3,
                    py: 1.5,
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                type='submit'
                variant='contained'
                disabled={!isFormValid || loading}
                size='large'
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(99, 102, 241, 0.5)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                {loading
                  ? 'Saving...'
                  : website
                  ? 'Update Website'
                  : 'Create Website'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
