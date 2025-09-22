# Router Component Documentation

## Overview

The Router component provides a clean, organized way to manage navigation between screens in your React Native app. It includes two versions:

1. **Router.jsx** - Basic routing functionality
2. **AdvancedRouter.jsx** - Advanced routing with navigation history, back button handling, and more features

## Features

### Basic Router
- ✅ Screen navigation
- ✅ State management
- ✅ Context-based navigation
- ✅ Screen-specific handlers

### Advanced Router
- ✅ All basic features
- ✅ Navigation history tracking
- ✅ Android back button handling
- ✅ Reset and replace navigation
- ✅ User data persistence
- ✅ Logout functionality

## Usage

### 1. Basic Setup

```jsx
// App.tsx
import AdvancedRouter from './src/components/AdvancedRouter';

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider followSystem>
        <AdvancedRouter />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
```

### 2. Using Navigation in Components

```jsx
import { useNavigation, useScreenNavigation } from '../hooks/useNavigation';

const MyComponent = () => {
  // Basic navigation
  const navigation = useNavigation();
  
  // Screen-specific navigation
  const screenNav = useScreenNavigation();

  return (
    <View>
      <Button 
        title="Go to Signup" 
        onPress={screenNav.goToSignup} 
      />
      <Button 
        title="Go Back" 
        onPress={navigation.goBack} 
      />
    </View>
  );
};
```

## Screen Types

```javascript
export const SCREEN_TYPES = {
  SPLASH: 'SPLASH',
  SIGNUP: 'SIGNUP',
  PHONE_VERIFY: 'PHONE_VERIFY',
  MAIN_APP: 'MAIN_APP',
  BUTTON_EXAMPLES: 'BUTTON_EXAMPLES',
};
```

## Navigation Functions

### Basic Navigation
- `navigateTo(screen, data, addToHistory)` - Navigate to a screen
- `goBack()` - Go back to previous screen
- `resetToScreen(screen, data)` - Reset navigation stack to a screen
- `replaceScreen(screen, data)` - Replace current screen

### Screen-Specific Navigation
- `goToSplash()` - Navigate to splash screen
- `goToSignup()` - Navigate to signup screen
- `goToPhoneVerify(phoneNumber)` - Navigate to phone verification
- `goToMainApp()` - Navigate to main app
- `goToButtonExamples()` - Navigate to button examples

### Utility Functions
- `canGoBack()` - Check if back navigation is possible
- `isCurrentScreen(screen)` - Check if current screen matches
- `hasUserData()` - Check if user data exists
- `isPhoneVerified()` - Check if phone is verified

## State Management

The router manages the following state:

```javascript
{
  currentScreen: 'SIGNUP',
  navigationHistory: ['SPLASH', 'SIGNUP'],
  screenData: {
    userPhoneNumber: '+91-9650448097',
    selectedCountry: { name: 'Poland Gold', code: '+01', flag: '🇵🇱' },
    userData: { phoneVerified: true, phoneNumber: '+91-9650448097' }
  }
}
```

## Adding New Screens

### 1. Define Screen Type
```javascript
// In AdvancedRouter.jsx
export const SCREEN_TYPES = {
  // ... existing screens
  NEW_SCREEN: 'NEW_SCREEN',
};
```

### 2. Add Navigation Handler
```javascript
const handleGoToNewScreen = useCallback((data) => {
  navigateTo(SCREEN_TYPES.NEW_SCREEN, data);
}, [navigateTo]);
```

### 3. Add to Context Value
```javascript
const navigationContextValue = {
  // ... existing handlers
  handleGoToNewScreen,
};
```

### 4. Add to Render Function
```javascript
case SCREEN_TYPES.NEW_SCREEN:
  return (
    <NewScreen 
      onBack={goBack}
      data={screenData.newScreenData}
    />
  );
```

### 5. Add to Hook
```javascript
// In useNavigation.js
goToNewScreen: (data) => navigation.navigateTo('NEW_SCREEN', data),
```

## Best Practices

1. **Use the hook**: Always use `useNavigation` or `useScreenNavigation` hooks
2. **Pass data**: Use the `data` parameter to pass information between screens
3. **Handle back navigation**: Implement proper back button handling
4. **Reset on logout**: Use `resetToScreen` when logging out
5. **Validate navigation**: Check `canGoBack()` before calling `goBack()`

## Examples

### Simple Navigation
```jsx
const { goToSignup } = useScreenNavigation();
<Button title="Sign Up" onPress={goToSignup} />
```

### Navigation with Data
```jsx
const { navigate } = useScreenNavigation();
<Button 
  title="Verify Phone" 
  onPress={() => navigate('PHONE_VERIFY', { userPhoneNumber: '+91-9650448097' })} 
/>
```

### Conditional Navigation
```jsx
const { isPhoneVerified, goToMainApp, goToPhoneVerify } = useScreenNavigation();
<Button 
  title="Continue" 
  onPress={isPhoneVerified() ? goToMainApp : () => goToPhoneVerify('+91-9650448097')} 
/>
```

### Back Navigation with Validation
```jsx
const { goBack, canGoBack } = useNavigation();
<Button 
  title="Back" 
  onPress={goBack} 
  disabled={!canGoBack()} 
/>
```

## Troubleshooting

### Common Issues

1. **Hook not working**: Make sure component is wrapped in NavigationProvider
2. **State not updating**: Check if you're using the correct navigation function
3. **Back button not working**: Ensure Android back button handler is properly set up
4. **Data not persisting**: Verify data is being passed correctly in navigation calls

### Debug Tips

1. Check console logs for navigation events
2. Use `getHistory()` to see navigation stack
3. Verify screen types are correctly defined
4. Check if handlers are properly added to context
