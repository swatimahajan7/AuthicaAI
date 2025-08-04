import { useState, useMemo, useCallback } from 'react';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Fingerprint as FingerprintIcon,
  Security as SecurityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuthContext } from '../context/globalAuthContext';
import { AuthMethods } from '../constants';

const SeverityAuthTable = () => {
  const { riskConfig, setRiskConfig, users, setUsers } = useAuthContext();

  const [severityLevels, setSeverityLevels] = useState([
    {
      id: 1,
      name: 'Medium',
      class: 'medium',
      auth: ['Basic Authentication']
    },
    {
      id: 2,
      name: 'High',
      class: 'high',
      auth: ['Basic Authentication', 'Phone OTP', 'Email OTP']
    },
    {
      id: 3,
      name: 'Severe',
      class: 'severe',
      auth: ['Basic Authentication', 'Phone OTP', 'Email OTP', 'MFA (Multifactor Auth)']
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSeverity, setEditingSeverity] = useState<any>(null);
  const [newSeverityName, setNewSeverityName] = useState('');
  const [selectedAuthMethods, setSelectedAuthMethods] = useState<any>([]);

  const authOptions = useMemo(() => [
    { id: 'basic-auth', label: 'Basic Authentication', icon: <LockIcon /> },
    { id: 'phone-otp', label: 'Phone OTP', icon: <PhoneIcon /> },
    { id: 'email-otp', label: 'Email OTP', icon: <EmailIcon /> },
    { id: 'face-recognition', label: 'Face Recognition', icon: <FingerprintIcon /> },
    { id: 'mfa', label: 'MFA (Multifactor Auth)', icon: <SecurityIcon /> }
  ], []);

  const getAuthIcon = useCallback((authMethod: any) => {
    const method = authMethod.toLowerCase();
    if (method.includes('basic')) return <LockIcon />;
    if (method.includes('phone')) return <PhoneIcon />;
    if (method.includes('email')) return <EmailIcon />;
    if (method.includes('face')) return <FingerprintIcon />;
    if (method.includes('mfa') || method.includes('multifactor')) return <SecurityIcon />;
    return <SecurityIcon />;
  }, []);

  const getSeverityClass = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('medium')) {
      return 'medium';
    } else if (lowerName.includes('high')) {
      return 'high';
    } else if (lowerName.includes('severe') || lowerName.includes('critical')) {
      return 'severe';
    } else {
      return 'medium';
    }
  };

  const getSeverityChipStyles = useCallback((severity: string) => {
    switch (severity) {
      case 'medium':
        return {
          backgroundColor: '#ffebee',
          color: '#c62828',
          border: '1px solid #ef9a9a'
        };
      case 'high':
        return {
          backgroundColor: '#e57373',
          color: '#ffffff',
          border: '1px solid #f44336'
        };
      case 'severe':
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

  const handleAuthMethodToggle = useCallback((methodId: any) => {
    setSelectedAuthMethods((prev: any) =>
      prev.includes(methodId)
        ? prev.filter((id: any) => id !== methodId)
        : [...prev, methodId]
    );
  }, []);

  const handleEditSeverity = (severity: any) => {
    setEditingSeverity(severity);
    setNewSeverityName(severity.name);

    const mappedAuthMethods: any = [];
    severity.auth.forEach((authMethod: any) => {
      const option = authOptions.find(opt => opt.label === authMethod);
      if (option) {
        mappedAuthMethods.push(option.id);
      }
    });

    setSelectedAuthMethods(mappedAuthMethods);
    setDialogOpen(true);
  };

  const handleDeleteSeverity = (severityId: any) => {
    if (window.confirm('Are you sure you want to delete this severity level?')) {
      setSeverityLevels(prev => prev.filter(level => level.id !== severityId));
    }
  };

  const handleSaveSeverity = () => {
    if (!newSeverityName.trim()) {
      alert('Please enter a severity level name');
      return;
    }

    if (selectedAuthMethods.length === 0) {
      alert('Please select at least one authentication method');
      return;
    }

    const mappedAuthMethods = selectedAuthMethods.map((methodId: any) => {
      switch (methodId) {
        case 'basic-auth':
          return AuthMethods.usernamePassword;
        case 'phone-otp':
          return AuthMethods.emailMobileOTP;
        case 'email-otp':
          return AuthMethods.emailMobileOTP;
        case 'face-recognition':
          return AuthMethods.faceRecognition;
        case 'mfa':
          return AuthMethods.authenticatorOTP;
        default:
          return AuthMethods.usernamePassword;
      }
    });

    const updatedRiskConfig = riskConfig.map(config =>
      config.risk === newSeverityName
        ? {
          ...config,
          authMethods: mappedAuthMethods,
          requireEmailOTP: selectedAuthMethods.includes('email-otp'),
          requirePhoneOTP: selectedAuthMethods.includes('phone-otp'),
        }
        : config
    );

    setRiskConfig(updatedRiskConfig);

    setUsers(prev =>
      prev.map(user =>
        user.risk === newSeverityName
          ? {
            ...user,
            authMethods: mappedAuthMethods,
            requireEmailOTP: selectedAuthMethods.includes('email-otp'),
            requirePhoneOTP: selectedAuthMethods.includes('phone-otp'),
          }
          : user
      )
    );

    const authMethods = selectedAuthMethods.map((methodId: any) => {
      const option = authOptions.find(opt => opt.id === methodId);
      return option ? option.label : methodId;
    });

    setSeverityLevels(prev =>
      prev.map(level =>
        level.id === editingSeverity.id
          ? {
            id: level.id,
            name: newSeverityName,
            class: getSeverityClass(newSeverityName),
            auth: [...authMethods]
          }
          : { ...level }
      )
    );

    alert(`Successfully updated "${newSeverityName}" risk level.`);
    handleCloseDialog();
  };

  const clearForm = () => {
    setNewSeverityName('');
    setSelectedAuthMethods([]);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSeverity(null);
    clearForm();
  };

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'severityLevel',
      headerName: 'Risk Level',
      flex: 1,
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
      headerName: 'Authentication Types',
      flex: 2,
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          height: '100%',
          alignItems: 'center',
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
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
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

  const rows = severityLevels.map(level => ({
    id: level.id,
    name: level.name,
    class: level.class,
    auth: [...level.auth],
    severityLevel: level.name,
    authMethods: [...level.auth],
  }));

  const renderAuthForm = () => (
    <>
      <TextField
        fullWidth
        label="Risk Level Name"
        placeholder="Enter risk level: Medium, High, or Severe"
        value={newSeverityName}
        onChange={(e) => setNewSeverityName(e.target.value)}
        sx={{ mb: 3, mt: 1 }}
        variant="outlined"
        helperText="Only Medium, High, and Severe are allowed"
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
    </>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h6" component="h6" gutterBottom sx={{ mb: 4 }}>
        Risk Policy
      </Typography>

      <DataGrid
        key={severityLevels.length + JSON.stringify(severityLevels)}
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        disableColumnMenu
        disableColumnSelector
        disableDensitySelector
        density='comfortable'
        sx={{
          marginBottom: '20px'
        }}
      />

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EditIcon color="primary" sx={{ mr: 1 }} />
            Edit Risk Level
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
            startIcon={<EditIcon />}
          >
            Update Risk Level
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SeverityAuthTable;