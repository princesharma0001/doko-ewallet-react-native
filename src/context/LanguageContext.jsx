import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Translation files
const translations = {
  en: {
    // Settings
    settings: "Settings",
    search: "Search",
    display: "Display",
    language: "Language",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    english: "English",
    nepali: "नेपाली",
    apply: "Apply",

    //logout

    logoutTitle: "Logout",
    logSubtitle:
      "Are you sure you want to logout? You will need to sign in again to access your account.",

    // Login
    signInToAccount: "Sign in to your Account",
    enterPhoneEmailUsername: "Enter phone or email or username",
    next: "Next",
    checking: "Checking...",
    dontHaveAccount: "Don't have an account?",
    signUp: "Sign up",
    pleaseEnterPhoneNumber:
      "Please enter your phone number, email, or username",
    error: "Error",
    userNotFound: "User not found.",
    unexpectedError: "An unexpected error occurred. Please try again.",

    // EnterPassword
    welcomeBack: "Welcome Back",
    user: "User",
    enterPasscode: "Enter Passcode",
    forgotPasscode: "Forgot your passcode?",
    useFaceIdToUnlock: "Use Face ID to unlock",
    faceIdAuthentication: "Face ID Authentication",
    useFaceToUnlock: "Use your face to unlock the app",
    placeFaceInCamera: "Place your face in front of the camera",
    usePasscode: "Use Passcode",
    cancel: "Cancel",
    authenticationFailed: "Authentication Failed",
    faceIdFailed:
      "Face ID authentication failed. Please try again or use passcode.",
    ok: "OK",
    forgotPasscodeTitle: "Forgot Passcode?",
    sendVerificationCode:
      "We will send you a verification code to reset your passcode.",
    sendCode: "Send Code",
    identityNotFound: "Identity not found. Please try again.",
    codeSent: "Code Sent",
    verificationCodeSent: "Verification code sent successfully",
    failed: "Failed",
    failedToSendCode: "Failed to send verification code",
    success: "Success",
    loggedInSuccessfully: "Logged in successfully!",
    loginFailed: "Login failed",
    invalidCredentials: "Invalid credentials. Please try again.",
    identityNotFoundGoBack:
      "Identity not found. Please go back and enter your email/phone/username.",

    // Signup
    letsGetStarted: "Let's Get Started!",
    enterYourPhoneNumber: "Enter your phone number",
    createAccount: "Create Account",
    creatingAccount: "Creating Account...",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign In",
    pleaseEnterPhoneNumber: "Please enter your phone number",
    pleaseEnterValidPhoneNumber: "Please enter a valid phone number",
    accountCreatedSuccessfully: "Account created successfully!",
    otpSentToPhone: "OTP has been sent to your phone.",
    failedToCreateAccount: "Failed to create account. Please try again.",

    // CountryPicker
    selectCountry: "Select Country",
    search: "Search",

    // PhoneVerify
    phoneVerification: "Phone Verification",
    enterVerificationCode: "Please enter 4-digit verification code sent to",
    didntReceiveCode: "Didn't receive the code?",
    submit: "Submit",
    verifying: "Verifying...",
    pleaseEnterOtp: "Please enter OTP",
    userIdentityNotFound:
      "User identity not found. Please try signing up again.",
    phoneNumberVerified: "Phone number verified successfully!",
    invalidOtp: "Invalid OTP. Please try again.",
    otpSentSuccessfully: "OTP has been sent Successfully.",
    failedToResendCode: "Failed to resend code. Please try again.",

    // EnterNameSign
    personalInformation: "Personal Information",
    providePersonalDetails:
      "Please provide your personal details and address information",
    enterFirstName: "Enter first name",
    enterLastName: "Enter last name",
    dateOfBirth: "Date of Birth",
    enterEmailAddress: "Enter email address",
    addressInformation: "Address Information",
    enterCity: "Enter city",
    enterStreetAddress: "Enter street address",
    enterBuildingName: "Enter building name",
    enterLocationArea: "Enter location/area",
    continue: "Continue",
    updatingProfile: "Updating Profile...",
    authenticationTokenNotFound:
      "Authentication token not found. Please try again.",
    profileUpdatedSuccessfully: "Profile updated successfully!",
    failedToUpdateProfile: "Failed to update profile. Please try again.",
    couldNotResendOtp: "Could not resend OTP. Please try again.",
    failedToResendOtp: "Failed to resend OTP. You can try again.",
    firstNameRequired: "First name is required",
    firstNameMinLength: "First name must be at least 2 characters",
    lastNameRequired: "Last name is required",
    lastNameMinLength: "Last name must be at least 2 characters",
    dayRequired: "Day required",
    validDay: "Please enter a valid day (1-31)",
    monthRequired: "Month required",
    validMonth: "Please enter a valid month (1-12)",
    yearRequired: "Year required",
    validYear: "Please enter a valid year",
    emailRequired: "Email is required",
    validEmail: "Please enter a valid email address",
    cityRequired: "City is required",
    cityMinLength: "City must be at least 2 characters",
    streetRequired: "Street is required",
    streetMinLength: "Street must be at least 2 characters",
    buildingNameRequired: "Building name is required",
    buildingNameMinLength: "Building name must be at least 2 characters",
    locationRequired: "Location is required",
    locationMinLength: "Location must be at least 2 characters",

    // EmailVerify
    verifyYourEmail: "Verify your email",
    sentVerificationCode:
      "We've sent a 6-digit verification code to your email address. Please enter it below.",
    didntReceiveCode: "Didn't receive the code?",
    resending: "Resending...",
    verifyEmail: "Verify Email",
    verifying: "Verifying...",
    pleaseEnterCompleteCode: "Please enter the complete verification code",
    emailNotFound: "Email not found. Please go back and try again.",
    emailVerifiedSuccessfully: "Email verified successfully!",
    invalidOtp: "Invalid OTP. Please try again.",
    otpSentSuccessfully: "OTP has been sent Successfully.",
    failedToResendCode: "Failed to resend code. Please try again.",

    // ForgotVerify
    verifyYourIdentity: "Verify Your Identity",
    enterVerificationCodeSent: "Please enter 4-digit verification code sent to",
    pleaseEnterVerificationCode: "Please enter the 4-digit verification code",
    verificationSuccessful: "Verification Successful",
    codeVerifiedSuccessfully: "Code verified successfully",
    verificationFailed: "Verification Failed",
    invalidVerificationCode: "Invalid verification code",
    error: "Error",
    unexpectedErrorOccurred: "An unexpected error occurred",
    codeSent: "Code Sent",
    newVerificationCodeSent: "New verification code sent successfully",
    failed: "Failed",
    failedToResendCode: "Failed to resend code",

    // ForgotCreatePassword
    createPasscode: "Create Passcode",
    confirmPasscode: "Confirm Passcode",
    passcodesDoNotMatch: "The passcodes do not match. Please try again.",
    authenticationTokenNotFound:
      "Authentication token not found. Please try again.",
    passcodeCreatedSuccessfully: "Your passcode has been created successfully!",
    failedToCreatePasscode: "Failed to create passcode. Please try again.",

    // FaceID
    enterWithFaceId: "Enter with Face ID?",
    wouldLikeToEnterWithFaceId:
      "Would you like to enter the application with Face ID",
    deviceNotSupportBiometric:
      "Your device doesn't support biometric authentication.",
    pleaseSetupBiometricInSettings:
      "Please set up {biometricName} in Settings first.",
    settingUp: "Setting up...",
    enableBiometric: "Enable {biometricName}",
    maybeLater: "Maybe Later",
    notSupported: "Not Supported",
    faceIdNotSupported: "Face ID/Touch ID is not supported on this device.",
    ok: "OK",
    notEnrolled: "Not Enrolled",
    pleaseSetupBiometricFirst:
      "Please set up Face ID/Touch ID in your device settings first.",
    cancel: "Cancel",
    settings: "Settings",
    goToSettings:
      "Please go to Settings > Face ID & Passcode to set up Face ID.",
    faceIdEnabled: "Face ID Enabled",
    faceIdEnabledSuccessfully:
      "Face ID has been successfully enabled for your account!",
    continue: "Continue",
    cancelled: "Cancelled",
    faceIdSetupCancelled: "Face ID setup was cancelled.",
    fallback: "Fallback",
    userChosePasscode: "User chose to use passcode instead.",
    authenticationFailed: "Authentication Failed",
    faceIdAuthenticationFailed:
      "Face ID authentication failed. Please try again.",
    skipFaceId: "Skip Face ID",
    skipFaceIdConfirmation:
      "Are you sure you want to skip Face ID setup? You can enable it later in settings.",
    skip: "Skip",
    faceId: "Face ID",
    touchId: "Touch ID",
    biometric: "Biometric",
    faceIdAuthentication: "Face ID Authentication",
    useFaceToUnlock: "Use your face to unlock the app",
    placeFaceInCamera: "Place your face in front of the camera",
    usePasscode: "Use Passcode",

    // ProfileSection
    personalDetails: "Personal Details",
    mySubscription: "My Subscription",
    notificationSettings: "Notification Settings",
    privacy: "Privacy",
    termsAndConditions: "Terms & Conditions",
    referral: "Referral",
    deleteAccount: "Delete Account",
    verifyIdentity: "Verify Identity",
    authenticationTokenNotFound:
      "Authentication token not found. Please login again.",
    accountDeleted: "Account Deleted",
    accountDeletedSuccessfully: "Your account has been successfully deleted.",
    failedToDeleteAccount: "Failed to delete account. Please try again.",
    unexpectedErrorOccurred: "An unexpected error occurred. Please try again.",
    getPlan: "Subscribe",
    // ProfileDetails
    personalDetails: "Personal Details",
    name: "Name",
    lastName: "Last Name",
    username: "Username",
    email: "Email",
    dateOfBirth: "Date of Birth (YYYY-MM-DD)",
    address: "Address",
    phoneNumber: "Phone Number",
    nameRequired: "Name is required",
    nameMinLength: "Name must be at least 2 characters",
    lastNameRequired: "Last name is required",
    lastNameMinLength: "Last name must be at least 2 characters",
    usernameRequired: "Username is required",
    usernameInvalid:
      "Username must be 3-20 characters, letters, numbers, and underscores only",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email address",
    dateOfBirthRequired: "Date of Birth is required",
    dateOfBirthInvalid: "Please enter date in YYYY-MM-DD format",
    addressRequired: "Address is required",
    addressMinLength: "Address must be at least 5 characters",
    phoneNumberRequired: "Phone Number is required",
    phoneNumberInvalid: "Please enter a valid phone number",
    submitting: "Submitting...",
    saveDetails: "Save Details",
    contactSupport: "Contact Support",
    profileUpdatedSuccessfully: "Profile updated successfully!",
    failedToUpdateProfile: "Failed to update profile. Please try again.",
    yourInformationSaved:
      "Your Information has been saved and submitted to regulators, if you would like to update this information let us know",

    // MySubscription
    myProSubscription: "My Pro Subscription",
    cardIssued: "Card issued",
    freeVirtualCards: "Free Virtual Cards",
    noCommissionTrades: "No Commission Trades",
    cashbackReceived: "Cashback Received",
    cancelSubscription: "Cancel Subscription",
    noActiveSubscriptionFound: "No active subscription found to cancel",
    pleaseProvideReason: "Please provide a reason for cancellation",
    unableToCancelSubscription: "Unable to cancel subscription",
    subscriptionCancelledSuccessfully: "Subscription cancelled successfully",
    failedToCancelSubscription: "Failed to cancel subscription",
    anUnexpectedErrorOccurred: "An unexpected error occurred",
    weAreSorryToSeeYouGo:
      "We're sorry to see you go! Please let us know why you're cancelling your subscription:",
    enterYourReasonForCancellation: "Enter your reason for cancellation...",
    characters: "characters",
    okay: "Okay",

    // Notification
    notifications: "Notifications",
    marketingOffers: "Marketing Offers",
    marketingOffersDescription:
      "I accept to recieve emails about DOKO's services and products that may benefit me in the future.",
    transactions: "Transactions",
    transactionsDescription:
      "I accept to receive notifications regarding all transactions.",
    investmentNews: "Investment News",
    investmentNewsDescription:
      "I accept to receive emails and in-app notifications of investment.",
    loadingSettings: "Loading settings...",
    settings: "Settings",
    failedToLoadNotificationSettings: "Failed to load notification settings",
    notification: "Notification",
    authenticationTokenNotFound:
      "Authentication token not found. Please log in again.",
    anUnexpectedErrorOccurred:
      "An unexpected error occurred. Please try again.",

    // ReferralSection
    earnFiftyDollarsForEveryInvite: "Earn 50$ For Every Invite",
    timeLeft: "Time left",
    allActionsBelowMustBeCompleted: "All actions below must be completed",
    whatMyInvitedFriendsNeedToDo: "What my invited friends need to do",
    letYourFriendsDownloadTheApp:
      "Let your friends download the app from the app store",
    pressOnTheLinkProvided:
      "Press On The Link Provided by you to them after downloading the app",
    letThemVerifyTheirAccount: "Let them verify their account",
    convinceThemToSubscribeToDoko: "Convince them to subscribe to DOKO",
    invitesEarned: "Invites {amount} earned",
    pending: "Pending",
    completed: "Completed",
    sendALink: "Send a Link",

    // ReferralDetails
    yourInvite: "Your Invite",
    whatYourInviteHasCompleted: "What your invite has completed",
    letYourFriendsDownloadTheAppFromAppStore:
      "Let your friends download the app form the app store",
    pressOnTheLinkProvidedByYou:
      "Press On The Link Provided by you to them after downloading the app",
    letThemVerifyTheirAccount: "Let them verify their account",
    convinceThemToSubscribeToDoko: "Convince them to subscribe to DOKO",
    makeThemCompleteTheirPaymentOfSubscription:
      "Make them complete their payment of subscription",

    // DeleteAccountConfirmationModal
    deleteAccount: "Delete Account",
    areYouSureYouWantToDeleteYourAccount:
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.",
    thisWillPermanentlyDeleteAllYourData:
      "This will permanently delete all your data, transactions, and account information.",
    cancel: "Cancel",
    deleting: "Deleting...",

    // CommunitySection
    community: "Community",
    noChannelSelected: "No Channel Selected",
    selectChannelFromListOrCreateNew:
      "Select a channel from the list or create a new one to start chatting.",
    createChannel: "Create Channel",
    guide: "Guide",
    suggested: "Suggested",
    tips: "Tips",
    selectAChannel: "Select a Channel",
    chooseFromExistingChannels:
      "Choose from existing channels in the sidebar to join conversations on specific topics.",
    createANewChannel: "Create a New Channel",
    ifYouCantFindWhatYoureLookingFor:
      "If you can't find what you're looking for, create a new channel to start a fresh discussion.",
    participateInDiscussions: "Participate in Discussions",
    onceYouveJoinedAChannel:
      "Once you've joined a channel, you can send messages, share files, and engage with other community members.",
    suggestedChannels: "Suggested Channels",
    discoverPopularChannels:
      "Discover popular channels and communities that might interest you.",
    communityTips: "Community Tips",
    learnBestPractices:
      "Learn best practices for engaging with the community and making the most of your experience.",

    // Subscription
    later: "Later",
    selectPlan: "Select Plan",
    noPlanSelected: "No plan selected",
    mostPopular: "Most Popular",
    featuresForYou: "Features for you",
    choosePlan: "Choose {planName} Plan",
    thisIsTwelveMonthPlan:
      "This is a 12 month plan. By proceeding, you agree to the",
    promotionTerms: "Promotion Terms",
    planTerms: "Plan Terms",
    and: "and",
    insuranceDocuments: "Insurance Documents",
    loadingSubscriptionPlans: "Loading subscription plans...",
    error: "Error",

    // SubscriptionDetails
    subscribeNow: "Subscribe Now",
    addMoneyToYourAccount: "Add Money To Your Account",
    youNeedToDepositMoney:
      "You need to deposit money to your account to subscribe :)",
    payWithPickup: "Pay With Pickup",
    payWithCard: "Pay With Card",
    payNprAndOpenAccount: "Pay NPR {price}/Month and Open Account",
    issuanceFee: "Issuance Fee",
    planSubscription: "{planName} Subscription",
    totalPayment: "Total Payment",
    subscriptionActivated: "Subscription Activated",
    yourSubscriptionHasBeenActivated:
      "Your subscription has been successfully activated!",

    // DAppSection
    dAppBrowser: "dApp Browser",
    browseAndInteract:
      "Browse and interact with decentralized applications directly from the platform.",
    search: "Search",
    all: "All",
    defi: "DeFi",
    nfts: "NFTs",
    games: "Games",
    openDApp: "Open dApp",
    wouldYouLikeToOpen: "Would you like to open",
    cancel: "Cancel",
    open: "Open",
    addCustomDApp: "Add Custom dApp",
    addCustomDAppDescription:
      "This feature will allow you to add custom dApps to your browser.",
    ok: "OK",
    addCustomDAppButton: "+ Add Custom dApp",

    // TransactionManagement
    transactionManagement: "Transaction Management",
    searchTransactions: "Search transactions...",
    selectType: "Select Type",
    selectStatus: "Select Status",
    selectNetwork: "Select Network",
    fromDate: "From Date",
    toDate: "To Date",
    clearAllFilters: "Clear All Filters",
    exportTransactions: "Export Transactions",
    exporting: "Exporting...",
    showAnalytics: "Show Analytics",
    hideAnalytics: "Hide Analytics",
    transactionAnalytics: "Transaction Analytics",
    visualOverview: "Visual overview of your transaction history",
    recentTransactions: "Recent Transactions",
    loadingTransactions: "Loading transactions...",
    noTransactionsFound: "No Transactions Found",
    tryAdjustingSearch: "Try adjusting your search criteria",
    transactionHistoryWillAppear: "Your transaction history will appear here",
    selectFromDate: "Select From Date",
    selectToDate: "Select To Date",
    cancel: "Cancel",
    select: "Select",
    exportTransactionsTitle: "Export Transactions",
    exportDescription:
      "Your transaction data has been formatted and is ready to share. You can share it via email, messaging apps, or save it to your device.",
    transactionsExported: "transactions exported",
    share: "Share",
    error: "Error",
    authenticationRequired: "Authentication required",
    failedToFetchTransactions: "Failed to fetch transactions",
    unexpectedErrorOccurred: "An unexpected error occurred",
    failedToShareData: "Failed to share data",
    transactionExport: "Transaction Export",
    all: "All",
    send: "Send",
    receive: "Receive",
    pending: "Pending",
    failed: "Failed",
    deposit: "Deposit",
    withdrawal: "Withdrawal",
    subscription: "Subscription",
    allStatus: "All Status",
    completed: "Completed",
    cancelled: "Cancelled",
    processing: "Processing",
    allNetworks: "All Networks",
    ethereum: "Ethereum",
    bitcoin: "Bitcoin",
    polygon: "Polygon",
    binanceSmartChain: "Binance Smart Chain",
    avalanche: "Avalanche",
    solana: "Solana",
    selectNetwork: "Select Network",
    subscriptionPayment: "Subscription Payment",
    chatPayment: "Chat Payment",
    to: "To",
    from: "From",
    transaction: "Transaction",

    // NotificationList
    notifications: "Notifications",
    searchNotifications: "Search notifications...",
    clearAll: "Clear All",
    errorLoadingNotifications: "Notifications",
    noDataFound: "No Data Found",
    youHaveNoNotificationsYet: "You have no notifications yet",
    authenticationRequired: "Authentication required",
    failedToLoadNotifications: "Failed to load notifications",
    anErrorOccurredWhileLoading:
      "An error occurred while loading notifications",
    requesterIdMissing: "Requester ID missing",
    requestAccepted: "Request accepted",
    failedToAcceptRequest: "Failed to accept request",
    requestRejected: "Request rejected",
    failedToRejectRequest: "Failed to reject request",
    cleared: "Cleared",
    failedToClear: "Failed to clear",
    failedToClearNotifications: "Failed to clear notifications",
    success: "Success",
    error: "Error",
    justNow: "Just now",
    minutesAgo: "m ago",
    hoursAgo: "h ago",
    daysAgo: "d ago",

    // CurrentHistory
    history: "History",
    filtered: "Filtered",
    all: "All",
    pending: "Pending",
    completed: "Completed",
    pullToRefresh: "Pull to refresh",
    retry: "Retry",
    noTransactionsFound: "No {filter} transactions found",
    filterByDate: "Filter by Date",
    fromDate: "From Date",
    toDate: "To Date",
    youHaveBeenLoggedOut: "You have been logged out",
    clearAllDates: "Clear All Dates",
    clearAllFilters: "Clear All Filters",
    confirm: "Confirm",
    dateRangeUpdated: "Date Range Updated",
    fromDateAfterToDate:
      "From date is after to date. To date has been cleared.",
    invalidDateRange: "Invalid Date Range",
    toDateBeforeFromDate:
      "To date cannot be before from date. Please select a valid date.",
    fromDateAfterToDateInvalid:
      "From date cannot be after to date. Please select valid dates.",
    filterError: "Filter Error",
    failedToApplyDateFilter: "Failed to apply date filter. Please try again.",
    failedToClearFilters: "Failed to clear filters. Please try again.",
    sentTo: "Sent to",
    receivedFrom: "Received from",
    walletDeposit: "Wallet Deposit",
    transactionWith: "Transaction with",
    unknownReceiver: "Unknown Receiver",
    to: "To",
    walletTopUp: "Wallet top-up",
    transfer: "Transfer",
    amount: "Amount",
    currency: "Currency",
    status: "Status",
    fee: "Fee",
    authenticationRequired: "Authentication required",
    failedToFetchTransactions: "Failed to fetch transactions",
    anErrorOccurredWhileFetching:
      "An error occurred while fetching transactions",

    // CurrentAccount
    yourBalance: "Your balance",
    noWalletFound: "No wallet found",
    send: "Send",
    deposit: "Deposit",
    qrCode: "QR Code",
    addCard: "+ Add Card",
    selectCurrency: "Select Currency",
    latestTransactions: "Latest Transactions",
    seeAll: "See All",
    noTransactionsFound: "No transactions found",
    pullToRefresh: "Pull to refresh",
    sendOptionSelected: "Send Option Selected",
    youSelected: "You selected:",
    ok: "OK",
    sendToDokoUser: "Send to DOKO User",
    sendMoneyInternationally: "Send Money Internationally",
    sendViaBankTransfer: "Send Via Bank Transfer",
    sentTo: "Sent to",
    receivedFrom: "Received from",
    walletDeposit: "Wallet Deposit",
    subscriptionPurchase: "Subscription Purchase",
    transactionWith: "Transaction with",
    unknownSender: "Unknown Sender",
    unknownReceiver: "Unknown Receiver",
    to: "To",
    walletTopUp: "Wallet top-up",
    transfer: "Transfer",
    transaction: "Transaction",
    justNow: "Just now",
    hoursAgo: "h ago",
    daysAgo: "d ago",
    authenticationRequired: "Authentication required",
    failedToFetchTransactions: "Failed to fetch transactions",
    anErrorOccurredWhileFetching:
      "An error occurred while fetching transactions",

    // MainHomeScreen
    currentAccount: "Current Account",
    cryptoAccount: "Crypto Account",
    cardAccount: "Card Account",
    apps: "Apps",
    dAppBrowser: "DApp Browser",

    // AccountBottomSheet
    selectAccount: "Select Account",

    // CreditCard
    creditDebitCard: "Credit/Debit Card",
    cardDetails: "Card Details",
    selectCurrency: "Select Currency",
    payNow: "Pay Now",
    error: "Error",
    pleaseEnterValidAmount: "Please enter a valid amount",
    pleaseEnterCompleteCardDetails: "Please enter complete card details",
    processingPayment: "Processing Payment",
    pleaseWait: "Please wait...",
    userNotAuthenticated: "User not authenticated",
    paymentFailed: "Payment Failed",
    depositSuccessful: "Deposit Successful",
    successfullyAdded: "Successfully added",
    toYourWallet: "to your wallet",
    verificationFailed: "Verification Failed",
    failedToVerifyDeposit: "Failed to verify deposit",
    verificationError: "Verification Error",
    errorOccurredWhileVerifying: "An error occurred while verifying deposit",
    failedToInitiatePayment: "Failed to initiate payment",
    paymentError: "Payment Error",
    unexpectedErrorOccurred: "An unexpected error occurred during payment",
    walletTopUp: "Wallet top-up",
    customer: "Customer",
    customerEmail: "customer@example.com",

    // QrCodeSendRecive
    qrCode: "QR Code",
    chooseAnOption: "Choose an option",
    sendMoneyByScanning:
      "Send money by scanning a QR code or receive money by showing your QR code",
    sendMoney: "Send Money",
    scanQrCodeToSend: "Scan QR code to send",
    receiveMoney: "Receive Money",
    showQrCodeToReceive: "Show QR code to receive",
    scanQrCode: "Scan QR Code",
    requestingCameraPermission: "Requesting camera permission...",
    cameraPermissionDenied: "Camera permission denied",
    grantPermission: "Grant Permission",
    cameraNotAvailable: "Camera not available",
    positionQrCodeWithinFrame: "Position the QR code within the frame",
    scanQrCodeToSendMoney: "Scan a QR code to send money",
    yourQrCode: "Your QR Code",
    showThisQrCodeToReceiveMoney: "Show this QR code to receive money",
    quickShare: "Quick Share",
    sharing: "Sharing...",
    qrCodeDataNotAvailable: "QR code data not available",
    copied: "Copied",
    qrCodeDataCopiedToClipboard: "QR code data copied to clipboard",
    failedToCopyQrCodeData: "Failed to copy QR code data",
    qrCodeNotReady: "QR code not ready",
    qrCodeImageSharedSuccessfully: "QR code image shared successfully",
    failedToShareQrCodeImage: "Failed to share QR code image",
    qrCodeDetected: "QR Code Detected",
    scanned: "Scanned",
    thisDoesntAppearToBeDokoPaymentQrCode:
      "This doesn't appear to be a DOKO payment QR code.",
    tryAgain: "Try Again",
    cancel: "Cancel",
    invalidQrCode: "Invalid QR Code",
    thisQrCodeIsNotValidDokoPaymentCode:
      "This QR code is not a valid DOKO payment code. Please scan a DOKO QR code.",
    failedToProcessQrCode: "Failed to process QR code. Please try again.",
    permissionRequired: "Permission Required",
    cameraPermissionIsRequiredToScanQrCodes:
      "Camera permission is required to scan QR codes. Please enable it in your device settings.",
    openSettings: "Open Settings",
    permission: "Permission",
    cameraPermissionIsRequiredToScanQrCodesShort:
      "Camera permission is required to scan QR codes",
    error: "Error",
    failedToRequestCameraPermission: "Failed to request camera permission",
    navigationNotAvailable: "Navigation not available",
    sendMeMoneyViaDoko: "Send me money via DOKO!",
    scanThisQrCodeToSendMoneyTo: "Scan this QR code to send money to",
    qrCodeData: "QR Code Data",
    downloadDokoAppToSendMoneyEasily: "Download DOKO app to send money easily!",
    dokoQrCodeSendMoney: "DOKO QR Code - Send Money",
    qrCodeSharedSuccessfully: "QR code shared successfully",
    shareDismissed: "Share dismissed",
    failedToShareQrCode: "Failed to share QR code",
    scanThisQrCodeToSendMeMoneyViaDoko:
      "Scan this QR code to send me money via DOKO!",
    user: "User",
    dokoQrCode: "DOKO QR Code",

    // HomeScreen
    totalBalance: "Total Balance",
    send: "Send",
    receive: "Receive",
    quickStats: "Quick Stats",
    sent: "Sent: UQ....R12F",
    expenses: "Expenses",
    wallets: "Wallets",
    recentActivity: "Recent Activity",
    all: "All",
    income: "Income",
    noRecentActivityFound: "No recent activity found",
    seeAll: "See all",
    myWallet: "My Wallet",
    balance: "Balance",
    noWalletFound: "No Wallet found",
    manageAllWallet: "Manage All Wallet",
    selectPhysicalOrVirtual: "Select Physical or Virtual",
    myContact: "My Contact",
    loadingContacts: "Loading contacts...",
    noContactsFoundOnYourDevice: "No contacts found on your device",
    tryAgain: "Try Again",
    viewAllContact: "View All Contact",
    contactsPermission: "Contacts Permission",
    thisAppNeedsAccessToYourContacts:
      "This app needs access to your contacts to show them in the app.",
    askMeLater: "Ask Me Later",
    cancel: "Cancel",
    ok: "OK",
    permissionRequired: "Permission Required",
    thisAppNeedsAccessToYourContactsToShowThem:
      "This app needs access to your contacts to show them. Please grant permission in Settings > Privacy & Security > Contacts.",
    openSettings: "Open Settings",
    error: "Error",
    failedToFetchContacts: "Failed to fetch contacts",
    noContacts: "No Contacts",
    noContactsFoundOnYourDevicePleaseAddSome:
      "No contacts found on your device. Please add some contacts to your phone first.",
    success: "Success",
    loadedContactsFromYourDevice: "Loaded contacts from your device!",
    unknownError: "Unknown error",
    unknownContact: "Unknown Contact",
    noPhoneNumber: "No phone number",
    noContactInfo: "No contact info",

    // Add more translations as needed
  },
  ne: {
    // Settings
    settings: "सेटिङ",
    search: "खोज्नुहोस्",
    display: "प्रदर्शन",
    language: "भाषा",
    lightMode: "उज्यालो मोड",
    darkMode: "अँध्यारो मोड",
    english: "English",
    nepali: "नेपाली",
    apply: "लागू गर्नुहोस्",

    logoutTitle: "लगआउट",
    logSubtitle:
      "के तपाईं साँच्चै लगआउट गर्न चाहनुहुन्छ? आफ्नो खातामा पुन: पहुँच पाउन फेरि साइन इन गर्नुपर्नेछ।",

    // Login
    signInToAccount: "तपाईंको खातामा साइन इन गर्नुहोस्",
    enterPhoneEmailUsername:
      "फोन वा इमेल वा प्रयोगकर्ता नाम प्रविष्ट गर्नुहोस्",
    next: "अर्को",
    checking: "जाँच गर्दै...",
    dontHaveAccount: "खाता छैन?",
    signUp: "साइन अप गर्नुहोस्",
    pleaseEnterPhoneNumber:
      "कृपया आफ्नो फोन नम्बर, इमेल, वा प्रयोगकर्ता नाम प्रविष्ट गर्नुहोस्",
    error: "त्रुटि",
    userNotFound: "प्रयोगकर्ता फेला परेन।",
    unexpectedError: "अप्रत्याशित त्रुटि भयो। कृपया फेरि प्रयास गर्नुहोस्।",

    // EnterPassword
    welcomeBack: "फेरि स्वागत छ",
    user: "प्रयोगकर्ता",
    enterPasscode: "पासकोड प्रविष्ट गर्नुहोस्",
    forgotPasscode: "पासकोड बिर्सनुभयो?",
    useFaceIdToUnlock: "अनलक गर्न Face ID प्रयोग गर्नुहोस्",
    faceIdAuthentication: "Face ID प्रमाणीकरण",
    useFaceToUnlock: "अनलक गर्न आफ्नो अनुहार प्रयोग गर्नुहोस्",
    placeFaceInCamera: "क्यामेराको सामु आफ्नो अनुहार राख्नुहोस्",
    usePasscode: "पासकोड प्रयोग गर्नुहोस्",
    cancel: "रद्द गर्नुहोस्",
    authenticationFailed: "प्रमाणीकरण असफल",
    faceIdFailed:
      "Face ID प्रमाणीकरण असफल भयो। कृपया फेरि प्रयास गर्नुहोस् वा पासकोड प्रयोग गर्नुहोस्।",
    ok: "ठीक छ",
    forgotPasscodeTitle: "पासकोड बिर्सनुभयो?",
    sendVerificationCode:
      "हामी तपाईंको पासकोड रिसेट गर्न सत्यापन कोड पठाउनेछौं।",
    sendCode: "कोड पठाउनुहोस्",
    identityNotFound: "पहिचान फेला परेन। कृपया फेरि प्रयास गर्नुहोस्।",
    codeSent: "कोड पठाइयो",
    verificationCodeSent: "सत्यापन कोड सफलतापूर्वक पठाइयो",
    failed: "असफल",
    failedToSendCode: "सत्यापन कोड पठाउन असफल",
    success: "सफल",
    loggedInSuccessfully: "सफलतापूर्वक लग इन भयो!",
    loginFailed: "लग इन असफल",
    invalidCredentials: "अवैध प्रमाणपत्र। कृपया फेरि प्रयास गर्नुहोस्।",
    identityNotFoundGoBack:
      "पहिचान फेला परेन। कृपया फिर्ता जानुहोस् र आफ्नो इमेल/फोन/प्रयोगकर्ता नाम प्रविष्ट गर्नुहोस्।",

    // Signup
    letsGetStarted: "सुरु गरौं!",
    enterYourPhoneNumber: "आफ्नो फोन नम्बर प्रविष्ट गर्नुहोस्",
    createAccount: "खाता सिर्जना गर्नुहोस्",
    creatingAccount: "खाता सिर्जना गर्दै...",
    alreadyHaveAccount: "पहिले नै खाता छ?",
    signIn: "साइन इन गर्नुहोस्",
    pleaseEnterPhoneNumber: "कृपया आफ्नो फोन नम्बर प्रविष्ट गर्नुहोस्",
    pleaseEnterValidPhoneNumber: "कृपया वैध फोन नम्बर प्रविष्ट गर्नुहोस्",
    accountCreatedSuccessfully: "खाता सफलतापूर्वक सिर्जना भयो!",
    otpSentToPhone: "तपाईंको फोनमा OTP पठाइयो।",
    failedToCreateAccount:
      "खाता सिर्जना गर्न असफल। कृपया फेरि प्रयास गर्नुहोस्।",

    // CountryPicker
    selectCountry: "देश छान्नुहोस्",
    search: "खोज्नुहोस्",

    // PhoneVerify
    phoneVerification: "फोन प्रमाणीकरण",
    enterVerificationCode:
      "कृपया पठाइएको 4-अंकीय प्रमाणीकरण कोड प्रविष्ट गर्नुहोस्",
    didntReceiveCode: "कोड प्राप्त भएन?",
    submit: "पेश गर्नुहोस्",
    verifying: "प्रमाणीकरण गर्दै...",
    pleaseEnterOtp: "कृपया OTP प्रविष्ट गर्नुहोस्",
    userIdentityNotFound:
      "प्रयोगकर्ता पहिचान फेला परेन। कृपया फेरि साइन अप गर्नुहोस्।",
    phoneNumberVerified: "फोन नम्बर सफलतापूर्वक प्रमाणित भयो!",
    invalidOtp: "अवैध OTP। कृपया फेरि प्रयास गर्नुहोस्।",
    otpSentSuccessfully: "OTP सफलतापूर्वक पठाइयो।",
    failedToResendCode: "कोड पुनः पठाउन असफल। कृपया फेरि प्रयास गर्नुहोस्।",

    // EnterNameSign
    personalInformation: "व्यक्तिगत जानकारी",
    providePersonalDetails:
      "कृपया आफ्नो व्यक्तिगत विवरण र ठेगाना जानकारी प्रदान गर्नुहोस्",
    enterFirstName: "पहिलो नाम प्रविष्ट गर्नुहोस्",
    enterLastName: "अन्तिम नाम प्रविष्ट गर्नुहोस्",
    dateOfBirth: "जन्म मिति",
    enterEmailAddress: "इमेल ठेगाना प्रविष्ट गर्नुहोस्",
    addressInformation: "ठेगाना जानकारी",
    enterCity: "शहर प्रविष्ट गर्नुहोस्",
    enterStreetAddress: "सडक ठेगाना प्रविष्ट गर्नुहोस्",
    enterBuildingName: "भवन नाम प्रविष्ट गर्नुहोस्",
    enterLocationArea: "स्थान/क्षेत्र प्रविष्ट गर्नुहोस्",
    continue: "जारी राख्नुहोस्",
    updatingProfile: "प्रोफाइल अपडेट गर्दै...",
    authenticationTokenNotFound:
      "प्रमाणीकरण टोकन फेला परेन। कृपया फेरि प्रयास गर्नुहोस्।",
    profileUpdatedSuccessfully: "प्रोफाइल सफलतापूर्वक अपडेट भयो!",
    failedToUpdateProfile:
      "प्रोफाइल अपडेट गर्न असफल। कृपया फेरि प्रयास गर्नुहोस्।",
    couldNotResendOtp: "OTP पुनः पठाउन सकिएन। कृपया फेरि प्रयास गर्नुहोस्।",
    failedToResendOtp:
      "OTP पुनः पठाउन असफल। तपाईं फेरि प्रयास गर्न सक्नुहुन्छ।",
    firstNameRequired: "पहिलो नाम आवश्यक छ",
    firstNameMinLength: "पहिलो नाम कम्तिमा २ अक्षर हुनुपर्छ",
    lastNameRequired: "अन्तिम नाम आवश्यक छ",
    lastNameMinLength: "अन्तिम नाम कम्तिमा २ अक्षर हुनुपर्छ",
    dayRequired: "दिन आवश्यक छ",
    validDay: "कृपया वैध दिन प्रविष्ट गर्नुहोस् (१-३१)",
    monthRequired: "महिना आवश्यक छ",
    validMonth: "कृपया वैध महिना प्रविष्ट गर्नुहोस् (१-१२)",
    yearRequired: "वर्ष आवश्यक छ",
    validYear: "कृपया वैध वर्ष प्रविष्ट गर्नुहोस्",
    emailRequired: "इमेल आवश्यक छ",
    validEmail: "कृपया वैध इमेल ठेगाना प्रविष्ट गर्नुहोस्",
    cityRequired: "शहर आवश्यक छ",
    cityMinLength: "शहर कम्तिमा २ अक्षर हुनुपर्छ",
    streetRequired: "सडक आवश्यक छ",
    streetMinLength: "सडक कम्तिमा २ अक्षर हुनुपर्छ",
    buildingNameRequired: "भवन नाम आवश्यक छ",
    buildingNameMinLength: "भवन नाम कम्तिमा २ अक्षर हुनुपर्छ",
    locationRequired: "स्थान आवश्यक छ",
    locationMinLength: "स्थान कम्तिमा २ अक्षर हुनुपर्छ",

    // EmailVerify
    verifyYourEmail: "आफ्नो इमेल प्रमाणित गर्नुहोस्",
    sentVerificationCode:
      "हामीले तपाईंको इमेल ठेगानामा ६-अंकीय प्रमाणीकरण कोड पठाएका छौं। कृपया यसलाई तल प्रविष्ट गर्नुहोस्।",
    didntReceiveCode: "कोड प्राप्त भएन?",
    resending: "पुनः पठाउँदै...",
    verifyEmail: "इमेल प्रमाणित गर्नुहोस्",
    verifying: "प्रमाणीकरण गर्दै...",
    pleaseEnterCompleteCode: "कृपया पूरा प्रमाणीकरण कोड प्रविष्ट गर्नुहोस्",
    emailNotFound:
      "इमेल फेला परेन। कृपया फिर्ता जानुहोस् र फेरि प्रयास गर्नुहोस्।",
    emailVerifiedSuccessfully: "इमेल सफलतापूर्वक प्रमाणित भयो!",
    invalidOtp: "अवैध OTP। कृपया फेरि प्रयास गर्नुहोस्।",
    otpSentSuccessfully: "OTP सफलतापूर्वक पठाइयो।",
    failedToResendCode: "कोड पुनः पठाउन असफल। कृपया फेरि प्रयास गर्नुहोस्।",

    // ForgotVerify
    verifyYourIdentity: "आफ्नो पहिचान प्रमाणित गर्नुहोस्",
    enterVerificationCodeSent:
      "कृपया पठाइएको ४-अंकीय प्रमाणीकरण कोड प्रविष्ट गर्नुहोस्",
    pleaseEnterVerificationCode:
      "कृपया ४-अंकीय प्रमाणीकरण कोड प्रविष्ट गर्नुहोस्",
    verificationSuccessful: "प्रमाणीकरण सफल",
    codeVerifiedSuccessfully: "कोड सफलतापूर्वक प्रमाणित भयो",
    verificationFailed: "प्रमाणीकरण असफल",
    invalidVerificationCode: "अवैध प्रमाणीकरण कोड",
    error: "त्रुटि",
    unexpectedErrorOccurred: "अप्रत्याशित त्रुटि भयो",
    codeSent: "कोड पठाइयो",
    newVerificationCodeSent: "नयाँ प्रमाणीकरण कोड सफलतापूर्वक पठाइयो",
    failed: "असफल",
    failedToResendCode: "कोड पुनः पठाउन असफल",

    // ForgotCreatePassword
    createPasscode: "पासकोड सिर्जना गर्नुहोस्",
    confirmPasscode: "पासकोड पुष्टि गर्नुहोस्",
    passcodesDoNotMatch: "पासकोडहरू मेल खाँदैनन्। कृपया फेरि प्रयास गर्नुहोस्।",
    authenticationTokenNotFound:
      "प्रमाणीकरण टोकन फेला परेन। कृपया फेरि प्रयास गर्नुहोस्।",
    passcodeCreatedSuccessfully: "तपाईंको पासकोड सफलतापूर्वक सिर्जना भयो!",
    failedToCreatePasscode:
      "पासकोड सिर्जना गर्न असफल। कृपया फेरि प्रयास गर्नुहोस्।",

    // FaceID
    enterWithFaceId: "Face ID सँग प्रविष्ट गर्नुहोस्?",
    wouldLikeToEnterWithFaceId:
      "के तपाईं Face ID सँग अनुप्रयोगमा प्रविष्ट हुन चाहनुहुन्छ",
    deviceNotSupportBiometric:
      "तपाईंको उपकरणले बायोमेट्रिक प्रमाणीकरण समर्थन गर्दैन।",
    pleaseSetupBiometricInSettings:
      "कृपया पहिले सेटिङमा {biometricName} सेटअप गर्नुहोस्।",
    settingUp: "सेटअप गर्दै...",
    enableBiometric: "{biometricName} सक्षम गर्नुहोस्",
    maybeLater: "पछि हेरौं",
    notSupported: "समर्थित छैन",
    faceIdNotSupported: "यस उपकरणमा Face ID/Touch ID समर्थित छैन।",
    ok: "ठीक छ",
    notEnrolled: "दर्ता भएको छैन",
    pleaseSetupBiometricFirst:
      "कृपया पहिले आफ्नो उपकरण सेटिङमा Face ID/Touch ID सेटअप गर्नुहोस्।",
    cancel: "रद्द गर्नुहोस्",
    settings: "सेटिङ",
    goToSettings:
      "कृपया Face ID सेटअप गर्न सेटिङ > Face ID & Passcode मा जानुहोस्।",
    faceIdEnabled: "Face ID सक्षम भयो",
    faceIdEnabledSuccessfully:
      "तपाईंको खाताका लागि Face ID सफलतापूर्वक सक्षम भयो!",
    continue: "जारी राख्नुहोस्",
    cancelled: "रद्द भयो",
    faceIdSetupCancelled: "Face ID सेटअप रद्द भयो।",
    fallback: "वैकल्पिक",
    userChosePasscode: "प्रयोगकर्ताले पासकोड प्रयोग गर्न छाने।",
    authenticationFailed: "प्रमाणीकरण असफल",
    faceIdAuthenticationFailed:
      "Face ID प्रमाणीकरण असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।",
    skipFaceId: "Face ID छोड्नुहोस्",
    skipFaceIdConfirmation:
      "के तपाईं Face ID सेटअप छोड्न चाहनुहुन्छ? तपाईंले यसलाई पछि सेटिङमा सक्षम गर्न सक्नुहुन्छ।",
    skip: "छोड्नुहोस्",
    faceId: "Face ID",
    touchId: "Touch ID",
    biometric: "बायोमेट्रिक",
    faceIdAuthentication: "Face ID प्रमाणीकरण",
    useFaceToUnlock: "अनुप्रयोग अनलक गर्न आफ्नो अनुहार प्रयोग गर्नुहोस्",
    placeFaceInCamera: "क्यामेराको सामुन्ने आफ्नो अनुहार राख्नुहोस्",
    usePasscode: "पासकोड प्रयोग गर्नुहोस्",

    // SideDrawer
    dashboard: "ड्यासबोर्ड",
    wallet: "बटुवा",
    profile: "प्रोफाइल",
    chat: "च्याट",
    community: "सामुदायिक",
    card: "कार्ड",
    notification: "सूचना",
    setting: "सेटिङ",
    getPlan: "योजना प्राप्त गर्नुहोस्",
    plan: "योजना",
    loggedOutSuccessfully: "सफलतापूर्वक लगआउट भयो",
    youHaveBeenLoggedOut: "तपाईं लगआउट भएका हुनुहुन्छ",
    logoutFailed: "लगआउट असफल",
    pleaseTryAgain: "कृपया फेरि प्रयास गर्नुहोस्",
    logout: "लगआउट",

    // ProfileSection
    personalDetails: "व्यक्तिगत विवरण",
    mySubscription: "मेरो सदस्यता",
    notificationSettings: "सूचना सेटिङ",
    privacy: "गोपनीयता",
    termsAndConditions: "नियम र शर्तहरू",
    referral: "सिफारिस",
    deleteAccount: "खाता मेटाउनुहोस्",
    verifyIdentity: "पहिचान प्रमाणित गर्नुहोस्",
    authenticationTokenNotFound:
      "प्रमाणीकरण टोकन फेला परेन। कृपया फेरि लगइन गर्नुहोस्।",
    accountDeleted: "खाता मेटाइयो",
    accountDeletedSuccessfully: "तपाईंको खाता सफलतापूर्वक मेटाइयो।",
    failedToDeleteAccount: "खाता मेटाउन असफल। कृपया फेरि प्रयास गर्नुहोस्।",
    unexpectedErrorOccurred:
      "अप्रत्याशित त्रुटि भयो। कृपया फेरि प्रयास गर्नुहोस्।",

    // ProfileDetails
    personalDetails: "व्यक्तिगत विवरण",
    name: "नाम",
    lastName: "थर",
    username: "प्रयोगकर्ता नाम",
    email: "इमेल",
    dateOfBirth: "जन्म मिति (YYYY-MM-DD)",
    address: "ठेगाना",
    phoneNumber: "फोन नम्बर",
    nameRequired: "नाम आवश्यक छ",
    nameMinLength: "नाम कम्तिमा २ अक्षरको हुनुपर्छ",
    lastNameRequired: "थर आवश्यक छ",
    lastNameMinLength: "थर कम्तिमा २ अक्षरको हुनुपर्छ",
    usernameRequired: "प्रयोगकर्ता नाम आवश्यक छ",
    usernameInvalid:
      "प्रयोगकर्ता नाम ३-२० अक्षरको, अक्षर, संख्या र अण्डरस्कोर मात्र हुनुपर्छ",
    emailRequired: "इमेल आवश्यक छ",
    emailInvalid: "कृपया वैध इमेल ठेगाना प्रविष्ट गर्नुहोस्",
    dateOfBirthRequired: "जन्म मिति आवश्यक छ",
    dateOfBirthInvalid: "कृपया YYYY-MM-DD ढाँचामा मिति प्रविष्ट गर्नुहोस्",
    addressRequired: "ठेगाना आवश्यक छ",
    addressMinLength: "ठेगाना कम्तिमा ५ अक्षरको हुनुपर्छ",
    phoneNumberRequired: "फोन नम्बर आवश्यक छ",
    phoneNumberInvalid: "कृपया वैध फोन नम्बर प्रविष्ट गर्नुहोस्",
    submitting: "पेश गर्दै...",
    saveDetails: "विवरण सेभ गर्नुहोस्",
    contactSupport: "सहयोग सम्पर्क गर्नुहोस्",
    profileUpdatedSuccessfully: "प्रोफाइल सफलतापूर्वक अपडेट भयो!",
    failedToUpdateProfile:
      "प्रोफाइल अपडेट गर्न असफल। कृपया फेरि प्रयास गर्नुहोस्।",
    yourInformationSaved:
      "तपाईंको जानकारी सेभ भएको छ र नियामकहरूलाई पेश गरिएको छ, यदि तपाईं यो जानकारी अपडेट गर्न चाहनुहुन्छ भने हामीलाई थाहा दिनुहोस्",

    // MySubscription
    myProSubscription: "मेरो प्रो सदस्यता",
    cardIssued: "कार्ड जारी भएको",
    freeVirtualCards: "निःशुल्क भर्चुअल कार्डहरू",
    noCommissionTrades: "कमिशन नभएको व्यापार",
    cashbackReceived: "क्यासब्याक प्राप्त भएको",
    cancelSubscription: "सदस्यता रद्द गर्नुहोस्",
    noActiveSubscriptionFound: "रद्द गर्नको लागि कुनै सक्रिय सदस्यता फेला परेन",
    pleaseProvideReason: "कृपया रद्दीकरणको कारण प्रदान गर्नुहोस्",
    unableToCancelSubscription: "सदस्यता रद्द गर्न असमर्थ",
    subscriptionCancelledSuccessfully: "सदस्यता सफलतापूर्वक रद्द भयो",
    failedToCancelSubscription: "सदस्यता रद्द गर्न असफल",
    anUnexpectedErrorOccurred: "अप्रत्याशित त्रुटि भयो",
    weAreSorryToSeeYouGo:
      "हामीलाई तपाईंले जानुहुन्छ भन्ने दुःख लाग्यो! कृपया तपाईंले आफ्नो सदस्यता किन रद्द गर्दै हुनुहुन्छ भन्ने कारण बताउनुहोस्:",
    enterYourReasonForCancellation: "रद्दीकरणको कारण प्रविष्ट गर्नुहोस्...",
    characters: "अक्षरहरू",
    okay: "ठीक छ",

    // Notification
    notifications: "सूचनाहरू",
    marketingOffers: "मार्केटिङ प्रस्तावहरू",
    marketingOffersDescription:
      "म भविष्यमा मलाई फाइदा हुन सक्ने DOKO का सेवाहरू र उत्पादहरूको बारेमा इमेल प्राप्त गर्न स्वीकार गर्छु।",
    transactions: "लेनदेनहरू",
    transactionsDescription:
      "सबै लेनदेनहरूको बारेमा सूचना प्राप्त गर्न म स्वीकार गर्छु।",
    investmentNews: "लगानी समाचार",
    investmentNewsDescription:
      "लगानीको बारेमा इमेल र इन-एप सूचनाहरू प्राप्त गर्न म स्वीकार गर्छु।",
    loadingSettings: "सेटिङहरू लोड गर्दै...",
    settings: "सेटिङ",
    failedToLoadNotificationSettings: "सूचना सेटिङहरू लोड गर्न असफल",
    notification: "सूचना",
    authenticationTokenNotFound:
      "प्रमाणीकरण टोकन फेला परेन। कृपया फेरि लगइन गर्नुहोस्।",
    anUnexpectedErrorOccurred:
      "अप्रत्याशित त्रुटि भयो। कृपया फेरि प्रयास गर्नुहोस्।",

    // ReferralSection
    earnFiftyDollarsForEveryInvite: "प्रत्येक निमन्त्रणाको लागि ५०$ कमाउनुहोस्",
    timeLeft: "बाँकी समय",
    allActionsBelowMustBeCompleted: "तलका सबै कार्यहरू पूरा गर्नुपर्छ",
    whatMyInvitedFriendsNeedToDo: "मेरा निमन्त्रित साथीहरूले के गर्नुपर्छ",
    letYourFriendsDownloadTheApp:
      "तपाईंका साथीहरूलाई एप स्टोरबाट एप डाउनलोड गर्न दिनुहोस्",
    pressOnTheLinkProvided:
      "एप डाउनलोड गरेपछि तपाईंले दिनुभएको लिङ्कमा थिच्नुहोस्",
    letThemVerifyTheirAccount: "उनीहरूलाई आफ्नो खाता प्रमाणित गर्न दिनुहोस्",
    convinceThemToSubscribeToDoko:
      "उनीहरूलाई DOKO मा सदस्यता लिन प्रेरित गर्नुहोस्",
    invitesEarned: "निमन्त्रणाहरू {amount} कमाइएको",
    pending: "बाँकी",
    completed: "पूरा भएको",
    sendALink: "लिङ्क पठाउनुहोस्",

    // ReferralDetails
    yourInvite: "तपाईंको निमन्त्रणा",
    whatYourInviteHasCompleted: "तपाईंको निमन्त्रणाले के पूरा गरेको छ",
    letYourFriendsDownloadTheAppFromAppStore:
      "तपाईंका साथीहरूलाई एप स्टोरबाट एप डाउनलोड गर्न दिनुहोस्",
    pressOnTheLinkProvidedByYou:
      "एप डाउनलोड गरेपछि तपाईंले दिनुभएको लिङ्कमा थिच्नुहोस्",
    letThemVerifyTheirAccount: "उनीहरूलाई आफ्नो खाता प्रमाणित गर्न दिनुहोस्",
    convinceThemToSubscribeToDoko:
      "उनीहरूलाई DOKO मा सदस्यता लिन प्रेरित गर्नुहोस्",
    makeThemCompleteTheirPaymentOfSubscription:
      "उनीहरूलाई सदस्यताको भुक्तानी पूरा गर्न दिनुहोस्",

    // DeleteAccountConfirmationModal
    deleteAccount: "खाता मेटाउनुहोस्",
    areYouSureYouWantToDeleteYourAccount:
      "के तपाईं आफ्नो खाता मेटाउन चाहनुहुन्छ? यो कार्य फिर्ता गर्न मिल्दैन र तपाईंको सबै डाटा स्थायी रूपमा हटाइनेछ।",
    thisWillPermanentlyDeleteAllYourData:
      "यसले तपाईंको सबै डाटा, लेनदेनहरू, र खाता जानकारी स्थायी रूपमा मेटाउनेछ।",
    cancel: "रद्द गर्नुहोस्",
    deleting: "मेटाउँदै...",

    // CommunitySection
    community: "समुदाय",
    noChannelSelected: "कुनै च्यानल छानिएको छैन",
    selectChannelFromListOrCreateNew:
      "च्याटिङ सुरु गर्नको लागि सूचीबाट च्यानल छान्नुहोस् वा नयाँ बनाउनुहोस्।",
    createChannel: "च्यानल बनाउनुहोस्",
    guide: "गाइड",
    suggested: "सुझाव",
    tips: "सुझावहरू",
    selectAChannel: "च्यानल छान्नुहोस्",
    chooseFromExistingChannels:
      "विशिष्ट विषयहरूमा कुराकानीमा सामेल हुनको लागि साइडबारमा रहेका मौजूदा च्यानलहरूबाट छान्नुहोस्।",
    createANewChannel: "नयाँ च्यानल बनाउनुहोस्",
    ifYouCantFindWhatYoureLookingFor:
      "यदि तपाईंले खोजिरहेको कुरा फेला परेन भने, नयाँ चर्चा सुरु गर्नको लागि नयाँ च्यानल बनाउनुहोस्।",
    participateInDiscussions: "चर्चाहरूमा सहभागी हुनुहोस्",
    onceYouveJoinedAChannel:
      "एकपटक तपाईंले च्यानलमा सामेल भएपछि, तपाईंले सन्देश पठाउन, फाइलहरू साझा गर्न, र अन्य समुदाय सदस्यहरूसँग जोडिन सक्नुहुन्छ।",
    suggestedChannels: "सुझावित च्यानलहरू",
    discoverPopularChannels:
      "तपाईंलाई रुचि हुन सक्ने लोकप्रिय च्यानलहरू र समुदायहरू खोज्नुहोस्।",
    communityTips: "समुदाय सुझावहरू",
    learnBestPractices:
      "समुदायसँग जोडिन र तपाईंको अनुभवलाई अधिकतम बनाउनको लागि उत्तम अभ्यासहरू सिक्नुहोस्।",

    // Subscription
    later: "पछि",
    selectPlan: "योजना छान्नुहोस्",
    noPlanSelected: "कुनै योजना छानिएको छैन",
    mostPopular: "सबैभन्दा लोकप्रिय",
    featuresForYou: "तपाईंका लागि सुविधाहरू",
    choosePlan: "{planName} योजना छान्नुहोस्",
    thisIsTwelveMonthPlan:
      "यो १२ महिनाको योजना हो। अगाडि बढ्दै, तपाईंले यसलाई स्वीकार गर्नुहुन्छ",
    promotionTerms: "प्रचार नियमहरू",
    planTerms: "योजना नियमहरू",
    and: "र",
    insuranceDocuments: "बीमा कागजातहरू",
    loadingSubscriptionPlans: "सदस्यता योजनाहरू लोड गर्दै...",
    error: "त्रुटि",

    // SubscriptionDetails
    subscribeNow: "अहिले सदस्यता लिनुहोस्",
    addMoneyToYourAccount: "आफ्नो खातामा पैसा थप्नुहोस्",
    youNeedToDepositMoney:
      "तपाईंले सदस्यता लिनको लागि आफ्नो खातामा पैसा जम्मा गर्नुपर्छ :)",
    payWithPickup: "पिकअपसँग तिर्नुहोस्",
    payWithCard: "कार्डसँग तिर्नुहोस्",
    payNprAndOpenAccount: "NPR {price}/महिना तिर्नुहोस् र खाता खोल्नुहोस्",
    issuanceFee: "जारी शुल्क",
    planSubscription: "{planName} सदस्यता",
    totalPayment: "कुल भुक्तानी",
    subscriptionActivated: "सदस्यता सक्रिय भयो",
    yourSubscriptionHasBeenActivated: "तपाईंको सदस्यता सफलतापूर्वक सक्रिय भयो!",

    // DAppSection
    dAppBrowser: "dApp ब्राउजर",
    browseAndInteract:
      "प्लेटफर्मबाट सिधै विकेन्द्रीकृत अनुप्रयोगहरू ब्राउज गर्नुहोस् र काम गर्नुहोस्।",
    search: "खोज्नुहोस्",
    all: "सबै",
    defi: "DeFi",
    nfts: "NFTs",
    games: "खेलहरू",
    openDApp: "dApp खोल्नुहोस्",
    wouldYouLikeToOpen: "के तपाईं खोल्न चाहनुहुन्छ",
    cancel: "रद्द गर्नुहोस्",
    open: "खोल्नुहोस्",
    addCustomDApp: "कस्टम dApp थप्नुहोस्",
    addCustomDAppDescription:
      "यो सुविधाले तपाईंलाई आफ्नो ब्राउजरमा कस्टम dAppहरू थप्न अनुमति दिनेछ।",
    ok: "ठीक छ",
    addCustomDAppButton: "+ कस्टम dApp थप्नुहोस्",

    // TransactionManagement
    transactionManagement: "लेनदेन व्यवस्थापन",
    searchTransactions: "लेनदेनहरू खोज्नुहोस्...",
    selectType: "प्रकार छान्नुहोस्",
    selectStatus: "स्थिति छान्नुहोस्",
    selectNetwork: "नेटवर्क छान्नुहोस्",
    fromDate: "सुरुको मिति",
    toDate: "अन्तिम मिति",
    clearAllFilters: "सबै फिल्टरहरू खाली गर्नुहोस्",
    exportTransactions: "लेनदेनहरू निर्यात गर्नुहोस्",
    exporting: "निर्यात गर्दै...",
    showAnalytics: "विश्लेषण देखाउनुहोस्",
    hideAnalytics: "विश्लेषण लुकाउनुहोस्",
    transactionAnalytics: "लेनदेन विश्लेषण",
    visualOverview: "तपाईंको लेनदेन इतिहासको दृश्य अवलोकन",
    recentTransactions: "हालका लेनदेनहरू",
    loadingTransactions: "लेनदेनहरू लोड गर्दै...",
    noTransactionsFound: "कुनै लेनदेन फेला परेन",
    tryAdjustingSearch: "तपाईंको खोज मापदण्ड समायोजन गर्नुहोस्",
    transactionHistoryWillAppear: "तपाईंको लेनदेन इतिहास यहाँ देखिनेछ",
    selectFromDate: "सुरुको मिति छान्नुहोस्",
    selectToDate: "अन्तिम मिति छान्नुहोस्",
    cancel: "रद्द गर्नुहोस्",
    select: "छान्नुहोस्",
    exportTransactionsTitle: "लेनदेनहरू निर्यात गर्नुहोस्",
    exportDescription:
      "तपाईंको लेनदेन डेटा फरमेट गरिएको छ र साझा गर्न तयार छ। तपाईंले यसलाई इमेल, मेसेजिङ एपहरू मार्फत साझा गर्न सक्नुहुन्छ वा आफ्नो डिभाइसमा सेभ गर्न सक्नुहुन्छ।",
    transactionsExported: "लेनदेनहरू निर्यात गरिएको",
    share: "साझा गर्नुहोस्",
    error: "त्रुटि",
    authenticationRequired: "प्रमाणीकरण आवश्यक",
    failedToFetchTransactions: "लेनदेनहरू प्राप्त गर्न असफल",
    unexpectedErrorOccurred: "अप्रत्याशित त्रुटि भयो",
    failedToShareData: "डेटा साझा गर्न असफल",
    transactionExport: "लेनदेन निर्यात",
    all: "सबै",
    send: "पठाउनुहोस्",
    receive: "प्राप्त गर्नुहोस्",
    pending: "बाँकी",
    failed: "असफल",
    deposit: "जम्मा गर्नुहोस्",
    withdrawal: "निकाल्नुहोस्",
    subscription: "सदस्यता",
    allStatus: "सबै स्थिति",
    completed: "पूरा भयो",
    cancelled: "रद्द गरिएको",
    processing: "प्रक्रियामा",
    allNetworks: "सबै नेटवर्कहरू",
    ethereum: "Ethereum",
    bitcoin: "Bitcoin",
    polygon: "Polygon",
    binanceSmartChain: "Binance Smart Chain",
    avalanche: "Avalanche",
    solana: "Solana",
    selectNetwork: "नेटवर्क छान्नुहोस्",
    subscriptionPayment: "सदस्यता भुक्तानी",
    chatPayment: "च्याट भुक्तानी",
    to: "लाई",
    from: "बाट",
    transaction: "लेनदेन",

    // NotificationList
    notifications: "सूचनाहरू",
    searchNotifications: "सूचनाहरू खोज्नुहोस्...",
    clearAll: "सबै खाली गर्नुहोस्",
    errorLoadingNotifications: "सूचनाहरू",
    noDataFound: "कुनै डेटा फेला परेन",
    youHaveNoNotificationsYet: "तपाईंसँग अहिलेसम्म कुनै सूचना छैन",
    authenticationRequired: "प्रमाणीकरण आवश्यक",
    failedToLoadNotifications: "सूचनाहरू लोड गर्न असफल",
    anErrorOccurredWhileLoading: "सूचनाहरू लोड गर्दा त्रुटि भयो",
    requesterIdMissing: "अनुरोधकर्ता ID हराइरहेको",
    requestAccepted: "अनुरोध स्वीकार गरियो",
    failedToAcceptRequest: "अनुरोध स्वीकार गर्न असफल",
    requestRejected: "अनुरोध अस्वीकार गरियो",
    failedToRejectRequest: "अनुरोध अस्वीकार गर्न असफल",
    cleared: "खाली गरियो",
    failedToClear: "खाली गर्न असफल",
    failedToClearNotifications: "सूचनाहरू खाली गर्न असफल",
    success: "सफलता",
    error: "त्रुटि",
    justNow: "अहिले",
    minutesAgo: "मिनेट अघि",
    hoursAgo: "घण्टा अघि",
    daysAgo: "दिन अघि",

    // CurrentHistory
    history: "इतिहास",
    filtered: "फिल्टर गरिएको",
    all: "सबै",
    pending: "बाँकी",
    completed: "पूरा भयो",
    pullToRefresh: "ताजा गर्न खिच्नुहोस्",
    retry: "पुनः प्रयास गर्नुहोस्",
    noTransactionsFound: "कुनै {filter} लेनदेन फेला परेन",
    filterByDate: "मिति अनुसार फिल्टर गर्नुहोस्",
    fromDate: "सुरुको मिति",
    toDate: "अन्तिम मिति",
    clearAllDates: "सबै मितिहरू खाली गर्नुहोस्",
    clearAllFilters: "सबै फिल्टरहरू खाली गर्नुहोस्",
    confirm: "पुष्टि गर्नुहोस्",
    dateRangeUpdated: "मिति दायरा अपडेट गरियो",
    fromDateAfterToDate:
      "सुरुको मिति अन्तिम मिति भन्दा पछि छ। अन्तिम मिति खाली गरिएको छ।",
    invalidDateRange: "अवैध मिति दायरा",
    toDateBeforeFromDate:
      "अन्तिम मिति सुरुको मिति भन्दा अगाडि हुन सक्दैन। कृपया वैध मिति छान्नुहोस्।",
    fromDateAfterToDateInvalid:
      "सुरुको मिति अन्तिम मिति भन्दा पछि हुन सक्दैन। कृपया वैध मितिहरू छान्नुहोस्।",
    filterError: "फिल्टर त्रुटि",
    failedToApplyDateFilter:
      "मिति फिल्टर लागू गर्न असफल। कृपया पुनः प्रयास गर्नुहोस्।",
    failedToClearFilters:
      "फिल्टरहरू खाली गर्न असफल। कृपया पुनः प्रयास गर्नुहोस्।",
    sentTo: "पठाइएको",
    receivedFrom: "प्राप्त गरिएको",
    walletDeposit: "वालेट जम्मा",
    transactionWith: "सँग लेनदेन",
    unknownReceiver: "अज्ञात प्रापक",
    to: "लाई",
    walletTopUp: "वालेट टप-अप",
    transfer: "साट्नुहोस्",
    amount: "रकम",
    currency: "मुद्रा",
    status: "स्थिति",
    fee: "शुल्क",
    authenticationRequired: "प्रमाणीकरण आवश्यक",
    failedToFetchTransactions: "लेनदेनहरू प्राप्त गर्न असफल",
    anErrorOccurredWhileFetching: "लेनदेनहरू प्राप्त गर्दा त्रुटि भयो",

    // CurrentAccount
    yourBalance: "तपाईंको ब्यालेन्स",
    noWalletFound: "कुनै वालेट फेला परेन",
    send: "पठाउनुहोस्",
    deposit: "जम्मा गर्नुहोस्",
    qrCode: "QR कोड",
    addCard: "+ कार्ड थप्नुहोस्",
    selectCurrency: "मुद्रा छान्नुहोस्",
    latestTransactions: "हालका लेनदेनहरू",
    seeAll: "सबै हेर्नुहोस्",
    noTransactionsFound: "कुनै लेनदेन फेला परेन",
    pullToRefresh: "ताजा गर्न खिच्नुहोस्",
    sendOptionSelected: "पठाउने विकल्प छानिएको",
    youSelected: "तपाईंले छान्नुभयो:",
    ok: "ठीक छ",
    sendToDokoUser: "DOKO प्रयोगकर्तालाई पठाउनुहोस्",
    sendMoneyInternationally: "अन्तर्राष्ट्रिय रूपमा पैसा पठाउनुहोस्",
    sendViaBankTransfer: "बैंक साटफर मार्फत पठाउनुहोस्",
    sentTo: "पठाइएको",
    receivedFrom: "प्राप्त गरिएको",
    walletDeposit: "वालेट जम्मा",
    subscriptionPurchase: "सदस्यता खरिद",
    transactionWith: "सँग लेनदेन",
    unknownSender: "अज्ञात पठाउने",
    unknownReceiver: "अज्ञात प्रापक",
    to: "लाई",
    walletTopUp: "वालेट टप-अप",
    transfer: "साट्नुहोस्",
    transaction: "लेनदेन",
    justNow: "अहिले",
    hoursAgo: "घण्टा अघि",
    daysAgo: "दिन अघि",
    authenticationRequired: "प्रमाणीकरण आवश्यक",
    failedToFetchTransactions: "लेनदेनहरू प्राप्त गर्न असफल",
    anErrorOccurredWhileFetching: "लेनदेनहरू प्राप्त गर्दा त्रुटि भयो",

    // MainHomeScreen
    currentAccount: "हालको खाता",
    cryptoAccount: "क्रिप्टो खाता",
    cardAccount: "कार्ड खाता",
    apps: "एपहरू",
    dAppBrowser: "DApp ब्राउजर",

    // AccountBottomSheet
    selectAccount: "खाता छान्नुहोस्",

    // CreditCard
    creditDebitCard: "क्रेडिट/डेबिट कार्ड",
    cardDetails: "कार्ड विवरणहरू",
    selectCurrency: "मुद्रा छान्नुहोस्",
    payNow: "अहिले तिर्नुहोस्",
    error: "त्रुटि",
    pleaseEnterValidAmount: "कृपया वैध रकम प्रविष्ट गर्नुहोस्",
    pleaseEnterCompleteCardDetails:
      "कृपया पूर्ण कार्ड विवरणहरू प्रविष्ट गर्नुहोस्",
    processingPayment: "भुक्तानी प्रक्रियामा",
    pleaseWait: "कृपया प्रतीक्षा गर्नुहोस्...",
    userNotAuthenticated: "प्रयोगकर्ता प्रमाणीकृत छैन",
    paymentFailed: "भुक्तानी असफल",
    depositSuccessful: "जम्मा सफल",
    successfullyAdded: "सफलतापूर्वक थपियो",
    toYourWallet: "तपाईंको वालेटमा",
    verificationFailed: "प्रमाणीकरण असफल",
    failedToVerifyDeposit: "जम्मा प्रमाणीकरण गर्न असफल",
    verificationError: "प्रमाणीकरण त्रुटि",
    errorOccurredWhileVerifying: "जम्मा प्रमाणीकरण गर्दा त्रुटि भयो",
    failedToInitiatePayment: "भुक्तानी सुरु गर्न असफल",
    paymentError: "भुक्तानी त्रुटि",
    unexpectedErrorOccurred: "भुक्तानी गर्दा अप्रत्याशित त्रुटि भयो",
    walletTopUp: "वालेट टप-अप",
    customer: "ग्राहक",
    customerEmail: "customer@example.com",

    // QrCodeSendRecive
    qrCode: "QR कोड",
    chooseAnOption: "एक विकल्प छान्नुहोस्",
    sendMoneyByScanning:
      "QR कोड स्क्यान गरेर पैसा पठाउनुहोस् वा आफ्नो QR कोड देखाएर पैसा प्राप्त गर्नुहोस्",
    sendMoney: "पैसा पठाउनुहोस्",
    scanQrCodeToSend: "पठाउनको लागि QR कोड स्क्यान गर्नुहोस्",
    receiveMoney: "पैसा प्राप्त गर्नुहोस्",
    showQrCodeToReceive: "प्राप्त गर्नको लागि QR कोड देखाउनुहोस्",
    scanQrCode: "QR कोड स्क्यान गर्नुहोस्",
    requestingCameraPermission: "क्यामेरा अनुमति अनुरोध गर्दै...",
    cameraPermissionDenied: "क्यामेरा अनुमति अस्वीकार गरियो",
    grantPermission: "अनुमति दिनुहोस्",
    cameraNotAvailable: "क्यामेरा उपलब्ध छैन",
    positionQrCodeWithinFrame: "QR कोडलाई फ्रेम भित्र राख्नुहोस्",
    scanQrCodeToSendMoney: "पैसा पठाउनको लागि QR कोड स्क्यान गर्नुहोस्",
    yourQrCode: "तपाईंको QR कोड",
    showThisQrCodeToReceiveMoney:
      "पैसा प्राप्त गर्नको लागि यो QR कोड देखाउनुहोस्",
    quickShare: "छिटो साझा गर्नुहोस्",
    sharing: "साझा गर्दै...",
    qrCodeDataNotAvailable: "QR कोड डेटा उपलब्ध छैन",
    copied: "कपी गरियो",
    qrCodeDataCopiedToClipboard: "QR कोड डेटा क्लिपबोर्डमा कपी गरियो",
    failedToCopyQrCodeData: "QR कोड डेटा कपी गर्न असफल",
    qrCodeNotReady: "QR कोड तयार छैन",
    qrCodeImageSharedSuccessfully: "QR कोड छवि सफलतापूर्वक साझा गरियो",
    failedToShareQrCodeImage: "QR कोड छवि साझा गर्न असफल",
    qrCodeDetected: "QR कोड फेला पर्यो",
    scanned: "स्क्यान गरियो",
    thisDoesntAppearToBeDokoPaymentQrCode:
      "यो DOKO भुक्तानी QR कोड जस्तो देखिँदैन।",
    tryAgain: "फेरि प्रयास गर्नुहोस्",
    cancel: "रद्द गर्नुहोस्",
    invalidQrCode: "अवैध QR कोड",
    thisQrCodeIsNotValidDokoPaymentCode:
      "यो QR कोड वैध DOKO भुक्तानी कोड होइन। कृपया DOKO QR कोड स्क्यान गर्नुहोस्।",
    failedToProcessQrCode:
      "QR कोड प्रक्रिया गर्न असफल। कृपया फेरि प्रयास गर्नुहोस्।",
    permissionRequired: "अनुमति आवश्यक",
    cameraPermissionIsRequiredToScanQrCodes:
      "QR कोडहरू स्क्यान गर्न क्यामेरा अनुमति आवश्यक छ। कृपया यसलाई तपाईंको उपकरण सेटिङमा सक्षम गर्नुहोस्।",
    openSettings: "सेटिङ खोल्नुहोस्",
    permission: "अनुमति",
    cameraPermissionIsRequiredToScanQrCodesShort:
      "QR कोडहरू स्क्यान गर्न क्यामेरा अनुमति आवश्यक छ",
    error: "त्रुटि",
    failedToRequestCameraPermission: "क्यामेरा अनुमति अनुरोध गर्न असफल",
    navigationNotAvailable: "नेभिगेसन उपलब्ध छैन",
    sendMeMoneyViaDoko: "DOKO मार्फत मलाई पैसा पठाउनुहोस्!",
    scanThisQrCodeToSendMoneyTo: "यो QR कोड स्क्यान गरेर पैसा पठाउनुहोस्",
    qrCodeData: "QR कोड डेटा",
    downloadDokoAppToSendMoneyEasily:
      "पैसा सजिलैसँग पठाउनको लागि DOKO एप डाउनलोड गर्नुहोस्!",
    dokoQrCodeSendMoney: "DOKO QR कोड - पैसा पठाउनुहोस्",
    qrCodeSharedSuccessfully: "QR कोड सफलतापूर्वक साझा गरियो",
    shareDismissed: "साझा गर्न अस्वीकार गरियो",
    failedToShareQrCode: "QR कोड साझा गर्न असफल",
    scanThisQrCodeToSendMeMoneyViaDoko:
      "DOKO मार्फत मलाई पैसा पठाउनको लागि यो QR कोड स्क्यान गर्नुहोस्!",
    user: "प्रयोगकर्ता",
    dokoQrCode: "DOKO QR कोड",

    // HomeScreen
    totalBalance: "कुल बैलेन्स",
    send: "पठाउनुहोस्",
    receive: "प्राप्त गर्नुहोस्",
    quickStats: "छिटो तथ्याङ्क",
    sent: "पठाइयो: UQ....R12F",
    expenses: "खर्च",
    wallets: "वालेटहरू",
    recentActivity: "हालको गतिविधि",
    all: "सबै",
    income: "आम्दानी",
    noRecentActivityFound: "हालको गतिविधि फेला परेन",
    seeAll: "सबै हेर्नुहोस्",
    myWallet: "मेरो वालेट",
    balance: "बैलेन्स",
    noWalletFound: "वालेट फेला परेन",
    manageAllWallet: "सबै वालेट व्यवस्थापन गर्नुहोस्",
    selectPhysicalOrVirtual: "भौतिक वा आभासी छान्नुहोस्",
    myContact: "मेरो सम्पर्क",
    loadingContacts: "सम्पर्कहरू लोड गर्दै...",
    noContactsFoundOnYourDevice: "तपाईंको उपकरणमा सम्पर्क फेला परेन",
    tryAgain: "फेरि प्रयास गर्नुहोस्",
    viewAllContact: "सबै सम्पर्क हेर्नुहोस्",
    contactsPermission: "सम्पर्क अनुमति",
    thisAppNeedsAccessToYourContacts:
      "यो एपले एपमा तिनीहरूलाई देखाउनको लागि तपाईंका सम्पर्कहरूमा पहुँच चाहिन्छ।",
    askMeLater: "पछि सोध्नुहोस्",
    cancel: "रद्द गर्नुहोस्",
    ok: "ठीक छ",
    permissionRequired: "अनुमति आवश्यक",
    thisAppNeedsAccessToYourContactsToShowThem:
      "यो एपले तिनीहरूलाई देखाउनको लागि तपाईंका सम्पर्कहरूमा पहुँच चाहिन्छ। कृपया सेटिङ > गोपनीयता र सुरक्षा > सम्पर्कहरूमा अनुमति दिनुहोस्।",
    openSettings: "सेटिङ खोल्नुहोस्",
    error: "त्रुटि",
    failedToFetchContacts: "सम्पर्कहरू ल्याउन असफल",
    noContacts: "सम्पर्क छैन",
    noContactsFoundOnYourDevicePleaseAddSome:
      "तपाईंको उपकरणमा सम्पर्क फेला परेन। कृपया पहिले आफ्नो फोनमा केही सम्पर्कहरू थप्नुहोस्।",
    success: "सफलता",
    loadedContactsFromYourDevice: "तपाईंको उपकरणबाट सम्पर्कहरू लोड गरियो!",
    unknownError: "अज्ञात त्रुटि",
    unknownContact: "अज्ञात सम्पर्क",
    noPhoneNumber: "फोन नम्बर छैन",
    noContactInfo: "सम्पर्क जानकारी छैन",

    // Add more translations as needed
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language from AsyncStorage
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("selectedLanguage");
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error("Error loading language:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (newLanguage) => {
    try {
      await AsyncStorage.setItem("selectedLanguage", newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
