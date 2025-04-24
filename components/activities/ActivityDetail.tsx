import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Activity } from "@/model/Activity";
import Colors from "@/constant/Color";
import ActivityChart from "@/components/activities/ActivityChart";
import DataTable from "@/components/shared/DataTable";
import FloatingButtonGroup from "@/components/shared/ButtonGroup";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AddParticipant from "../participants/AddParticipant";
import { DB } from "@/utils/DB";
import { Participant } from "@/model/Participant";
import { Expense } from "@/model/Expense";

export default function ActivityDetail({ activity }: { activity: Activity }) {
  const router = useRouter();
  const [viewType, setViewType] = useState<"participants" | "expenses">(
    "participants"
  );

  const [activityParticipants, setActivityParticipants] = useState([]);
  const [activityExpenses, setActivityExpenses] = useState([]);
  const [participantModal, setParticipantModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [participantsResult, expensesResult] = await Promise.allSettled([
        DB.get("participants", { activity_id: ["=", activity.id] }),
        DB.get("expenses", { activity_id: ["=", activity.id] }),
      ]);

      // Handling participants
      if (participantsResult.status === "fulfilled") {
        const ps = participantsResult.value.map(
          (row: any) => new Participant(row)
        );
        setActivityParticipants(ps);
      } else {
        console.error("Error loading participants:", participantsResult.reason);
      }

      // Handling expenses
      if (expensesResult.status === "fulfilled") {
        const es = expensesResult.value.map((row: any) => new Expense(row));
        setActivityExpenses(es);
      } else {
        console.error("Error loading expenses:", expensesResult.reason);
      }
    } catch (error) {
      console.error("Error loading activity data:", error);
    } finally {
      console.log("state participants: ", activityParticipants);
    }
  };

  const currencyHelper = (val: number) => {
    return Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(val);
  };

  const participantData = {
    columns: ["Name", "Paid", "Owed", "Net"],
    cells: activityParticipants.map((p: any) => {
      const paid = p.totalPaid;
      const due = p.totalOwed;
      const net = paid - due;
      return {
        values: [
          p.name,
          currencyHelper(paid),
          currencyHelper(due),
          currencyHelper(net),
        ],
        styles: [
          null,
          null,
          null,
          {
            color: net > 0 ? Colors.Success : Colors.Danger,
          },
        ],
      };
    }),
  };

  const expenseData = {
    columns: ["Description", "Amount", "Paid By"],
    cells: activityExpenses.map((e: any) => {
      return {
        values: [
          e.description,
          currencyHelper(e.amount),
          e.paidByParticipant?.name || "Unknown",
        ],
      };
    }),
  };

  const isOverBudget = activity.budget
    ? activity.totals > activity.budget
    : false;

  const buttonGroup = [
    {
      icon: <FontAwesome name="edit" size={24} color={Colors.Background} />,
      onPress: () => console.log("Edit Activity"),
    },
    {
      icon: (
        <Ionicons
          name="person-add-outline"
          size={24}
          color={Colors.Background}
        />
      ),
      onPress: () => setParticipantModal(true),
    },
    {
      icon: <FontAwesome name="dollar" size={24} color={Colors.Background} />,
      onPress: () =>
        router.push(`/(modals)/activities/${activity.id}/expenses/new`),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollViewContainer}>
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
                {activity.budget
                  ? currencyHelper(activity.budget - activity.totals)
                  : "N/A"}
              </Text>
            </View>
          </View>
          {/* Chart Section */}
          <ActivityChart dataset={activityParticipants}></ActivityChart>

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
                viewType === "expenses"
                  ? styles.activeView
                  : styles.inactiveView
              }
            >
              <Text style={styles.buttonText}>EXPENSES</Text>
            </TouchableOpacity>
          </View>

          {/* Main Section */}
          {viewType === "participants" ? (
            <DataTable data={participantData}></DataTable>
          ) : (
            <DataTable data={expenseData}></DataTable>
          )}
        </ScrollView>
      </View>
      <View style={styles.fabContainer}>
        <FloatingButtonGroup
          buttons={buttonGroup}
          backgroundColor={Colors.Primary}
          color={Colors.Background}
          shadow
          direction="left"
        ></FloatingButtonGroup>
      </View>

      <AddParticipant
        activity={activity}
        open={participantModal}
        close={setParticipantModal}
      ></AddParticipant>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 100, // enough space for FAB group
  },
  scrollViewContainer: {
    paddingBottom: 40,
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
  fabContainer: {
    position: "absolute",
    bottom: 40,
    right: 30,
    left: 0,
    alignItems: "flex-end",
  },
});
