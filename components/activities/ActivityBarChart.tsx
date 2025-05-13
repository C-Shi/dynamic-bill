import { Activity } from "@/model/Activity";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import Colors from "@/constant/Color";

const MIN_BAR_WIDTH = 20; // Minimum width for readability
const MAX_BAR_WIDTH = 40; // Maximum width for aesthetics
const BAR_GAP = 10; // Gap between bars
const screenWidth = Dimensions.get("window").width;

export default function ActivityBarChart({
  dataset,
  chartColorSet,
}: {
  dataset: any[];
  chartColorSet: string[];
}) {
  const currencyHelper = (val: number) => {
    return Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(val);
  };

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

  const { chartWidth, barWidth } = (function (): any {
    const dataLength = barData.length;
    const calculatedBarWidth = Math.min(
      MAX_BAR_WIDTH,
      Math.max(MIN_BAR_WIDTH, (screenWidth - 40) / dataLength - BAR_GAP)
    );

    const calculatedChartWidth = (calculatedBarWidth + BAR_GAP) * dataLength;
    return {
      chartWidth: Math.max(calculatedChartWidth, screenWidth - 40),
      barWidth: calculatedBarWidth,
    };
  })();

  return (
    <View style={styles.mainContainer}>
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={[styles.container, { width: chartWidth }]}>
          <BarChart
            data={barData}
            width={chartWidth}
            height={200}
            barWidth={barWidth}
            spacing={BAR_GAP}
            hideRules
            showYAxisIndices
            xAxisLabelTextStyle={{ color: Colors.Main, fontSize: 10 }}
            yAxisTextStyle={{
              color: Colors.Main,
              fontSize: 10,
              position: "relative",
              left: -15,
              transform: [{ rotate: "-20deg" }],
            }}
            yAxisThickness={0.5}
            yAxisColor={Colors.Main}
            noOfSections={4}
            maxValue={barMaxValue}
            formatYLabel={(value) => currencyHelper(parseFloat(value))}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 10,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 5,
  },
});
