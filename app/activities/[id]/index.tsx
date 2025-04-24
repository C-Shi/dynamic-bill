import ActivityDetail from "@/components/activities/ActivityDetail";
import { ActivityContext } from "@/context/ActivityContext";
import { Activity } from "@/model/Activity";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect } from "react";

export default function ActivityIndexPage() {
  const { id } = useLocalSearchParams();
  const { get } = useContext(ActivityContext);

  const activity: Activity = get(id as string);

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: activity.title,
    });
  }, []);

  return <ActivityDetail activity={activity}></ActivityDetail>;
}
