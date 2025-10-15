import { useState } from 'react';
import { Alert, ActionSheetIOS, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { IMAGE_PICKER_OPTIONS, ALERT_MESSAGES } from '../constants/wardrobe';

export const useImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert(
          ALERT_MESSAGES.PERMISSIONS_REQUIRED.title,
          ALERT_MESSAGES.PERMISSIONS_REQUIRED.message
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const launchImagePicker = async (
    source: 'camera' | 'library'
  ): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Request permissions first
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        setIsLoading(false);
        return;
      }
      
      const pickerFn = source === 'camera' 
        ? ImagePicker.launchCameraAsync 
        : ImagePicker.launchImageLibraryAsync;
        
      const result = await pickerFn({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.6, // Reduced quality to prevent 413 errors
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      const errorMessage = source === 'camera' 
        ? ALERT_MESSAGES.ERROR_TAKE_PHOTO
        : ALERT_MESSAGES.ERROR_SELECT_IMAGE;
        
      console.error(`Error ${source === 'camera' ? 'taking photo' : 'selecting image'}:`, error);
      Alert.alert(errorMessage.title, errorMessage.message);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImageFromCamera = (): Promise<void> => launchImagePicker('camera');
  const pickImageFromLibrary = (): Promise<void> => launchImagePicker('library');

  const showImagePicker = async (): Promise<void> => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            pickImageFromCamera();
          } else if (buttonIndex === 2) {
            pickImageFromLibrary();
          }
        }
      );
    } else {
      Alert.alert(
        ALERT_MESSAGES.SELECT_IMAGE.title,
        ALERT_MESSAGES.SELECT_IMAGE.message,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Take Photo', onPress: pickImageFromCamera },
          { text: 'Choose from Library', onPress: pickImageFromLibrary },
        ]
      );
    }
  };

  const resetImage = (): void => {
    setSelectedImage(null);
  };

  return {
    selectedImage,
    isLoading,
    showImagePicker,
    pickImageFromCamera,
    pickImageFromLibrary,
    resetImage,
  };
};