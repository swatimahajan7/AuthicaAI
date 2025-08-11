import React, { useState, useRef, useCallback } from 'react';
import Navbar from "../components/NavBar";
import { useAuthContext } from '../context/globalAuthContext';
import { useNavigate } from "react-router";
import AuthenticatorOTP, { type AuthenticatorOTPHandle } from "../components/AuthenticatorOTP";
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
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
  Smartphone,
  ArrowBack,
  Email,
  Close
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import type { FileRejection } from 'react-dropzone';
import Webcam from 'react-webcam';
import type { User } from '../context/globalAuthContext';

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface EmailData {
  currentEmail: string;
  newEmail: string;
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

const DropZoneBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDragActive',
})<DropZoneBoxProps>(({ theme, isDragActive }) => ({
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
  const { currentUser, setUsers, setCurrentUser } = useAuthContext();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showWebcam, setShowWebcam] = useState<boolean>(false);
  const [showAuthenticatorSetup, setShowAuthenticatorSetup] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const [snackbar, setSnackbar] = useState<SnackbarState>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [emailData, setEmailData] = useState<EmailData>({
    currentEmail: '',
    newEmail: ''
  });
  
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const authenticatorRef = useRef<AuthenticatorOTPHandle>(null);

  // Navigation function
  const handleBackToHome = (): void => {
    if (currentUser?.username) {
      navigate(`/userHome/${currentUser.username}`);
    } else {
      navigate('/signin')
    }
  };

  const updateCurrentUser = (updates: Partial<User>): void => {
    if (currentUser && setCurrentUser) {
      const updatedUser: User = {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        password: currentUser.password,
        email: currentUser.email,
        phone: currentUser.phone,
        risk: currentUser.risk,
        faceRecognition: currentUser.faceRecognition,
        authenticatorEnabled: currentUser.authenticatorEnabled,
        ...(currentUser.isAdmin !== undefined && { isAdmin: currentUser.isAdmin }),
        ...updates
      };

      setCurrentUser(updatedUser);

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === currentUser.id ? updatedUser : user))
      );
    }
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          updateCurrentUser({ faceRecognition: e.target!.result as string });
          showSnackbar('Face recognition image uploaded successfully!', 'success');
        }
      };
      reader.readAsDataURL(file);
    } else {
      showSnackbar('Please upload a valid image file', 'error');
    }
  }, [currentUser]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false,
    maxSize: 5242880 // 5MB
  });

  
  const captureImage = useCallback((): void => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      updateCurrentUser({ faceRecognition: imageSrc });
      setShowWebcam(false);
      showSnackbar('Face recognition image captured successfully!', 'success');
    }
  }, [currentUser]);

  const showSnackbar = (message: string, severity: AlertColor = 'success'): void => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSave = async (): Promise<void> => {
    setLoading(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));
    setIsEditing(false);
    setLoading(false);
    showSnackbar("Profile updated successfully!", "success");
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

    if (passwordData.currentPassword !== currentUser?.password) {
      showSnackbar('Current password is incorrect', 'error');
      return;
    }

    setLoading(true);
    await new Promise<void>(resolve => setTimeout(resolve, 1500));

    updateCurrentUser({ password: passwordData.newPassword });

    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setLoading(false);
    showSnackbar('Password updated successfully!', 'success');
  };

  const handleEmailChange = async (): Promise<void> => {
    if (!emailData.currentEmail || !emailData.newEmail) {
      showSnackbar('Please fill in both current and new email', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailData.newEmail)) {
      showSnackbar('Please enter a valid email address', 'error');
      return;
    }

    if (emailData.currentEmail !== currentUser?.email) {
      showSnackbar('Current email does not match', 'error');
      return;
    }

    setLoading(true);
    await new Promise<void>(resolve => setTimeout(resolve, 1500));

    updateCurrentUser({ email: emailData.newEmail });

    setEmailData({ currentEmail: '', newEmail: '' });
    setLoading(false);
    showSnackbar('Email updated successfully!', 'success');
  };

  const setupAuthenticator = (): void => {
    setShowAuthenticatorSetup(true);
  };

  const handleAuthenticatorSetupComplete = (): void => {
    if (authenticatorRef.current?.isVerified()) {
      updateCurrentUser({ authenticatorEnabled: true });
      setShowAuthenticatorSetup(false);
      showSnackbar('Authenticator app setup completed successfully!', 'success');
    } else {
      showSnackbar('Please complete the verification process first', 'error');
    }
  };

  const handleAuthenticatorSetupCancel = (): void => {
    setShowAuthenticatorSetup(false);
    showSnackbar('Authenticator setup cancelled', 'info');
  };

  const removeAuthenticator = (): void => {
    updateCurrentUser({ authenticatorEnabled: false });
    showSnackbar('Authenticator app removed!', 'warning');
  };

  const handleCancel = (): void => {
    setIsEditing(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setEmailData({ currentEmail: '', newEmail: '' });
    showSnackbar('Changes cancelled', 'info');
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    updateCurrentUser({ phone: event.target.value });
  };

  const handlePasswordDataChange = (field: keyof PasswordData) => 
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setPasswordData(prev => ({ ...prev, [field]: event.target.value }));
    };

  const handleEmailDataChange = (field: keyof EmailData) => 
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setEmailData(prev => ({ ...prev, [field]: event.target.value }));
    };

  const handleSnackbarClose = (): void => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (!currentUser) {
    return (
      <div>
        <Box sx={{ 
          display: 'flex',
          flexDirection:"column",
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          paddingTop: '80px'
        }}>
          <Typography variant="h6">Please sign in to view your profile</Typography>
          <Button variant="contained" onClick={() =>{ navigate('/signin') }}>
            Sign In
          </Button>
        </Box>
      </div>
    );
  }

  return (
    <div>
      <Navbar isAdmin={false} />
      <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#f5f5f5', paddingTop: '80px' }}>
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton 
                  onClick={handleBackToHome}
                  sx={{ 
                    backgroundColor: 'grey.100',
                    '&:hover': { backgroundColor: 'grey.200' }
                  }}
                >
                  <ArrowBack />
                </IconButton>
                <Typography variant="h5" component="h1" fontWeight="500">
                  User Profile Settings - {`${currentUser.name.charAt(0).toUpperCase()}${currentUser.name.slice(1)}`}
                </Typography>
              </Box>
              <Button
                variant={isEditing ? "outlined" : "contained"}
                startIcon={isEditing ? <Cancel /> : <Edit />}
                onClick={() => setIsEditing(!isEditing)}
                size="medium"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>

            <Grid container spacing={4}>
              
              <Grid item xs={12} md={5}>
                <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}>
                    <PhotoCamera sx={{ mr: 1 }} />
                    Face Recognition
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Avatar
                      src={currentUser.faceRecognition || undefined}
                      sx={{ width: 150, height: 150, fontSize: '3rem' }}
                    >
                      {!currentUser.faceRecognition && currentUser.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </Box>

                  {isEditing && (
                    <>
                      <DropZoneBox {...getRootProps()} isDragActive={isDragActive}>
                        <input {...getInputProps()} />
                        <Upload sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                        <Typography variant="body2" color="textSecondary">
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
                          size="medium"
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
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}>
                        <Email sx={{ mr: 1 }} />
                        Email Address
                      </Typography>
                      
                      {!isEditing ? (
                        <Typography variant="body1" sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                          {currentUser.email}
                        </Typography>
                      ) : (
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Current Email"
                              type="email"
                              value={emailData.currentEmail}
                              onChange={handleEmailDataChange('currentEmail')}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="New Email"
                              type="email"
                              value={emailData.newEmail}
                              onChange={handleEmailDataChange('newEmail')}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              variant="contained"
                              onClick={handleEmailChange}
                              disabled={loading || !emailData.currentEmail || !emailData.newEmail}
                              startIcon={loading ? <CircularProgress size={20} /> : <Email />}
                            >
                              Update Email
                            </Button>
                          </Grid>
                        </Grid>
                      )}
                    </Paper>
                  </Grid>
                  
                  {/* Phone Section */}
                  <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}>
                        <Smartphone sx={{ mr: 1 }} />
                        Phone Number
                      </Typography>
                      
                      {!isEditing ? (
                        <Typography variant="body1" sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                          {currentUser.phone}
                        </Typography>
                      ) : (
                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={currentUser.phone}
                          onChange={handlePhoneChange}
                          variant="outlined"
                          type="tel"
                        />
                      )}
                    </Paper>
                  </Grid>

                  {/* Password Section */}
                  <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}>
                        <Security sx={{ mr: 1 }} />
                        Password
                      </Typography>
                      
                      {!isEditing ? (
                        <Typography variant="body1" sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                          ••••••••
                        </Typography>
                      ) : (
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Current Password"
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordDataChange('currentPassword')}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="New Password"
                              type="password"
                              value={passwordData.newPassword}
                              onChange={handlePasswordDataChange('newPassword')}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Confirm New Password"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordDataChange('confirmPassword')}
                              variant="outlined"
                            />
                          </Grid>
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
                        </Grid>
                      )}
                    </Paper>
                  </Grid>

                  {/* Multi-Factor Authentication Section */}
                  <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom fontWeight="500">
                        Multi-Factor Authentication
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 2 }}>
                            Authenticator App Status:
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {currentUser.authenticatorEnabled ? (
                              <>
                                <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                                <Typography variant="body2" color="success.main" fontWeight="500">
                                  Enabled
                                </Typography>
                              </>
                            ) : (
                              <>
                                <Cancel sx={{ color: 'error.main', mr: 1 }} />
                                <Typography variant="body2" color="error.main" fontWeight="500">
                                  Disabled
                                </Typography>
                              </>
                            )}
                          </Box>
                        </Box>
                      </Box>
                      
                      {isEditing && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          {!currentUser.authenticatorEnabled ? (
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

        <Dialog 
          open={showAuthenticatorSetup} 
          onClose={handleAuthenticatorSetupCancel}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Setup Authenticator App
            <IconButton onClick={handleAuthenticatorSetupCancel}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <AuthenticatorOTP 
              ref={authenticatorRef}
              mode="signup"
              onVerified={() => {
                console.log('Authenticator verified in dialog');
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={handleAuthenticatorSetupCancel}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleAuthenticatorSetupComplete}
            >
              Complete Setup
            </Button>
          </DialogActions>
        </Dialog>

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