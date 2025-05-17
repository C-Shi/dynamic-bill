import { Activity } from "@/model/Activity";
import { Participant } from "@/model/Participant";
import { useContext, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import Colors from "@/constant/Color";
import { ActivityContext } from "@/context/ActivityContext";
import { CurrentActivityDetailContext } from "@/context/CurrentActivityDetailContext";
import { DB } from "@/utils/db";

/**
 * AddParticipant Component
 * A modal dialog for adding new participants to an activity.
 * Features:
 * - Input field for participant name
 * - Validation for empty names and duplicates
 * - Integration with activity context for updates
 * - Database integration for participant storage
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
  const { set, participants } = useContext(CurrentActivityDetailContext);
  const [participantName, setParticipantName] = useState("");

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

    const data = new Participant({
      name: participantName.trim(),
      activityId: activity.id,
    }).toEntity();

    try {
      await DB.insert("participants", data);
    } catch (e) {
      alert("Unable to save participant");
    } finally {
      await set(activity.id);
      await update(activity.id);
      close(false);
    }
  }

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => close(false)}
    >
      {/* Backdrop with press to close */}
      <Pressable style={styles.backdrop} onPress={() => close(false)}>
        <View style={styles.container}>
          {/* Modal Title */}
          <Text style={styles.title}>Add Participant</Text>

          {/* Participant Name Input */}
          <TextInput
            value={participantName}
            onChangeText={setParticipantName}
            placeholder="Participant Name"
            style={styles.input}
            placeholderTextColor="#888"
          />

          {/* Add Participant Button */}
          <TouchableOpacity onPress={onAddParticipant} style={styles.button}>
            <Text style={styles.buttonText}>Add Participant</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
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
    backgroundColor: Colors.Card,
    padding: 24,
    borderRadius: 16,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
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
