import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors, { ColorSet } from "@/constant/Color";
import ActivityContributionChart from "./ActivityContributionChart";
import ActivityPayChart from "./ActivityPayChart";
import ActivityUtilizationChart from "./ActivityUtilizationChart";
import React, { useState } from "react";
import { Participant } from "@/model/Participant";
import { MaterialIcons } from "@expo/vector-icons";
import { Activity } from "@/model/Activity";
export default function ActivityChart({
  dataset,
  activity,
}: {
  dataset: Participant[];
  activity: Activity;
}) {
  const [chartType, setChartType] = useState<
    "contribution" | "settlement" | "utilization"
  >("contribution");

  // check if there is expenses, if not no need to show any graph
  const ttl = dataset.reduce((prev: number, p: Participant): number => {
    return p.totalPaid + prev;
  }, 0);

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

  const chartColorSet = ColorSet.newSet(dataset.length);

  let chartToDisplay = (
    <ActivityContributionChart
      dataset={dataset}
      chartColorSet={chartColorSet}
    ></ActivityContributionChart>
  );

  if (chartType === "settlement") {
    chartToDisplay = (
      <ActivityPayChart
        dataset={dataset}
        chartColorSet={chartColorSet}
      ></ActivityPayChart>
    );
  }

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
