import React, { useState, useMemo, useCallback } from 'react';
import {
  DataGrid,
  
} from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Button,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Container,
  Collapse,
  Card,
  CardContent,
  Chip,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Fingerprint as FingerprintIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

const SeverityAuthTable = () => {
  const [severityLevels, setSeverityLevels] = useState([
    {
      id: 1,
      name: 'Low',
      class: 'low',
      auth: ['Username', 'Password']
    },
    {
      id: 2,
      name: 'Medium', 
      class: 'medium',
      auth: ['Username', 'Password', 'Phone OTP']
    },
    {
      id: 3,
      name: 'High',
      class: 'high', 
      auth: ['Username', 'Password', 'Phone OTP', 'Email OTP']
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSeverityName, setNewSeverityName] = useState('');
  const [selectedAuthMethods, setSelectedAuthMethods] = useState([]);
  const [customAuthMethod, setCustomAuthMethod] = useState('');

  const authOptions = useMemo(() => [
    { id: 'username', label: 'Username', icon: <PersonIcon /> },
    { id: 'password', label: 'Password', icon: <LockIcon /> },
    { id: 'phone-otp', label: 'Phone OTP', icon: <PhoneIcon /> },
    { id: 'email-otp', label: 'Email OTP', icon: <EmailIcon /> },
    { id: 'biometric', label: 'Biometric Authentication', icon: <FingerprintIcon /> },
    { id: 'hardware-token', label: 'Hardware Token (2FA)', icon: <SecurityIcon /> }
  ], []);

  const getAuthIcon = useCallback((authMethod) => {
    const method = authMethod.toLowerCase();
    if (method.includes('username')) return <PersonIcon />;
    if (method.includes('password')) return <LockIcon />;
    if (method.includes('phone')) return <PhoneIcon />;
    if (method.includes('email')) return <EmailIcon />;
    if (method.includes('biometric')) return <FingerprintIcon />;
    if (method.includes('token') || method.includes('2fa')) return <SecurityIcon />;
    // For custom auth methods
    return <SecurityIcon />;
  }, []);

  const getSeverityClass = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('low') || lowerName.includes('minimal')) {
      return 'low';
    } else if (lowerName.includes('high') || lowerName.includes('critical') || lowerName.includes('severe')) {
      return 'high';
    } else {
      return 'medium';
    }
  };

  const getSeverityChipStyles = useCallback((severity) => {
    switch (severity) {
      case 'low':
        return {
          backgroundColor: '#ffebee', // Light red/pink
          color: '#c62828',
          border: '1px solid #ef9a9a'
        };
      case 'medium':
        return {
          backgroundColor: '#e57373', // Medium red
          color: '#ffffff',
          border: '1px solid #f44336'
        };
      case 'high':
        return {
          backgroundColor: '#c62828', // Dark red
          color: '#ffffff',
          border: '1px solid #b71c1c'
        };
      default:
        return {
          backgroundColor: '#f5f5f5',
          color: '#666666',
          border: '1px solid #cccccc'
        };
    }
  }, []);

  const handleAuthMethodToggle = useCallback((methodId) => {
    setSelectedAuthMethods(prev => 
      prev.includes(methodId) 
        ? prev.filter(id => id !== methodId)
        : [...prev, methodId]
    );
  }, []);

  const handleAddSeverityLevel = () => {
    if (!newSeverityName.trim()) {
      alert('Please enter a severity level name');
      return;
    }

    let finalAuthMethods = [...selectedAuthMethods];
    
    // Add custom auth method if provided
    if (customAuthMethod.trim()) {
      finalAuthMethods.push('custom-' + Date.now());
    }

    if (finalAuthMethods.length === 0) {
      alert('Please select at least one authentication method or add a custom one');
      return;
    }

    if (severityLevels.some(level => level.name.toLowerCase() === newSeverityName.toLowerCase())) {
      alert('This severity level already exists');
      return;
    }

    const authMethods = finalAuthMethods.map(methodId => {
      if (methodId.startsWith('custom-')) {
        return customAuthMethod.trim();
      }
      const option = authOptions.find(opt => opt.id === methodId);
      return option ? option.label : methodId;
    });

    const newLevel = {
      id: Date.now(),
      name: newSeverityName,
      class: getSeverityClass(newSeverityName),
      auth: authMethods
    };

    setSeverityLevels(prev => [...prev, newLevel]);
    
    // Reset form
    setNewSeverityName('');
    setSelectedAuthMethods([]);
    setCustomAuthMethod('');
    setShowAddForm(false);

    alert(`Successfully added "${newSeverityName}" severity level with ${finalAuthMethods.length} authentication method(s).`);
  };

  const clearForm = () => {
    setNewSeverityName('');
    setSelectedAuthMethods([]);
    setCustomAuthMethod('');
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    if (showAddForm) {
      clearForm();
    }
  };

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'severityLevel',
      headerName: 'Severity Level',
      flex: 1,
      minWidth: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.row.name}
          sx={{ 
            fontWeight: 'medium',
            ...getSeverityChipStyles(params.row.class)
          }}
        />
      ),
    },
    {
      field: 'authMethods',
      headerName: 'Auth Type',
      flex: 2,
      minWidth: 400,
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 0.5, 
          py: 1,
          alignItems: 'center'
        }}>
          {params.row.auth.map((method: string, idx: number) => (
            <Chip
              key={`${params.row.id}-${idx}`}
              icon={getAuthIcon(method)}
              label={method}
              variant="outlined"
              color="primary"
              size="small"
              sx={{ 
                backgroundColor: '#e3f2fd',
                maxHeight: '24px'
              }}
            />
          ))}
        </Box>
      ),
    },
  ], [getSeverityChipStyles, getAuthIcon]);

  // Transform data for DataGrid - memoized to prevent recalculation
  const rows = useMemo(() => severityLevels.map(level => ({
    id: level.id,
    name: level.name,
    class: level.class,
    auth: level.auth,
    severityLevel: level.name,
    authMethods: level.auth
  })), [severityLevels]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Severity Level Authentication Configuration
      </Typography>

      {/* DataGrid */}
      <Paper elevation={3} sx={{ mb: 3 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          disableColumnMenu
          disableColumnSelector
          disableDensitySelector
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#1976d2',
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#1976d2',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                color: '#ffffff !important',
                fontWeight: 'bold !important',
                fontSize: '16px'
              },
              '& .MuiDataGrid-iconSeparator': {
                color: '#ffffff'
              },
              '& .MuiDataGrid-sortIcon': {
                color: '#ffffff'
              },
              '& .MuiDataGrid-menuIconButton': {
                color: '#ffffff'
              }
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f0f0f0',
            },
            '& .MuiDataGrid-row:nth-of-type(odd)': {
              backgroundColor: '#fafafa',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #e0e0e0',
            },
            border: 'none'
          }}
        />
      </Paper>

      {/* Add Button */}
      <Button
        variant="contained"
        color="primary"
        startIcon={showAddForm ? <CloseIcon /> : <AddIcon />}
        onClick={toggleAddForm}
        sx={{ 
          mb: 2,
          transition: 'all 0.3s ease'
        }}
      >
        {showAddForm ? 'Cancel' : 'Add Auth and Severity'}
      </Button>

      {/* Add New Form */}
      <Collapse in={showAddForm}>
        <Card elevation={3} sx={{ mt: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AddIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="h2">
                Add New Severity Level
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Severity Level Name"
              placeholder="Enter severity level (e.g., Critical, Very High)"
              value={newSeverityName}
              onChange={(e) => setNewSeverityName(e.target.value)}
              sx={{ mb: 3 }}
              variant="outlined"
            />

            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
              Select Authentication Methods
            </Typography>
            
            <FormGroup sx={{ mb: 3 }}>
              {authOptions.map((option) => (
                <FormControlLabel
                  key={option.id}
                  control={
                    <Checkbox
                      checked={selectedAuthMethods.includes(option.id)}
                      onChange={() => handleAuthMethodToggle(option.id)}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {option.icon}
                      <Typography sx={{ ml: 1 }}>{option.label}</Typography>
                    </Box>
                  }
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    m: 0.5,
                    p: 1,
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                />
              ))}
            </FormGroup>

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', mt: 2 }}>
              Add Custom Authentication Method (Optional)
            </Typography>
            
            <TextField
              fullWidth
              label="Custom Authentication Method"
              placeholder="Enter custom authentication method (e.g., Smart Card, Voice Recognition)"
              value={customAuthMethod}
              onChange={(e) => setCustomAuthMethod(e.target.value)}
              multiline
              rows={2}
              sx={{ mb: 3 }}
              variant="outlined"
              helperText="Describe any additional authentication method not listed above"
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddSeverityLevel}
              sx={{ mt: 1 }}
            >
              Add Severity Level
            </Button>
          </CardContent>
        </Card>
      </Collapse>
    </Container>
  );
};

export default SeverityAuthTable;