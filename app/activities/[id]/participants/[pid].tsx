import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import Avatar from "@/components/shared/Avatar";

import { useNavigation, useLocalSearchParams } from "expo-router";
import Colors from "@/constant/Color";

const participant = {
  name: "Emily Johnson",
  totalPaid: 1250.75,
  totalOwed: 980.25,
  netBalance: 270.5,
  role: "The Giver",
  roleDescription:
    "You consistently maintain a positive balance, often covering more than your share. Your friends appreciate your generosity!",
  activities: [
    { name: "Weekend Getaway", paidByYou: 450.0, yourPortion: 300.0 },
    { name: "Dinner at Osteria", paidByYou: 210.75, yourPortion: 175.25 },
    { name: "Concert Tickets", paidByYou: 320.0, yourPortion: 320.0 },
    { name: "Grocery Shopping", paidByYou: 120.0, yourPortion: 85.0 },
    { name: "Utility Bills", paidByYou: 150.0, yourPortion: 100.0 },
  ],
};

const getBalanceColor = (balance: number) => {
  if (balance > 50) return "#16A34A"; // green
  if (balance < -50) return "#FF3B30"; // red
  return "#b45309"; // amber
};

const getPercentage = (value: number, max: number) => (value / max) * 100;

export default function ParticipantDetails() {
  const { pid } = useLocalSearchParams();
  const participantId = pid;
  console.log(participantId);
  // Max value per activity for bar scaling
  const maxValuePerActivity = participant.activities.map(
    (a) => Math.max(a.paidByYou, a.yourPortion) * 1.2
  );

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Participant Details",
    });
  });

  const renderActivity = ({ item, index }: { item: any; index: number }) => {
    const max = maxValuePerActivity[index];
    const paidPct = getPercentage(item.paidByYou, max);
    const portionPct = getPercentage(item.yourPortion, max);

    return (
      <View style={styles.activityCard}>
        <View style={styles.activityHeader}>
          <Text style={[styles.activityName]}>{item.name}</Text>
          <Text style={styles.activityAmount}>
            Paid by You: ${item.paidByYou.toFixed(2)}
          </Text>
          <Text style={styles.activityAmount}>
            Your Portion: ${item.yourPortion.toFixed(2)}
          </Text>
        </View>
        <View style={styles.barsContainer}>
          <View style={styles.barLabel}>
            <Text style={{ color: "#4A90E2" }}>■</Text>
            <Text style={styles.barLabelText}>Paid by You</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBar,
                { width: `${paidPct}%`, backgroundColor: "#4A90E2" },
              ]}
            />
          </View>
          <View style={styles.barLabel}>
            <Text style={{ color: "#9B6ADE" }}>■</Text>
            <Text style={styles.barLabelText}>Your Portion</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBar,
                { width: `${portionPct}%`, backgroundColor: "#9B6ADE" },
              ]}
            />
          </View>
        </View>
      </View>
    );
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

        {/* Activity Breakdown */}
        <Text style={styles.sectionTitle}>Activity Breakdown</Text>

        <FlatList
          data={participant.activities}
          keyExtractor={(item) => item.name}
          renderItem={renderActivity}
          contentContainerStyle={{ paddingBottom: 16 }}
          scrollEnabled={false}
        />
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
    flex: 1,
    backgroundColor: "#E9ECEF",
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
