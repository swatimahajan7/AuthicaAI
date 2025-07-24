export const AuthMethods = {
    usernamePassword: 'usernamePassword',
    emailMobileOTP: 'emailMobileOTP',
    authenticatorOTP: 'authenticatorOTP',
    faceRecognition: 'faceRecognition'
}

export const AuthSteps = [
    AuthMethods.usernamePassword,
    AuthMethods.emailMobileOTP,
    AuthMethods.authenticatorOTP,
    AuthMethods.faceRecognition
]
