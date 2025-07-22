import { useState, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, TextField, Button, Divider } from '@mui/material';
import QRCode from 'react-qr-code';

export type AuthenticatorOTPHandle = {
    isVerified: () => boolean;
};

const mockSecretKey = 'JBSWY3DPEHPK3PXP';
const mockOTP = '123456';

const AuthenticatorOTP = forwardRef<AuthenticatorOTPHandle>((_, ref) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [verified, setVerified] = useState(false);

    const otpAuthUrl = `otpauth://totp/YourApp:demo@example.com?secret=${mockSecretKey}&issuer=YourApp`;

    const handleVerify = () => {
        if (otp === mockOTP) {
            setVerified(true);
            setError('');
        } else {
            setError('Invalid OTP. Please check and try again.');
        }
    };

    useImperativeHandle(ref, () => ({
        isVerified: () => verified,
    }));

    return (
        <Box display="flex" flexDirection="column" gap={3} alignItems="center" mt={4}>
            <Typography variant="h6">Set up Authenticator App</Typography>

            <Typography variant="body1" sx={{ textAlign: 'center', maxWidth: 500 }}>
                Scan the QR code with an Authenticator app like <strong>Google Authenticator</strong>.
            </Typography>

            <Box sx={{ background: 'white', padding: 2, borderRadius: 2 }}>
                <QRCode value={otpAuthUrl} size={180} />
            </Box>

            <Typography variant="caption">
                Can’t scan? Enter this code manually: <strong>{mockSecretKey}</strong>
            </Typography>

            <Divider sx={{ width: '100%', maxWidth: 400 }} />

            <Typography variant="body1">Enter the 6-digit code from your app:</Typography>

            <TextField
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={!!error}
                helperText={error}
                sx={{ width: 200 }}
                inputProps={{ maxLength: 6 }}
            />

            <Button variant="contained" onClick={handleVerify}>
                Verify
            </Button>

            {verified && (
                <Typography color="green" sx={{ mt: 1 }}>
                    Authenticator verified ✅
                </Typography>
            )}
        </Box>
    );
});

export default AuthenticatorOTP;
