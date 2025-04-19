import { Activity } from "@/model/Activity";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "@/constant/Color";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useState } from "react";

const screenWidth = Dimensions.get("window").width;

export default function ActivityChart({ activity }: { activity: Activity }) {
  const [chartType, setChartType] = useState<"contribution" | "settlement">(
    "contribution"
  );

  const chartData = [
    {
      name: "Food",
      population: 150,
      color: Colors.Primary,
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Transport",
      population: 90,
      color: Colors.Secondary,
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Misc",
      population: 80,
      color: Colors.Danger,
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ];
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
      <PieChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute
      />
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
