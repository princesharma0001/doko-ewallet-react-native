import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import screens
import Splash from "../Screens/Splash";
import Signup from "../Screens/Signup";
import Login from "../Screens/Login";
import EnterPassword from "../Screens/EnterPassword";
import CardPassword from "../Screens/CardPassword";
import AddMoney from "../Screens/AddMoney";
import PhoneVerify from "../Screens/PhoneVerify";
import AddingAmount from "../Screens/AddingAmount";
import AddRecieveQr from "../Screens/AddRecieveQr";
import EmailVerify from "../Screens/EmailVerify";
import SearchUserChat from "../Screens/SearchUserChat";
import EnterNameSign from "../Screens/EnterNameSign";
import TakeSelfie from "../Screens/TakeSelfie";
import CameraScreen from "../Screens/CameraScreen";
import CreatePassword from "../Screens/CreatePassword";
import ForgotCreatePassword from "../Screens/ForgotCreatePassword";
import FaceID from "../Screens/FaceID";
import ForgotVerify from "../Screens/ForgotVerify";
import HomeScreen from "../Screens/HomeScreen";
import MainHomeScreen from "../Screens/MainHomeScreen";
import Notification from "../Screens/Notification";
import OnFido from "../Screens/OnFido";
import Settings from "../Screens/Settings";
import ButtonExamples from "../components/ButtonExamples";
import { useTheme } from "../context/ThemeContext";
import Wallet from "../components/Wallet";
import ReferralSection from "../components/ReferralSection";
import NotificationList from "../components/NotificationList";
import ReferralDetails from "../components/ReferralDetails";
import ProfileSection from "../components/ProfileSection";
import ProfileDetails from "../components/ProfileDetails";
import MySubscription from "../components/MySubscription";
import MyDocument from "../components/MyDocument";
import MyTerms from "../components/MyTerms";
import TermsDetails from "../components/TermsDetails";
import Subscription from "../components/Subscription";
import TransactionManagement from "../components/TransactionManagement";
import SubscriptionDetails from "../components/SubscriptionDetails";
import CreditCard from "../components/CreditCard";
import CurrentHistory from "../Screens/History/CurrentHistory";
import PhysicalCard from "../components/PhysicalCard";
import NewChat from "../components/NewChat";
import QrCodeSendRecive from "../components/QrCodeSendRecive";
import NewGroup from "../Screens/NewGroup";
import GroupSeperateChat from "../Screens/GroupSeperateChat";
import InvidusalGroup from "../Screens/InvidusalGroup";
import BankTransfer from "../Screens/Deposit/BankTransfer";
import SendInternational from "../Screens/SendInternational";
import KYCSection from "../Screens/KYCSection";
import SelectWay from "../Screens/SelectWay";
import PickOriginal from "../Screens/PickOriginal";
import WesternUnion from "../Screens/WesternUnion";
import WesternUnionPreview from "../Screens/WesternUnionPreview";
import WestrenThanku from "../Screens/WestrenThanku";
import BankTransferSendInternational from "../Screens/BankTransferSendInternational";
import ReportUserModalTest from "../components/ReportUserModalTest";
import CommunitySection from "../components/CommunitySection";
import SumSubKyc from "../components/SumSubKyc";
// Create stack navigator
const Stack = createStackNavigator();

