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
  G,
  Path,
} from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 36 Deterministic celestial starlight particles
const STARS = Array.from({ length: 36 }).map((_, i) => ({
  id: i,
  cx: ((i * 89 + 23) % SCREEN_WIDTH),
  cy: ((i * 127 + 37) % SCREEN_HEIGHT),
  r: (i % 4 === 0 ? 2.2 : i % 2 === 0 ? 1.4 : 0.8),
  opacity: (0.3 + (i % 5) * 0.15),
}));

interface CosmicBackgroundProps {
  children?: React.ReactNode;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ children }) => {
  // Pure native GPU-driven animated values for 120 FPS smoothness
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const floatOrb1 = useRef(new Animated.Value(0)).current;
  const floatOrb2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Slow hypnotic celestial galaxy rotation (Native Driver = 120 FPS)
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 32000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 2. Breathing stardust glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 3500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Floating Nebula 1 (Teal Emerald)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatOrb1, {
          toValue: 1,
          duration: 7000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatOrb1, {
          toValue: 0,
          duration: 7000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 4. Floating Nebula 2 (Violet Coral)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatOrb2, {
          toValue: 1,
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatOrb2, {
          toValue: 0,
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [spinAnim, pulseAnim, floatOrb1, floatOrb2]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const orb1TranslateY = floatOrb1.interpolate({
    inputRange: [0, 1],
    outputRange: [-25, 30],
  });

  const orb2TranslateY = floatOrb2.interpolate({
    inputRange: [0, 1],
    outputRange: [25, -25],
  });

  const starPulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.65, 1],
  });

  return (
    <View style={styles.container}>
      {/* 1. Base Cosmic Deep Space Sky */}
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgLinearGradient id="bgDeepSky" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#040914" />
            <Stop offset="40%" stopColor="#061224" />
            <Stop offset="75%" stopColor="#08182B" />
            <Stop offset="100%" stopColor="#02060E" />
          </SvgLinearGradient>

          <RadialGradient id="coreAura" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#0F4C5C" stopOpacity="0.45" />
            <Stop offset="60%" stopColor="#10B981" stopOpacity="0.12" />
            <Stop offset="100%" stopColor="#040914" stopOpacity="0" />
          </RadialGradient>

          <RadialGradient id="violetAura" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#7C3AED" stopOpacity="0.35" />
            <Stop offset="65%" stopColor="#E36414" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#040914" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="url(#bgDeepSky)" />
      </Svg>

      {/* 2. Rotating Hypnotic Galaxy Mesh Nebula (120 FPS GPU Rendered) */}
      <Animated.View
        style={[
          styles.rotatingGalaxy,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <Svg width={SCREEN_WIDTH * 1.6} height={SCREEN_WIDTH * 1.6} viewBox="0 0 500 500">
          <Defs>
            <RadialGradient id="galaxyDisc" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
              <Stop offset="30%" stopColor="#0F4C5C" stopOpacity="0.25" />
              <Stop offset="60%" stopColor="#7C3AED" stopOpacity="0.15" />
              <Stop offset="85%" stopColor="#E36414" stopOpacity="0.06" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="250" cy="250" r="240" fill="url(#galaxyDisc)" />

          {/* Celestial Spiral Arms */}
          <Path
            d="M 250,250 Q 320,160 400,200 Q 460,260 430,340"
            fill="none"
            stroke="rgba(16, 185, 129, 0.18)"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <Path
            d="M 250,250 Q 180,340 100,300 Q 40,240 70,160"
            fill="none"
            stroke="rgba(124, 58, 237, 0.18)"
            strokeWidth="24"
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>

      {/* 3. Floating Glowing Nebula Orbs */}
      <Animated.View
        style={[
          styles.floatingOrbTop,
          {
            transform: [{ translateY: orb1TranslateY }],
          },
        ]}
      >
        <Svg width="260" height="260" viewBox="0 0 260 260">
          <Circle cx="130" cy="130" r="120" fill="url(#coreAura)" />
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingOrbBottom,
          {
            transform: [{ translateY: orb2TranslateY }],
          },
        ]}
      >
        <Svg width="280" height="280" viewBox="0 0 280 280">
          <Circle cx="140" cy="140" r="130" fill="url(#violetAura)" />
        </Svg>
      </Animated.View>

      {/* 4. Twinkling Starlight Field */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: starPulseOpacity }]}>
        <Svg style={StyleSheet.absoluteFill}>
          <G>
            {STARS.map((star) => (
              <Circle
                key={star.id}
                cx={star.cx}
                cy={star.cy}
                r={star.r}
                fill="#FFFFFF"
                opacity={star.opacity}
              />
            ))}
          </G>
        </Svg>
      </Animated.View>

      {/* 5. Interactive Content Overlay */}
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
    backgroundColor: '#040914',
    overflow: 'hidden',
  },
  rotatingGalaxy: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.12 - (SCREEN_WIDTH * 1.6) / 2,
    left: SCREEN_WIDTH / 2 - (SCREEN_WIDTH * 1.6) / 2,
    width: SCREEN_WIDTH * 1.6,
    height: SCREEN_WIDTH * 1.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingOrbTop: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.08,
    left: -40,
    width: 260,
    height: 260,
  },
  floatingOrbBottom: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.12,
    right: -50,
    width: 280,
    height: 280,
  },
  contentOverlay: {
    flex: 1,
    zIndex: 10,
  },
});
