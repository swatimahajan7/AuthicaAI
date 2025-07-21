export const SignupMethods = {
    usernamePassword: 'usernamePassword',
    emailMobileOTP: 'emailMobileOTP',
    authenticatorOTP: 'authenticatorOTP',
    faceRecognition: 'faceRecognition'
}

export const SignupSteps = [SignupMethods.usernamePassword, SignupMethods.emailMobileOTP, SignupMethods.authenticatorOTP, SignupMethods.faceRecognition]