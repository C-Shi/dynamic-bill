import { Activity } from "@/model/Activity";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors, { ColorSet } from "@/constant/Color";
import ActivityPieChart from "./ActivityPieChart";

import React, { useState } from "react";

export default function ActivityChart({ activity }: { activity: Activity }) {
  const [chartType, setChartType] = useState<"contribution" | "settlement">(
    "contribution"
  );

  const chartColorSet = ColorSet.newSet(activity.participants.length);

  const chartToDisplay =
    chartType === "contribution" ? (
      <ActivityPieChart
        activity={activity}
        chartColorSet={chartColorSet}
      ></ActivityPieChart>
    ) : (
      <Text>Settlement</Text>
    );

  return (
    <View style={styles.container}>
      <View style={styles.chartButtonGroup}>
        <TouchableOpacity
          onPress={() => setChartType("contribution")}
          style={[
            chartType === "contribution"
              ? styles.activeButton
              : styles.inactiveButton,
            styles.leftButton,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color:
                  chartType === "contribution"
                    ? Colors.Background
                    : Colors.Main,
              },
            ]}
          >
            Contribution
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setChartType("settlement")}
          style={[
            chartType === "settlement"
              ? styles.activeButton
              : styles.inactiveButton,
            styles.rightButton,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color:
                  chartType === "settlement" ? Colors.Background : Colors.Main,
              },
            ]}
          >
            Paid vs Owed
          </Text>
        </TouchableOpacity>
      </View>
      {chartToDisplay}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: Colors.Background,
    shadowColor: Colors.Main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderRadius: 8,
  },
  chartButtonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  activeButton: {
    backgroundColor: Colors.Primary,
  },
  inactiveButton: {
    backgroundColor: Colors.Card,
  },
  leftButton: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 8,
    width: 150,
  },
  rightButton: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 8,
    width: 150,
  },
  buttonText: {
    color: Colors.Main,
    fontWeight: "600",
    textAlign: "center",
  },
});
