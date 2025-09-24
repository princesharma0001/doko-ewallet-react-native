# Stripe Payment Integration Setup

This guide will help you complete the Stripe payment integration setup for your React Native app.

## 1. Stripe Configuration

### Update Stripe Keys
Replace the placeholder keys in the following files with your actual Stripe keys:

**App.tsx** (line 18):
```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_actual_publishable_key_here';
```

**StripePaymentModal.jsx** (if you need to override):
```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_actual_publishable_key_here';
```

### Get Your Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers > API Keys
3. Copy your Publishable key (starts with `pk_test_` for test mode)
4. Copy your Secret key (starts with `sk_test_` for test mode) - keep this secure on your backend

## 2. iOS Configuration

### Update Info.plist
Add the following to your `ios/DOKO/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>doko-ewallet</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>doko-ewallet</string>
        </array>
    </dict>
</array>
```

### Update AppDelegate.swift
Add the following import and method to `ios/DOKO/AppDelegate.swift`:

```swift
import Stripe

// Add this method to your AppDelegate class
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    return StripeAPI.handleURLCallback(url)
}
```

## 3. Android Configuration

### Update android/app/src/main/AndroidManifest.xml
Add the following intent filter to your main activity:

```xml
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTask"
    android:theme="@style/LaunchTheme">
    <!-- ... existing intent filters ... -->
    
    <!-- Add this intent filter for Stripe -->
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="doko-ewallet" />
    </intent-filter>
</activity>
```

## 4. Backend API Integration

Your backend API endpoint should handle the subscription purchase and return the Stripe payment intent. The current implementation expects this response format:

```json
{
  "error": "false",
  "message": "Subscription created successfully",
  "data": {
    "userId": "68d14423ec7089c0b801e9fc",
    "planId": "68b93ad3f0741c8efcdfe8a0",
    "subscriptionStatus": "pending",
    "startDate": "2025-09-24T10:45:08.461Z",
    "endDate": "2025-10-24T10:45:08.461Z",
    "autoRenew": false,
    "paymentDetails": {
      "stripeSubscriptionId": null,
      "stripeCustomerId": "cus_T70OJaEw5oJ2me",
      "stripePaymentIntentId": "pi_3SAqC8DQjTqdiW4x18Wzsdhm",
      "paymentMethod": "stripe",
      "amount": 9.99,
      "currency": "USD",
      "paymentStatus": "pending"
    },
    "usageStats": {
      "usersCreated": 0,
      "transactionsCount": 0,
      "walletsCreated": 0,
      "cardsCreated": 0
    },
    "isTrialPeriod": false,
    "createdBy": "68d14423ec7089c0b801e9fc",
    "_id": "68d3cbb535fecf8b3f0c1cc1",
    "createdAt": "2025-09-24T10:45:09.243Z",
    "updatedAt": "2025-09-24T10:45:09.243Z",
    "__v": 0,
    "isActive": false,
    "daysRemaining": 30,
    "id": "68d3cbb535fecf8b3f0c1cc1"
  }
}
```

## 5. Testing

### Test Cards
Use these test card numbers for testing:

- **Successful payment**: 4242 4242 4242 4242
- **Declined payment**: 4000 0000 0000 0002
- **Requires authentication**: 4000 0025 0000 3155

Use any future expiry date and any 3-digit CVC.

### Test Flow
1. Select a subscription plan
2. Click "Pay With Card"
3. Use a test card number
4. Complete the payment flow
5. Verify the subscription is created successfully

## 6. Production Deployment

Before going live:

1. Replace test keys with live keys
2. Update merchant identifier and URL scheme if needed
3. Test thoroughly with real payment methods
4. Implement proper error handling and logging
5. Set up webhook endpoints for payment status updates

## 7. Security Notes

- Never expose your secret key in the mobile app
- Always validate payments on your backend
- Use HTTPS for all API calls
- Implement proper authentication and authorization
- Log all payment attempts for audit purposes

## 8. Troubleshooting

### Common Issues

1. **"No such file or directory" error**: Make sure you've run `cd ios && pod install` after installing the Stripe package
2. **Payment fails silently**: Check your Stripe dashboard for error logs
3. **URL scheme not working**: Verify the URL scheme is correctly configured in both iOS and Android
4. **API errors**: Ensure your backend is properly configured with Stripe and returns the correct response format

### Debug Mode
Enable debug logging by adding this to your app initialization:

```javascript
import { initStripe } from '@stripe/stripe-react-native';

// Enable debug mode (remove in production)
initStripe({
  publishableKey: STRIPE_PUBLISHABLE_KEY,
  merchantIdentifier: 'merchant.com.doko.ewallet',
  urlScheme: 'doko-ewallet',
  setReturnUrlSchemeOnAndroid: true,
});
```

## Support

For additional help:
- [Stripe React Native Documentation](https://stripe.com/docs/stripe-react-native)
- [Stripe Mobile Integration Guide](https://stripe.com/docs/mobile)
- [Stripe Support](https://support.stripe.com/)
