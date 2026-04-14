import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Coins, CreditCard, Lock, RotateCcw, Shield } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, radii, spacing, typography } from '../../constants/theme';
import { useFinanceStore } from '../../store/useFinanceStore';
import { PressableScale } from '../../components/ui/PressableScale';
import { Card } from '../../components/ui/Card';

interface Row {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  destructive?: boolean;
  onPress?: () => void;
}

export default function SettingsScreen() {
  const reset = useFinanceStore((s) => s.reset);

  const sections: { title: string; rows: Row[] }[] = [
    {
      title: 'Préférences',
      rows: [
        {
          icon: <Coins color={colors.textSecondary} size={18} strokeWidth={1.6} />,
          label: 'Devise',
          hint: 'EUR',
        },
        {
          icon: <Bell color={colors.textSecondary} size={18} strokeWidth={1.6} />,
          label: 'Notifications',
          hint: 'Activées',
        },
      ],
    },
    {
      title: 'Comptes',
      rows: [
        {
          icon: <CreditCard color={colors.textSecondary} size={18} strokeWidth={1.6} />,
          label: 'Gérer les comptes',
        },
      ],
    },
    {
      title: 'Sécurité',
      rows: [
        {
          icon: <Lock color={colors.textSecondary} size={18} strokeWidth={1.6} />,
          label: 'Code secret',
          hint: 'Désactivé',
        },
        {
          icon: <Shield color={colors.textSecondary} size={18} strokeWidth={1.6} />,
          label: 'Face ID',
          hint: 'Désactivé',
        },
      ],
    },
    {
      title: 'Données',
      rows: [
        {
          icon: <RotateCcw color={colors.accentRed} size={18} strokeWidth={1.6} />,
          label: 'Réinitialiser les données',
          hint: 'Remet les valeurs par défaut',
          destructive: true,
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
              () => {}
            );
            reset();
          },
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.label}>Réglages</Text>
          <Text style={styles.title}>Préférences</Text>
        </View>

        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card padded={false} style={styles.sectionCard}>
              {section.rows.map((row, idx) => (
                <View key={row.label}>
                  <PressableScale
                    haptic="selection"
                    scaleTo={0.99}
                    onPress={row.onPress}
                    style={styles.row}
                  >
                    <View style={styles.rowIcon}>{row.icon}</View>
                    <Text
                      style={[
                        styles.rowLabel,
                        row.destructive && { color: colors.accentRed },
                      ]}
                    >
                      {row.label}
                    </Text>
                    {row.hint && <Text style={styles.rowHint}>{row.hint}</Text>}
                  </PressableScale>
                  {idx < section.rows.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </Card>
          </View>
        ))}

        <Text style={styles.footer}>FINANCE2 · 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
    gap: spacing.lg,
  },
  label: { ...typography.label, color: colors.textSecondary },
  title: { ...typography.title, color: colors.textPrimary, marginTop: spacing.xs },

  section: { gap: spacing.sm },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  sectionCard: { overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    gap: spacing.md,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { flex: 1, ...typography.body, color: colors.textPrimary },
  rowHint: { ...typography.bodySmall, color: colors.textSecondary },
  divider: {
    height: 0.5,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 32 + spacing.md,
  },
  footer: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
