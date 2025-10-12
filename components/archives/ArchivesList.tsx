import { ScrollView, StyleSheet, Text } from "react-native";

import Colors from "@/constant/Color";
import { useEffect, useState } from "react";
import { DB } from "@/utils/db";
import { Activity } from "@/model/Activity";
import ArchivesListItem from "./ArchivesListItem";
import { ACTIVITIES_QUERY } from "@/constant/Query";

/**
 * ArchivesList Component
 * Displays a scrollable list of completed activities.
 * Each activity is rendered as an ArchivesListItem component,
 * showing key information about the activity.
 *
 * Uses ActivityContext to access and display the list of activities.
 */
export default function ArchivesList() {
  // Access activities from the global context
  const [archives, setArchives] = useState<Activity[]>([]);

  useEffect(() => {
    fetchArchives();
  }, []);

  async function fetchArchives() {
    const rows = await DB.query(ACTIVITIES_QUERY, ["ARCHIVED"]);

    setArchives(rows.map((r: any) => new Activity(r)));
  }

  // Map activities to ActivityListItem components
  const activityList = archives.map((activity) => {
    return (
      <ArchivesListItem
        key={activity.id}
        activity={activity}
      ></ArchivesListItem>
    );
  });

  return (
    <ScrollView style={styles.container}>
      {archives.length > 0 && (
        <Text style={styles.title}>Archived Activities</Text>
      )}
      {archives.length > 0 ? activityList : <Text>No archives found</Text>}
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
