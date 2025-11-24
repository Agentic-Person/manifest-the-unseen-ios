/**
 * ConfettiCelebration
 *
 * Animated confetti celebration effect for Phase 10 Graduation.
 * Creates a particle-based confetti explosion effect.
 *
 * Design (from APP-DESIGN.md):
 * - Uses accent colors: gold, purple, teal, rose
 * - Celebratory and spiritual theme
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Confetti colors (from design system)
const CONFETTI_COLORS = [
  '#c9a227', // Gold
  '#4a1a6b', // Deep purple
  '#1a5f5f', // Teal
  '#8b3a5f', // Rose
  '#e5d39a', // Light gold
  '#6b5b8a', // Lavender
  '#2d5a4a', // Forest green
  '#fbbf24', // Bright gold
];

// Confetti shapes
type ConfettiShape = 'square' | 'circle' | 'rectangle' | 'star';

interface ConfettiParticle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  color: string;
  shape: ConfettiShape;
  size: number;
}

export interface ConfettiCelebrationProps {
  isActive: boolean;
  duration?: number; // in ms
  particleCount?: number;
  onComplete?: () => void;
}

/**
 * Generate random number between min and max
 */
const random = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Get random item from array
 */
const randomItem = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * ConfettiCelebration Component
 */
export const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
  isActive,
  duration = 3000,
  particleCount = 100,
  onComplete,
}) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const animationsRef = useRef<Animated.CompositeAnimation[]>([]);

  // Create and animate particles when active
  useEffect(() => {
    if (!isActive) {
      // Clean up
      animationsRef.current.forEach(anim => anim.stop());
      animationsRef.current = [];
      setParticles([]);
      return;
    }

    // Create particles
    const newParticles: ConfettiParticle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: new Animated.Value(random(0, SCREEN_WIDTH)),
      y: new Animated.Value(-50),
      rotation: new Animated.Value(0),
      scale: new Animated.Value(random(0.5, 1.5)),
      opacity: new Animated.Value(1),
      color: randomItem(CONFETTI_COLORS),
      shape: randomItem(['square', 'circle', 'rectangle', 'star'] as ConfettiShape[]),
      size: random(8, 16),
    }));

    setParticles(newParticles);

    // Animate each particle
    const animations = newParticles.map((particle, _index) => {
      const delay = random(0, 500);
      const particleDuration = random(duration * 0.7, duration);
      const drift = random(-100, 100);

      return Animated.parallel([
        // Fall animation
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(particle.y, {
            toValue: SCREEN_HEIGHT + 50,
            duration: particleDuration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        // Horizontal drift
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(particle.x, {
            toValue: (particle.x as any)._value + drift,
            duration: particleDuration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        // Rotation
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(particle.rotation, {
            toValue: random(2, 8) * 360,
            duration: particleDuration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
        // Fade out at end
        Animated.sequence([
          Animated.delay(delay + particleDuration * 0.7),
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: particleDuration * 0.3,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    animationsRef.current = animations;

    // Start all animations
    Animated.parallel(animations).start(() => {
      onComplete?.();
    });

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, [isActive, duration, particleCount, onComplete]);

  if (!isActive || particles.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => {
        const rotateInterpolate = particle.rotation.interpolate({
          inputRange: [0, 360],
          outputRange: ['0deg', '360deg'],
        });

        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                transform: [
                  { translateX: particle.x },
                  { translateY: particle.y },
                  { rotate: rotateInterpolate },
                  { scale: particle.scale },
                ],
                opacity: particle.opacity,
              },
            ]}
          >
            <ConfettiShape
              shape={particle.shape}
              color={particle.color}
              size={particle.size}
            />
          </Animated.View>
        );
      })}
    </View>
  );
};

/**
 * Individual confetti shape component
 */
interface ConfettiShapeProps {
  shape: ConfettiShape;
  color: string;
  size: number;
}

const ConfettiShape: React.FC<ConfettiShapeProps> = ({ shape, color, size }) => {
  switch (shape) {
    case 'circle':
      return (
        <View
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
            },
          ]}
        />
      );
    case 'rectangle':
      return (
        <View
          style={[
            styles.rectangle,
            {
              width: size * 0.4,
              height: size,
              backgroundColor: color,
            },
          ]}
        />
      );
    case 'star':
      // Simplified star using Unicode
      return (
        <View style={[styles.star, { width: size, height: size }]}>
          <Animated.Text style={[styles.starText, { fontSize: size, color }]}>
            {'\u2605'}
          </Animated.Text>
        </View>
      );
    case 'square':
    default:
      return (
        <View
          style={[
            styles.square,
            {
              width: size,
              height: size,
              backgroundColor: color,
            },
          ]}
        />
      );
  }
};

/**
 * Burst effect - creates an instant burst of confetti from a point
 */
export interface ConfettiBurstProps {
  isActive: boolean;
  originX?: number;
  originY?: number;
  particleCount?: number;
  onComplete?: () => void;
}

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({
  isActive,
  originX = SCREEN_WIDTH / 2,
  originY = SCREEN_HEIGHT / 3,
  particleCount = 50,
  onComplete,
}) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    // Create burst particles
    const newParticles: ConfettiParticle[] = Array.from({ length: particleCount }, (_, i) => {
      const angle = random(0, Math.PI * 2);
      const velocity = random(100, 400);

      return {
        id: i,
        x: new Animated.Value(originX),
        y: new Animated.Value(originY),
        rotation: new Animated.Value(0),
        scale: new Animated.Value(random(0.5, 1.2)),
        opacity: new Animated.Value(1),
        color: randomItem(CONFETTI_COLORS),
        shape: randomItem(['square', 'circle', 'rectangle', 'star'] as ConfettiShape[]),
        size: random(6, 14),
        // Store angle and velocity for animation
        _angle: angle,
        _velocity: velocity,
      } as ConfettiParticle & { _angle: number; _velocity: number };
    });

    setParticles(newParticles);

    // Animate burst
    const animations = newParticles.map((particle: any) => {
      const angle = particle._angle;
      const velocity = particle._velocity;
      const endX = originX + Math.cos(angle) * velocity;
      const endY = originY + Math.sin(angle) * velocity + 200; // Add gravity

      return Animated.parallel([
        Animated.timing(particle.x, {
          toValue: endX,
          duration: 1500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(particle.y, {
          toValue: endY,
          duration: 1500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(particle.rotation, {
          toValue: random(360, 1080),
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(800),
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    Animated.parallel(animations).start(() => {
      onComplete?.();
    });
  }, [isActive, originX, originY, particleCount, onComplete]);

  if (!isActive || particles.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => {
        const rotateInterpolate = particle.rotation.interpolate({
          inputRange: [0, 360],
          outputRange: ['0deg', '360deg'],
        });

        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              styles.burstParticle,
              {
                transform: [
                  { translateX: Animated.subtract(particle.x, particle.size / 2) },
                  { translateY: Animated.subtract(particle.y, particle.size / 2) },
                  { rotate: rotateInterpolate },
                  { scale: particle.scale },
                ],
                opacity: particle.opacity,
              },
            ]}
          >
            <ConfettiShape
              shape={particle.shape}
              color={particle.color}
              size={particle.size}
            />
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  particle: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  burstParticle: {
    // Burst particles start from center
  },
  square: {
    borderRadius: 2,
  },
  circle: {},
  rectangle: {
    borderRadius: 1,
  },
  star: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  starText: {
    lineHeight: undefined,
    includeFontPadding: false,
  },
});

export default ConfettiCelebration;
