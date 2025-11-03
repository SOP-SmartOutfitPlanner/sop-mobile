// hooks/useNotification.ts
import { useState, useCallback } from 'react';
import { NotificationType } from '../components/notification/NotificationModal';

interface NotificationConfig {
  type?: NotificationType;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

export const useNotification = () => {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<NotificationConfig>({
    message: '',
  });

  const showNotification = useCallback((newConfig: NotificationConfig) => {
    setConfig(newConfig);
    setVisible(true);
  }, []);

  const hideNotification = useCallback(() => {
    setVisible(false);
  }, []);

  // Shortcut methods
  const showSuccess = useCallback(
    (message: string, title?: string, onConfirm?: () => void) => {
      showNotification({
        type: 'success',
        message,
        title: title || 'Success!',
        onConfirm,
      });
    },
    [showNotification]
  );

  const showError = useCallback(
    (message: string, title?: string, onConfirm?: () => void) => {
      showNotification({
        type: 'error',
        message,
        title: title || 'Error!',
        onConfirm,
      });
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string, title?: string, onConfirm?: () => void) => {
      showNotification({
        type: 'warning',
        message,
        title: title || 'Warning!',
        onConfirm,
      });
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string, title?: string, onConfirm?: () => void) => {
      showNotification({
        type: 'info',
        message,
        title: title || 'Information',
        onConfirm,
      });
    },
    [showNotification]
  );

  // Confirmation dialog with 2 buttons
  const showConfirm = useCallback(
    (
      message: string,
      onConfirm: () => void,
      options?: {
        title?: string;
        confirmText?: string;
        cancelText?: string;
        type?: NotificationType;
      }
    ) => {
      showNotification({
        type: options?.type || 'warning',
        message,
        title: options?.title || 'Confirm',
        confirmText: options?.confirmText || 'Confirm',
        cancelText: options?.cancelText || 'Cancel',
        showCancel: true,
        onConfirm,
      });
    },
    [showNotification]
  );

  return {
    visible,
    config,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };
};
