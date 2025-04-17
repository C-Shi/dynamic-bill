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
import { Activity } from "@/model/Activity";
import Colors from "@/constant/Color";

const screenWidth = Dimensions.get("window").width;

const ActivityDetail = () => {
  const { id } = useLocalSearchParams();
  const { get, detail } = useContext(ActivityContext);

  const activity: Activity = get(id as string);

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: activity.title,
    });
    detail(activity, ["expense", "participant"]);
  }, []);

  const [chartType, setChartType] = useState<"spending" | "distribution">(
    "spending"
  );
  const [viewType, setViewType] = useState<"participants" | "expenses">(
    "participants"
  );

  function remainingBudgetHelper(activity: Activity): string {
    if (!activity.budget) {
      return "N/A";
    }
    return Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(activity.budget - activity.totalAmount);
  }

  const isOverBudget = activity.budget
    ? activity.totalAmount > activity.budget
    : false;

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
    <ScrollView style={styles.container}>
      {/* Summary Section */}
      <View style={styles.summarySection}>
        <View style={styles.summarySubSection}>
          <Text style={[styles.textCenter, styles.summaryHeader]}>
            Total Expenses
          </Text>
          <Text style={[styles.textCenter, styles.summaryInfo]}>
            {activity.totalAmountDisplay}
          </Text>
        </View>
        <View style={styles.summarySubSection}>
          <Text style={[styles.textCenter, styles.summaryHeader]}>
            Remaining Budget
          </Text>
          <Text
            style={[
              styles.textCenter,
              styles.summaryInfo,
              { color: isOverBudget ? Colors.Danger : Colors.Success },
            ]}
          >
            {remainingBudgetHelper(activity)}
          </Text>
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
        <ParticipantList participants={activity.participants}></ParticipantList>
      ) : (
        <ExpenseList expenses={activity.expenses}></ExpenseList>
      )}
    </ScrollView>
  );
};

export default ActivityDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    padding: 10,
  },
  summarySection: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-around",
    backgroundColor: Colors.Background,
    shadowColor: Colors.Main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderRadius: 8,
    paddingVertical: 20,
  },
  summaryHeader: {
    fontSize: 16,
    fontWeight: 500,
    paddingBottom: 6,
  },
  summaryInfo: {
    fontSize: 22,
    fontWeight: 600,
  },
  summarySubSection: {},
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
  textCenter: {
    textAlign: "center",
  },
});
