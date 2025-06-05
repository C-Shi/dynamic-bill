import React, { useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

import { useNavigation, useLocalSearchParams } from "expo-router";
import Colors from "@/constant/Color";
import DataTable from "@/components/shared/DataTable";
import { dollar } from "@/utils/Helper";

const participant = {
  name: "Emily Johnson",
  totalPaid: 1250.75,
  totalOwed: 980.25,
  netBalance: 270.5,
  role: "The Giver",
  roleDescription:
    "You consistently maintain a positive balance, often covering more than your share. Your friends appreciate your generosity!",
  activities: [
    {
      expenseName: "Dinner at Osteria",
      total: 210.75,
      youPaid: 210.75,
      yourPortion: 175.25,
    },
    {
      expenseName: "Concert Tickets",
      total: 180.0,
      youPaid: 0,
      yourPortion: 40,
    },
    {
      expenseName: "Grocery Shopping",
      total: 120.0,
      youPaid: 120.0,
      yourPortion: 85.0,
    },
    {
      expenseName: "Utility Bills",
      total: 180.0,
      youPaid: 150.0,
      yourPortion: 100.0,
    },
  ],
};

const getBalanceColor = (balance: number) => {
  if (balance > 50) return "#16A34A"; // green
  if (balance < -50) return "#FF3B30"; // red
  return "#b45309"; // amber
};

export default function ParticipantDetails() {
  const { pid } = useLocalSearchParams();
  const participantId = pid;
  console.log(participantId);
  // Max value per activity for bar scaling
  const maxValuePerActivity = participant.activities.map(
    (a) => Math.max(a.youPaid, a.yourPortion) * 1.2
  );

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Participant Details",
    });
  });

  const tableData = {
    columns: ["Expense", "Paid by You", "Your Portion"],
    rows: participant.activities.map((expense, i) => {
      const yourPct = (expense.yourPortion / expense.total) * 100;
      const portion = (
        <>
          <Text>{dollar(expense.yourPortion)}</Text>
          <View style={styles.barsContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${yourPct}%`,
                    backgroundColor: Colors.Secondary,
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4,
                  },
                ]}
              />
            </View>
          </View>
        </>
      );

      const youPaid = <Text>{dollar(expense.youPaid)}</Text>;

      const expenseName = (
        <Text style={{ textAlign: "left" }}>{expense.expenseName}</Text>
      );
      return {
        values: [expenseName, youPaid, portion],
        styles: [
          {
            marginLeft: 10,
          },
          null,
          null,
        ],
      };
    }),
  };

  const summeryCard = (
    <View style={styles.summaryCard}>
      <Text style={styles.participantName}>{participant.name}</Text>
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>💳 Total Paid</Text>
          <Text style={styles.summaryValue}>
            ${participant.totalPaid.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}> 🫴 Total Owed</Text>
          <Text style={styles.summaryValue}>
            ${participant.totalOwed.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}> ⚖️ Net Balance</Text>
          <Text
            style={[
              styles.summaryValue,
              { color: getBalanceColor(participant.netBalance) },
            ]}
          >
            ${participant.netBalance.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  const roleCard = (
    <View style={styles.roleCard}>
      <Text style={styles.roleName}>👤{participant.role}</Text>
      <Text style={styles.roleDescription}>{participant.roleDescription}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {summeryCard}
        {roleCard}

        {/* Expenses Breakdown */}
        <Text style={styles.sectionTitle}>Expenses Breakdown</Text>

        <DataTable
          data={tableData}
          headerStyle={{ backgroundColor: Colors.Secondary }}
        ></DataTable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 60,
    backgroundColor: "#fff",
    borderBottomColor: "#E9ECEF",
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3436",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  summaryCard: {
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  participantName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    color: "#000",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6C757D",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3436",
  },
  roleCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: Colors.Secondary,
    alignItems: "flex-start",
  },
  roleName: {
    fontSize: 20,
    color: "white",
    textAlign: "left",
    marginBottom: 10,
  },
  roleDescription: {
    color: "white",
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderColor: "#E9ECEF",
    borderWidth: 1,
  },
  activityHeader: {
    marginBottom: 8,
  },
  activityName: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
    color: "#2D3436",
  },
  activityAmount: {
    fontSize: 14,
    color: "#4A90E2",
  },
  barsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  barLabel: {
    flexDirection: "row",
    alignItems: "center",
    width: "25%",
    marginRight: 8,
  },
  progressBarBackground: {
    marginTop: 8,
    flex: 1,
    backgroundColor: Colors.SubText,
    borderRadius: 4,
    marginRight: 8,
  },
  barLabelText: {
    fontSize: 12,
    color: "#6C757D",
  },
  progressBar: {
    height: 10,
  },
});
