import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fonts, radii, spacing, typography } from '../../constants/theme';

interface Segment<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.container}>
      {segments.map((s) => {
        const active = s.value === value;
        return (
          <Pressable
            key={s.value}
            onPress={() => {
              if (!active) Haptics.selectionAsync().catch(() => {});
              onChange(s.value);
            }}
            style={[styles.item, active && styles.itemActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {s.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.elevated,
    borderRadius: radii.full,
    padding: 4,
    gap: 4,
  },
  item: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radii.full,
    alignItems: 'center',
  },
  itemActive: {
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.textPrimary,
    fontFamily: fonts.sansSemiBold,
  },
});
