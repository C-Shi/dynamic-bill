import { View, Text, Button, StyleSheet } from "react-native";
import Colors from "@/constant/Color";
import { Participant } from "@/model/Participant";

export default function ParticipantList({
  participants,
}: {
  participants: Participant[];
}) {
  const currencyHelper = (val: number) => {
    return Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(val);
  };
  return (
    <View style={styles.card}>
      <Text style={styles.tableHeader}>Participants</Text>
      {participants.map((p, idx) => {
        const paid = p.totalPaid;
        const due = p.totalOwed;
        const net = paid - due;

        return (
          <View key={idx} style={styles.row}>
            <Text>{p.name}</Text>
            <Text>Paid: {currencyHelper(paid)}</Text>
            <Text>Due: {currencyHelper(due)}</Text>
            <Text
              style={{
                color: net > 0 ? "green" : net < 0 ? "red" : Colors.Main,
              }}
            >
              Net: {net > 0 ? "+" : ""}${net}
            </Text>
          </View>
        );
      })}
      <Button
        title="Add Participant"
        onPress={() => {}}
        color={Colors.Primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.Card,
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  tableHeader: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
  },
  row: {
    marginBottom: 8,
  },
});
