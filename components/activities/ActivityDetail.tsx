import React, { useState, useEffect, useContext } from "react";
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
import { Participant } from "@/model/Participant";
import { CurrentActivityDetailContext } from "@/context/CurrentActivityDetailContext";
import { dollar } from "@/utils/Helper";

export default function ActivityDetail({ activity }: { activity: Activity }) {
  const router = useRouter();
  const [viewType, setViewType] = useState<"participants" | "expenses">(
    "participants"
  );
  const { participants, expenses, set } = useContext(
    CurrentActivityDetailContext
  );

  const [participantModal, setParticipantModal] = useState(false);

  useEffect(() => {
    set(activity.id);
  }, []);

  const participantData = {
    columns: ["Name", "Paid", "Owed", "Net"],
    cells: participants.map((p: any) => {
      const paid = p.totalPaid;
      const due = p.totalOwed;
      const net = paid - due;
      return {
        values: [p.name, dollar(paid), dollar(due), dollar(net)],
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
    cells: expenses.map((e: any) => {
      return {
        values: [
          e.description,
          dollar(e.amount),
          participants.find((p: Participant) => p.id === e.paidBy)?.name ||
            "Unknown",
        ],
      };
    }),
  };

  const isOverBudget = activity.budget
    ? activity.totals > activity.budget
    : false;

  const buttonGroup = [
    {
      icon: (
        <Ionicons
          name="person-add-outline"
          size={24}
          color={Colors.Background}
        />
      ),
      onPress: () => {
        if (expenses.length > 0) {
          alert(
            "Cannot add participant for activities with expenses. This limitation will be removed on v2"
          );
        } else {
          setParticipantModal(true);
        }
      },
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
                  ? dollar(activity.budget - activity.totals)
                  : "N/A"}
              </Text>
            </View>
          </View>
          {/* Chart Section */}
          {participants.length > 0 && (
            <ActivityChart
              dataset={participants}
              activity={activity}
            ></ActivityChart>
          )}

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
              <Text style={styles.buttonText}>PARTICIPANTS</Text>
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
        {expenses.length > 0 && (
          <TouchableOpacity
            style={styles.settleBtn}
            onPress={() => router.push(`/activities/${activity.id}/settlement`)}
          >
            <Ionicons
              name="receipt-outline"
              size={32}
              color={Colors.Background}
            />
          </TouchableOpacity>
        )}
        <FloatingButtonGroup
          buttons={buttonGroup}
          backgroundColor={Colors.Primary}
          color={Colors.Background}
          shadow
          direction="up"
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
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  settleBtn: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    backgroundColor: Colors.Secondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6, // for Android
    marginRight: 10,
  },
});
