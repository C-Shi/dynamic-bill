import { useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { Activity } from "@/model/Activity";
import { ActivityContext } from "@/context/ActivityContext";
import ActivityForm from "@/components/activities/ActivityForm";
import { useRouter } from "expo-router";

export default function NewActivity() {
  const router = useRouter();
  const activityCtx = useContext(ActivityContext);

  const [newActivity, setNewActivity] = useState({
    title: "",
    note: "",
    budget: null,
    type: "Other",
  } as { [key: string]: any });

  const [participantList, setParticipantList] = useState<string[]>([]);

  async function createActivity() {
    if (!newActivity.title) {
      Alert.alert("Activity Title is required");
      return;
    }
    try {
      let data = { ...newActivity };
      data.participants = participantList;
      data.totals = 0;
      console.log(data);
      await activityCtx.add(new Activity(data));
      router.back();
    } catch {
      Alert.alert("Operation Failed!", "Unable to create activity");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={160}
      >
        <ActivityForm
          type="new"
          activity={newActivity}
          setActivity={setNewActivity}
          participants={participantList}
          setParticipants={setParticipantList}
          onOk={createActivity}
          onCancel={router.back}
        ></ActivityForm>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
