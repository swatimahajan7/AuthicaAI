import { useRef, useState } from 'react'
import StepperComponent from '../components/StepperComponent'
import { SignupMethods, SignupSteps } from '../constants'
import './Signup.css'
import SignupForm, { type SignupFormHandle } from '../components/SignupForm'
import AuthenticatorOTP from '../components/AuthenticatorOTP'
import EmailMobileOTP from '../components/EmailMobileOTP'
import FaceRecognition from '../components/FaceRecognition'
import { Button, Box } from '@mui/material'

const Signup = () => {
    const [activeStep, setActiveStep] = useState(SignupSteps[0]);
    const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
    const activeStepNumber = SignupSteps.indexOf(activeStep);

    const signupFormRef = useRef<SignupFormHandle>(null);

    const handleNext = () => {
        const nextStep = SignupSteps[activeStepNumber + 1];
        if (nextStep) setActiveStep(nextStep);
    };

    const handleBack = () => {
        const prevStep = SignupSteps[activeStepNumber - 1];
        if (prevStep) setActiveStep(prevStep);
    };

    const handleContinue = async () => {
        // Check if we're on the SignupForm step
        // if (activeStep === SignupMethods.usernamePassword) {
        //     const isValid = await signupFormRef.current?.validate();
        //     if (!isValid) return;
        // }

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

                {activeStep === SignupMethods.usernamePassword && <SignupForm ref={signupFormRef} />}
                {activeStep === SignupMethods.emailMobileOTP && <EmailMobileOTP />}
                {activeStep === SignupMethods.authenticatorOTP && <AuthenticatorOTP />}
                {activeStep === SignupMethods.faceRecognition && <FaceRecognition />}

                <Box mt={2} display="flex" justifyContent="space-between">
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
