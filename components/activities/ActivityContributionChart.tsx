import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import Colors from "@/constant/Color";

/**
 * ActivityContributionChart Component
 * Displays a pie chart showing the contribution distribution among participants.
 * Each participant's contribution is represented by a slice in the pie chart,
 * with a corresponding legend showing their name and amount.
 *
 * @param dataset - Array of participants with their contribution data
 * @param chartColorSet - Array of colors to use for the pie chart slices
 */
export default function ActivityContributionChart({
  dataset,
  chartColorSet,
}: {
  dataset: any[];
  chartColorSet: string[];
}) {
  /**
   * Format a number as Canadian currency
   */
  const currencyHelper = (val: number) => {
    return Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(val);
  };

  // Transform participant data into pie chart data format
  const contributionData = dataset.map((p, i) => {
    return {
      value: p.totalPaid,
      color: chartColorSet[i],
      text: currencyHelper(p.totalPaid),
      name: p.name,
    };
  });

  // Generate legend items for each participant
  const legend = contributionData.map((c) => {
    return (
      <View key={Math.random()} style={styles.legend}>
        <View style={[styles.legendDot, { backgroundColor: c.color }]} />
        <Text style={[styles.legendText, { color: Colors.Main }]}>
          {c.name}: {currencyHelper(c.value)}
        </Text>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      {/* Pie Chart showing contribution distribution */}
      <PieChart
        data={contributionData}
        radius={90}
        textSize={10}
        textColor={Colors.Background}
      />
      {/* Legend showing participant names and amounts */}
      <View style={styles.legendContainer}>{legend}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    marginTop: 15,
    width: "100%",
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 8,
  },
  legendDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  legendText: {
    flex: 1,
  },
});
