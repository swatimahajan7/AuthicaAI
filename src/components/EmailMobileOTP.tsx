import { useState, forwardRef, useImperativeHandle } from 'react';
import { Box, Button, Typography, TextField, Divider } from '@mui/material';

export type EmailMobileOTPHandle = {
    isVerified: () => boolean;
};

interface EmailMobileOTPProps {
    email: string;
    phone: string;
}

const EmailMobileOTP = forwardRef<EmailMobileOTPHandle, EmailMobileOTPProps>(({ email, phone }, ref) => {
    const [emailCodeSent, setEmailCodeSent] = useState(false);
    const [emailVerificationCode, setEmailVerificationCode] = useState('');
    const [emailInputCode, setEmailInputCode] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [emailError, setEmailError] = useState('');

    const [phoneCodeSent, setPhoneCodeSent] = useState(false);
    const [phoneVerificationCode, setPhoneVerificationCode] = useState('');
    const [phoneInputCode, setPhoneInputCode] = useState('');
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [phoneError, setPhoneError] = useState('');

    useImperativeHandle(ref, () => ({
        isVerified: () => emailVerified && phoneVerified,
    }));

    const sendEmailCode = () => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Mock email code:', code);
        setEmailVerificationCode(code);
        setEmailCodeSent(true);
        setEmailError('');
    };

    const sendPhoneCode = () => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Mock phone code:', code);
        setPhoneVerificationCode(code);
        setPhoneCodeSent(true);
        setPhoneError('');
    };

    const verifyEmail = () => {
        if (emailInputCode === emailVerificationCode) {
            setEmailVerified(true);
            setEmailError('');
        } else {
            setEmailError('Invalid code. Please try again.');
        }
    };

    const verifyPhone = () => {
        if (phoneInputCode === phoneVerificationCode) {
            setPhoneVerified(true);
            setPhoneError('');
        } else {
            setPhoneError('Invalid code. Please try again.');
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={4} mt={3}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h6">Verify your email</Typography>
                <Typography>{email}</Typography>

                {!emailVerified ? (
                    <>
                        {!emailCodeSent ? (
                            <Button variant="contained" onClick={sendEmailCode} sx={{ mt: 1 }}>
                                Send Email Code
                            </Button>
                        ) : (
                            <>
                                <TextField
                                    label="Enter Email Code"
                                    value={emailInputCode}
                                    onChange={(e) => setEmailInputCode(e.target.value)}
                                    error={!!emailError}
                                    helperText={emailError}
                                    sx={{ my: 1 }}
                                />
                                <Box display="flex" gap={2} mt={1}>
                                    <Button variant="outlined" onClick={sendEmailCode}>
                                        Resend
                                    </Button>
                                    <Button variant="contained" onClick={verifyEmail}>
                                        Verify Email
                                    </Button>
                                </Box>
                            </>
                        )}
                    </>
                ) : (
                    <Typography color="green">Email verified</Typography>
                )}
            </Box>

            <Divider />

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h6">Verify your mobile</Typography>
                <Typography>{phone}</Typography>

                {!phoneVerified ? (
                    <>
                        {!phoneCodeSent ? (
                            <Button variant="contained" onClick={sendPhoneCode} sx={{ mt: 1 }}>
                                Send SMS Code
                            </Button>
                        ) : (
                            <>
                                <TextField
                                    label="Enter SMS Code"
                                    value={phoneInputCode}
                                    onChange={(e) => setPhoneInputCode(e.target.value)}
                                    error={!!phoneError}
                                    helperText={phoneError}
                                    sx={{ my: 1 }}
                                />
                                <Box display="flex" gap={2} mt={1}>
                                    <Button variant="outlined" onClick={sendPhoneCode}>
                                        Resend
                                    </Button>
                                    <Button variant="contained" onClick={verifyPhone}>
                                        Verify Phone
                                    </Button>
                                </Box>
                            </>
                        )}
                    </>
                ) : (
                    <Typography color="green">Mobile verified</Typography>
                )}
            </Box>
        </Box>
    );
});

export default EmailMobileOTP;
