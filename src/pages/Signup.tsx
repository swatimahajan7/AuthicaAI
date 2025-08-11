import { useRef, useState } from 'react';
import { AuthMethods, AuthSteps } from '../constants';
import './Signup.css';
import SignupForm, { type SignupFormHandle } from '../components/SignupForm';
import AuthenticatorOTP, { type AuthenticatorOTPHandle } from '../components/AuthenticatorOTP';
import EmailMobileOTP, { type EmailMobileOTPHandle } from '../components/EmailMobileOTP';
import { Box } from '@mui/material';
import FaceRecognition, { type FaceRecognitionHandle } from '../components/FaceRecognition';
import RegistrationSuccess from '../components/RegistrationSuccess';
import { useAuthContext, type User } from '../context/globalAuthContext';

const Signup = () => {
    const [currentStep, setCurrentStep] = useState(AuthSteps[0]);
    const [isAllStepsComplete, setIsAllStepsComplete] = useState(false);

    const signupFormRef = useRef<SignupFormHandle>(null);
    const emailOtpRef = useRef<EmailMobileOTPHandle>(null);
    const authenticatorRef = useRef<AuthenticatorOTPHandle>(null);
    const faceRef = useRef<FaceRecognitionHandle>(null);

    const { values, setUsers, currentUser, setCurrentUser, riskConfig } = useAuthContext();

    const handleBack = () => {
        const prevIndex = AuthSteps.indexOf(currentStep) - 1;
        if (prevIndex >= 0) {
            setCurrentStep(AuthSteps[prevIndex]);
        }
    };

    const handleContinue = async () => {
        if (currentStep === AuthMethods.usernamePassword) {
            const isValid = await signupFormRef.current?.validate();
            if (!isValid) return;

            const formValues = signupFormRef.current?.getValues();
            const selectedRisk = riskConfig.find(r => r.risk === 'Medium') || riskConfig[0];

            const newUser: User = {
                id: Date.now(),
                name: formValues!.name,
                username: formValues!.username,
                password: formValues!.password,
                email: '',
                phone: '',
                risk: selectedRisk.risk
            };

            setUsers(prev => [...prev, newUser]);
            setCurrentUser(newUser);
        }

        if (currentStep === AuthMethods.emailMobileOTP) {
            if (!emailOtpRef.current?.isVerified()) {
                alert('Please complete both email and phone verification.');
                return;
            }

            setUsers(prev =>
                prev.map(user =>
                    user.id === currentUser?.id
                        ? { ...user, email: values.email, phone: values.phone }
                        : user
                )
            );

            setCurrentUser(prev =>
                prev ? { ...prev, email: values.email, phone: values.phone } : prev
            );
        }

        if (currentStep === AuthMethods.authenticatorOTP && !authenticatorRef.current?.isVerified()) {
            alert('Please verify the Authenticator OTP before continuing.');
            return;
        }

        if (currentStep === AuthMethods.faceRecognition && !faceRef.current?.isCaptured()) {
            alert('Please capture your face before continuing.');
            return;
        }

        const nextIndex = AuthSteps.indexOf(currentStep) + 1;
        if (nextIndex < AuthSteps.length) {
            setCurrentStep(AuthSteps[nextIndex]);
        } else {
            setIsAllStepsComplete(true);
        }
    };

    return (
        <div className='signup-wrapper-div'>
            <div className='signup-section'>
                {!isAllStepsComplete ? (
                    <>
                        <Box sx={{
                            backgroundColor: '#f0f8ff',
                            paddingY: '50px',
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            height: '100%',
                            overflowY: "scroll",
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                            <img src='../src/assets/logo.svg' width={150} className='logo' />
                            <img src="../src/assets/darkAuthica.svg" width={210} className="logo" style={{ marginTop: "-70px", marginBottom:"-70px", marginLeft: "10px"}} />

                            {currentStep === AuthMethods.usernamePassword && (
                                <SignupForm ref={signupFormRef} onVerified={handleContinue} />
                            )}
                            {currentStep === AuthMethods.emailMobileOTP && (
                                <EmailMobileOTP ref={emailOtpRef} mode='signup' onVerified={handleContinue} />
                            )}
                            {currentStep === AuthMethods.authenticatorOTP && (
                                <AuthenticatorOTP ref={authenticatorRef} mode='signup' onVerified={handleContinue} />
                            )}
                            {currentStep === AuthMethods.faceRecognition && (
                                <FaceRecognition ref={faceRef} mode='signup' onVerified={handleContinue} />
                            )}
                        </Box>
                    </>
                ) : (
                    <RegistrationSuccess />
                )}
            </div>
        </div>
    );
}

export default Signup;
