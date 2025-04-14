import { ScrollView, StyleSheet, Text } from "react-native";
import ActivityListItem from "./ActivitiyListItem";
import Colors from "@/constant/Color";
import { useContext, useEffect } from "react";
import { ActivityContext } from "@/context/ActivityContext";

export default function ActivityList() {
  const activitiesCtx = useContext(ActivityContext);

  useEffect(() => {}, []);

  const activityList = activitiesCtx.activities.map((activity) => {
    return (
      <ActivityListItem
        key={activity.id}
        activity={activity}
      ></ActivityListItem>
    );
  });
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ongoing Activities</Text>
      {activityList}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  title: {
    color: Colors.Dark,
    fontWeight: 600,
    fontSize: 16,
    marginLeft: 5,
    marginVertical: 10,
  },
});
