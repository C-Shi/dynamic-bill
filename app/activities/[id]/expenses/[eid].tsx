import React, { useEffect } from "react";
import { Text } from "react-native";
import { useNavigation, useLocalSearchParams } from "expo-router";

export default function ExpenseDetailsPage() {
  const { eid } = useLocalSearchParams();
  const expenseId = eid as string;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Expense Details",
    });
  });

  return <Text>This is Expense Detail page {expenseId}</Text>;
}
