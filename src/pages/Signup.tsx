import { useRef, useState } from 'react'
import StepperComponent from '../components/StepperComponent'
import { SignupMethods, SignupSteps } from '../constants'
import './Signup.css'
import SignupForm, { type SignupFormHandle } from '../components/SignupForm'
import AuthenticatorOTP from '../components/AuthenticatorOTP'
import EmailMobileOTP, { type EmailMobileOTPHandle } from '../components/EmailMobileOTP';
import FaceRecognition from '../components/FaceRecognition'
import { Button, Box } from '@mui/material'
import { useSignupContext } from '../context/signupContext'

const Signup = () => {
    const [activeStep, setActiveStep] = useState(SignupSteps[0]);
    const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
    const activeStepNumber = SignupSteps.indexOf(activeStep);
    const { formValues } = useSignupContext();

    const signupFormRef = useRef<SignupFormHandle>(null);
    const emailOtpRef = useRef<EmailMobileOTPHandle>(null);

    const handleNext = () => {
        const nextStep = SignupSteps[activeStepNumber + 1];
        if (nextStep) setActiveStep(nextStep);
    };

    const handleBack = () => {
        const prevStep = SignupSteps[activeStepNumber - 1];
        if (prevStep) setActiveStep(prevStep);
    };

    const handleContinue = async () => {
        if (activeStep === SignupMethods.usernamePassword) {
            const isValid = await signupFormRef.current?.validate();
            if (!isValid) return;
        }

        if (activeStep === SignupMethods.emailMobileOTP) {
            const isVerified = emailOtpRef.current?.isVerified();
            if (!isVerified) {
                alert('Please complete both email and phone verification.');
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
                <StepperComponent steps={SignupSteps} activeStepNumber={activeStepNumber} completed={completed} />

                <Box sx={{
                    backgroundColor: '#f0f8ff',
                    paddingY: '50px',
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 -4px 8px 0 rgba(0, 0, 0, 0.1)",
                    borderRadius: '30px',
                    overflowY: "scroll"
                }}>
                    <img src='../src/assets/ACL-logo.svg' width={200} className='logo' />
                    {activeStep === SignupMethods.usernamePassword && <SignupForm ref={signupFormRef} />}
                    {activeStep === SignupMethods.emailMobileOTP && <EmailMobileOTP ref={emailOtpRef}
                        email={formValues.email}
                        phone={formValues.phone} />}
                    {activeStep === SignupMethods.authenticatorOTP && <AuthenticatorOTP />}
                    {activeStep === SignupMethods.faceRecognition && <FaceRecognition />}
                </Box>

                <Box my={2} display="flex" justifyContent="space-between">
                    <Button variant="outlined" onClick={handleBack} disabled={activeStepNumber === 0}>
                        Back
                    </Button>
                    <Button variant="contained" onClick={handleContinue}>
                        Continue
                    </Button>
                </Box>
            </div>
        </div>
    );
}

export default Signup;
