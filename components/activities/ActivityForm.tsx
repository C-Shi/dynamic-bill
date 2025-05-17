import Colors from "@/constant/Color";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { DB } from "@/utils/db";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import TouchableCard from "@/components/shared/TouchableCard";

/**
 * Base props shared between new and update activity forms
 */
type BaseProps = {
  activity: any;
  setActivity: any;
  onOk: () => any;
  onCancel: () => any;
};

/**
 * Props specific to creating a new activity
 * Includes participant management functionality
 */
type NewActivityProps = BaseProps & {
  type: "new";
  participants: string[];
  setParticipants: React.Dispatch<React.SetStateAction<string[]>>;
};

/**
 * Props specific to updating an existing activity
 * Does not include participant management
 */
type UpdateActivityProps = BaseProps & {
  type: "update";
  participants?: undefined;
  setParticipants?: undefined;
};

type ActivityProps = NewActivityProps | UpdateActivityProps;

/**
 * ActivityForm Component
 * A form component for creating new activities or updating existing ones.
 * Features:
 * - Activity title and note input
 * - Activity type selection with icons
 * - Optional budget setting with numeric input
 * - Participant management for new activities
 * - Form validation and submission handling
 *
 * @param type - "new" for creating, "update" for modifying
 * @param activity - Activity data object
 * @param setActivity - Function to update activity data
 * @param participants - Array of participant names (new activity only)
 * @param setParticipants - Function to update participants (new activity only)
 * @param onOk - Callback for form submission
 * @param onCancel - Callback for form cancellation
 */
export default function ActivityForm({
  type,
  activity,
  setActivity,
  participants,
  setParticipants,
  onOk,
  onCancel,
}: ActivityProps) {
  // State for available activity types and new participant input
  const [activityTypes, setActivityTypes] = useState([]);
  const [newParticipant, setNewParticipant] = useState("");

  console.log(activity);

  // Load activity types from database on mount
  useEffect(() => {
    (async () => {
      const data = await DB.get("activity_types");
      setActivityTypes(data as []);
    })();
  }, []);

  // Update activity field value
  function onChangeActivity(field: string, value: string) {
    setActivity({ ...activity, [field]: value });
  }

  // Update activity type
  function onSelectActivityType(type: string) {
    setActivity((prev: any) => {
      return { ...prev, type };
    });
  }

  // Toggle budget input field
  function onToggleBudget(val: boolean): void {
    setActivity({ ...activity, budget: val ? 0 : undefined });
  }

  // Update budget value with decimal validation
  function onChangeBudget(val: string): void {
    const regex = /^\d*\.?\d{0,2}$/;

    if (regex.test(val)) {
      setActivity({ ...activity, budget: val });
    }
  }

  // Remove participant from list (new activity only)
  function removeParticipant(index: number) {
    if (type === "update") {
      return;
    }
    setParticipants!((prev) => prev.filter((_, i) => i !== index));
  }

  // Add new participant with duplicate check (new activity only)
  function onAddParticipant() {
    if (type === "update") {
      return;
    }
    if (!newParticipant) return;

    const capArr = participants!.map((p: string) => p.toUpperCase());
    if (capArr.includes(newParticipant.trim().toUpperCase())) {
      alert("Duplicate Participant");
      setNewParticipant("");
      return;
    }
    setParticipants!((prev) => {
      return [...prev, newParticipant.trim()];
    });
    setNewParticipant("");
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
      style={styles.container}
    >
      {/* Activity Information Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Activity Info</Text>
        <Text style={styles.subLabel}>Titile</Text>
        <TextInput
          style={styles.input}
          placeholder="eg: Bowling"
          onChangeText={(text) => onChangeActivity("title", text)}
          value={activity.title}
        />
        <Text style={styles.subLabel}>Note</Text>
        <TextInput
          onChangeText={(text) => onChangeActivity("note", text)}
          style={[styles.input, { height: 72 }]}
          multiline
          numberOfLines={3}
          maxLength={150}
          placeholder="eg: Bowling at bow bowling center"
          value={activity.note}
        />

        {/* Activity Type Selection */}
        <Text style={styles.subLabel}>Event Type</Text>
        <View style={styles.grid}>
          {activityTypes.map((item: { [key: string]: any }) => (
            <TouchableCard
              key={item.id}
              style={{ width: 60, height: 60 }}
              onPress={() => onSelectActivityType(item.name)}
              selected={item.name === activity.type}
            >
              <View>
                <Text style={{ textAlign: "center", fontSize: 24 }}>
                  {item.icon}
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 10,
                    color:
                      item.name === activity.type
                        ? Colors.Background
                        : Colors.Main,
                  }}
                >
                  {item.name}
                </Text>
              </View>
            </TouchableCard>
          ))}
        </View>

        {/* Budget Toggle and Input */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <Text style={styles.subLabel}>Add Budget</Text>
          <Switch
            style={{
              transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
              marginBottom: 10,
            }}
            value={activity.budget !== undefined && activity.budget !== null}
            trackColor={{ true: Colors.Primary }}
            onValueChange={onToggleBudget}
          />
        </View>
        {activity.budget !== undefined && activity.budget !== null ? (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="eg: $1000.00"
            onChangeText={onChangeBudget}
            value={activity.budget.toString()}
          />
        ) : (
          <Text style={styles.noBudget}>
            This activity do not have a budget
          </Text>
        )}
      </View>

      {/* Participant Management Section (New Activity Only) */}
      {type === "new" && (
        <View style={styles.section}>
          <Text style={styles.label}>Participants</Text>
          <View>
            <TextInput
              style={styles.input}
              value={newParticipant}
              onChangeText={setNewParticipant}
              placeholder="Enter name"
            />
            <TouchableOpacity
              style={styles.participantAdd}
              onPress={onAddParticipant}
            >
              <Ionicons name="add-circle" size={24} color={Colors.Primary} />
            </TouchableOpacity>
          </View>

          {/* Participant Badges */}
          <View style={styles.badgeContainer}>
            {participants.map((participant, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{participant}</Text>
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => removeParticipant(index)}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={Colors.Background}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Form Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={onOk}>
          <Text style={styles.saveBtnText}>
            {type === "new" ? "Create" : "Update"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginVertical: 10,
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "500",
  },
  subLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.SubText,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  noBudget: {
    backgroundColor: Colors.Card,
    padding: 15,
    borderRadius: 5,
    color: Colors.Main,
  },
  participantAdd: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -25 }],
    padding: 4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.Background,
    borderTopWidth: 1, // Upper border
    borderTopColor: "#ccc", // Color of the border
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveBtn: {
    backgroundColor: Colors.Primary,
    borderRadius: 4,
    paddingHorizontal: 16, // Add padding to make button wider
    paddingVertical: 10,
  },
  saveBtnText: {
    color: Colors.Card,
    textAlign: "center",
  },
  cancelBtn: {
    paddingHorizontal: 16, // Add padding to make button wider
    paddingVertical: 10,
  },
  cancelBtnText: {
    color: Colors.Dark,
    textAlign: "center",
  },
  badgeContainer: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    backgroundColor: Colors.Secondary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 14,
    marginRight: 8,
    color: Colors.Background,
  },
  removeIcon: {
    paddingLeft: 2,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    padding: 6,
  },
});
