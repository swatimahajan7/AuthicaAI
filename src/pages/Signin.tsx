import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import StepperComponent from "../components/StepperComponent";
import { AuthMethods } from "../constants";
import AuthenticatorOTP, { type AuthenticatorOTPHandle } from "../components/AuthenticatorOTP";
import FaceRecognition, { type FaceRecognitionHandle } from "../components/FaceRecognition";
import EmailMobileOTP, { type EmailMobileOTPHandle } from "../components/EmailMobileOTP";
import { Button, Box } from "@mui/material";
import SigninSuccess from "../components/SigninSuccess";
import "./Signin.css";
import SigninForm, { type SigninFormHandle } from "../components/SigninForm";
import { useAuthContext } from "../context/globalAuthContext";

const Signin = () => {
  const { setCurrentUser, currentUser, users, riskConfig } = useAuthContext();
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<boolean>(false);

  const [steps, setSteps] = useState<string[]>([AuthMethods.usernamePassword]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const [isAllStepsComplete, setIsAllStepsComplete] = useState(false);

  const activeStep = steps[activeStepIndex];

  const signinFormRef = useRef<SigninFormHandle>(null);
  const emailOtpRef = useRef<EmailMobileOTPHandle>(null);
  const authenticatorRef = useRef<AuthenticatorOTPHandle>(null);
  const faceRef = useRef<FaceRecognitionHandle>(null);

  useEffect(() => {
    resetSigninState();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      resetSigninState();
    }
  }, [currentUser]);

  const resetSigninState = () => {
    setSteps([AuthMethods.usernamePassword]);
    setActiveStepIndex(0);
    setCompleted({});
    setIsAllStepsComplete(false);
    setAdminUser(false);
  };

  useEffect(() => {
    if (currentUser) {
      const userRiskConfig = riskConfig.find(config => config.risk === currentUser.risk);
      if (userRiskConfig) {
        const updatedUser = {
          ...currentUser,
          authMethods: userRiskConfig.authMethods,
          requireEmailOTP: userRiskConfig.requireEmailOTP,
          requirePhoneOTP: userRiskConfig.requirePhoneOTP,
        };

        setCurrentUser(updatedUser);
        setSteps(userRiskConfig.authMethods);
        setActiveStepIndex(0);
        setCompleted({});
      }
    }
  }, [riskConfig]);

  const handleBack = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(prev => prev - 1);
    }
  };

  const handleContinue = async () => {
    if (isAllStepsComplete) {
      navigate(adminUser ? "/adminDashboard" : "/userDashboard");
      return;
    }

    if (activeStep === AuthMethods.usernamePassword) {
      const isValid = await signinFormRef.current?.validate();
      if (!isValid) return;

      const user = users.find(u => u.username === signinFormRef.current?.getValues().username);
      if (user) {
        const userRiskConfig = riskConfig.find(config => config.risk === user.risk);
        if (userRiskConfig) {
          const updatedUser = {
            ...user,
            authMethods: userRiskConfig.authMethods,
            requireEmailOTP: userRiskConfig.requireEmailOTP,
            requirePhoneOTP: userRiskConfig.requirePhoneOTP,
          };

          setCurrentUser(updatedUser);
          setSteps(userRiskConfig.authMethods);

          if (userRiskConfig.authMethods.length > 1) {
            setActiveStepIndex(1);
            setCompleted({});
            setIsAllStepsComplete(false);
          } else {
            setActiveStepIndex(0);
            setCompleted({ 0: true });
            setIsAllStepsComplete(true);
          }

          setAdminUser(updatedUser.isAdmin || false);
          return;
        }
      }
    }

    if (activeStep === AuthMethods.emailMobileOTP) {
      const isVerified = emailOtpRef.current?.isVerified();
      if (!isVerified) {
        alert("Please complete both email and phone verification.");
        return;
      }
    }

    if (activeStep === AuthMethods.authenticatorOTP) {
      const isVerified = authenticatorRef.current?.isVerified();
      if (!isVerified) {
        alert("Please verify the Authenticator OTP before continuing.");
        return;
      }
    }

    if (activeStep === AuthMethods.faceRecognition) {
      const isCaptured = faceRef.current?.isCaptured();
      if (!isCaptured) {
        alert("Please capture your face before continuing.");
        return;
      }
    }

    setCompleted(prev => ({ ...prev, [activeStepIndex]: true }));

    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(prev => prev + 1);
    } else {
      setIsAllStepsComplete(true);
    }
  };

  return (
    <div className="signin-wrapper-div">
      <div className="signin-section">
        {!isAllStepsComplete ? (
          <>
            <StepperComponent steps={steps} activeStepNumber={activeStepIndex} completed={completed} />

            <Box
              sx={{
                backgroundColor: "#f0f8ff",
                paddingY: "50px",
                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 -4px 8px 0 rgba(0, 0, 0, 0.1)",
                borderRadius: "30px",
                overflowY: "scroll",
              }}
            >
              <img src="../src/assets/logo.svg" width={200} className="logo" />

              {activeStep === AuthMethods.usernamePassword && <SigninForm ref={signinFormRef} />}
              {activeStep === AuthMethods.emailMobileOTP && <EmailMobileOTP ref={emailOtpRef} mode="signin" />}
              {activeStep === AuthMethods.authenticatorOTP && <AuthenticatorOTP ref={authenticatorRef} mode="signin" />}
              {activeStep === AuthMethods.faceRecognition && <FaceRecognition ref={faceRef} mode="signin" />}
            </Box>

            <Box my={2} display="flex" justifyContent="space-between">
              <Button variant="outlined" onClick={handleBack} disabled={activeStepIndex === 0}>
                Back
              </Button>
              <Button variant="contained" onClick={handleContinue}>
                Continue
              </Button>
            </Box>
          </>
        ) : (
          <SigninSuccess isAdmin={adminUser} username={currentUser?.username}/>
        )}
      </div>
    </div>
  );
};

export default Signin;
