import { useState, useMemo, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
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
  Lock as LockIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Fingerprint as FingerprintIcon,
  Security as SecurityIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useAuthContext } from '../context/globalAuthContext';
import { AuthMethods } from '../constants';

const SeverityAuthTable = () => {
  const { riskConfig, setRiskConfig } = useAuthContext();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSeverity, setEditingSeverity] = useState<any>(null);
  const [newSeverityName, setNewSeverityName] = useState('');
  const [selectedAuthMethods, setSelectedAuthMethods] = useState<string[]>([]);

  const authOptions = useMemo(() => [
    { id: 'basic-auth', label: 'Basic Authentication', icon: <LockIcon /> },
    { id: 'phone-otp', label: 'Phone OTP', icon: <PhoneIcon /> },
    { id: 'email-otp', label: 'Email OTP', icon: <EmailIcon /> },
    { id: 'face-recognition', label: 'Face Recognition', icon: <FingerprintIcon /> },
    { id: 'mfa', label: 'MFA (Multifactor Auth)', icon: <SecurityIcon /> }
  ], []);

  const getAuthIcon = (method: string) => {
    const lower = method.toLowerCase();
    if (lower.includes('basic')) return <LockIcon />;
    if (lower.includes('phone')) return <PhoneIcon />;
    if (lower.includes('email')) return <EmailIcon />;
    if (lower.includes('face')) return <FingerprintIcon />;
    if (lower.includes('mfa')) return <SecurityIcon />;
    return <SecurityIcon />;
  };

  const getSeverityChipStyles = useCallback((severity: string) => {
    switch (severity.toLowerCase()) {
      case 'medium':
        return { backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a' };
      case 'high':
        return { backgroundColor: '#e57373', color: '#fff', border: '1px solid #f44336' };
      case 'severe':
        return { backgroundColor: '#c62828', color: '#fff', border: '1px solid #b71c1c' };
      default:
        return { backgroundColor: '#f5f5f5', color: '#666', border: '1px solid #ccc' };
    }
  }, []);

  const handleAuthMethodToggle = useCallback((methodId: string) => {
    setSelectedAuthMethods(prev =>
      prev.includes(methodId)
        ? prev.filter(id => id !== methodId)
        : [...prev, methodId]
    );
  }, []);

  const handleEditSeverity = (severity: any) => {
    setEditingSeverity(severity);
    setNewSeverityName(severity.risk);

    const selected: string[] = [];
    if (severity.authMethods.includes(AuthMethods.usernamePassword)) selected.push('basic-auth');
    if (severity.requirePhoneOTP) selected.push('phone-otp');
    if (severity.requireEmailOTP) selected.push('email-otp');
    if (severity.authMethods.includes(AuthMethods.faceRecognition)) selected.push('face-recognition');
    if (severity.authMethods.includes(AuthMethods.authenticatorOTP)) selected.push('mfa');

    setSelectedAuthMethods(selected);
    setDialogOpen(true);
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

    const mappedAuthMethods = selectedAuthMethods.map((id: string) => {
      switch (id) {
        case 'basic-auth': return AuthMethods.usernamePassword;
        case 'phone-otp': return AuthMethods.emailMobileOTP;
        case 'email-otp': return AuthMethods.emailMobileOTP;
        case 'face-recognition': return AuthMethods.faceRecognition;
        case 'mfa': return AuthMethods.authenticatorOTP;
        default: return AuthMethods.usernamePassword;
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
    setDialogOpen(false);
  };

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'risk',
      headerName: 'Risk Level',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          sx={{ fontWeight: 'medium', ...getSeverityChipStyles(params.value) }}
        />
      ),
    },
    {
      field: 'auth',
      headerName: 'Authentication Methods',
      flex: 2,
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, height: '100%', alignItems: 'center' }}>
          {params.value.map((method: string, idx: number) => (
            <Chip
              key={`${params.id}-${idx}`}
              icon={getAuthIcon(method)}
              label={method}
              variant="outlined"
              color="primary"
              size="small"
              sx={{ backgroundColor: '#e3f2fd', maxHeight: '24px' }}
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
      renderCell: (params: GridRenderCellParams) => (
        <IconButton size="small" color="primary" onClick={() => handleEditSeverity(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    }
  ], [getSeverityChipStyles]);

  const rows = riskConfig.map(config => {
    const auth: string[] = [];
    if (config.authMethods.includes(AuthMethods.usernamePassword)) auth.push('Basic Authentication');
    if (config.requirePhoneOTP) auth.push('Phone OTP');
    if (config.requireEmailOTP) auth.push('Email OTP');
    if (config.authMethods.includes(AuthMethods.faceRecognition)) auth.push('Face Recognition');
    if (config.authMethods.includes(AuthMethods.authenticatorOTP)) auth.push('MFA (Multifactor Auth)');

    return {
      id: config.risk,
      risk: config.risk,
      auth,
      authMethods: config.authMethods,
      requireEmailOTP: config.requireEmailOTP,
      requirePhoneOTP: config.requirePhoneOTP,
    };
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
        Risk Policy
      </Typography>

      <DataGrid
        rows={rows}
        columns={columns}
        hideFooter
        disableRowSelectionOnClick
        disableColumnMenu
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Risk Level</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Risk Level"
            value={newSeverityName}
            disabled
            sx={{ mb: 3, mt: 1 }}
          />
          <Typography variant="subtitle1" gutterBottom>Select Authentication Methods</Typography>
          <FormGroup>
            {authOptions.map(option => (
              <FormControlLabel
                key={option.id}
                control={
                  <Checkbox
                    checked={selectedAuthMethods.includes(option.id)}
                    onChange={() => handleAuthMethodToggle(option.id)}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {option.icon}
                    <Typography sx={{ ml: 1 }}>{option.label}</Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSaveSeverity} variant="contained" color="primary" startIcon={<EditIcon />}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SeverityAuthTable;
