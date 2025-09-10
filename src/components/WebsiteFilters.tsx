import React, { useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
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
import { WebsiteFilters as WebsiteFiltersType } from '../types/job';

interface WebsiteFiltersProps {
  filters: WebsiteFiltersType;
  onFiltersChange: (filters: WebsiteFiltersType) => void;
}

export function WebsiteFilters({
  filters,
  onFiltersChange,
}: WebsiteFiltersProps) {
  const handleFilterChange = useCallback(
    (key: string, value: any) => {
      if (key === 'isActive') {
        if (value === 'all') {
          onFiltersChange({ ...filters, [key]: undefined });
        } else {
          onFiltersChange({ ...filters, [key]: value === 'true' });
        }
      } else {
        onFiltersChange({ ...filters, [key]: value });
      }
    },
    [filters, onFiltersChange],
  );

  const handleClearFilters = useCallback(() => {
    onFiltersChange({
      search: '',
      isActive: undefined,
    });
  }, [onFiltersChange]);

  const getStatusValue = useCallback(() => {
    if (filters.isActive === undefined) return 'all';
    return filters.isActive ? 'true' : 'false';
  }, [filters.isActive]);

  const activeFiltersCount = [
    filters.search,
    filters.isActive !== undefined,
  ].filter(Boolean).length;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterList sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          Filter Websites
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
            key='search-websites'
            fullWidth
            label='Search websites'
            placeholder='Enter website name or URL'
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
            <InputLabel>Status</InputLabel>
            <Select
              key='status-select'
              value={getStatusValue()}
              label='Status'
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              sx={{
                borderRadius: 2,
              }}
            >
              <MenuItem value='true'>Active</MenuItem>
              <MenuItem value='false'>Inactive</MenuItem>
              <MenuItem value='all'>All</MenuItem>
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
