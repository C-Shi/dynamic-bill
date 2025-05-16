import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";

/**
 * ActivityUtilizationChart Component
 * Displays a donut chart showing budget utilization.
 * Features:
 * - Donut chart with inner radius for center label
 * - Center label showing utilization percentage
 * - Status text indicating if over budget
 * - Dataset should contain two values: [used amount, remaining amount]
 *
 * @param dataset - Array containing two objects with value and color properties
 *                First object represents used amount, second represents remaining amount
 */
export default function ActivityUtilizationChart({
  dataset,
}: {
  dataset: { value: number; color: string }[];
}) {
  // Calculate utilization percentage from dataset values
  const utilization =
    (dataset[0].value / (dataset[1].value + dataset[0].value)) * 100;

  return (
    <View style={{ alignItems: "center", transform: [{ scale: 0.9 }] }}>
      <PieChart
        donut
        innerRadius={80}
        data={dataset}
        centerLabelComponent={() => {
          return (
            <>
              {/* Display utilization percentage */}
              <Text style={{ fontSize: 30, textAlign: "center" }}>
                {utilization.toFixed(2)}%
              </Text>
              {/* Display budget status */}
              <Text style={{ fontSize: 15, textAlign: "center" }}>
                {utilization > 100 ? "Over Budget" : "Utilized"}
              </Text>
            </>
          );
        }}
      />
    </View>
  );
}
