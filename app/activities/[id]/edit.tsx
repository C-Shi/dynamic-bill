import ActivityForm from "@/components/activities/ActivityForm";
import { ActivityContext } from "@/context/ActivityContext";
import { Activity } from "@/model/Activity";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect, useState } from "react";

export default function ActivityEditPage() {
  const { id } = useLocalSearchParams();
  const { get, modify } = useContext(ActivityContext);

  const activity: Activity = get(id as string);
  const [activityState, setActivityState] = useState({ ...activity });

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Edit Activity",
    });
  }, []);

  async function onUpdateActivity() {
    const updatedActivity = new Activity(activityState);
    try {
      await modify(updatedActivity);
      router.back();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <ActivityForm
      type="update"
      activity={activityState}
      setActivity={setActivityState}
      onOk={onUpdateActivity}
      onCancel={router.back}
    ></ActivityForm>
  );
}
