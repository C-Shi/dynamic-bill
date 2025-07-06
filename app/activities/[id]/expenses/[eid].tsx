import React, { useEffect } from "react";
import { useNavigation, useLocalSearchParams } from "expo-router";
import ExpenseDetail from "@/components/expenses/ExpenseDetail";

export default function ExpenseDetailsPage() {
  const { id, eid } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Expense Details",
    });
  }, []);

  return <ExpenseDetail aid={id as string} eid={eid as string}></ExpenseDetail>;
}
