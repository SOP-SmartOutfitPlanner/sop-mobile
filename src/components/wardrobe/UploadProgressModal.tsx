import React from 'react';
import { View, Text, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { UploadProgress } from '../../types/image';
import LottieView from 'lottie-react-native';

interface UploadProgressModalProps {
  visible: boolean;
  progress: UploadProgress;
}

export const UploadProgressModal: React.FC<UploadProgressModalProps> = ({ visible, progress }) => {
  const getPhaseMessage = () => {
    switch (progress.phase) {
      case 'uploading':
        return 'Uploading images...';
      case 'analyzing':
        return 'Analyzing items...';
      case 'complete':
        return 'Upload complete!';
      case 'failed':
        return 'Upload failed';
      default:
        return '';
    }
  };

  const getPhaseColor = () => {
    switch (progress.phase) {
      case 'complete':
        return '#10b981';
      case 'failed':
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {progress.phase === 'uploading' || progress.phase === 'analyzing' ? (
            <LottieView
              source={require('../../../assets/animations/ai-loading.json')}
              autoPlay
              loop
              style={styles.lottie}
            />
          ) : null}

          <Text style={[styles.phase, { color: getPhaseColor() }]}>
            {getPhaseMessage()}
          </Text>

          <Text style={styles.message}>{progress.message}</Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${(progress.current / progress.total) * 100}%`,
                    backgroundColor: getPhaseColor()
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {progress.current} / {progress.total}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  lottie: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  phase: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  progressContainer: {
    width: '100%',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
