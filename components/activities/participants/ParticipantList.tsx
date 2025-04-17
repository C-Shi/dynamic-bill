import { View, Text, Button, StyleSheet } from "react-native";
import Colors from "@/constant/Color";
import { Participant } from "@/model/Participant";

export default function ParticipantList({
  participants,
}: {
  participants: Participant[];
}) {
  const net = (p: any) => p.paid - p.owed;
  return (
    <View style={styles.card}>
      <Text style={styles.tableHeader}>Participants</Text>
      {participants.map((p, idx) => (
        <View key={idx} style={styles.row}>
          <Text>{p.name}</Text>
          <Text>Paid: $10</Text>
          <Text>Owed: $50</Text>
          <Text
            style={{
              color: net(p) > 0 ? "green" : net(p) < 0 ? "red" : Colors.Main,
            }}
          >
            Net: {net(p) > 0 ? "+" : ""}${net(p)}
          </Text>
        </View>
      ))}
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
