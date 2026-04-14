import { Tabs } from 'expo-router';
import { Home, ListOrdered, PieChart, Settings } from 'lucide-react-native';
import { colors, fonts, fontSizes } from '../../constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accentGold,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          height: 84,
          paddingTop: 8,
          paddingBottom: 28,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.sansMedium,
          fontSize: fontSizes.xs,
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Aperçu',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size - 2} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Opérations',
          tabBarIcon: ({ color, size }) => (
            <ListOrdered color={color} size={size - 2} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analyse',
          tabBarIcon: ({ color, size }) => (
            <PieChart color={color} size={size - 2} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Réglages',
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size - 2} strokeWidth={1.5} />
          ),
        }}
      />
    </Tabs>
  );
}
