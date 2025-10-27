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
    <View style={styles.overlay}>
      <LinearGradient
        colors={['#5ee7df', '#b490ca']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Lottie Animation */}
        <LottieView
          ref={lottieRef}
          source={require('../../../assets/animations/ai-loading.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        
        <Text style={styles.title}>{message ?? 'Analyzing your item…'}</Text>

        <View style={styles.row}>
          <ImageIcon color="#ffffff" size={22} />
          <Text style={styles.label}>Processing image</Text>
        </View>
        <View style={styles.row}>
          <Sparkles color="#ffffff" size={22} />
          <Text style={styles.label}>AI detection in progress</Text>
        </View>

        {onCancel && (
          <Pressable style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelTxt}>Cancel</Text>
          </Pressable>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  card: {
    width: 320,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  lottie: {
    width: 180,
    height: 180,
    marginBottom: 8,
  },
  title: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    marginTop: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: { 
    color: '#ffffff', 
    fontSize: 14, 
    flex: 1 
  },
  cancelBtn: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cancelTxt: { 
    color: 'white', 
    fontWeight: '600',
    fontSize: 14,
  },
});
