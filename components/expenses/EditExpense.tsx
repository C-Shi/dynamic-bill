import { ActivityContext } from "@/context/ActivityContext";
import { Expense } from "@/model/Expense";
import { useRouter } from "expo-router";
import React, { useContext, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  TextInput,
  Text,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import Colors from "@/constant/Color";
import {
  PaperProvider,
  Button,
  Menu,
  Checkbox,
  Divider,
} from "react-native-paper";
import { Participant } from "@/model/Participant";
import { DB } from "@/utils/db";
import { ParticipantExpense } from "@/model/ParticipantExpense";
import { CurrentActivityDetailContext } from "@/context/CurrentActivityDetailContext";

export default function EditExpense({
  aid,
  eid,
}: {
  aid: string;
  eid: string;
}) {
  const router = useRouter();
  const { set, expenses, participants, update } = useContext(
    CurrentActivityDetailContext
  );
  const { update: updateActivity } = useContext(ActivityContext);
  const expense = expenses.find((e: Expense) => e.id === eid)!;

  // State for new expense details
  const [newExpense, setNewExpense] = useState({
    id: expense.id,
    description: expense.description,
    amount: String(expense.amount),
    paidBy: expense.paidBy,
  });

  // State for tracking which participants the expense is for
  const [newExpenseFor, setNewExpenseFor] = useState<string[]>([]);

  // State for tracking current participants the expense is for
  const [oldExpenseFor, setOldExpenseFor] = useState<ParticipantExpense[]>([]);

  // State for controlling the payer selection menu
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    async function getPE() {
      const pes = await DB.get("participant_expenses", {
        expense_id: ["=", eid],
      });

      const expenseFor = participants
        .filter((participant: Participant) =>
          pes.some((ref: any) => ref.participant_id === participant.id)
        )
        .map((p) => p.id);

      // Old expense for set a list of full participant_expenses
      setOldExpenseFor(pes.map((pe: any) => new ParticipantExpense(pe)));
      // new Expense for set a collection of participant_id ONLY
      setNewExpenseFor(expenseFor);
    }

    getPE();
  }, [eid]);

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
      Alert.alert("Expense need description");
      return false;
    }

    if (!newExpense.amount || !parseFloat(newExpense.amount)) {
      Alert.alert("Expense need amount");
      return false;
    }

    if (!newExpense.paidBy) {
      Alert.alert("Select who paid for this expense");
      return false;
    }

    if (newExpenseFor.length === 0) {
      Alert.alert("Expense has to be paid for at least one person");
      return false;
    }

    return true;
  }

  // Check expense diff and update
  async function onSubmit() {
    if (!validated()) {
      return;
    }
    // participant expense to add
    const oldIds = oldExpenseFor.map((item) => item.participantId);
    const toAdd: any[] = newExpenseFor
      .filter((pid) => !oldIds.includes(pid))
      .map((pid) =>
        new ParticipantExpense({
          participantId: pid,
          expenseId: eid,
        }).toEntity()
      );
    // participant expense to remove
    const toRemove: string[] = oldExpenseFor
      .filter((pe) => !newExpenseFor.includes(pe.participantId))
      .map((item) => item.id);

    // update database records
    try {
      await DB.transaction(async () => {
        await DB.update("expenses", newExpense.id, {
          description: newExpense.description,
          paid_by: newExpense.paidBy,
          // activity_id is for observer to correctly locate item
          activity_id: aid,
          amount: parseFloat(newExpense.amount),
        });
        if (toAdd.length > 0) {
          await DB.insert("participant_expenses", toAdd);
        }
        if (toRemove.length > 0) {
          await DB.delete("participant_expenses", toRemove);
        }
      });
    } catch (error) {
      if (__DEV__) {
        console.error(error);
      }
      Alert.alert("Unexpected Error during update.");
    }

    // update ActivityContext with this specific activity
    await updateActivity(aid);
    // update CurrentActicityDetail with participants (catched total po change) and expenses (pe change)
    const newParticipantList = await DB.get("participants", {
      activity_id: ["=", aid],
    });
    update.participants(newParticipantList.map((a: any) => new Participant(a)));

    update.expense(new Expense(newExpense));

    router.back();
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
          Update Expense
        </Button>
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
