import Colors from "@/constant/Color";
import { TouchableOpacity, StyleSheet } from "react-native";

/**
 * TouchableCard Component
 * A circular touchable card component that can be selected.
 * Features:
 * - Circular shape with customizable size
 * - Selection state with color change
 * - Customizable content through children prop
 * - Optional custom styling
 *
 * @param children - Content to be displayed inside the card
 * @param selected - Boolean indicating if the card is selected
 * @param style - Optional custom styles to apply to the card
 * @param onPress - Function to call when the card is pressed
 */
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
