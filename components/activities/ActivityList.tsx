import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import ActivityListItem from "./ActivitiyListItem";
import Colors from "@/constant/Color";
import { useContext, useEffect } from "react";
import { ActivityContext } from "@/context/ActivityContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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
  const router = useRouter();

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

  // Empty state component
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={48} color={Colors.Dark} />
      <Text style={styles.emptyTitle}>No Activities Yet</Text>
      <Text style={styles.emptyText}>
        Start tracking your shared expenses by creating a new activity
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/(modals)/activities/new")}
      >
        <Ionicons name="add" size={24} color={Colors.Background} />
        <Text style={styles.createButtonText}>Create First Activity</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {activitiesCtx.activities.length > 0 && (
        <Text style={styles.title}>Ongoing Activities</Text>
      )}
      {activitiesCtx.activities.length > 0 ? activityList : <EmptyState />}
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: Colors.Dark,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: Colors.Dark,
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: Colors.Secondary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    color: Colors.Background,
    fontSize: 14,
    fontWeight: "600",
  },
});
