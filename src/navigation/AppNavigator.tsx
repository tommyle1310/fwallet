import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import { useSelector } from "react-redux"; // Import useSelector
import { RootState } from "@/src/store/store"; // Import RootState from your store

import ContactScreen from "@/screens/ContactScreen";
import HomeScreen from "@/screens/HomeScreen";
import StatsScreen from "@/screens/StatsScreen";
import TopUpScreen from "@/screens/TopUpScreen";
import LoginScreen from "@/screens/Auth/LoginScreen";
import SignupScreen from "@/screens/Auth/SignupScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import FFBottomTab from "@/src/components/FFBottomTab";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "../store/types";
import { loadTokenFromAsyncStorage } from "../store/authSlice";
import TransferMoneyScreen from "@/screens/TransferMoneyScreen";

// Define the param list for the stack navigator
export type RootStackParamList = {
  Login: undefined;
  TopUp: undefined;
  TransferMoney: undefined;
  Signup: undefined;
  Home: undefined;
};

// Define the param list for the bottom tab navigator
export type RootTabParamList = {
  Home: undefined;
  Stats: undefined;
  Contact: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

// Tab Navigator for the Home screen
const HomeTabs = () => {
  const [currentScreen, setCurrentScreen] = useState(0); // Track the selected screen

  let content;
  switch (currentScreen) {
    case 0:
      content = <HomeScreen />;
      break;
    case 1:
      content = <StatsScreen />;
      break;
    case 2:
      content = <ContactScreen />;
      break;
    case 3:
      content = <ProfileScreen />;
      break;
    default:
      content = <HomeScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Render the screen content */}
      {content}

      {/* Render the custom bottom tab */}
      <FFBottomTab
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
      />
    </View>
  );
};

// Stack Navigator for Login, Signup, and Home screens
const AppNavigator = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken); // Get token from Redux
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true); // Loading state to wait for token loading

  // Load token from AsyncStorage when the app starts
  useEffect(() => {
    const loadToken = async () => {
      await dispatch(loadTokenFromAsyncStorage());
      setLoading(false); // Set loading to false after token is loaded
    };
    loadToken();
  }, [dispatch]);

  // If the token is still loading, show a blank screen or a loading spinner
  if (loading) {
    return null; // Or return a loading spinner here, e.g. <ActivityIndicator />
  }

  return (
    <Stack.Navigator initialRouteName={token ? "Home" : "Login"}>
      <Stack.Screen
        name="Login"
        options={{ headerShown: false }} // Disable header for Login screen
        component={LoginScreen}
      />
      <Stack.Screen
        name="Signup"
        options={{ headerShown: false }} // Disable header for Signup screen
        component={SignupScreen}
      />
      <Stack.Screen
        name="Home"
        options={{ headerShown: false }} // Disable header for Home screen
        component={HomeTabs}
      />
      <Stack.Screen
        name="TopUp"
        options={{ headerShown: false }}
        component={TopUpScreen}
      />
      <Stack.Screen
        name="TransferMoney"
        options={{ headerShown: false }}
        component={TransferMoneyScreen}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
