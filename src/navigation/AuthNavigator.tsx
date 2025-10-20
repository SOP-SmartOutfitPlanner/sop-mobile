import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ForgotPasswordScreen } from "../screens/forgotpassword/ForgotPassword";
import { VerifyOtpResetScreen } from "../screens/forgotpassword/VerifyOtpReset";
import { ResetPasswordScreen } from "../screens/forgotpassword/ResetPassword";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyOtpReset: { email: string };
  ResetPassword: { email: string; resetToken: string };
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#F9FAFB" },
      }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyOtpReset" component={VerifyOtpResetScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};
