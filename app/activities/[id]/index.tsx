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

import { useLocalSearchParams, useNavigation } from "expo-router";
import { ActivityContext } from "@/context/ActivityContext";
import ParticipantList from "@/components/activities/participants/ParticipantList";
import ExpenseList from "@/components/activities/expenses/ExpenseList";
import { Activity } from "@/model/Activity";
import Colors from "@/constant/Color";
import ActivityChart from "@/components/activities/ActivityChart";

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
      <ActivityChart activity={activity}></ActivityChart>

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
        <ExpenseList
          expenses={activity.expenses}
          activityId={activity.id}
        ></ExpenseList>
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
  buttonText: {
    color: Colors.Main,
    fontWeight: "600",
    textAlign: "center",
  },
});
