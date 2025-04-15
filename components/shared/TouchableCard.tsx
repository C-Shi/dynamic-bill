import Colors from "@/constant/Color";
import { TouchableOpacity, StyleSheet } from "react-native";

export default function TouchableCard({
  children,
  selected,
  style,
  onPress,
}: {
  [key: string]: any;
}) {
  return (
    <TouchableOpacity
      style={[styles.card, style, selected && styles.selectedCard]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 20,
    height: 20,
    backgroundColor: "#eee",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCard: {
    backgroundColor: Colors.Primary,
  },
});
