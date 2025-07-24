import { useState, forwardRef, useImperativeHandle } from 'react';
import { Box, Button, Typography, TextField, Divider } from '@mui/material';

export type EmailMobileOTPHandle = {
    isVerified: () => boolean;
};

interface EmailMobileOTPProps {
    email: string;
    phone: string;
    mode?: 'signup' | 'signin';
}

const EmailMobileOTP = forwardRef<EmailMobileOTPHandle, EmailMobileOTPProps>(({ email, phone, mode = 'signup' }, ref) => {
    const [emailCodeSent, setEmailCodeSent] = useState(mode === 'signin');
    const [emailVerificationCode, setEmailVerificationCode] = useState('123123');
    const [emailInputCode, setEmailInputCode] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [emailError, setEmailError] = useState('');

    const [phoneCodeSent, setPhoneCodeSent] = useState(mode === 'signin');
    const [phoneVerificationCode, setPhoneVerificationCode] = useState('123123');
    const [phoneInputCode, setPhoneInputCode] = useState('');
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [phoneError, setPhoneError] = useState('');

    useImperativeHandle(ref, () => ({
        isVerified: () => emailVerified && phoneVerified,
    }));

    const sendEmailCode = () => {
        console.log(`${mode} email code: 123123`);
        setEmailVerificationCode('123123');
        setEmailCodeSent(true);
        setEmailError('');
    };

    const sendPhoneCode = () => {
        console.log(`${mode} phone code: 123123`);
        setPhoneVerificationCode('123123');
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
                <Typography variant="h6">{mode === 'signin' ? 'Verify your email to sign in' : 'Verify your email'}</Typography>
                <Typography>{email}</Typography>

                {!emailVerified ? (
                    <>
                        {emailCodeSent ? (
                            <>
                                {mode === 'signin' && (
                                    <Typography variant="caption" sx={{ mt: 1 }}>
                                        OTP has been sent to your registered email.
                                    </Typography>
                                )}
                                <TextField
                                    label="Enter Email Code"
                                    value={emailInputCode}
                                    onChange={(e) => setEmailInputCode(e.target.value)}
                                    error={!!emailError}
                                    helperText={emailError}
                                    sx={{ my: 1 }}
                                />
                                <Box display="flex" gap={2} mt={1}>
                                    {mode === 'signup' && (
                                        <Button variant="outlined" onClick={sendEmailCode}>
                                            Resend
                                        </Button>
                                    )}
                                    <Button variant="contained" onClick={verifyEmail}>
                                        Verify Email
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <Button variant="contained" onClick={sendEmailCode} sx={{ mt: 1 }}>
                                Send Email Code
                            </Button>
                        )}
                    </>
                ) : (
                    <Typography color="green">Email verified</Typography>
                )}
            </Box>

            <Divider />

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h6">{mode === 'signin' ? 'Verify your mobile to sign in' : 'Verify your mobile'}</Typography>
                <Typography>{phone}</Typography>

                {!phoneVerified ? (
                    <>
                        {phoneCodeSent ? (
                            <>
                                {mode === 'signin' && (
                                    <Typography variant="caption" sx={{ mt: 1 }}>
                                        OTP has been sent to your registered mobile number.
                                    </Typography>
                                )}
                                <TextField
                                    label="Enter SMS Code"
                                    value={phoneInputCode}
                                    onChange={(e) => setPhoneInputCode(e.target.value)}
                                    error={!!phoneError}
                                    helperText={phoneError}
                                    sx={{ my: 1 }}
                                />
                                <Box display="flex" gap={2} mt={1}>
                                    {mode === 'signup' && (
                                        <Button variant="outlined" onClick={sendPhoneCode}>
                                            Resend
                                        </Button>
                                    )}
                                    <Button variant="contained" onClick={verifyPhone}>
                                        Verify Phone
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <Button variant="contained" onClick={sendPhoneCode} sx={{ mt: 1 }}>
                                Send SMS Code
                            </Button>
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
