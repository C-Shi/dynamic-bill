import { Participant } from "@/model/Participant";
import {
  dollar,
  minimumTrasactionStrategy,
  proportionalOneToManyStrategy,
} from "@/utils/Helper";
import { View, Text, StyleSheet } from "react-native";
import Avatar from "../shared/Avatar";
import Colors from "@/constant/Color";
import React, { useState, useEffect } from "react";

/**
 * Props for the ActivitySettlement component
 */
type SettlementProp = {
  strategy: "minimum" | "proportional";
  participants: Participant[];
};

/**
 * Strategy descriptions and analysis for each settlement method
 */
const STRATEGY_PROP = {
  minimum: {
    name: "Minimum Transaction",
    analysis:
      "The minimum transaction strategy is a way to settle group expenses using the fewest payments possible. It works by calculating each person's net balance and matching debtors to creditors. The algorithm then transfers the minimum necessary amount between them until all balances are zero.",
  },
  proportional: {
    name: "Proportional One-To-Many",
    analysis:
      "Each debtor pays all creditors in proportion to how much the creditors are owed. This ensures fairness by distributing each debtor's debt based on the relative claims of the creditors. Any rounding differences are corrected by adjusting the largest payment to maintain balance.",
  },
};

/**
 * ActivitySettlement Component
 * Displays a settlement plan for group expenses using different strategies.
 * Features:
 * - Summary of total payout, participant count, and transaction count
 * - Individual participant cards showing net balance and required transactions
 * - Color-coded avatars indicating creditor (green) or debtor (red) status
 * - Detailed transaction list for each participant
 * - AI analysis of the chosen settlement strategy
 *
 * @param strategy - The settlement strategy to use ("minimum" or "proportional")
 * @param participants - Array of participants with their payment data
 */
export default function ActivitySettlement({
  strategy,
  participants,
}: SettlementProp) {
  // State for storing calculated payment transactions
  const [payments, setPayments] = useState<any[]>([]);

  // Calculate payments based on selected strategy
  useEffect(() => {
    setPayments(() => {
      switch (strategy) {
        case "minimum":
          return minimumTrasactionStrategy(participants);
        case "proportional":
          return proportionalOneToManyStrategy(participants);
        default:
          return [];
      }
    });
  }, []);

  // Calculate total amount to be circulated
  const totalCirculate = payments.reduce((t, p) => t + p.amount, 0);

  // Generate participant cards with their payment details
  const paymentPerParticipant = participants
    .sort((a: Participant, b: Participant) => b.net - a.net)
    .map((p: Participant) => {
      // Collect all payments for this participant
      let paymentArray: { type: string; name: any; amount: any }[] = [];
      payments.forEach((pm) => {
        // if pay to this participant, it is a RECEIVED transaction
        if (pm.toId === p.id) {
          paymentArray.push({
            type: "RECEIVE",
            name: pm.fromName,
            amount: pm.amount,
          });
        }
        if (pm.fromId === p.id) {
          paymentArray.push({
            type: "PAY",
            name: pm.toName,
            amount: pm.amount,
          });
        }
      });

      return (
        <View key={p.id} style={styles.participantCard}>
          {/* Participant header with avatar and net balance */}
          <View style={styles.participantRow}>
            <Avatar
              name={p.name}
              style={{
                backgroundColor:
                  p.net > 0
                    ? Colors.Success
                    : p.net < 0
                    ? Colors.Danger
                    : Colors.Primary,
              }}
            ></Avatar>
            <Text style={{ fontWeight: 700, color: Colors.Main }}>
              {p.net === 0
                ? ` ${p.name} is settled`
                : p.net > 0
                ? ` ${p.name} needs to receive ${dollar(p.net)}`
                : ` ${p.name} needs to pay ${dollar(Math.abs(p.net))}`}
            </Text>
          </View>
          {/* List of payments for this participant */}
          <View style={styles.paymentRow}>
            <View style={styles.verticalDivider} />
            <View>
              {paymentArray.map((pm: any, i: number) => {
                return (
                  <Text key={i} style={{ color: Colors.SubText }}>
                    {pm.type === "RECEIVE" ? "From" : "To"} {pm.name}
                    {": "}
                    {dollar(pm.amount)}
                  </Text>
                );
              })}
            </View>
          </View>
        </View>
      );
    });
  return (
    <>
      {/* Summary section showing key metrics */}
      <View style={styles.info}>
        <View>
          <Text style={styles.infoTitle}>Total Payout</Text>
          <Text style={styles.infoMain}>{dollar(totalCirculate)}</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View>
          <Text style={styles.infoTitle}>Participants</Text>
          <Text style={styles.infoMain}>{participants.length}</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View>
          <Text style={styles.infoTitle}># Transactions</Text>
          <Text style={styles.infoMain}>{payments.length}</Text>
        </View>
      </View>

      {/* Settlement plan header with strategy name */}
      <View style={styles.settlementHeader}>
        <Text style={{ color: Colors.Primary, fontSize: 20, fontWeight: 700 }}>
          Settlement Plan
        </Text>
        <Text style={{ color: Colors.SubText, fontSize: 12 }}>
          {STRATEGY_PROP[strategy].name}
        </Text>
      </View>

      {/* List of participant cards */}
      <View>{participants.length > 0 && paymentPerParticipant}</View>

      {/* AI analysis of the chosen strategy */}
      <View style={styles.ai}>
        <Text style={styles.aih}>🤖 AI Analysis</Text>
        <Text style={styles.aib}>{STRATEGY_PROP[strategy].analysis}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  info: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: Colors.Background,
    shadowColor: Colors.Main,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderRadius: 5,
  },
  infoTitle: {
    color: Colors.SubText,
    textAlign: "center",
  },
  infoMain: {
    color: Colors.Primary,
    textAlign: "center",
    fontWeight: 700,
  },
  settlementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 5,
    backgroundColor: Colors.Card,
    padding: 12,
    marginHorizontal: 5,
    alignItems: "baseline",
  },
  ai: {
    backgroundColor: "rgba(155, 106, 222, 0.2)",
    borderRadius: 5,
    marginHorizontal: 5,
    padding: 10,
    marginTop: 10,
  },
  aih: {
    color: Colors.Secondary,
    fontSize: 16,
    fontWeight: 700,
  },
  aib: {
    color: Colors.SubText,
    lineHeight: 18,
  },

  participantCard: {
    padding: 12,
    borderRadius: 5,
    backgroundColor: Colors.Card,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  paymentRow: {
    flexDirection: "row",
  },
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  paymentText: {
    fontSize: 14,
    color: "#555",
  },
  verticalDivider: {
    width: 1,
    backgroundColor: Colors.SubText,
    alignItems: "stretch",
    marginLeft: 15,
    marginRight: 19,
  },
});
