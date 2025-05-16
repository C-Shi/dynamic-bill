import ActivityDetail from "@/components/activities/ActivityDetail";
import { ActivityContext } from "@/context/ActivityContext";
import { Activity } from "@/model/Activity";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import Colors from "@/constant/Color";

export default function ActivityIndexPage() {
  const { id } = useLocalSearchParams();
  const { get } = useContext(ActivityContext);
  const activity: Activity = get(id as string);

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: activity.title,
      headerRight: () => (
        <TouchableOpacity onPress={() => router.push(`/activities/${id}/edit`)}>
          <FontAwesome name="edit" size={24} color={Colors.Background} />
        </TouchableOpacity>
      ),
    });
  }, [activity]);

  return <ActivityDetail activity={activity}></ActivityDetail>;
}
