// ActivityDetail.tsx
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ActivityContext } from "@/context/ActivityContext";
import ParticipantList from "@/components/activities/participants/ParticipantList";
import ExpenseList from "@/components/activities/expenses/ExpenseList";

const screenWidth = Dimensions.get("window").width;

const Colors = {
  Primary: "#4A90E2",
  Secondary: "#9B6ADE",
  Background: "#FFFFFF",
  Card: "#E9ECEF",
  Main: "#2D3436",
  SubText: "#6C757D",
  Danger: "#FF3B30",
  Dark: "#000000",
};

const ActivityDetail = () => {
  const { id } = useLocalSearchParams();
  const { get } = useContext(ActivityContext);

  const activity = get(id as string);

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: activity.title,
    });
  }, []);
  const [chartType, setChartType] = useState<"spending" | "distribution">(
    "spending"
  );
  const [viewType, setViewType] = useState<"participants" | "expenses">(
    "participants"
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
      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContainer}>
        {/* Summary Section */}
        <View>
          <View>
            <Text>Total Expenses</Text>
            <Text>{activity.totalAmountDisplay}</Text>
          </View>
          <View>
            <Text>Remaining Budget</Text>
            <Text>{activity.budgetAmountDisplay}</Text>
          </View>
        </View>
        {/* Chart Section */}
        <View style={styles.card}>
          <View style={styles.chartToggle}>
            <TouchableOpacity
              onPress={() => setChartType("spending")}
              style={
                chartType === "spending"
                  ? styles.activeButton
                  : styles.inactiveButton
              }
            >
              <Text style={styles.buttonText}>Spending</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setChartType("distribution")}
              style={
                chartType === "distribution"
                  ? styles.activeButton
                  : styles.inactiveButton
              }
            >
              <Text style={styles.buttonText}>Distribution</Text>
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

        {/* Toggle View */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            onPress={() => setViewType("participants")}
            style={
              viewType === "participants"
                ? styles.activeView
                : styles.inactiveView
            }
          >
            <Text style={styles.buttonText}>BY PARTICIPANTS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewType("expenses")}
            style={
              viewType === "expenses" ? styles.activeView : styles.inactiveView
            }
          >
            <Text style={styles.buttonText}>EXPENSES</Text>
          </TouchableOpacity>
        </View>

        {/* Main Section */}
        {viewType === "participants" ? (
          <ParticipantList
            participants={activity.participants}
          ></ParticipantList>
        ) : (
          <ExpenseList activity={activity}></ExpenseList>
        )}
      </ScrollView>
    </View>
  );
};

export default ActivityDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  scrollContainer: {
    padding: 10,
  },
  header: {
    backgroundColor: Colors.Primary,
    padding: 15,
  },
  headerText: {
    fontSize: 20,
    color: Colors.Background,
    fontWeight: "bold",
  },
  subHeader: {
    color: Colors.Background,
    marginTop: 5,
  },
  budgetRow: {
    marginTop: 10,
  },
  card: {
    backgroundColor: Colors.Card,
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  chartToggle: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  activeButton: {
    backgroundColor: Colors.Primary,
    padding: 8,
    borderRadius: 10,
  },
  inactiveButton: {
    backgroundColor: Colors.Card,
    padding: 8,
    borderRadius: 10,
  },
  viewToggle: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  activeView: {
    borderBottomColor: Colors.Primary,
    borderBottomWidth: 3,
    paddingBottom: 5,
  },
  inactiveView: {
    paddingBottom: 5,
  },
  buttonText: {
    color: Colors.Main,
    fontWeight: "600",
  },
  row: {
    marginBottom: 8,
  },
  tableHeader: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
  },
  money: {
    fontWeight: "bold",
    color: Colors.Dark,
  },
});
