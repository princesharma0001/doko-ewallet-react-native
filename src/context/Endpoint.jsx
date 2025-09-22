const url = "https://1f9dq437-8000.inc1.devtunnels.ms/"; //  url


const ApiConfig = {
    login: `${url}api/v1/auth/login`,
    signup: `${url}api/v1/auth/signup`,
    resendOTP: `${url}api/v1/auth/resendOTP`,
    verifyOTP: `${url}api/v1/auth/verifyOTP`,
    updateProfile: `${url}api/v1/auth/updateProfile`,
    createPasscode: `${url}api/v1/auth/createPasscode`,
    checkAccount: `${url}api/v1/auth/checkAccount`,
    getProfile: `${url}api/v1/auth/getProfile`,
    forgotPasscode: `${url}api/v1/auth/forgotPasscode`,
};
export default ApiConfig;