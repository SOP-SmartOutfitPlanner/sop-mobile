import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID, // Web Client ID from Firebase Console
  scopes: ['profile', 'email'], 
  offlineAccess: true, // Required for refresh token
  forceCodeForRefreshToken: true, 
});

export default GoogleSignin;