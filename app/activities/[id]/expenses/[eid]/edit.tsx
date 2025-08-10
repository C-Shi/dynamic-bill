import EditExpense from "@/components/expenses/EditExpense";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";

function ExpenseEditPage() {
  const { id, eid } = useLocalSearchParams();

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Edit Expense",
    });
  }, [eid]);

  return <EditExpense aid={id as string} eid={eid as string}></EditExpense>;
}

export default ExpenseEditPage;
