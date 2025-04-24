import { Participant } from "@/model/Participant";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import Colors from "@/constant/Color";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const MIN_BAR_WIDTH = 20;
const MAX_BAR_WIDTH = 60;
const BAR_GAP = 40;

export default function ActivityBarChart({
  dataset,
  chartColorSet,
}: {
  dataset: Participant[];
  chartColorSet: string[];
}) {
  const barData = dataset.flatMap((p) => {
    return [
      {
        value: p.totalPaid,
        label: p.name,
        spacing: 2,
        labelWidth: 30,
        labelTextStyle: { color: Colors.Main },
        frontColor: chartColorSet[0],
      },
      { value: p.totalOwed, frontColor: chartColorSet[1] },
    ];
  });

  const barMaxValue = (function () {
    const max = dataset.reduce((prev, curr) => {
      return Math.max(curr.totalOwed, curr.totalPaid, prev);
    }, 0);
    const scaled = max * 1.1;

    // Determine the rounding base: 10, 100, 1000, etc.
    const magnitude = Math.pow(10, Math.floor(Math.log10(scaled)));

    // Round up to the next multiple of the base
    const rounded = Math.ceil(scaled / (magnitude / 10)) * (magnitude / 10);

    return rounded;
  })();

  const { chartWidth, barWitdh } = (function (): any {
    const dataLength = barData.length;
    const barWidth = Math.min(
      MAX_BAR_WIDTH,
      Math.max(MIN_BAR_WIDTH, (screenWidth - 40) / dataLength - BAR_GAP)
    );

    const chartWidth = (barWidth + BAR_GAP) * dataLength;
    return { chartWidth, barWidth };
  })();

  return (
    <View>
      <View style={styles.legendContainer}>
        <View style={styles.legend}>
          <View
            style={[styles.legendDot, { backgroundColor: chartColorSet[0] }]}
          />
          <Text style={{ color: Colors.Main }}>Paid</Text>
        </View>

        <View style={styles.legend}>
          <View
            style={[styles.legendDot, { backgroundColor: chartColorSet[1] }]}
          />
          <Text style={{ color: Colors.Main }}>Owed</Text>
        </View>
      </View>
      <BarChart
        data={barData}
        barWidth={barWitdh}
        width={chartWidth}
        spacing={BAR_GAP}
        hideRules
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{ color: Colors.Main }}
        noOfSections={4}
        maxValue={barMaxValue}
        isAnimated
      />
    </View>
  );
}

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "center",
    alignSelf: "center",
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    width: 150,
  },
  legendDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 10,
  },
});
