import { forwardRef } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends PressableProps {
  scaleTo?: number;
  haptic?: 'light' | 'medium' | 'heavy' | 'selection' | 'none';
  style?: StyleProp<ViewStyle>;
}

/**
 * Pressable with a subtle scale-down animation + optional haptic feedback.
 */
export const PressableScale = forwardRef<any, PressableScaleProps>(
  ({ scaleTo = 0.96, haptic = 'light', style, onPressIn, onPress, children, ...rest }, ref) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = (e: GestureResponderEvent) => {
      scale.value = withTiming(scaleTo, { duration: 80 });
      onPressIn?.(e);
    };
    const handlePressOut = () => {
      scale.value = withTiming(1, { duration: 120 });
    };
    const handlePress = (e: GestureResponderEvent) => {
      if (haptic !== 'none') {
        const impact = {
          light: Haptics.ImpactFeedbackStyle.Light,
          medium: Haptics.ImpactFeedbackStyle.Medium,
          heavy: Haptics.ImpactFeedbackStyle.Heavy,
        }[haptic as 'light' | 'medium' | 'heavy'];
        if (haptic === 'selection') {
          Haptics.selectionAsync().catch(() => {});
        } else if (impact) {
          Haptics.impactAsync(impact).catch(() => {});
        }
      }
      onPress?.(e);
    };

    return (
      <AnimatedPressable
        ref={ref}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={[style, animatedStyle]}
        {...rest}
      >
        {children as any}
      </AnimatedPressable>
    );
  }
);

PressableScale.displayName = 'PressableScale';
