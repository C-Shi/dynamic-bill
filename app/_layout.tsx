import { ActivityContextProvider } from "@/context/ActivityContext";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import Colors from "@/constant/Color";
import { CurrentActivityDetailContextProvider } from "@/context/CurrentActivityDetailContext";
import { DB } from "@/utils/DB";

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

if (__DEV__) {
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Disable strict mode
  });
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      // await DB.init();
      // if (__DEV__) {
      //   await DB.seed();
      // }
      DB.register("expenses", "insert", (payload: any) => {
        const aid = Array.isArray(payload)
          ? payload[0].activity_id
          : payload.activity_id;
        DB.query(
          `
          UPDATE participants SET 
          total_paid = (
              SELECT COALESCE(SUM(e.amount), 0)
              FROM expenses e
              WHERE e.paid_by = participants.id
          ) WHERE activity_id = ?
        `,
          [aid]
        );
      });
      DB.register("participants", "insert", (payload: any) => {
        const aid = Array.isArray(payload)
          ? payload[0].activity_id
          : payload.activity_id;
        DB.query(
          `
          UPDATE participants SET
          total_owed = (
              SELECT COALESCE(SUM(
                e.amount / (
                    SELECT COUNT(*) 
                    FROM participant_expenses pe2 
                    WHERE pe2.expense_id = e.id
                )
              ), 0)
              FROM expenses e
              JOIN participant_expenses pe ON pe.expense_id = e.id
              WHERE pe.participant_id = participants.id
            )
          WHERE activity_id = ?;
        `,
          [aid]
        );
      });
      DB.register("participant_expenses", "insert", (payload: any) => {
        const pid = Array.isArray(payload)
          ? payload.map((pe) => pe.participant_id)
          : [payload.participant_id];
        DB.query(
          `
          UPDATE participants SET
          total_owed = (
              SELECT COALESCE(SUM(
                e.amount / (
                    SELECT COUNT(*) 
                    FROM participant_expenses pe2 
                    WHERE pe2.expense_id = e.id
                )
              ), 0)
              FROM expenses e
              JOIN participant_expenses pe ON pe.expense_id = e.id
              WHERE pe.participant_id = participants.id
            )
          WHERE id IN (${pid.map(() => "?").join(", ")});
        `,
          pid
        );
      });
      setReady(true);
    } catch (err) {
      console.log(err);
    }
  };

  if (!ready) {
    return <Text>Loading...</Text>;
  }
  return (
    <ActivityContextProvider>
      <CurrentActivityDetailContextProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.Primary,
            },
            headerTintColor: Colors.Background,
            headerBackButtonDisplayMode: "minimal",
            contentStyle: {
              backgroundColor: Colors.Background,
            },
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="activities/[id]/settlement"
            options={{
              headerTitle: "Expense Settlement",
            }}
          ></Stack.Screen>
          <Stack.Screen
            name="(modals)/activities/new"
            options={{
              presentation: "modal",
              title: "Add Activity",
              headerTitleAlign: "left",
              headerTintColor: Colors.Card,
              // to align title right in iOS
              headerTitle: (props) => (
                <View
                  style={{ flex: 1, flexDirection: "row", marginLeft: -10 }}
                >
                  <Text
                    style={{
                      color: Colors.Background,
                      fontSize: 18,
                      fontWeight: 500,
                    }}
                  >
                    {props.children}
                  </Text>
                </View>
              ),
            }}
          />
          <Stack.Screen
            name="(modals)/activities/[id]/expenses/new"
            options={{
              presentation: "modal",
              title: "Add Expense",
            }}
          ></Stack.Screen>
        </Stack>
      </CurrentActivityDetailContextProvider>
    </ActivityContextProvider>
  );
}
