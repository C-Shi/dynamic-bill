import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Avatar from "@/components/shared/Avatar";
import Colors from "@/constant/Color";
import { FontAwesome } from "@expo/vector-icons";
import { Activity } from "@/model/Activity";
import { Key, useContext } from "react";
import { useRouter } from "expo-router";
import { ActivityContext } from "@/context/ActivityContext";

export default function ActivityListItem({ activity }: { activity: Activity }) {
  const router = useRouter();
  const { remove } = useContext(ActivityContext);
  const participants = activity.participants;
  const visibleParticipant = participants.slice(0, 4);
  const invisibleParticipantCount = participants.length - 4;

  async function deleteActivity() {
    Alert.alert("Warning!!", "Are you sure you want to delete this activity?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await remove(activity);
          } catch {
            Alert.alert(`Activity - ${activity.title} - cannot be deleted`);
          }
        },
        style: "destructive",
      },
    ]);
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        router.push(`/activities/${activity.id}`);
      }}
    >
      <View style={styles.summaryLine}>
        <Text style={styles.activityName}>{activity.title}</Text>
        <Text style={styles.totalAmount}>{activity.totalAmountDisplay}</Text>
      </View>
      <View style={styles.detailLine}>
        <Text style={styles.detail}>
          {participants.length} people {`\u2022`} Created on:{" "}
          {activity.createdAt.toLocaleDateString()}
        </Text>
        {activity.budget && (
          <Text style={styles.detail}>
            Budget: {activity.budgetAmountDisplay!}
          </Text>
        )}
      </View>
      <View style={styles.participantLine}>
        <View style={styles.participants}>
          {visibleParticipant.map((p: string, index: number): any => (
            <Avatar
              key={index}
              name={p}
              style={{
                marginLeft: index === 0 ? 0 : -10,
                zIndex: 10 + index,
              }}
            />
          ))}
          {invisibleParticipantCount > 0 && (
            <View style={styles.extraAvatar}>
              <Text style={styles.extraText}>+{invisibleParticipantCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity hitSlop={10} onPress={deleteActivity}>
          <FontAwesome name="trash" size={26} color={Colors.Danger} />
        </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  activityName: {
    color: Colors.Main,
    fontWeight: "600",
    fontSize: 14,
  },
  totalAmount: {
    color: Colors.Primary,
    fontWeight: "bold",
    fontSize: 14,
  },
  detailLine: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detail: {
    color: Colors.SubText,
    fontSize: 12,
  },
  participantLine: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  participants: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  avatarWrapper: {
    zIndex: 1,
  },
  extraAvatar: {
    backgroundColor: Colors.SubText,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -10,
    zIndex: 100,
    borderWidth: 2,
    borderColor: "white",
  },
  extraText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
