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

export const riskAuthMap = {
    Medium: [AuthMethods.usernamePassword],
    High: [AuthMethods.usernamePassword, AuthMethods.emailMobileOTP],
    Severe: [AuthMethods.usernamePassword, AuthMethods.emailMobileOTP, AuthMethods.authenticatorOTP]
};