import { Activity } from "@/model/Activity";
import { Participant } from "@/model/Participant";
import { dollar, minimumTrasactionStrategy } from "@/utils/Helper";
import { View, Text, StyleSheet } from "react-native";
import Avatar from "../shared/Avatar";
import Colors from "@/constant/Color";
import { useState, useEffect } from "react";

type MinimumTrasactionSettlementProp = {
  activity: Activity;
  participants: Participant[];
};

export default function MinimumTrasactionSettlement({
  activity,
  participants,
}: MinimumTrasactionSettlementProp) {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    loadSettlement();
  }, [activity.id]);

  async function loadSettlement() {
    setPayments(() => {
      return minimumTrasactionStrategy(participants);
    });
  }
  const paymentPerParticipant = participants
    .sort((a: Participant, b: Participant) => b.net - a.net)
    .map((p: Participant) => {
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
      <View style={styles.info}>
        <View>
          <Text style={styles.infoTitle}>Total Spending</Text>
          <Text style={styles.infoMain}>{activity?.totalAmountDisplay}</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View>
          <Text style={styles.infoTitle}>Participants</Text>
          <Text style={styles.infoMain}>{activity.participants.length}</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View>
          <Text style={styles.infoTitle}># Transactions</Text>
          <Text style={styles.infoMain}>{payments.length}</Text>
        </View>
      </View>
      {/** Settlement transaction */}

      <View style={styles.settlementHeader}>
        <Text style={{ color: Colors.Primary, fontSize: 20, fontWeight: 700 }}>
          Settlement Plan
        </Text>
        <Text style={{ color: Colors.SubText, fontSize: 12 }}>
          Minimum Transactions
        </Text>
      </View>
      <View>{participants.length > 0 && paymentPerParticipant}</View>
      {/** AI Analysis */}
      <View style={styles.ai}>
        <Text style={styles.aih}>🤖 AI Analysis</Text>
        <Text style={styles.aib}>
          The minimum transaction strategy is a way to settle group expenses
          using the fewest payments possible. It works by calculating each
          person's net balance and matching debtors to creditors. The algorithm
          then transfers the minimum necessary amount between them until all
          balances are zero.
        </Text>
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
