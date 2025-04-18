import { ActivityContext } from "@/context/ActivityContext";
import { Expense } from "@/model/Expense";
import { useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import {
  Text,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";

export default function NewExpense() {
  const { id } = useLocalSearchParams();
  const { get } = useContext(ActivityContext);

  const activity = get(id as string);
  const participants = activity.participants.map((p) => {
    return {
      label: p.name,
      value: p.id,
    };
  });
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString(),
    paidBy: undefined,
  });

  const [newExpenseFor, setNewExpenseFor] = useState(
    participants.map((p) => p.value)
  );

  function onPaidByChange(v: any) {
    setNewExpense({ ...newExpense, paidBy: v.value });
  }

  function onDescriptionChange(description: string) {
    setNewExpense({ ...newExpense, description });
  }

  function onAmountChange(amount: string) {
    setNewExpense({ ...newExpense, amount });
  }

  function onPaidForChange(v: any) {
    setNewExpenseFor(v);
  }

  function onSubmit() {
    const expData = new Expense({
      ...newExpense,
      activityId: id,
      date: new Date(newExpense.date),
    });
    activity.addExpense(expData, newExpenseFor);
  }

  return (
    <ScrollView>
      <Text>Description</Text>
      <TextInput
        value={newExpense.description}
        onChangeText={onDescriptionChange}
      ></TextInput>
      <Text>Amount</Text>
      <TextInput
        value={newExpense.amount}
        onChangeText={onAmountChange}
      ></TextInput>
      <Text>Paid By</Text>
      <Dropdown
        data={participants}
        value={newExpense.paidBy}
        labelField="label"
        valueField="value"
        placeholder="Paid By Who?"
        onChange={onPaidByChange}
      ></Dropdown>
      <Text>Paid For</Text>
      <MultiSelect
        data={participants}
        value={newExpenseFor}
        labelField="label"
        valueField="value"
        placeholder="Paid For Who?"
        onChange={onPaidForChange}
      ></MultiSelect>

      <TouchableOpacity onPress={onSubmit}>
        <Text>Add</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
