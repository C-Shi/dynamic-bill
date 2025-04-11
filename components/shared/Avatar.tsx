import { View, Text, StyleSheet } from "react-native";

export default function Avatar({ name, style }: { name: string; style?: any }) {
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <View style={[styles.avatar, style]}>
      <Text style={styles.initial}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 32, // 8 * 4 (Tailwind's w-8)
    height: 32,
    borderRadius: 16, // to make it a circle
    backgroundColor: "#9B6ADE",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  initial: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
