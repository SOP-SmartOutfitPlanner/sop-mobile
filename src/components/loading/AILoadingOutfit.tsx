import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Image as ImageIcon } from 'lucide-react-native';

type Props = {
  visible: boolean;
  onCancel?: () => void;
  message?: string;
};

export const AILoadingOutfit = ({ visible, onCancel, message }: Props) => {
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    if (visible && lottieRef.current) {
      lottieRef.current.play();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <LinearGradient
      colors={['#30cfd0', '#330867']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.overlay}
    >
      <View style={styles.content}>
        {/* Lottie Animation */}
        <LottieView
          ref={lottieRef}
          source={require('../../../assets/animations/ai-loading.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        
        <Text style={styles.title}>{message ?? 'Analyzing your item…'}</Text>

        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <ImageIcon color="#ffffff" size={24} />
            <Text style={styles.label}>Processing image</Text>
          </View>
          <View style={styles.row}>
            <Sparkles color="#ffffff" size={24} />
            <Text style={styles.label}>AI detection in progress</Text>
          </View>
        </View>

        {onCancel && (
          <Pressable style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelTxt}>Cancel</Text>
          </Pressable>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  lottie: {
    width: 240,
    height: 240,
    marginBottom: 16,
  },
  title: { 
    color: 'white', 
    fontSize: 24, 
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  infoContainer: {
    width: '100%',
    maxWidth: 320,
    gap: 16,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  label: { 
    color: '#ffffff', 
    fontSize: 16, 
    fontWeight: '500',
    flex: 1,
  },
  cancelBtn: {
    marginTop: 32,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  cancelTxt: { 
    color: 'white', 
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
});
