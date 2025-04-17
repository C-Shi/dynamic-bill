import { Expense } from "@/model/Expense";
import { useEffect } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function ExpenseList({ expenses }: { expenses: Expense[] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.tableHeader}>Expenses</Text>
      {expenses.map((e, idx) => (
        <View key={idx} style={styles.row}>
          <Text>{e.description}</Text>
          <Text>Amount: {e.amount}</Text>
          <Text>Paid by: {e.paidByParticipant?.name}</Text>
        </View>
      ))}
      <Button title="Add Expense" onPress={() => {}} color={Colors.Primary} />
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
