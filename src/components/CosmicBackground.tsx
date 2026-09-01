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
} from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Generate 45 deterministic starry particles
const STARS = Array.from({ length: 45 }).map((_, i) => ({
  id: i,
  cx: ((i * 73 + 17) % SCREEN_WIDTH),
  cy: ((i * 109 + 29) % SCREEN_HEIGHT),
  r: (i % 3 === 0 ? 2 : i % 2 === 0 ? 1.4 : 0.9),
  opacity: (0.35 + (i % 5) * 0.15),
  pulseSpeed: 1800 + (i % 7) * 450,
}));

interface CosmicBackgroundProps {
  children?: React.ReactNode;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ children }) => {
  // Nebula slow orbital float animations
  const orb1Anim = useRef(new Animated.Value(0)).current;
  const orb2Anim = useRef(new Animated.Value(0)).current;
  const starPulse = useRef(new Animated.Value(0.4)).current;
  const meteorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Orb 1 gentle floating loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(orb1Anim, {
          toValue: 1,
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(orb1Anim, {
          toValue: 0,
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Orb 2 counter floating loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(orb2Anim, {
          toValue: 1,
          duration: 12000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(orb2Anim, {
          toValue: 0,
          duration: 12000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Starfield twinkle breathing pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(starPulse, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(starPulse, {
          toValue: 0.45,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Periodic shooting star
    Animated.loop(
      Animated.sequence([
        Animated.delay(4000),
        Animated.timing(meteorAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(meteorAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [orb1Anim, orb2Anim, starPulse, meteorAnim]);

  const orb1TranslateX = orb1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 40],
  });
  const orb1TranslateY = orb1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  const orb2TranslateX = orb2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, -40],
  });
  const orb2TranslateY = orb2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });

  const meteorTranslateX = meteorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, SCREEN_WIDTH + 100],
  });
  const meteorTranslateY = meteorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, SCREEN_HEIGHT * 0.45],
  });
  const meteorOpacity = meteorAnim.interpolate({
    inputRange: [0, 0.1, 0.8, 1],
    outputRange: [0, 1, 0.8, 0],
  });

  return (
    <View style={styles.container}>
      {/* Deep Space Canvas */}
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          {/* Base Midnight Sky Gradient */}
          <SvgLinearGradient id="spaceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#040914" />
            <Stop offset="45%" stopColor="#07172A" />
            <Stop offset="80%" stopColor="#0A1E38" />
            <Stop offset="100%" stopColor="#030712" />
          </SvgLinearGradient>

          {/* Deep Teal Nebula Aura */}
          <RadialGradient
            id="nebulaTeal"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <Stop offset="0%" stopColor="#0F4C5C" stopOpacity="0.55" />
            <Stop offset="60%" stopColor="#0F4C5C" stopOpacity="0.18" />
            <Stop offset="100%" stopColor="#07172A" stopOpacity="0" />
          </RadialGradient>

          {/* Emerald Aurora Aura */}
          <RadialGradient
            id="nebulaEmerald"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <Stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
            <Stop offset="55%" stopColor="#10B981" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#07172A" stopOpacity="0" />
          </RadialGradient>

          {/* Celestial Coral Violet Aura */}
          <RadialGradient
            id="nebulaCoral"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <Stop offset="0%" stopColor="#E36414" stopOpacity="0.32" />
            <Stop offset="65%" stopColor="#9333EA" stopOpacity="0.08" />
            <Stop offset="100%" stopColor="#030712" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Base Sky Background */}
        <Rect width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="url(#spaceGradient)" />

        {/* Static Ambient Nebulae */}
        <Circle cx={SCREEN_WIDTH * 0.85} cy={SCREEN_HEIGHT * 0.15} r={SCREEN_WIDTH * 0.55} fill="url(#nebulaCoral)" />
        <Circle cx={SCREEN_WIDTH * 0.15} cy={SCREEN_HEIGHT * 0.5} r={SCREEN_WIDTH * 0.65} fill="url(#nebulaTeal)" />
        <Circle cx={SCREEN_WIDTH * 0.7} cy={SCREEN_HEIGHT * 0.85} r={SCREEN_WIDTH * 0.6} fill="url(#nebulaEmerald)" />

        {/* Starfield Particles */}
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

      {/* Floating Animated Nebula Orb 1 (Teal Cyan Glow) */}
      <Animated.View
        style={[
          styles.animatedOrb,
          {
            top: SCREEN_HEIGHT * 0.1,
            left: SCREEN_WIDTH * 0.1,
            width: 240,
            height: 240,
            borderRadius: 120,
            backgroundColor: 'rgba(15, 76, 92, 0.28)',
            transform: [{ translateX: orb1TranslateX }, { translateY: orb1TranslateY }],
          },
        ]}
      />

      {/* Floating Animated Nebula Orb 2 (Emerald Light) */}
      <Animated.View
        style={[
          styles.animatedOrb,
          {
            bottom: SCREEN_HEIGHT * 0.2,
            right: SCREEN_WIDTH * 0.05,
            width: 260,
            height: 260,
            borderRadius: 130,
            backgroundColor: 'rgba(16, 185, 129, 0.22)',
            transform: [{ translateX: orb2TranslateX }, { translateY: orb2TranslateY }],
          },
        ]}
      />

      {/* Shooting Meteor Streak */}
      <Animated.View
        style={[
          styles.meteorStreak,
          {
            transform: [
              { translateX: meteorTranslateX },
              { translateY: meteorTranslateY },
              { rotate: '35deg' },
            ],
            opacity: meteorOpacity,
          },
        ]}
      />

      {/* Optional Content Overlay */}
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
  animatedOrb: {
    position: 'absolute',
    opacity: 0.8,
  },
  meteorStreak: {
    position: 'absolute',
    width: 90,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  contentOverlay: {
    flex: 1,
    zIndex: 2,
  },
});
