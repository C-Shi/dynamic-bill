import { Tabs } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constant/Color";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerTitle: "DynamicBill",
        headerStyle: {
          backgroundColor: Colors.Primary,
        },
        sceneStyle: {
          backgroundColor: Colors.Background,
        },
        headerTitleStyle: {
          color: Colors.Background,
          marginBottom: 10,
        },
        headerTitleAlign: "left",
        headerRight: () => (
          <Pressable>
            <Ionicons
              name="add-circle-outline"
              size={28}
              style={styles.addIcon}
              color={Colors.Background}
            ></Ionicons>
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Activities",
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarActiveTintColor: Colors.Secondary,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="calendar"
              size={24}
              style={focused ? styles.barIconActive : styles.barIconInactive}
            ></Ionicons>
          ),
        }}
      ></Tabs.Screen>
      {/* <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarActiveTintColor: Colors.Secondary,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person"
              size={24}
              style={focused ? styles.barIconActive : styles.barIconInactive}
            ></Ionicons>
          ),
        }}
      ></Tabs.Screen> */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addIcon: {
    marginBottom: 10,
    marginRight: 10,
  },
  barIconActive: {
    color: Colors.Secondary,
  },
  barIconInactive: {
    color: Colors.Main,
  },
});
