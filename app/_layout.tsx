import { ActivityContextProvider } from "@/context/ActivityContext";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import Colors from "@/constant/Color";
import { CurrentActivityDetailContextProvider } from "@/context/CurrentActivityDetailContext";
import { DB } from "@/utils/db";
import { init } from "@/utils/init";
import { migrate } from "@/utils/migrationManager";

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
      await DB.init();
      await migrate();
      await init();
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
