import { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

// Constants for button sizing and spacing
const FAB_SIZE = 60;
const BUTTON_SPACING = 70;

/**
 * Type definition for action button properties
 */
type ActionButtonProp = {
  icon: React.ReactElement;
  onPress: () => void;
};

/**
 * ActionButton Component
 * An animated button that appears when the FAB is opened.
 * Features:
 * - Animated entrance/exit
 * - Customizable direction (up/down/left/right)
 * - Customizable background color
 * - Smooth opacity transitions
 *
 * @param icon - Icon element to display
 * @param onPress - Function to call when pressed
 * @param index - Position index for animation
 * @param isOpen - Whether the FAB is open
 * @param backgroundColor - Optional custom background color
 * @param direction - Direction for button to animate in
 */
const ActionButton = ({
  icon,
  onPress,
  index,
  isOpen,
  backgroundColor,
  direction,
}: {
  icon: React.ReactElement;
  onPress: () => void;
  index: number;
  isOpen: boolean;
  backgroundColor?: string;
  direction?: string;
}) => {
  const offset = useSharedValue(0);

  offset.value = isOpen ? withTiming(index * BUTTON_SPACING) : withTiming(0);

  const animatedStyle = useAnimatedStyle(() => {
    let translateX = 0;
    let translateY = 0;

    switch (direction) {
      case "up":
        translateY = -offset.value;
        break;
      case "down":
        translateY = offset.value;
        break;
      case "left":
        translateX = -offset.value;
        break;
      case "right":
        translateX = offset.value;
        break;
    }

    return {
      transform: [{ translateX }, { translateY }],
      opacity: offset.value > 0 ? 1 : 0,
    };
  });

  return (
    <Animated.View style={[styles.actionContainer, animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: backgroundColor ?? "#000" },
        ]}
        onPress={onPress}
      >
        {icon}
      </TouchableOpacity>
    </Animated.View>
  );
};

/**
 * FABGroup Component
 * A floating action button group with expandable action buttons.
 * Features:
 * - Main FAB that toggles action buttons
 * - Animated action buttons that appear/disappear
 * - Customizable colors and shadow
 * - Configurable expansion direction
 * - Smooth animations using react-native-reanimated
 *
 * @param buttons - Array of action buttons with icons and press handlers
 * @param backgroundColor - Optional custom background color
 * @param color - Optional custom icon color
 * @param shadow - Whether to show shadow on the main FAB
 * @param direction - Direction for action buttons to expand in
 */
export default function FABGroup({
  buttons,
  backgroundColor,
  color,
  shadow,
  direction,
}: {
  buttons: ActionButtonProp[];
  backgroundColor?: string;
  color?: string;
  shadow?: boolean;
  direction?: "up" | "down" | "left" | "right";
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFAB = () => {
    setIsOpen((prev) => !prev);
  };

  function onButtonPress(button: ActionButtonProp) {
    button.onPress();
    toggleFAB();
  }

  return (
    <View>
      {/* Action Buttons */}
      {buttons.map((button: ActionButtonProp, i) => (
        <ActionButton
          key={i}
          icon={button.icon}
          onPress={() => onButtonPress(button)}
          index={i + 1}
          isOpen={isOpen}
          backgroundColor={backgroundColor}
          direction={direction ?? "up"}
        ></ActionButton>
      ))}

      {/* Main FAB */}
      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: backgroundColor ?? "#000" },
          shadow && styles.shadow,
        ]}
        onPress={toggleFAB}
      >
        <Ionicons
          name={isOpen ? "close" : "add"}
          size={32}
          color={color ?? "#FFF"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  actionContainer: {
    position: "absolute",
    alignItems: "center",
  },
  actionButton: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6, // for Android
  },
});
