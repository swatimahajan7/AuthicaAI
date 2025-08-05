import { useRef, useState } from 'react';
import { AuthMethods, AuthSteps } from '../constants';
import './Signup.css';
import SignupForm, { type SignupFormHandle } from '../components/SignupForm';
import AuthenticatorOTP, { type AuthenticatorOTPHandle } from '../components/AuthenticatorOTP';
import EmailMobileOTP, { type EmailMobileOTPHandle } from '../components/EmailMobileOTP';
import { Button, Box } from '@mui/material';
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
                            borderRadius: '30px',
                            overflowY: "scroll"
                        }}>
                            <img src='../src/assets/logo.svg' width={200} className='logo' />
                            {currentStep === AuthMethods.usernamePassword && <SignupForm ref={signupFormRef} />}
                            {currentStep === AuthMethods.emailMobileOTP && <EmailMobileOTP ref={emailOtpRef} mode='signup' />}
                            {currentStep === AuthMethods.authenticatorOTP && <AuthenticatorOTP ref={authenticatorRef} mode='signup' />}
                            {currentStep === AuthMethods.faceRecognition && <FaceRecognition ref={faceRef} mode='signup' />}
                        </Box>

                        <Box my={2} display="flex" justifyContent="flex-end">
                            <Button variant="contained" onClick={handleContinue}>
                                Continue
                            </Button>
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