// Main App component for authenticated users

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false, // Hide default headers
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{
            gestureEnabled: false, // Disable swipe back on splash
          }}
        />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OnFido" component={OnFido} />
        <Stack.Screen
          name="EnterPassword"
          component={EnterPassword}
          options={{
            gestureEnabled: true, // Disable swipe back on passcode
          }}
        />
        <Stack.Screen
          name="CardPassword"
          component={CardPassword}
          options={{
            gestureEnabled: false, // Disable swipe back on passcode
          }}
        />
        <Stack.Screen
          name="AddMoney"
          component={AddMoney}
          options={{
            gestureEnabled: false, // Disable swipe back on passcode
          }}
        />
        <Stack.Screen name="PhoneVerify" component={PhoneVerify} />
        <Stack.Screen name="EmailVerify" component={EmailVerify} />
        <Stack.Screen name="EnterNameSign" component={EnterNameSign} />
        <Stack.Screen name="TakeSelfie" component={TakeSelfie} />
        <Stack.Screen name="FaceID" component={FaceID} />
        <Stack.Screen name="ForgotVerify" component={ForgotVerify} />
        <Stack.Screen name="Wallet" component={Wallet} />
        <Stack.Screen name="CreditCard" component={CreditCard} />
        <Stack.Screen name="ProfileSection" component={ProfileSection} />
        <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
        <Stack.Screen name="QrCodeSendRecive" component={QrCodeSendRecive} />
        <Stack.Screen name="NotificationList" component={NotificationList} />
        <Stack.Screen name="MySubscription" component={MySubscription} />
        <Stack.Screen name="MyDocument" component={MyDocument} />
        <Stack.Screen name="MyTerms" component={MyTerms} />
        <Stack.Screen name="TermsDetails" component={TermsDetails} />
        <Stack.Screen name="Subscription" component={Subscription} />
        <Stack.Screen name="CommunitySection" component={CommunitySection} />
        <Stack.Screen name="kycs" component={SumSubKyc} />

        <Stack.Screen
          name="TransactionManagement"
          component={TransactionManagement}
        />
        <Stack.Screen name="ReferralSection" component={ReferralSection} />
        <Stack.Screen name="ReferralDetails" component={ReferralDetails} />
        <Stack.Screen name="SendInternational" component={SendInternational} />
        <Stack.Screen name="KYCSection" component={KYCSection} />
        <Stack.Screen name="SelectWay" component={SelectWay} />
        <Stack.Screen name="PickOriginal" component={PickOriginal} />
        <Stack.Screen name="WesternUnion" component={WesternUnion} />
        <Stack.Screen
          name="WesternUnionPreview"
          component={WesternUnionPreview}
        />
        <Stack.Screen name="WestrenThanku" component={WestrenThanku} />
        <Stack.Screen
          name="BankTransferSendInternational"
          component={BankTransferSendInternational}
        />
        <Stack.Screen
          name="SubscriptionDetails"
          component={SubscriptionDetails}
        />
        <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
          options={{
            gestureEnabled: false, // Disable swipe back on camera
          }}
        />
        <Stack.Screen
          name="CreatePassword"
          component={CreatePassword}
          options={{
            gestureEnabled: false, // Disable swipe back on passcode
          }}
        />
        <Stack.Screen
          name="ForgotCreatePassword"
          component={ForgotCreatePassword}
          options={{
            gestureEnabled: false, // Disable swipe back on passcode
          }}
        />
        <Stack.Screen
          name="SearchUserChat"
          component={SearchUserChat}
          options={{
            gestureEnabled: false, // Disable swipe back on passcode
          }}
        />
        {/* <Stack.Screen 
          name="FaceID" 
          component={FaceID}
          options={{
            gestureEnabled: false, // Disable swipe back on Face ID
          }}
        /> */}

        {/* <Stack.Screen 
          name="HomeScreen" 
          component={HomeScreen}
        /> */}
        <Stack.Screen
          name="HomeScreen"
          component={MainHomeScreen}
          options={{
            gestureEnabled: false, // Disable swipe back on passcode
          }}
        />
        <Stack.Screen name="Notification" component={Notification} />

        <Stack.Screen name="ButtonExamples" component={ButtonExamples} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="CurrentHistory" component={CurrentHistory} />
        <Stack.Screen name="PhysicalCard" component={PhysicalCard} />
        <Stack.Screen name="NewChat" component={NewChat} />
        <Stack.Screen name="NewGroup" component={NewGroup} />
        <Stack.Screen name="GroupSeperateChat" component={GroupSeperateChat} />
        <Stack.Screen name="InvidusalGroup" component={InvidusalGroup} />
        <Stack.Screen name="BankTransfer" component={BankTransfer} />
        <Stack.Screen name="AddingAmount" component={AddingAmount} />
        <Stack.Screen name="AddRecieveQr" component={AddRecieveQr} />
        <Stack.Screen
          name="ReportUserModalTest"
          component={ReportUserModalTest}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  mainAppContainer: {
    flex: 1,
    justifyContent: "center",
  },
});

export default AppNavigator;
