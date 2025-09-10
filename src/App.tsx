import React, { useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Container,
  Paper,
} from '@mui/material';
import { Dashboard, Work, Language, Settings } from '@mui/icons-material';
import { theme } from './theme';
import { DashboardPage } from './pages/DashboardPage';
import { JobsPage } from './pages/JobsPage';
import { WebsitesPage } from './pages/WebsitesPage';
import { SettingsPage } from './pages/SettingsPage';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleNavigate = (tabIndex: number) => {
    setCurrentTab(tabIndex);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}
      >
        <AppBar
          position='static'
          elevation={0}
          sx={{
            bgcolor: 'white',
            borderBottom: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          }}
        >
          <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexGrow: 1,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <Work />
              </Box>
              <Typography
                variant='h5'
                component='div'
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Job Scanner
              </Typography>
            </Box>

            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              aria-label='navigation tabs'
              sx={{
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              <Tab
                icon={<Dashboard />}
                label='Dashboard'
                iconPosition='start'
                {...a11yProps(0)}
                sx={{
                  minHeight: 64,
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                }}
              />
              <Tab
                icon={<Work />}
                label='Jobs'
                iconPosition='start'
                {...a11yProps(1)}
                sx={{
                  minHeight: 64,
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                }}
              />
              <Tab
                icon={<Language />}
                label='Websites'
                iconPosition='start'
                {...a11yProps(2)}
                sx={{
                  minHeight: 64,
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                }}
              />
              <Tab
                icon={<Settings />}
                label='Settings'
                iconPosition='start'
                {...a11yProps(3)}
                sx={{
                  minHeight: 64,
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                }}
              />
            </Tabs>
          </Toolbar>
        </AppBar>

        <Container maxWidth='xl' sx={{ py: 4 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <TabPanel value={currentTab} index={0}>
              <DashboardPage onNavigate={handleNavigate} />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
              <JobsPage />
            </TabPanel>
            <TabPanel value={currentTab} index={2}>
              <WebsitesPage />
            </TabPanel>
            <TabPanel value={currentTab} index={3}>
              <SettingsPage />
            </TabPanel>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
