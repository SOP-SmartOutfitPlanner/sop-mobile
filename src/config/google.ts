import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID, 
  scopes: ['profile', 'email'], 
  offlineAccess: true, 
  forceCodeForRefreshToken: true, 
});

export default GoogleSignin;