import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient as SvgLinearGradient,
  Stop,
  Rect,
  Circle,
} from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PastelBackgroundProps {
  children?: React.ReactNode;
}

export const PastelBackground: React.FC<PastelBackgroundProps> = ({ children }) => {
  const floatOrb1 = useRef(new Animated.Value(0)).current;
  const floatOrb2 = useRef(new Animated.Value(0)).current;
  const floatOrb3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Soft pastel orb 1 floating loop (Mint Sage)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatOrb1, {
          toValue: 1,
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatOrb1, {
          toValue: 0,
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Soft pastel orb 2 floating loop (Peach Rose)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatOrb2, {
          toValue: 1,
          duration: 11000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatOrb2, {
          toValue: 0,
          duration: 11000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Soft pastel orb 3 floating loop (Lavender Lilac)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatOrb3, {
          toValue: 1,
          duration: 13000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatOrb3, {
          toValue: 0,
          duration: 13000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatOrb1, floatOrb2, floatOrb3]);

  const orb1TranslateY = floatOrb1.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 25],
  });

  const orb2TranslateY = floatOrb2.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -35],
  });

  const orb3TranslateY = floatOrb3.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 20],
  });

  return (
    <View style={styles.container}>
      {/* Base Warm Cream & Vanilla Silk Canvas */}
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgLinearGradient id="pastelBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FAF7F2" />
            <Stop offset="35%" stopColor="#F4EFEA" />
            <Stop offset="70%" stopColor="#EFF6F0" />
            <Stop offset="100%" stopColor="#F5F3FF" />
          </SvgLinearGradient>

          {/* Mint Sage Pastel Aura */}
          <RadialGradient id="mintAura" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.65" />
            <Stop offset="60%" stopColor="#D1FAE5" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
          </RadialGradient>

          {/* Peach Rose Pastel Aura */}
          <RadialGradient id="peachAura" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FED7AA" stopOpacity="0.6" />
            <Stop offset="65%" stopColor="#FEE2E2" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
          </RadialGradient>

          {/* Lavender Periwinkle Pastel Aura */}
          <RadialGradient id="lavenderAura" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.65" />
            <Stop offset="60%" stopColor="#EDE9FE" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="url(#pastelBase)" />
      </Svg>

      {/* Floating Pastel Orb 1 (Top Left - Peach Rose) */}
      <Animated.View
        style={[
          styles.pastelOrb,
          {
            top: SCREEN_HEIGHT * 0.04,
            left: -50,
            width: 280,
            height: 280,
            transform: [{ translateY: orb2TranslateY }],
          },
        ]}
      >
        <Svg width="280" height="280" viewBox="0 0 280 280">
          <Circle cx="140" cy="140" r="130" fill="url(#peachAura)" />
        </Svg>
      </Animated.View>

      {/* Floating Pastel Orb 2 (Mid Right - Mint Sage) */}
      <Animated.View
        style={[
          styles.pastelOrb,
          {
            top: SCREEN_HEIGHT * 0.35,
            right: -60,
            width: 300,
            height: 300,
            transform: [{ translateY: orb1TranslateY }],
          },
        ]}
      >
        <Svg width="300" height="300" viewBox="0 0 300 300">
          <Circle cx="150" cy="150" r="140" fill="url(#mintAura)" />
        </Svg>
      </Animated.View>

      {/* Floating Pastel Orb 3 (Bottom Left - Lavender Lilac) */}
      <Animated.View
        style={[
          styles.pastelOrb,
          {
            bottom: SCREEN_HEIGHT * 0.06,
            left: -40,
            width: 280,
            height: 280,
            transform: [{ translateY: orb3TranslateY }],
          },
        ]}
      >
        <Svg width="280" height="280" viewBox="0 0 280 280">
          <Circle cx="140" cy="140" r="130" fill="url(#lavenderAura)" />
        </Svg>
      </Animated.View>

      {/* Content Overlay */}
      {children && <View style={styles.contentOverlay}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FAF7F2',
    overflow: 'hidden',
  },
  pastelOrb: {
    position: 'absolute',
  },
  contentOverlay: {
    flex: 1,
    zIndex: 10,
  },
});
