import { StyleSheet, View } from 'react-native';
import { Area, CartesianChart, Line } from 'victory-native';
import { LinearGradient, vec } from '@shopify/react-native-skia';
import { colors } from '../../constants/theme';

type Point = { x: number; y: number };

interface BalanceChartProps {
  data: { date: string; balance: number }[];
  height?: number;
}

/**
 * Elegant balance-evolution line chart with a subtle gold gradient area.
 * Axis labels are intentionally hidden for a minimalist premium look.
 */
export function BalanceChart({ data, height = 220 }: BalanceChartProps) {
  const points: Point[] = data.map((p) => ({
    x: new Date(p.date).getTime(),
    y: p.balance,
  }));

  if (points.length < 2) {
    return <View style={[styles.empty, { height }]} />;
  }

  return (
    <View style={{ height, width: '100%' }}>
      <CartesianChart
        data={points}
        xKey="x"
        yKeys={['y']}
        domainPadding={{ top: 20, bottom: 8, left: 4, right: 4 }}
      >
        {({ points: p, chartBounds }) => (
          <>
            <Area
              points={p.y}
              y0={chartBounds.bottom}
              curveType="natural"
              animate={{ type: 'timing', duration: 400 }}
            >
              <LinearGradient
                start={vec(0, chartBounds.top)}
                end={vec(0, chartBounds.bottom)}
                colors={[`${colors.accentGold}66`, `${colors.accentGold}00`]}
              />
            </Area>
            <Line
              points={p.y}
              color={colors.accentGold}
              strokeWidth={2}
              curveType="natural"
              animate={{ type: 'timing', duration: 400 }}
            />
          </>
        )}
      </CartesianChart>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    width: '100%',
    backgroundColor: colors.elevated,
    borderRadius: 12,
  },
});
