import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
} from '@mui/material';
import {
  Settings,
  Add,
  Delete,
  Save,
  Schedule,
  Search,
  Refresh,
} from '@mui/icons-material';
import {
  getGeneralSettings,
  updateGeneralSettings,
  GeneralSettings,
} from '../services/generalService';

export function SettingsPage() {
  const [settings, setSettings] = useState<GeneralSettings>({
    keywords: [],
    interval: 60,
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setInitialLoading(true);
        const backendSettings = await getGeneralSettings();
        if (backendSettings) {
          setSettings(backendSettings);
        } else {
          // If no settings exist, use defaults
          setSettings({
            keywords: [
              'student',
              'intern',
              'internship',
              'entry level',
              'junior',
              'graduate',
              'trainee',
              'part time',
              'remote',
              'work from home',
            ],
            interval: 30,
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load settings from server',
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await updateGeneralSettings({
        keywords: settings.keywords,
        interval: settings.interval,
      });
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings to server' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAddKeyword = () => {
    if (
      newKeyword.trim() &&
      !settings.keywords.includes(newKeyword.trim().toLowerCase())
    ) {
      setSettings((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim().toLowerCase()],
      }));
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setSettings((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((keyword) => keyword !== keywordToRemove),
    }));
  };

  const handleResetSettings = () => {
    setSettings({
      keywords: [
        'student',
        'intern',
        'internship',
        'entry level',
        'junior',
        'graduate',
        'trainee',
        'part time',
        'remote',
        'work from home',
      ],
      interval: 30,
    });
    setMessage({ type: 'success', text: 'Settings reset to defaults' });
    setTimeout(() => setMessage(null), 3000);
  };

  const intervalOptions = Array.from({ length: 59 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} minute${i === 0 ? '' : 's'}`,
  }));

  if (initialLoading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='400px'
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={40} />
          <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
            Loading settings...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Settings sx={{ mr: 1, color: 'primary.main' }} />
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
            Settings
          </Typography>
        </Box>
        <Typography
          variant='h6'
          color='text.secondary'
          sx={{ maxWidth: '600px', lineHeight: 1.6 }}
        >
          Configure your job scraping system with custom keywords and monitoring
          intervals. Settings are synced with the backend server.
        </Typography>
      </Box>

      {message && (
        <Alert
          severity={message.type}
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Keywords Configuration */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Search sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  Keywords Vocabulary
                </Typography>
              </Box>

              <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                Define the keywords that will be used to find relevant job
                postings. These are synced with the backend server.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  label='Add Keyword'
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' &&
                    (e.preventDefault(), handleAddKeyword())
                  }
                  placeholder='Enter a keyword'
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <Button
                  variant='contained'
                  onClick={handleAddKeyword}
                  disabled={!newKeyword.trim()}
                  startIcon={<Add />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    minWidth: '100px',
                  }}
                >
                  Add
                </Button>
              </Box>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  maxHeight: '300px',
                  overflow: 'auto',
                }}
              >
                <List dense>
                  {settings.keywords.map((keyword, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText primary={keyword} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge='end'
                          onClick={() => handleRemoveKeyword(keyword)}
                          size='small'
                          sx={{
                            color: 'error.main',
                            '&:hover': {
                              bgcolor: 'error.light',
                              color: 'white',
                            },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Scraping Configuration */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Schedule sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  Scraping Configuration
                </Typography>
              </Box>

              <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                Configure the scraping interval. This determines how often the
                system will scan websites for new job postings.
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Scraping Interval</InputLabel>
                    <Select
                      value={settings.interval}
                      label='Scraping Interval'
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          interval: e.target.value as number,
                        }))
                      }
                      sx={{
                        borderRadius: 2,
                      }}
                    >
                      {intervalOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: 'info.light',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'info.main',
                    }}
                  >
                    <Typography variant='body2' color='info.dark'>
                      <strong>Current Schedule:</strong> The system will scan
                      for jobs every{' '}
                      {settings.interval === 1
                        ? '1 minute'
                        : `${settings.interval} minutes`}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant='outlined'
          onClick={handleResetSettings}
          startIcon={<Refresh />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1.5,
          }}
        >
          Reset to Defaults
        </Button>
        <Button
          variant='contained'
          onClick={handleSaveSettings}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
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
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>
    </Box>
  );
}
