import { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';

interface UpdateStatus {
  isChecking: boolean;
  isDownloading: boolean;
  isUpdateAvailable: boolean;
  updateError: Error | null;
}

export const useOTAUpdates = () => {
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({
    isChecking: false,
    isDownloading: false,
    isUpdateAvailable: false,
    updateError: null,
  });

  // Check for updates on mount
  useEffect(() => {
    if (__DEV__) {
      // Skip update checks in development
      return;
    }

    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      setUpdateStatus(prev => ({ ...prev, isChecking: true, updateError: null }));

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setUpdateStatus(prev => ({ 
          ...prev, 
          isChecking: false, 
          isUpdateAvailable: true 
        }));
        
        // Tự động tải và cài đặt update mà không cần hỏi người dùng
        console.log('Update available, downloading automatically...');
        await downloadAndApplyUpdate();
      } else {
        setUpdateStatus(prev => ({ 
          ...prev, 
          isChecking: false, 
          isUpdateAvailable: false 
        }));
        console.log('No updates available');
      }
    } catch (error) {
      setUpdateStatus(prev => ({ 
        ...prev, 
        isChecking: false, 
        updateError: error as Error 
      }));
      console.error('Error checking for updates:', error);
    }
  };

  const downloadAndApplyUpdate = async () => {
    try {
      setUpdateStatus(prev => ({ ...prev, isDownloading: true, updateError: null }));

      console.log('Fetching update...');
      await Updates.fetchUpdateAsync();
      
      console.log('Update downloaded, reloading app...');
      // Reload the app to apply the update
      await Updates.reloadAsync();
    } catch (error) {
      setUpdateStatus(prev => ({ 
        ...prev, 
        isDownloading: false, 
        updateError: error as Error 
      }));
      
      console.error('Error downloading update:', error);
      // Tự động cập nhật thất bại - chỉ log lỗi, không hiển thị alert
    }
  };

  const manualCheckForUpdates = async () => {
    if (updateStatus.isChecking || updateStatus.isDownloading) {
      return;
    }
    await checkForUpdates();
  };

  return {
    ...updateStatus,
    checkForUpdates: manualCheckForUpdates,
    downloadAndApplyUpdate,
  };
};
