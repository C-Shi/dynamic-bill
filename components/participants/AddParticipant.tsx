import { Activity } from "@/model/Activity";
import { Participant } from "@/model/Participant";
import { useContext, useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
} from "react-native";
import Colors from "@/constant/Color";
import { ActivityContext } from "@/context/ActivityContext";
import { CurrentActivityDetailContext } from "@/context/CurrentActivityDetailContext";
import { DB } from "@/utils/db";
import { dollar } from "@/utils/Helper";
import { ParticipantExpense } from "@/model/ParticipantExpense";

/**
 * AddParticipant Component
 * A modal dialog for adding new participants to an activity.
 * Features:
 * - Input field for participant name
 * - Validation for empty names and duplicates
 * - Integration with activity context for updates
 * - Database integration for participant storage
 * - Expense selection for the new participant
 *
 * @param activity - The activity to add the participant to
 * @param open - Boolean controlling modal visibility
 * @param close - Function to close the modal
 */
export default function AddParticipant({
  activity,
  open,
  close,
}: {
  activity: Activity;
  open: boolean;
  close: (val: boolean) => void;
}) {
  const { update } = useContext(ActivityContext);
  const { set, participants, expenses } = useContext(
    CurrentActivityDetailContext
  );
  const [participantName, setParticipantName] = useState("");
  const [expensesToSplit, setExpensesToSplit] = useState<any[]>([]);

  useEffect(() => {
    setExpensesToSplit(
      expenses.map((e) => {
        return { ...e, split: true };
      })
    );
  }, [expenses]);

  const splitWarning = expensesToSplit.filter((e) => e.split).length === 0;
  function onChangeSplit(id: string) {
    setExpensesToSplit(
      expensesToSplit.map((e) => {
        return { ...e, split: e.id === id ? !e.split : e.split };
      })
    );
  }

  // Validate input and update database with new participant
  async function onAddParticipant() {
    if (!participantName) {
      alert("Please add a name");
      return;
    }

    // validate uniqueness software level
    const duplicate = participants.find(
      (p: Participant): boolean =>
        p.name.trim().toUpperCase() === participantName.trim().toUpperCase()
    );

    if (duplicate) {
      alert("Duplicate participant!!");
      return;
    }

    const participant = new Participant({
      name: participantName.trim(),
      activityId: activity.id,
    }).toEntity();

    const participantExpenses = expensesToSplit
      .filter((e) => e.split)
      .map((e) => {
        return new ParticipantExpense({
          expenseId: e.id,
          participantId: participant.id,
        }).toEntity();
      });
    try {
      await DB.transaction(async () => {
        // save participant
        await DB.insert("participants", participant);

        if (participantExpenses.length > 0) {
          // save participant_expenses relationship
          await DB.insert("participant_expenses", participantExpenses);
        }
      });
    } catch (e) {
      alert("Unable to save participant");
    } finally {
      await set(activity.id);
      await update(activity.id);
      setParticipantName("");
      close(false);
    }
  }

  function onModalClose() {
    setParticipantName("");
    setExpensesToSplit(
      expenses.map((e) => {
        return { ...e, split: true };
      })
    );
    close(false);
  }

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onModalClose}
    >
      {/* Backdrop without press to close */}
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Header with close button */}
          <View style={styles.header}>
            <Text style={styles.sectionTitle}>Add Participant</Text>
            <TouchableOpacity onPress={onModalClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Participant Name Input */}
          <TextInput
            value={participantName}
            onChangeText={setParticipantName}
            placeholder="Participant Name"
            style={styles.input}
            placeholderTextColor="#888"
          />

          {/* Expense Selection Section */}
          <View style={styles.expenseSection}>
            <Text style={styles.sectionTitle}>
              Expenses to split with {participantName}
            </Text>
            <ScrollView style={styles.expenseList}>
              {expensesToSplit.map((expense) => (
                <View style={styles.expenseItem} key={expense.id}>
                  <View style={styles.expenseInfo}>
                    <Text style={styles.expenseDescription}>
                      {expense.description}
                    </Text>
                    <Text style={styles.expenseAmount}>
                      {dollar(expense.amount)}
                    </Text>
                  </View>
                  <Switch
                    value={expense.split}
                    onValueChange={() => onChangeSplit(expense.id)}
                    trackColor={{ false: "#767577", true: Colors.Primary }}
                    thumbColor={"#f4f3f4"}
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          {splitWarning && (
            <Text style={{ color: Colors.Coffee, marginBottom: 10 }}>
              ⚠️ Participant doesn't share any expenses
            </Text>
          )}

          {/* Add Participant Button */}
          <TouchableOpacity onPress={onAddParticipant} style={styles.button}>
            <Text style={styles.buttonText}>Add Participant</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    maxHeight: "80%",
    backgroundColor: Colors.Card,
    padding: 24,
    borderRadius: 16,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  expenseSection: {
    marginBottom: 20,
  },
  expenseList: {
    maxHeight: 200,
  },
  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "space-between",
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 14,
  },
  expenseAmount: {
    fontSize: 12,
    color: Colors.SubText,
  },
  button: {
    backgroundColor: Colors.Primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
