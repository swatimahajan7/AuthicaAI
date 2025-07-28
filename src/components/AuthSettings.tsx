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
  Chip,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Fingerprint as FingerprintIcon,
  Security as SecurityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const SeverityAuthTable = () => {
  const [severityLevels, setSeverityLevels] = useState([
    {
      id: 1,
      name: 'Low',
      class: 'low',
      auth: ['Username & Password']
    },
    {
      id: 2,
      name: 'Medium', 
      class: 'medium',
      auth: ['Username & Password', 'Phone OTP']
    },
    {
      id: 3,
      name: 'High',
      class: 'high', 
      auth: ['Username & Password', 'Phone OTP', 'Email OTP']
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSeverity, setEditingSeverity] = useState(null);
  const [newSeverityName, setNewSeverityName] = useState('');
  const [selectedAuthMethods, setSelectedAuthMethods] = useState([]);
  const [customAuthMethod, setCustomAuthMethod] = useState('');

  const authOptions = useMemo(() => [
    { id: 'username-password', label: 'Username & Password', icon: <LockIcon /> },
    { id: 'phone-otp', label: 'Phone OTP', icon: <PhoneIcon /> },
    { id: 'email-otp', label: 'Email OTP', icon: <EmailIcon /> },
    { id: 'biometric', label: 'Biometric Authentication', icon: <FingerprintIcon /> },
    { id: 'hardware-token', label: 'Hardware Token (2FA)', icon: <SecurityIcon /> }
  ], []);

  const getAuthIcon = useCallback((authMethod) => {
    const method = authMethod.toLowerCase();
    if (method.includes('username') && method.includes('password')) return <LockIcon />;
    if (method.includes('phone')) return <PhoneIcon />;
    if (method.includes('email')) return <EmailIcon />;
    if (method.includes('biometric')) return <FingerprintIcon />;
    if (method.includes('token') || method.includes('2fa')) return <SecurityIcon />;
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
          backgroundColor: '#ffebee',
          color: '#c62828',
          border: '1px solid #ef9a9a'
        };
      case 'medium':
        return {
          backgroundColor: '#e57373',
          color: '#ffffff',
          border: '1px solid #f44336'
        };
      case 'high':
        return {
          backgroundColor: '#c62828',
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

  const handleAddSeverity = () => {
    setEditingSeverity(null);
    clearForm();
    setDialogOpen(true);
  };

  const handleEditSeverity = (severity) => {
    setEditingSeverity(severity);
    setNewSeverityName(severity.name);
    
    const mappedAuthMethods = [];
    severity.auth.forEach(authMethod => {
      const option = authOptions.find(opt => opt.label === authMethod);
      if (option) {
        mappedAuthMethods.push(option.id);
      }
    });
    
    setSelectedAuthMethods(mappedAuthMethods);
    setCustomAuthMethod('');
    setDialogOpen(true);
  };

  const handleDeleteSeverity = (severityId) => {
    if (window.confirm('Are you sure you want to delete this severity level?')) {
      setSeverityLevels(prev => prev.filter(level => level.id !== severityId));
    }
  };

  const handleSaveSeverity = () => {
    if (!newSeverityName.trim()) {
      alert('Please enter a severity level name');
      return;
    }

    let finalAuthMethods = [...selectedAuthMethods];
    
    if (customAuthMethod.trim()) {
      finalAuthMethods.push('custom-' + Date.now());
    }

    if (finalAuthMethods.length === 0) {
      alert('Please select at least one authentication method or add a custom one');
      return;
    }

    const nameExists = severityLevels.some(level => 
      level.name.toLowerCase() === newSeverityName.toLowerCase() && 
      (!editingSeverity || level.id !== editingSeverity.id)
    );

    if (nameExists) {
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

    if (editingSeverity) {
      setSeverityLevels(prev => prev.map(level => 
        level.id === editingSeverity.id 
          ? {
              ...level,
              name: newSeverityName,
              class: getSeverityClass(newSeverityName),
              auth: authMethods
            }
          : level
      ));
      alert(`Successfully updated "${newSeverityName}" severity level.`);
    } else {
      const newLevel = {
        id: Date.now(),
        name: newSeverityName,
        class: getSeverityClass(newSeverityName),
        auth: authMethods
      };

      setSeverityLevels(prev => [...prev, newLevel]);
      alert(`Successfully added "${newSeverityName}" severity level with ${finalAuthMethods.length} authentication method(s).`);
    }
    
    handleCloseDialog();
  };

  const clearForm = () => {
    setNewSeverityName('');
    setSelectedAuthMethods([]);
    setCustomAuthMethod('');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSeverity(null);
    clearForm();
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
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEditSeverity(params.row)}
            title="Edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteSeverity(params.row.id)}
            title="Delete"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ], [getSeverityChipStyles, getAuthIcon]);

  const rows = useMemo(() => severityLevels.map(level => ({
    id: level.id,
    name: level.name,
    class: level.class,
    auth: level.auth,
    severityLevel: level.name,
    authMethods: level.auth
  })), [severityLevels]);

  const renderAuthForm = () => (
    <>
      <TextField
        fullWidth
        label="Severity Level Name"
        placeholder="Enter severity level (e.g., Critical, Very High)"
        value={newSeverityName}
        onChange={(e) => setNewSeverityName(e.target.value)}
        sx={{ mb: 3, mt: 1 }}
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
    </>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Severity Level Authentication Configuration
      </Typography>

      <Paper elevation={3} sx={{ mb: 3 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={70} 
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

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddSeverity}
        sx={{ 
          mb: 2,
          transition: 'all 0.3s ease'
        }}
      >
        Add Auth and Severity
      </Button>

      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {editingSeverity ? <EditIcon color="primary" sx={{ mr: 1 }} /> : <AddIcon color="primary" sx={{ mr: 1 }} />}
            {editingSeverity ? 'Edit Severity Level' : 'Add New Severity Level'}
          </Box>
        </DialogTitle>
        <DialogContent>
          {renderAuthForm()}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSeverity} 
            variant="contained" 
            color="primary"
            startIcon={editingSeverity ? <EditIcon /> : <AddIcon />}
          >
            {editingSeverity ? 'Update Severity Level' : 'Add Severity Level'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SeverityAuthTable;