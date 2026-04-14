import { StyleSheet, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { colors, radii } from '../../constants/theme';
import { PressableScale } from './PressableScale';

interface FABProps {
  onPress: () => void;
}

/**
 * Gold floating action button — bottom-right, suggests the primary action.
 */
export function FAB({ onPress }: FABProps) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <PressableScale
        onPress={onPress}
        style={styles.button}
        haptic="medium"
        scaleTo={0.92}
      >
        <Plus color={colors.background} size={24} strokeWidth={2.4} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    backgroundColor: colors.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accentGold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
});
