import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { colors, radii, spacing, typography } from '../../constants/theme';

export default function AddTransactionModal() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Nouvelle opération</Text>
        <Pressable onPress={() => router.back()} style={styles.close} hitSlop={12}>
          <X color={colors.textSecondary} size={22} strokeWidth={1.5} />
        </Pressable>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholder}>
          Formulaire (montant, catégorie, compte, date, note) à venir.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
  },
  title: { ...typography.heading, color: colors.textPrimary },
  close: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, padding: spacing.lg },
  placeholder: { ...typography.body, color: colors.textTertiary },
});
