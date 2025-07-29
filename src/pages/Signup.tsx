import { useRef, useState } from 'react';
import StepperComponent from '../components/StepperComponent';
import { AuthMethods, AuthSteps } from '../constants';
import './Signup.css';
import SignupForm, { type SignupFormHandle } from '../components/SignupForm';
import AuthenticatorOTP, { type AuthenticatorOTPHandle } from '../components/AuthenticatorOTP';
import EmailMobileOTP, { type EmailMobileOTPHandle } from '../components/EmailMobileOTP';
import { Button, Box } from '@mui/material';
import FaceRecognition, { type FaceRecognitionHandle } from '../components/FaceRecognition';
import RegistrationSuccess from '../components/RegistrationSuccess';

const Signup = () => {
    const [activeStep, setActiveStep] = useState(AuthSteps[0]);
    const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
    const activeStepNumber = AuthSteps.indexOf(activeStep);
    const isAllStepsComplete = activeStep === "success";

    const signupFormRef = useRef<SignupFormHandle>(null);
    const emailOtpRef = useRef<EmailMobileOTPHandle>(null);
    const authenticatorRef = useRef<AuthenticatorOTPHandle>(null);
    const faceRef = useRef<FaceRecognitionHandle>(null);

    const handleNext = () => {
        const nextStep = AuthSteps[activeStepNumber + 1];
        if (nextStep) {
            setActiveStep(nextStep);
        } else {
            setCompleted((prev) => ({
                ...prev,
                [activeStepNumber]: true,
            }));
            setActiveStep("success");
        }
    };

    const handleBack = () => {
        const prevStep = AuthSteps[activeStepNumber - 1];
        if (prevStep) setActiveStep(prevStep);
    };

    const handleContinue = async () => {
        if (activeStep === AuthMethods.usernamePassword) {
            const isValid = await signupFormRef.current?.validate();
            if (!isValid) return;
        }

        if (activeStep === AuthMethods.emailMobileOTP) {
            const isVerified = emailOtpRef.current?.isVerified();
            if (!isVerified) {
                alert('Please complete both email and phone verification.');
                return;
            }
        }

        if (activeStep === AuthMethods.authenticatorOTP) {
            const isVerified = authenticatorRef.current?.isVerified();
            if (!isVerified) {
                alert('Please verify the Authenticator OTP before continuing.');
                return;
            }
        }

        if (activeStep === AuthMethods.faceRecognition) {
            const isCaptured = faceRef.current?.isCaptured();
            if (!isCaptured) {
                alert('Please capture your face before continuing.');
                return;
            }
        }

        setCompleted({
            ...completed,
            [activeStepNumber]: true,
        });
        handleNext();
    };

    return (
        <div className='signup-wrapper-div'>
            <div className='signup-section'>
                {!isAllStepsComplete ? (
                    <>
                        <StepperComponent steps={AuthSteps} activeStepNumber={activeStepNumber} completed={completed} />

                        <Box sx={{
                            backgroundColor: '#f0f8ff',
                            paddingY: '50px',
                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 -4px 8px 0 rgba(0, 0, 0, 0.1)",
                            borderRadius: '30px',
                            overflowY: "scroll"
                        }}>
                            <img src='../src/assets/logo.svg' width={200} className='logo' />
                            {activeStep === AuthMethods.usernamePassword && <SignupForm ref={signupFormRef} />}
                            {activeStep === AuthMethods.emailMobileOTP && <EmailMobileOTP ref={emailOtpRef} mode='signup' />}
                            {activeStep === AuthMethods.authenticatorOTP && <AuthenticatorOTP ref={authenticatorRef} mode='signup' />}
                            {activeStep === AuthMethods.faceRecognition && <FaceRecognition ref={faceRef} mode='signup' />}
                        </Box>

                        <Box my={2} display="flex" justifyContent="space-between">
                            <Button variant="outlined" onClick={handleBack} disabled={activeStepNumber === 0}>
                                Back
                            </Button>
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
