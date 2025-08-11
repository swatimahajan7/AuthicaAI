import { useState, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, TextField, Button, Divider } from '@mui/material';
import QRCode from 'react-qr-code';

export interface AuthenticatorOTPHandle {
    isVerified: () => boolean;
}

interface AuthenticatorOTPProps {
    onVerified?: () => void;
    mode?: 'signup' | 'signin';
}

const mockSecretKey = 'JBSWY3DPEHPK3PXP';
const mockOTP = '123123';

const AuthenticatorOTP = forwardRef<AuthenticatorOTPHandle, AuthenticatorOTPProps>(
    ({ onVerified, mode = 'signup' }, ref) => {
        const [otp, setOtp] = useState('');
        const [error, setError] = useState('');
        const [verified, setVerified] = useState(false);

        const otpAuthUrl = `otpauth://totp/YourApp:${mode}@demo.com?secret=${mockSecretKey}&issuer=YourApp`;

        useImperativeHandle(ref, () => ({
            isVerified: () => verified,
        }));

        const handleVerify = () => {
            if (otp === mockOTP) {
                setVerified(true);
                setError('');
            } else {
                setError('Invalid OTP. Please check and try again.');
            }
        };

        const handleContinue = () => {
            if (verified) {
                onVerified?.();
            } else {
                alert('Please verify OTP first.');
            }
        };

        return (
            <Box display="flex" flexDirection="column" alignItems="center" gap={3} mt={4} sx={{ overflowY: 'scroll' }}>
                <Typography variant="h6">
                    {mode === 'signin' ? 'Verify with Authenticator App' : 'Set up Authenticator App'}
                </Typography>

                {mode === 'signup' && (
                    <>
                        <Typography textAlign="center" px={4}>
                            Scan this QR code using one of the supported authenticator apps: Google Authenticator or Microsoft Authenticator.
                        </Typography>
                        <Box bgcolor="white" p={2} borderRadius={2}>
                            <QRCode value={otpAuthUrl} size={180} />
                        </Box>
                        <Typography variant="caption">
                            Can't scan? Enter this code manually: <strong>{mockSecretKey}</strong>
                        </Typography>
                        <Divider sx={{ width: '100%', maxWidth: 400 }} />
                    </>
                )}

                <Typography>Enter the 6-digit code from your app:</Typography>
                <TextField
                    label="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    error={!!error}
                    helperText={error}
                    slotProps={{
                        htmlInput: {
                            maxLength: 6
                        }
                    }}
                    sx={{ width: '70%' }}
                />

                <Box display="flex" gap={2}>
                    <Button variant="outlined" onClick={handleVerify}>
                        Verify OTP
                    </Button>
                    <Button variant="contained" onClick={handleContinue}>
                        Continue
                    </Button>
                </Box>

                {verified && (
                    <Typography color="green" sx={{ mt: 1 }}>
                        Authenticator verified ✅
                    </Typography>
                )}
            </Box>
        );
    }
);

export default AuthenticatorOTP;
