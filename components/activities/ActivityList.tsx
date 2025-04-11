import { ScrollView, StyleSheet, Text } from "react-native";
import ActivityListItem from "./ActivitiyListItem";
import Colors from "@/constant/Color";

export default function ActivityList() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ongoing Activities</Text>
      <ActivityListItem></ActivityListItem>
      <ActivityListItem></ActivityListItem>
      <ActivityListItem></ActivityListItem>
      <ActivityListItem></ActivityListItem>
      <ActivityListItem></ActivityListItem>
      <ActivityListItem></ActivityListItem>
      <ActivityListItem></ActivityListItem>
      <ActivityListItem></ActivityListItem>
      <ActivityListItem></ActivityListItem>
      <ActivityListItem></ActivityListItem>
      <ActivityListItem></ActivityListItem>
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
