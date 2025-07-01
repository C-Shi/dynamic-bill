import React from "react";
import { View, StyleSheet, DimensionValue } from "react-native";

type ProgressBarProp = {
  percentage: string;
  frontColor: string;
  backColor?: string;
};

export default function ProgressBar({
  percentage,
  frontColor,
  backColor,
}: ProgressBarProp) {
  return (
    <View style={styles.barsContainer}>
      <View
        style={[
          styles.progressBarBackground,
          { backgroundColor: backColor ?? "#ABB1B6" },
        ]}
      >
        <View
          style={[
            styles.progressBar,
            {
              width: percentage as DimensionValue,
              backgroundColor: frontColor,
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
            },
            percentage === "100%" && {
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  progressBarBackground: {
    marginTop: 8,
    flex: 1,
    backgroundColor: "#ABB1B6",
    borderRadius: 4,
  },
  progressBar: {
    height: 10,
  },
});
