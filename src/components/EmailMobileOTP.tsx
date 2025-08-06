import { useState, forwardRef, useImperativeHandle } from 'react';
import { Box, Button, Typography, TextField, Divider } from '@mui/material';
import { useAuthContext } from '../context/globalAuthContext';

export type EmailMobileOTPHandle = {
    isVerified: () => boolean;
};

interface EmailMobileOTPProps {
    mode?: 'signup' | 'signin';
}

const EmailMobileOTP = forwardRef<EmailMobileOTPHandle, EmailMobileOTPProps>(({ mode = 'signup' }, ref) => {
    const { values, updateValues, currentUser, riskConfig } = useAuthContext();

    const currentRiskConfig = currentUser
        ? riskConfig.find(r => r.risk === currentUser.risk)
        : null;

    const showEmail = !!currentRiskConfig?.requireEmailOTP;
    const showPhone = !!currentRiskConfig?.requirePhoneOTP;

    const [emailCodeSent, setEmailCodeSent] = useState(mode === 'signin');
    const [emailInputCode, setEmailInputCode] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [emailLocked, setEmailLocked] = useState(false);

    const [phoneCodeSent, setPhoneCodeSent] = useState(mode === 'signin');
    const [phoneInputCode, setPhoneInputCode] = useState('');
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [phoneLocked, setPhoneLocked] = useState(false);

    const emailVerificationCode = '123123';
    const phoneVerificationCode = '123123';

    useImperativeHandle(ref, () => ({
        isVerified: () => {
            if (showEmail && !emailVerified) return false;
            if (showPhone && !phoneVerified) return false;
            return true;
        }
    }));

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
            {/* Email Section */}
            {showEmail && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h6">
                        {mode === 'signin' ? 'Verify your email to sign in' : 'Enter and verify your email'}
                    </Typography>

                    {mode === 'signup' && (
                        <TextField
                            label="Email"
                            value={values.email}
                            onChange={(e) => updateValues({ email: e.target.value })}
                            sx={{ mt: 2, width: '70%' }}
                            disabled={emailCodeSent || emailVerified || emailLocked}
                        />
                    )}

                    {emailCodeSent && !emailVerified && (
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
                                slotProps={{
                                    htmlInput: {
                                        maxLength: 6
                                    }
                                }}
                                sx={{ my: 1, width: '70%' }}
                            />
                            <Box display="flex" gap={2}>
                                {mode === 'signup' && (
                                    <Button variant="outlined" onClick={() => setEmailCodeSent(true)}>
                                        Resend
                                    </Button>
                                )}
                                <Button variant="contained" onClick={verifyEmail}>
                                    Verify Email
                                </Button>
                            </Box>
                        </>
                    )}

                    {!emailCodeSent && !emailVerified && (
                        <Button
                            variant="contained"
                            onClick={() => {
                                console.log(`${mode} email code: ${emailVerificationCode}`);
                                setEmailCodeSent(true);
                                setEmailError('');
                                setEmailLocked(true);
                            }}
                            sx={{ mt: 1, width: '30%' }}
                            disabled={!values.email}
                        >
                            Send Email Code
                        </Button>
                    )}

                    {emailVerified && (
                        <Typography color="green" sx={{ mt: 1 }}>
                            Email verified
                        </Typography>
                    )}
                </Box>
            )}

            {(showEmail && showPhone) && <Divider />}

            {/* Phone Section */}
            {showPhone && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h6">
                        {mode === 'signin' ? 'Verify your mobile to sign in' : 'Enter and verify your mobile'}
                    </Typography>

                    {mode === 'signup' && (
                        <TextField
                            label="Phone"
                            value={values.phone}
                            onChange={(e) => updateValues({ phone: e.target.value })}
                            sx={{ mt: 2, width: '70%' }}
                            disabled={phoneCodeSent || phoneVerified || phoneLocked}
                            slotProps={{
                                htmlInput: {
                                    maxLength: 10
                                }
                            }}
                        />
                    )}

                    {phoneCodeSent && !phoneVerified && (
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
                                slotProps={{
                                    htmlInput: {
                                        maxLength: 6
                                    }
                                }}
                                sx={{ my: 1, width: '70%' }}
                            />
                            <Box display="flex" gap={2}>
                                {mode === 'signup' && (
                                    <Button variant="outlined" onClick={() => setPhoneCodeSent(true)}>
                                        Resend
                                    </Button>
                                )}
                                <Button variant="contained" onClick={verifyPhone}>
                                    Verify Phone
                                </Button>
                            </Box>
                        </>
                    )}

                    {!phoneCodeSent && !phoneVerified && (
                        <Button
                            variant="contained"
                            onClick={() => {
                                console.log(`${mode} phone code: ${phoneVerificationCode}`);
                                setPhoneCodeSent(true);
                                setPhoneError('');
                                setPhoneLocked(true);
                            }}
                            sx={{ mt: 1, width: '30%' }}
                            disabled={!values.phone}
                        >
                            Send SMS Code
                        </Button>
                    )}

                    {phoneVerified && (
                        <Typography color="green" sx={{ mt: 1 }}>
                            Mobile verified
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
});

export default EmailMobileOTP;
