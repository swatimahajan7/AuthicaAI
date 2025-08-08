import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthMethods } from "../constants";
import AuthenticatorOTP, { type AuthenticatorOTPHandle } from "../components/AuthenticatorOTP";
import FaceRecognition, { type FaceRecognitionHandle } from "../components/FaceRecognition";
import EmailMobileOTP, { type EmailMobileOTPHandle } from "../components/EmailMobileOTP";
import { Box } from "@mui/material";
import "./Signin.css";
import SigninForm, { type SigninFormHandle } from "../components/SigninForm";
import { useAuthContext } from "../context/globalAuthContext";

const Signin = () => {
  const { setCurrentUser, currentUser, users, riskConfig } = useAuthContext();
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<boolean>(false);

  const [currentStep, setCurrentStep] = useState(AuthMethods.usernamePassword);
  const [allSteps, setAllSteps] = useState<string[]>([AuthMethods.usernamePassword]);

  const signinFormRef = useRef<SigninFormHandle>(null);
  const emailOtpRef = useRef<EmailMobileOTPHandle>(null);
  const authenticatorRef = useRef<AuthenticatorOTPHandle>(null);
  const faceRef = useRef<FaceRecognitionHandle>(null);

  useEffect(() => {
    resetSigninState();
  }, []);

  useEffect(() => {
    if (!currentUser) resetSigninState();
  }, [currentUser]);

  const resetSigninState = () => {
    setAllSteps([AuthMethods.usernamePassword]);
    setCurrentStep(AuthMethods.usernamePassword);
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
        setAllSteps(userRiskConfig.authMethods);
        setCurrentStep(userRiskConfig.authMethods[0]);
      }
    }
  }, [riskConfig]);

  const handleContinue = async () => {
    if (currentStep === AuthMethods.usernamePassword) {
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
          setAllSteps(userRiskConfig.authMethods);
          setAdminUser(updatedUser.isAdmin || false);

          if (userRiskConfig.authMethods.length === 1) {
            navigate(updatedUser.isAdmin ? "/adminDashboard" : "/userDashboard");
          } else {
            setCurrentStep(userRiskConfig.authMethods[1]);
          }
          return;
        }
      }
    }

    if (currentStep === AuthMethods.emailMobileOTP && !emailOtpRef.current?.isVerified()) {
      alert("Please complete both email and phone verification.");
      return;
    }

    if (currentStep === AuthMethods.authenticatorOTP && !authenticatorRef.current?.isVerified()) {
      alert("Please verify the Authenticator OTP before continuing.");
      return;
    }

    if (currentStep === AuthMethods.faceRecognition && !faceRef.current?.isCaptured()) {
      alert("Please capture your face before continuing.");
      return;
    }

    const nextIndex = allSteps.indexOf(currentStep) + 1;
    if (nextIndex < allSteps.length) {
      setCurrentStep(allSteps[nextIndex]);
    } else {
      navigate(adminUser ? "/adminDashboard" : "/userDashboard");
    }
  };

  return (
    <div className="signin-wrapper-div">
      <div className="signin-section">
        <Box
          sx={{
            backgroundColor: "#f0f8ff",
            paddingY: "50px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "30px",
            overflowY: "scroll",
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src="../src/assets/logo.svg" width={150} className="logo" />
          <img src="../src/assets/AuthicaAI_logo.svg" width={200} className="logo" />
          {currentStep === AuthMethods.usernamePassword && (
            <SigninForm ref={signinFormRef} onVerified={handleContinue} />
          )}
          {currentStep === AuthMethods.emailMobileOTP && (
            <EmailMobileOTP ref={emailOtpRef} mode="signin" onVerified={handleContinue} />
          )}
          {currentStep === AuthMethods.authenticatorOTP && (
            <AuthenticatorOTP ref={authenticatorRef} mode="signin" onVerified={handleContinue} />
          )}
          {currentStep === AuthMethods.faceRecognition && (
            <FaceRecognition ref={faceRef} mode="signin" onVerified={handleContinue} />
          )}
        </Box>
      </div>
    </div>
  );
};

export default Signin;
