import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors, { lightenColor } from "@/constant/Color";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { Activity } from "@/model/Activity";

/**
 * ArchiveListItem Component
 * Displays a single activity in a list format.
 *
 * @param activity - The activity object to display
 */
export default function ArchivesListItem({ activity }: { activity: Activity }) {
  const participants = activity.participants;

  /**
   * Handle activity deletion with confirmation dialog
   */
  return (
    <View style={styles.container}>
      {/* Activity Title and Total Amount */}
      <View style={styles.summaryLine}>
        <Text style={styles.activityName}>{activity.title}</Text>
        <Feather name="share-2" size={24} color="black" />
      </View>

      {/* Activity Details */}
      <View>
        <Text style={styles.detail}>
          <FontAwesome name="dollar" size={12} color={Colors.SubText} />{" "}
          {activity.totalAmountDisplay} / {activity.budgetAmountDisplay}
        </Text>
        <Text style={styles.detail}>
          <FontAwesome name="group" size={12} color={Colors.SubText} />{" "}
          {participants.length} participant(s)
        </Text>
        <Text style={styles.detail}>
          <FontAwesome
            name="calendar-check-o"
            size={12}
            color={Colors.SubText}
          />{" "}
          Closed on: {activity.lastStatusChangedAt.toDateString()}
        </Text>
        <Text style={styles.detail}>
          <FontAwesome name="clock-o" size={12} color={Colors.SubText} /> Event
          Last for {activity.daysToSettle} days
        </Text>
      </View>

      {/* Participant Avatars and Delete Button */}
      <View style={styles.statusLine}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Completed</Text>
        </View>
      </View>
    </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
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
