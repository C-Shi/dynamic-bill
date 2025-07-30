import UpdateExpense from "@/components/expenses/UpdateExpense";
import { useLocalSearchParams } from "expo-router";

function ExpenseEditPage() {
  const { id, eid } = useLocalSearchParams();

  return <UpdateExpense aid={id as string} eid={eid as string}></UpdateExpense>;
}

export default ExpenseEditPage;
