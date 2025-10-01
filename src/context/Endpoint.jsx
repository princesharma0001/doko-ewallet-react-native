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
    deleteAccount: `${url}api/v1/auth/deleteAccount`,
    getPlans: `${url}api/v1/plan/list`,
    getContent: `${url}api/v1/content/list`,
    purchaseSubscription: `${url}api/v1/subscription/purchase`,
    verifyPayment: `${url}api/v1/subscription/verify-payment`,
    getActiveSubscription: `${url}api/v1/subscription/getActive`,
    getWalletList: `${url}api/v1/wallet/list`,
    initiateDeposit: `${url}api/v1/deposit/initiate`,
    verifyDeposit: `${url}api/v1/deposit/verify`,
    searchUsers: `${url}api/v1/user/list`,
    sendMessage: `${url}api/v1/message/send`,
    getMessageList: `${url}api/v1/message/list`,
    sendPaymentSplit: `${url}api/v1/message/payment/split`,
    acceptPayment: `${url}api/v1/message/payment/accept`,
    sendTransfer: `${url}api/v1/transfer/send`,
    getTransactionList: `${url}api/v1/transaction/list`,
};
export default ApiConfig;