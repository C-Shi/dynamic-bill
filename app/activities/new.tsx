import Colors from "@/constant/Color";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityType } from "@/model/ActivityType";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import TouchableCard from "@/components/shared/TouchableCard";
import { useRouter } from "expo-router";

export default function NewActivity() {
  const router = useRouter();
  const [activityTypes, setActivityTypes] = useState([]);
  const [newActivity, setNewActivity] = useState({
    title: "",
    note: "",
    budget: undefined,
    type: "Other",
  });

  const [newParticipant, setNewParticipant] = useState("");

  const [participantList, setParticipantList] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const data = await ActivityType.all();
      setActivityTypes(data as []);
    })();
  }, []);

  function onChangeActivity(field: string, value: string) {
    setNewActivity({ ...newActivity, [field]: value });
  }

  function onAddParticipant() {
    setParticipantList((prev) => {
      return [...prev, newParticipant];
    });
    setNewParticipant("");
  }

  function removeParticipant(index: number) {
    setParticipantList((prev) => prev.filter((_, i) => i !== index));
  }

  function onSelectActivityType(type: string) {
    setNewActivity((prev: any) => {
      return { ...prev, type };
    });
  }

  async function createActivity() {}

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={160}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
          style={styles.container}
        >
          <View style={styles.section}>
            <Text style={styles.label}>Activity Info</Text>
            <Text style={styles.subLabel}>Titile</Text>
            <TextInput
              style={styles.input}
              placeholder="eg: Bowling"
              onChangeText={(text) => onChangeActivity("title", text)}
            />
            <Text style={styles.subLabel}>Note</Text>
            <TextInput
              onChangeText={(text) => onChangeActivity("note", text)}
              style={[styles.input, { height: 72 }]}
              multiline
              numberOfLines={3}
              maxLength={150}
              placeholder="eg: Bowling at bow bowling center"
            />
            <Text style={styles.subLabel}>Budget</Text>
            <TextInput style={styles.input} placeholder="eg: $1000.00" />
            <Text style={styles.subLabel}>Event Type</Text>
            <View style={styles.grid}>
              {activityTypes.map((item: { [key: string]: any }) => (
                <TouchableCard
                  key={item.id}
                  style={{ width: 60, height: 60 }}
                  onPress={() => onSelectActivityType(item.name)}
                  selected={item.name === newActivity.type}
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
                          item.name === newActivity.type
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
          </View>

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

            <View style={styles.badgeContainer}>
              {participantList.map((participant, index) => (
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
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Create</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "500",
  },
  subLabel: {
    fontSize: 12,
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
