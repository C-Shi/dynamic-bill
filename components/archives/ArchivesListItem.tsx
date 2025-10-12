import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Avatar from "@/components/shared/Avatar";
import Colors, { lightenColor } from "@/constant/Color";
import { FontAwesome } from "@expo/vector-icons";
import { Activity } from "@/model/Activity";
import { useRouter } from "expo-router";
import { ActivityContext } from "@/context/ActivityContext";

/**
 * ArchiveListItem Component
 * Displays a single activity in a list format.
 *
 * @param activity - The activity object to display
 */
export default function ArchivesListItem({ activity }: { activity: Activity }) {
  const participants = activity.participants;
  // Show only first 4 participants, with a count for the rest
  const visibleParticipant = participants.slice(0, 4);
  const invisibleParticipantCount = participants.length - 4;

  /**
   * Handle activity deletion with confirmation dialog
   */
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        console.log("click archives");
      }}
    >
      {/* Activity Title and Total Amount */}
      <View style={styles.summaryLine}>
        <Text style={styles.activityName}>{activity.title}</Text>
      </View>

      {/* Activity Details */}
      <View>
        <Text style={styles.detail}>{participants.length} participant(s)</Text>
        <Text style={styles.detail}>
          {activity.totalAmountDisplay}/{activity.budgetAmountDisplay}
        </Text>
        <Text style={styles.detail}>
          Closed on: {activity.lastStatusChangedAt.toDateString()}
        </Text>
        <Text style={styles.detail}>
          Event Last for
          {activity.createdAt.getTime()}{" "}
          {activity.lastStatusChangedAt.getTime()} {new Date().getTime()}
        </Text>
      </View>

      {/* Participant Avatars and Delete Button */}
      <View style={styles.statusLine}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Completed</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.Card,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  summaryLine: {
    marginBottom: 10,
  },
  activityName: {
    color: Colors.Main,
    fontWeight: "600",
    fontSize: 14,
  },
  detail: {
    color: Colors.SubText,
    marginBottom: 10,
    fontSize: 12,
  },
  statusLine: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  badge: {
    backgroundColor: lightenColor(Colors.Success, 75),
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  badgeText: {
    color: Colors.Success,
    fontWeight: "700",
    fontSize: 11,
  },
});
