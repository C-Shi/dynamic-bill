import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import Colors from "@/constant/Color";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { PieChart } from "react-native-gifted-charts";
import ProgressBar from "@/components/shared/ProgressBar";

export default function ExpenseDetail({ eid }: { eid: string }) {
  const pieData = [
    { value: 25, color: "#177AD5", name: "Michael Chen" },
    { value: 25, color: "#79D2DE", name: "Sarah Johnson" },
    { value: 25, color: "#ED6665", name: "David Wilson" },
    { value: 25, color: "#F39C12", name: "Emily Rodriguez" },
  ];

  const legends = pieData.map((dataPoint, i) => {
    return (
      <View key={i} style={styles.legendLine}>
        <View style={styles.flexRow}>
          <View
            style={[styles.legendDot, { backgroundColor: dataPoint.color }]}
          ></View>
          <Text>{dataPoint.name}</Text>
        </View>
        <View>
          <Text>${dataPoint.value}.00</Text>
        </View>
      </View>
    );
  });
  return (
    <ScrollView style={styles.container}>
      {/* Summary container  */}
      <View style={styles.summaryContainer}>
        <Text style={styles.expenseName}>Team Dinner at Osteria</Text>
        <Text style={styles.expenseAmount}>$248.75</Text>
        <View style={styles.flexRow}>
          <FontAwesome name="users" size={16} color={Colors.SubText} />
          <Text style={styles.expensePayer}> Expense for 6 people</Text>
        </View>
        <View style={styles.flexRow}>
          <Ionicons
            name="person-circle-outline"
            size={18}
            color={Colors.SubText}
          />
          <Text style={styles.expensePayer}> Paid My Michael Chen</Text>
        </View>
      </View>

      {/* graph container */}
      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>Who's included</Text>
        <View style={styles.graphChartContainer}>
          <PieChart
            donut
            data={pieData}
            radius={90}
            innerRadius={50}
          ></PieChart>
        </View>
        <View>{legends}</View>
      </View>

      {/* Payment Breakdown container */}
      <View style={styles.paymentBreakdownContainer}>
        <Text style={styles.graphTitle}>Payment Breakdown</Text>
        <View>
          <View style={styles.progressBarTitleLine}>
            <Text style={{ fontSize: 13 }}>Payer's portion</Text>
            <Text style={{ fontSize: 13, fontWeight: 600 }}>$41.48</Text>
          </View>
          <ProgressBar
            percentage="50%"
            frontColor={Colors.Primary}
          ></ProgressBar>
        </View>
        <View>
          <View style={styles.progressBarTitleLine}>
            <Text style={{ fontSize: 13 }}>Payer's overpaid</Text>
            <Text
              style={{ fontSize: 13, fontWeight: 600, color: Colors.Success }}
            >
              +$207.29
            </Text>
          </View>
          <ProgressBar
            percentage="100%"
            frontColor={Colors.Success}
          ></ProgressBar>
        </View>
        <View style={styles.overpayExplainContainer}>
          <Ionicons
            name="information-circle"
            size={24}
            color={Colors.Primary}
          />
          <Text style={{ lineHeight: 24 }}>
            &nbsp; You paid for 6 people in this expense
          </Text>
        </View>
      </View>

      {/* Expense Insights container */}
      <View style={styles.insightContainer}>
        <View style={styles.flexRow}>
          <FontAwesome name="pie-chart" size={24} color={Colors.Primary} />
          <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: 500 }}>
            &nbsp;Expense Insights
          </Text>
        </View>

        {/* Budget or total expense impact */}
        <View style={styles.insightDetailContainer}>
          <View style={[styles.flexRow, { justifyContent: "space-between" }]}>
            <Text style={{ color: Colors.SubText, fontWeight: 500 }}>
              Budget Impact
            </Text>
            <Text style={{ fontWeight: 600 }}>24%</Text>
          </View>
          <ProgressBar
            percentage="24%"
            frontColor={Colors.Primary}
          ></ProgressBar>
          <Text style={{ fontSize: 12, color: Colors.SubText }}>
            This expense represents 24% of the "Team Building Q2" budget
          </Text>
        </View>

        {/* Largest Expense */}
        <View style={[styles.flexRow, styles.insightDetailContainer]}>
          <Ionicons name="trophy-sharp" size={28} color={Colors.Secondary} />
          <View>
            <Text style={{ fontWeight: 500 }}>&nbsp;Largest Expense</Text>
            <Text style={{ fontSize: 12, color: Colors.SubText }}>
              &nbsp;This is the largest expense in this activity
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  flexRow: {
    flexDirection: "row",
  },
  summaryContainer: {
    backgroundColor: Colors.Card,
    borderRadius: 10,
    padding: 15,
    gap: 10,
    marginBottom: 10,
  },
  expenseName: {
    fontSize: 20,
    fontWeight: 500,
  },
  expenseAmount: {
    fontSize: 21,
    fontWeight: 600,
  },
  expensePayer: {
    fontSize: 14,
    color: Colors.SubText,
  },
  graphContainer: {
    padding: 15,
    borderWidth: 2,
    borderColor: Colors.Card,
    borderRadius: 10,
    marginBottom: 10,
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: 600,
  },
  graphChartContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  legendLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  legendDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  legendText: {
    flex: 1,
  },
  paymentBreakdownContainer: {
    padding: 15,
    borderWidth: 2,
    borderColor: Colors.Card,
    borderRadius: 10,
    gap: 10,
    marginBottom: 10,
  },
  overpayExplainContainer: {
    borderRadius: 10,
    backgroundColor: Colors.Card,
    padding: 10,
    flexDirection: "row",
  },
  progressBarTitleLine: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  insightContainer: {
    borderRadius: 10,
    backgroundColor: Colors.Light,
    padding: 15,
    marginBottom: 100,
    gap: 10,
  },
  insightDetailContainer: {
    backgroundColor: Colors.Background,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
  },
});
