import  { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Search, Clear, FilterList } from '@mui/icons-material';
import { JobFilters as JobFiltersType } from '../types/job';
import { getWebsites } from '../services/websiteService';

interface JobFiltersProps {
  filters: JobFiltersType;
  onFiltersChange: (filters: JobFiltersType) => void;
}

export function JobFilters({ filters, onFiltersChange }: JobFiltersProps) {
  const [websites, setWebsites] = useState<any[]>([]);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const data = await getWebsites();
        setWebsites(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching websites:', error);
      }
    };
    fetchWebsites();
  }, []);

  const handleFilterChange = useCallback(
    (key: string, value: any) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange],
  );

  const handleClearFilters = useCallback(() => {
    onFiltersChange({
      search: '',
      websiteId: '',
      isActive: true,
    });
  }, [onFiltersChange]);

  const activeFiltersCount = [
    filters.search,
    filters.websiteId,
    filters.isActive !== true,
  ].filter(Boolean).length;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterList sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          Filter Jobs
        </Typography>
        {activeFiltersCount > 0 && (
          <Chip
            label={`${activeFiltersCount} active`}
            size='small'
            color='primary'
            sx={{ ml: 2 }}
          />
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            key='search-jobs'
            fullWidth
            label='Search jobs'
            placeholder='Enter job title or description'
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Website</InputLabel>
            <Select
              key='website-select'
              value={filters.websiteId}
              label='Website'
              onChange={(e) => handleFilterChange('websiteId', e.target.value)}
              sx={{
                borderRadius: 2,
              }}
            >
              <MenuItem value=''>All Websites</MenuItem>
              {websites.map((website) => (
                <MenuItem key={website._id} value={website._id}>
                  {website.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box display='flex' gap={2} alignItems='center' flexWrap='wrap'>
            <Button
              variant='outlined'
              onClick={handleClearFilters}
              startIcon={<Clear />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
