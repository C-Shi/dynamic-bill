import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import Colors, { ColorSet } from "@/constant/Color";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { PieChart } from "react-native-gifted-charts";
import ProgressBar from "@/components/shared/ProgressBar";
import { ActivityContext } from "@/context/ActivityContext";
import { EXPENSE_PARTICIPANT_PAYMENT_BREAKDOWN_QUERY } from "@/constant/Query";
import { DB } from "@/utils/db";
import { CurrentActivityDetailContext } from "@/context/CurrentActivityDetailContext";
import { dollar } from "@/utils/Helper";

type EP = {
  value: number;
  color: string;
  name: string;
  isPayer: boolean;
};

export default function ExpenseDetail({
  aid,
  eid,
}: {
  aid: string;
  eid: string;
}) {
  const { get } = useContext(ActivityContext);
  const { expenses } = useContext(CurrentActivityDetailContext);
  const currentExpense = expenses.find((e) => e.id === eid)!;

  /** check if the current Expense is the biggest expense */
  const isMax = expenses.every((obj) => {
    if (obj.id === eid) return true;
    const target = expenses.find((o) => o.id === eid);
    return obj.amount <= target!.amount;
  });
  const activity = get(aid)!;
  const [expenseBreakdown, setExpenseBreakdown] = useState<EP[]>([]);

  useEffect(() => {
    DB.query(EXPENSE_PARTICIPANT_PAYMENT_BREAKDOWN_QUERY, [eid]).then(
      (result) => {
        const dataColorSet = ColorSet.newSet(result.length);
        setExpenseBreakdown(() => {
          return result.map((ep: any, i: number) => {
            return {
              value: currentExpense.amount / result.length,
              color: dataColorSet[i],
              name: ep.name,
              isPayer: Boolean(ep.payer),
            };
          });
        });
      }
    );
  }, []);

  const payer = expenseBreakdown.find((ep: EP) => ep.isPayer === true);

  const legends = expenseBreakdown.map((dataPoint: EP, i) => {
    return (
      <View key={i} style={styles.legendLine}>
        <View style={styles.flexRow}>
          <View
            style={[styles.legendDot, { backgroundColor: dataPoint.color }]}
          ></View>
          <Text>{dataPoint.name}</Text>
        </View>
        <View>
          <Text>{dollar(dataPoint.value)}</Text>
        </View>
      </View>
    );
  });
  return (
    <ScrollView style={styles.container}>
      {/* Summary container  */}
      <View style={styles.summaryContainer}>
        <Text style={styles.expenseName}>{currentExpense.description}</Text>
        <Text style={styles.expenseAmount}>
          {dollar(currentExpense.amount)}
        </Text>
        <View style={styles.flexRow}>
          <FontAwesome name="users" size={16} color={Colors.SubText} />
          <Text style={styles.expensePayer}>&nbsp;{activity.title}</Text>
        </View>
        <View style={styles.flexRow}>
          <Ionicons
            name="person-circle-outline"
            size={18}
            color={Colors.SubText}
          />
          <Text style={styles.expensePayer}> Paid by {payer?.name}</Text>
        </View>
      </View>

      {/* graph container */}
      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>Who's included</Text>
        <View style={styles.graphChartContainer}>
          <PieChart
            donut
            data={expenseBreakdown}
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
            <Text style={{ fontSize: 13, fontWeight: 600 }}>
              {dollar(currentExpense.amount / expenseBreakdown.length)}
            </Text>
          </View>
          <ProgressBar
            percentage={100 / expenseBreakdown.length + "%"}
            frontColor={Colors.Primary}
          ></ProgressBar>
        </View>
        <View>
          <View style={styles.progressBarTitleLine}>
            <Text style={{ fontSize: 13 }}>Payer's overpaid</Text>
            <Text
              style={{ fontSize: 13, fontWeight: 600, color: Colors.Success }}
            >
              +
              {dollar(
                currentExpense.amount -
                  currentExpense.amount / expenseBreakdown.length
              )}
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
            &nbsp; {payer?.name} paid for {expenseBreakdown.length - 1} more
            people
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
        {activity.budget && (
          <View style={styles.insightDetailContainer}>
            <View style={[styles.flexRow, { justifyContent: "space-between" }]}>
              <Text style={{ color: Colors.SubText, fontWeight: 500 }}>
                Budget Impact
              </Text>
              <Text style={{ fontWeight: 600 }}>
                {((currentExpense.amount / activity.budget) * 100).toPrecision(
                  3
                )}
                %
              </Text>
            </View>
            <ProgressBar
              percentage={(currentExpense.amount / activity.budget) * 100 + "%"}
              frontColor={Colors.Primary}
            ></ProgressBar>
            <Text style={{ fontSize: 12, color: Colors.SubText }}>
              This expense represents{" "}
              {((currentExpense.amount / activity.budget) * 100).toPrecision(3)}
              % of the "{activity.title}" budget
            </Text>
          </View>
        )}

        {/* Total expense impact */}
        <View style={styles.insightDetailContainer}>
          <View style={[styles.flexRow, { justifyContent: "space-between" }]}>
            <Text style={{ color: Colors.SubText, fontWeight: 500 }}>
              Spending Share
            </Text>
            <Text style={{ fontWeight: 600 }}>
              {((currentExpense.amount / activity.totals) * 100).toPrecision(3)}
              %
            </Text>
          </View>
          <ProgressBar
            percentage={(currentExpense.amount / activity.totals) * 100 + "%"}
            frontColor={Colors.Success}
          ></ProgressBar>
          <Text style={{ fontSize: 12, color: Colors.SubText }}>
            This expense represents{" "}
            {((currentExpense.amount / activity.totals) * 100).toPrecision(3)}%
            of the "{activity.title}" spending
          </Text>
        </View>

        {/* Largest Expense */}
        {isMax && (
          <View style={[styles.flexRow, styles.insightDetailContainer]}>
            <Ionicons name="trophy-sharp" size={28} color={Colors.Secondary} />
            <View>
              <Text style={{ fontWeight: 500 }}>&nbsp;Largest Expense</Text>
              <Text style={{ fontSize: 12, color: Colors.SubText }}>
                &nbsp;This is the largest expense in this activity
              </Text>
            </View>
          </View>
        )}
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
