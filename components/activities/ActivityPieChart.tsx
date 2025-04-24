import { Activity } from "@/model/Activity";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import Colors from "@/constant/Color";

export default function ActivityPieChart({
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
  const contributionData = dataset.map((p, i) => {
    return {
      value: p.totalPaid,
      color: chartColorSet[i],
      text: currencyHelper(p.totalPaid),
      name: p.name,
    };
  });
  const legend = contributionData.map((c) => {
    return (
      <View key={Math.random()} style={styles.legend}>
        <View style={[styles.legendDot, { backgroundColor: c.color }]} />
        <Text style={{ color: Colors.Main }}>
          {c.name}: {currencyHelper(c.value)}
        </Text>
      </View>
    );
  });
  return (
    <View style={styles.container}>
      <PieChart
        data={contributionData}
        radius={90}
        textSize={10}
        textColor={Colors.Background}
      />
      <View style={styles.legendContainer}>{legend}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  legendContainer: {
    flexDirection: "row",
    marginTop: 15,
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
