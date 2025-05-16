import { ActivityContext } from "@/context/ActivityContext";
import { Expense } from "@/model/Expense";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  ScrollView,
  View,
  TextInput,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import Colors from "@/constant/Color";
import {
  PaperProvider,
  Button,
  Menu,
  Checkbox,
  Divider,
} from "react-native-paper";
import { Activity } from "@/model/Activity";
import { Participant } from "@/model/Participant";
import { DB } from "@/utils/DB";
import { ParticipantExpense } from "@/model/ParticipantExpense";
import { CurrentActivityDetailContext } from "@/context/CurrentActivityDetailContext";

/**
 * NewExpense Component
 * A form for adding new expenses to an activity.
 * Features:
 * - Expense description and amount input
 * - Payer selection via dropdown menu
 * - Participant selection for expense sharing
 * - Validation for required fields
 * - Database integration for expense storage
 *
 * @param activity - The activity to add the expense to
 * @param participants - List of participants in the activity
 */
export default function NewExpense({
  activity,
  participants,
}: {
  activity: Activity;
  participants: Participant[];
}) {
  const router = useRouter();
  const { set } = useContext(CurrentActivityDetailContext);
  const { update } = useContext(ActivityContext);

  // State for new expense details
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString(),
    paidBy: undefined,
  });

  // State for tracking which participants the expense is for
  const [newExpenseFor, setNewExpenseFor] = useState(
    participants.map((p) => p.id)
  );

  // State for controlling the payer selection menu
  const [menuVisible, setMenuVisible] = useState(false);

  // Update the payer of the expense
  function onPaidByChange(v: any) {
    setNewExpense({ ...newExpense, paidBy: v.id });
    setMenuVisible(false);
  }

  // Update expense description
  function onDescriptionChange(description: string) {
    setNewExpense({ ...newExpense, description });
  }

  // Update expense amount
  function onAmountChange(amount: string) {
    setNewExpense({ ...newExpense, amount });
  }

  // Toggle participant selection for expense sharing
  function onPaidForChange(value: string) {
    if (newExpenseFor.includes(value)) {
      setNewExpenseFor((prev) => prev.filter((v) => v !== value));
    } else {
      setNewExpenseFor((prev) => [...prev, value]);
    }
  }

  // Select all participants for expense sharing
  function onPaidForEveryone() {
    setNewExpenseFor(participants.map((p) => p.id));
  }

  // Validate all required fields are filled
  function validated() {
    if (!newExpense.description) {
      alert("Expense need description");
      return false;
    }

    if (!newExpense.amount || !parseFloat(newExpense.amount)) {
      alert("Expense need amount");
      return false;
    }

    if (!newExpense.paidBy) {
      alert("Select who paid for this expense");
      return false;
    }

    if (newExpenseFor.length === 0) {
      alert("Expense has to be paid for at least one person");
      return false;
    }

    return true;
  }

  // Submit the new expense to the database
  async function onSubmit() {
    if (!validated()) {
      return;
    }
    const expData = new Expense({
      ...newExpense,
      activityId: activity.id,
      date: new Date(newExpense.date),
    }).toEntity();

    const peData = newExpenseFor.map((e) => {
      return new ParticipantExpense({
        expenseId: expData.id,
        participantId: e,
      }).toEntity();
    });

    try {
      await DB.insert("expenses", expData);
      await DB.insert("participant_expenses", peData);
    } catch (e) {
      alert("Add Expense Failed");
    } finally {
      await set(activity.id);
      await update(activity.id);
      router.back();
    }
  }

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        {/* Expense Description Input */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={newExpense.description}
          onChangeText={onDescriptionChange}
          placeholder="What was the expense?"
          style={styles.input}
        />

        {/* Expense Amount Input */}
        <Text style={styles.label}>Amount</Text>
        <TextInput
          value={newExpense.amount}
          onChangeText={onAmountChange}
          keyboardType="numeric"
          placeholder="e.g. 45.00"
          style={styles.input}
        />

        {/* Payer Selection Dropdown */}
        <Text style={styles.label}>Paid By</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          style={{ borderColor: Colors.SubText }}
          anchor={
            <Button
              mode="elevated"
              onPress={() => setMenuVisible(true)}
              style={styles.dropdownButton}
              textColor={Colors.Background}
            >
              {participants.find((p) => p.id === newExpense.paidBy)?.name ||
                "Select Payer"}
            </Button>
          }
        >
          {participants.map((p) => (
            <Menu.Item
              key={p.name}
              onPress={() => onPaidByChange(p)}
              title={p.name}
              style={{ width: 500 }}
            />
          ))}
        </Menu>

        {/* Participant Selection for Expense Sharing */}
        <Text style={styles.label}>Paid For</Text>
        <View style={{ marginBottom: 24 }}>
          {newExpenseFor.length < participants.length && (
            <>
              <Checkbox.Item
                label="Every One"
                status={
                  newExpenseFor.length === participants.length
                    ? "checked"
                    : "unchecked"
                }
                onPress={onPaidForEveryone}
                mode="android"
              ></Checkbox.Item>
              <Divider></Divider>
            </>
          )}

          {participants.map((participant) => (
            <Checkbox.Item
              key={participant.id}
              label={participant.name}
              status={
                newExpenseFor.includes(participant.id) ? "checked" : "unchecked"
              }
              onPress={() => onPaidForChange(participant.id)}
              mode="android" // or 'ios' for a different look
            />
          ))}
        </View>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={onSubmit}
          style={styles.submitButton}
          labelStyle={styles.submitButtonLabel}
        >
          Add Expense
        </Button>

        {/* Warning about participant modification */}
        <View style={{ marginVertical: 16 }}>
          <Text style={{ color: Colors.Coffee, fontSize: 14 }}>
            ⚠️ You cannot add/remove participants after you add expenses.
          </Text>
        </View>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.SubText,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    marginBottom: 16,
  },
  dropdownButton: {
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: Colors.Primary,
  },
  submitButton: {
    borderRadius: 8,
    elevation: 2, // raised shadow
    backgroundColor: Colors.Primary,
  },
  submitButtonLabel: {
    color: Colors.Background,
    fontWeight: "bold",
  },
});
