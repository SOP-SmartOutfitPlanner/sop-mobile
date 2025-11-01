import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import { useAIDetection } from '../../contexts/AIDetectionContext';

export const AIDetectionBanner: React.FC = () => {
  const { isDetecting, hasCompletedDetection, error, setShouldOpenModal } = useAIDetection();
  const slideAnim = React.useRef(new Animated.Value(100)).current; // Start from bottom (100)
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isDetecting || hasCompletedDetection || error) {
      // Slide up from bottom
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }).start();

      // Pulse animation for detecting state
      if (isDetecting) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ).start();
      } else {
        pulseAnim.setValue(1);
      }
    } else {
      // Slide down to hide
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isDetecting, hasCompletedDetection, error, slideAnim, pulseAnim]);

  if (!isDetecting && !hasCompletedDetection && !error) {
    return null;
  }

  const getColors = (): [string, string] => {
    if (error) return ['#ef4444', '#dc2626'];
    if (hasCompletedDetection) return ['#10b981', '#059669'];
    return ['#30cfd0', '#330867'];
  };

  const getMessage = () => {
    if (error) return error;
    if (hasCompletedDetection) return 'AI analysis complete! Tap to view';
    return 'Analyzing your item with AI...';
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={hasCompletedDetection ? 0.7 : 1}
        onPress={hasCompletedDetection ? () => setShouldOpenModal(true) : undefined}
        disabled={!hasCompletedDetection}
      >
        <LinearGradient
          colors={getColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.banner}
        >
          <Animated.View
            style={[
              styles.iconContainer,
              isDetecting && { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Sparkles color="#ffffff" size={20} />
          </Animated.View>
          
          <View style={styles.textContainer}>
            <Text style={styles.message} numberOfLines={2}>
              {getMessage()}
            </Text>
          </View>

          {isDetecting && (
            <View style={styles.loadingDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 13,
    
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderRadius: 150,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  message: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  dot1: {},
  dot2: {},
  dot3: {},
});
