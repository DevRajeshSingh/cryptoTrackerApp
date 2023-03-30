import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CoinDetailedScreen from "../screens/CoinDetailedScreen";
import AddNewAssetScreen from "../screens/AddNewAssetScreen";
import Feedback from "../screens/FeedbackScreen";
import BottomTabNavigator from "./BottomTabNavigator.jsx";
import SplashScreen from "../screens/SplashScreen";
import AuthPage from "../screens/Authentication/AuthPage";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      useLegacyImplementation={true}
    >
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Authenticate"
        component={AuthPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CoinDetailedScreen"
        component={CoinDetailedScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AddNewAssetScreen"
        component={AddNewAssetScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FeedbackScreen"
        component={Feedback}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
