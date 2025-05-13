import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import Colors from "@/constant/Color";

export default function ActivityUtilizationChart({
  dataset,
}: {
  dataset: { value: number; color: string }[];
}) {
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
              <Text style={{ fontSize: 30, textAlign: "center" }}>
                {utilization.toFixed(2)}%
              </Text>
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
