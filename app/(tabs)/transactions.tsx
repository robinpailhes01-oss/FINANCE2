import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../constants/theme';

export default function TransactionsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.label}>Opérations</Text>
        <Text style={styles.title}>Toutes les transactions</Text>
        <Text style={styles.placeholder}>
          Liste, filtres et recherche à venir.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.lg, paddingTop: spacing.xl },
  label: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.sm },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: spacing.md },
  placeholder: { ...typography.body, color: colors.textTertiary },
});
