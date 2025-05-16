import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors, { ColorSet } from "@/constant/Color";
import ActivityContributionChart from "./ActivityContributionChart";
import ActivityPayChart from "./ActivityPayChart";
import ActivityUtilizationChart from "./ActivityUtilizationChart";
import React, { useState } from "react";
import { Participant } from "@/model/Participant";
import { MaterialIcons } from "@expo/vector-icons";
import { Activity } from "@/model/Activity";

/**
 * ActivityChart Component
 * A component that displays various charts for activity data visualization.
 * Features:
 * - Contribution chart showing how much each participant contributed
 * - Utilization chart showing budget usage (if budget exists)
 * - Settlement chart showing paid vs owed amounts
 *
 * @param dataset - Array of participants with their financial data
 * @param activity - The activity object containing budget and total information
 */
export default function ActivityChart({
  dataset,
  activity,
}: {
  dataset: Participant[];
  activity: Activity;
}) {
  // State for tracking which chart type is currently selected
  const [chartType, setChartType] = useState<
    "contribution" | "settlement" | "utilization"
  >("contribution");

  // Calculate total amount paid by all participants
  const ttl = dataset.reduce((prev: number, p: Participant): number => {
    return p.totalPaid + prev;
  }, 0);

  // Show "No Data" message if there are no expenses
  if (ttl === 0) {
    return (
      <View style={[styles.container, styles.textContainer]}>
        <MaterialIcons
          name="info-outline"
          size={60}
          color={Colors.Coffee}
          style={styles.icon}
        />
        <View>
          <Text style={styles.title}>No Data Available (Yet)</Text>
        </View>
      </View>
    );
  }

  // Generate a color set for the charts based on number of participants
  const chartColorSet = ColorSet.newSet(dataset.length);

  // Default to contribution chart
  let chartToDisplay = (
    <ActivityContributionChart
      dataset={dataset}
      chartColorSet={chartColorSet}
    ></ActivityContributionChart>
  );

  // Switch to settlement chart if selected
  if (chartType === "settlement") {
    chartToDisplay = (
      <ActivityPayChart
        dataset={dataset}
        chartColorSet={chartColorSet}
      ></ActivityPayChart>
    );
  }

  // Switch to utilization chart if selected and budget exists
  if (chartType === "utilization") {
    const utilizationData = [
      {
        value: activity.totals,
        color:
          activity.budget! >= activity.totals ? Colors.Primary : Colors.Danger,
      },
      {
        value: activity.budget! - activity.totals,
        color: Colors.Light,
      },
    ];
    chartToDisplay = (
      <ActivityUtilizationChart
        dataset={utilizationData}
      ></ActivityUtilizationChart>
    );
  }

  return (
    <View style={styles.container}>
      {/* Chart Type Selection Buttons */}
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
        {/* Show utilization button only if activity has a budget */}
        {!!activity.budget && (
          <TouchableOpacity
            onPress={() => setChartType("utilization")}
            style={[
              chartType === "utilization"
                ? styles.activeButton
                : styles.inactiveButton,
              styles.middleButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    chartType === "utilization"
                      ? Colors.Background
                      : Colors.Main,
                },
              ]}
            >
              Utilization
            </Text>
          </TouchableOpacity>
        )}
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
      {/* Display the selected chart */}
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
    width: 110,
  },
  middleButton: {
    padding: 8,
    width: 110,
  },
  rightButton: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 8,
    width: 110,
  },
  buttonText: {
    color: Colors.Main,
    fontWeight: "600",
    textAlign: "center",
    fontSize: 13,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    color: Colors.Coffee,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
