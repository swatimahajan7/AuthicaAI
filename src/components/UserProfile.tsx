import React, { useState, useRef, useCallback } from 'react';
import Navbar from "../components/NavBar";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Paper,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  styled
} from '@mui/material';
import type { AlertColor } from '@mui/material';
import {
  PhotoCamera,
  Upload,
  Save,
  Edit,
  CheckCircle,
  Cancel,
  Security,
  Smartphone
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import type { FileRejection } from 'react-dropzone';
import Webcam from 'react-webcam';


interface UserData {
  phone: string;
  profileImage: string | null;
  isAuthenticatorSetup: boolean;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}


const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
  minHeight: '80vh',
  boxShadow: theme.shadows[8],
  borderRadius: theme.spacing(2)
}));

interface DropZoneBoxProps {
  isDragActive: boolean;
}

const DropZoneBox = styled(Box)<DropZoneBoxProps>(({ theme, isDragActive }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.grey[300]}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: isDragActive ? theme.palette.primary.light + '10' : 'transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light + '05'
  }
}));

const WebcamContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '400px',
  margin: '0 auto',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  border: `2px solid ${theme.palette.grey[300]}`
}));

const UserProfilePage: React.FC = () => {
  // State management
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showWebcam, setShowWebcam] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  
  
  const [userData, setUserData] = useState<UserData>({
    phone: '+1 (555) 123-4567',
    profileImage: null,
    isAuthenticatorSetup: true 
  });
  
  
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Refs
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop configuration
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setUserData(prev => ({ ...prev, profileImage: e.target!.result as string }));
          showSnackbar('Profile image uploaded successfully!', 'success');
        }
      };
      reader.readAsDataURL(file);
    } else {
      showSnackbar('Please upload a valid image file', 'error');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false,
    maxSize: 5242880 // 5MB
  });

  // Webcam capture function
  const captureImage = useCallback((): void => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUserData(prev => ({ ...prev, profileImage: imageSrc }));
      setShowWebcam(false);
      showSnackbar('Image captured successfully!', 'success');
    }
  }, []);

  
  const showSnackbar = (message: string, severity: AlertColor = 'success'): void => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSave = async (): Promise<void> => {
    setLoading(true);
    
    await new Promise<void>(resolve => setTimeout(resolve, 1500));
    setIsEditing(false);
    setLoading(false);
    showSnackbar('Profile updated successfully!', 'success');
  };

  const handlePasswordChange = async (): Promise<void> => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showSnackbar('Passwords do not match', 'error');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      showSnackbar('Password must be at least 8 characters long', 'error');
      return;
    }
    
    setLoading(true);
    
    await new Promise<void>(resolve => setTimeout(resolve, 1500));
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setLoading(false);
    showSnackbar('Password updated successfully!', 'success');
  };

  const setupAuthenticator = (): void => {
    
    setUserData(prev => ({ ...prev, isAuthenticatorSetup: true }));
    showSnackbar('Authenticator app setup initiated!', 'info');
  };

  const removeAuthenticator = (): void => {
    setUserData(prev => ({ ...prev, isAuthenticatorSetup: false }));
    showSnackbar('Authenticator app removed!', 'warning');
  };

  const handleCancel = (): void => {
    setIsEditing(false);
    
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showSnackbar('Changes cancelled', 'info');
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUserData(prev => ({ ...prev, phone: event.target.value }));
  };

  const handlePasswordDataChange = (field: keyof PasswordData) => 
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setPasswordData(prev => ({ ...prev, [field]: event.target.value }));
    };

  const handleSnackbarClose = (): void => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <div>
      <Navbar isAdmin={false} />
      <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#f5f5f5', paddingTop: '80px' }}>
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" fontWeight="600">
              User Profile Settings
            </Typography>
            <Button
              variant={isEditing ? "outlined" : "contained"}
              startIcon={isEditing ? <Cancel /> : <Edit />}
              onClick={() => setIsEditing(!isEditing)}
              size="large"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </Box>

          <Grid container spacing={4}>
            
            <Grid item xs={12} md={5}>
              <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhotoCamera sx={{ mr: 1 }} />
                  Profile Image
                </Typography>
                
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Avatar
                    src={userData.profileImage || undefined}
                    sx={{ width: 150, height: 150, fontSize: '3rem' }}
                  >
                    {!userData.profileImage && 'U'}
                  </Avatar>
                </Box>

                {isEditing && (
                  <>
                    
                    <DropZoneBox {...getRootProps()} isDragActive={isDragActive}>
                      <input {...getInputProps()} />
                      <Upload sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                      <Typography variant="body1" color="textSecondary">
                        {isDragActive
                          ? "Drop the image here..."
                          : "Drag & drop an image here, or click to select"}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                        Supports: JPG, PNG, GIF, WebP (Max 5MB)
                      </Typography>
                    </DropZoneBox>

                    <Divider sx={{ my: 3 }}>OR</Divider>

                    
                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        variant="outlined"
                        startIcon={<PhotoCamera />}
                        onClick={() => setShowWebcam(!showWebcam)}
                        fullWidth
                        size="large"
                        sx={{ mb: 2 }}
                      >
                        {showWebcam ? 'Hide Camera' : 'Use Camera'}
                      </Button>

                      {showWebcam && (
                        <WebcamContainer>
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width="100%"
                            videoConstraints={{
                              width: 400,
                              height: 300,
                              facingMode: "user"
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 16,
                              left: '50%',
                              transform: 'translateX(-50%)'
                            }}
                          >
                            <IconButton
                              onClick={captureImage}
                              sx={{
                                backgroundColor: 'white',
                                color: 'primary.main',
                                width: 60,
                                height: 60,
                                '&:hover': { backgroundColor: 'grey.100' }
                              }}
                            >
                              <PhotoCamera sx={{ fontSize: 30 }} />
                            </IconButton>
                          </Box>
                        </WebcamContainer>
                      )}
                    </Box>
                  </>
                )}
              </Paper>
            </Grid>

            
            <Grid item xs={12} md={7}>
              <Grid container spacing={3}>
                
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <Smartphone sx={{ mr: 1 }} />
                      Phone Number
                    </Typography>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={userData.phone}
                      onChange={handlePhoneChange}
                      disabled={!isEditing}
                      variant={isEditing ? "outlined" : "filled"}
                      type="tel"
                      InputProps={{
                        readOnly: !isEditing
                      }}
                    />
                  </Paper>
                </Grid>

                
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <Security sx={{ mr: 1 }} />
                      Change Password
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Current Password"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordDataChange('currentPassword')}
                          disabled={!isEditing}
                          variant={isEditing ? "outlined" : "filled"}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="New Password"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordDataChange('newPassword')}
                          disabled={!isEditing}
                          variant={isEditing ? "outlined" : "filled"}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordDataChange('confirmPassword')}
                          disabled={!isEditing}
                          variant={isEditing ? "outlined" : "filled"}
                        />
                      </Grid>
                      {isEditing && (
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            onClick={handlePasswordChange}
                            disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
                            startIcon={loading ? <CircularProgress size={20} /> : <Security />}
                          >
                            Update Password
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>

                
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Two-Factor Authentication
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ mr: 2 }}>
                          Authenticator App Status:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {userData.isAuthenticatorSetup ? (
                            <>
                              <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                              <Typography variant="body1" color="success.main" fontWeight="600">
                                Yes - Enabled
                              </Typography>
                            </>
                          ) : (
                            <>
                              <Cancel sx={{ color: 'error.main', mr: 1 }} />
                              <Typography variant="body1" color="error.main" fontWeight="600">
                                No - Disabled
                              </Typography>
                            </>
                          )}
                        </Box>
                      </Box>
                    </Box>
                    
                    {isEditing && (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {!userData.isAuthenticatorSetup ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={setupAuthenticator}
                            startIcon={<Smartphone />}
                          >
                            Setup Authenticator App
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={removeAuthenticator}
                            startIcon={<Cancel />}
                          >
                            Remove Authenticator
                          </Button>
                        )}
                      </Box>
                    )}
                  </Paper>
                </Grid>

                
                {isEditing && (
                  <Grid item xs={12}>
                    <Box sx={{ pt: 2 }}>
                      
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleSave}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                        sx={{ minWidth: 200 }}
                      >
                        {loading ? 'Saving...' : 'Save All Changes'}
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>

    </div>


  );
};

export default UserProfilePage;
