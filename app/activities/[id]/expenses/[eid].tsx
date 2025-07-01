import React, { useEffect } from "react";
import { useNavigation, useLocalSearchParams } from "expo-router";
import ExpenseDetail from "@/components/expenses/ExpenseDetail";

export default function ExpenseDetailsPage() {
  const { eid } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Expense Details",
    });
  });

  return <ExpenseDetail eid={eid as string}></ExpenseDetail>;
}
