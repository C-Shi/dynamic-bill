import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors, { ColorSet } from "@/constant/Color";
import ActivityPieChart from "./ActivityPieChart";
import ActivityBarChart from "./ActivityBarChart";

import React, { useState } from "react";
import { Participant } from "@/model/Participant";
import { MaterialIcons } from "@expo/vector-icons";

export default function ActivityChart({ dataset }: { dataset: Participant[] }) {
  const [chartType, setChartType] = useState<"contribution" | "settlement">(
    "contribution"
  );

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

  const chartToDisplay =
    chartType === "contribution" ? (
      <ActivityPieChart
        dataset={dataset}
        chartColorSet={chartColorSet}
      ></ActivityPieChart>
    ) : (
      <ActivityBarChart
        dataset={dataset}
        chartColorSet={chartColorSet}
      ></ActivityBarChart>
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
