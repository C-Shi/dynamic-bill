import { ScrollView, StyleSheet, Text } from "react-native";
import ActivityListItem from "./ActivitiyListItem";
import Colors from "@/constant/Color";
import { useContext, useEffect } from "react";
import { ActivityContext } from "@/context/ActivityContext";

/**
 * ActivityList Component
 * Displays a scrollable list of ongoing activities.
 * Each activity is rendered as an ActivityListItem component,
 * showing key information about the activity.
 *
 * Uses ActivityContext to access and display the list of activities.
 */
export default function ActivityList() {
  // Access activities from the global context
  const activitiesCtx = useContext(ActivityContext);

  useEffect(() => {}, []);

  // Map activities to ActivityListItem components
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
