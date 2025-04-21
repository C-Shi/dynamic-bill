import { ActivityContextProvider } from "@/context/ActivityContext";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { DB } from "@/utils/db";
import Colors from "@/constant/Color";

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
      setReady(true);
    } catch (err) {
      console.log(err);
    }
  };

  const modalHeaderStyle = {};

  if (!ready) {
    return <Text>Loading...</Text>;
  }
  return (
    <ActivityContextProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="activities/[id]/index"
          options={{
            headerStyle: {
              backgroundColor: Colors.Primary,
            },
            headerTintColor: Colors.Background,
            headerBackButtonDisplayMode: "minimal",
            headerBackTitle: "Activities",
          }}
        ></Stack.Screen>
        <Stack.Screen
          name="(modals)/activities/new"
          options={{
            presentation: "modal",
            title: "Add Activity",
            headerTitleAlign: "left",
            headerTintColor: Colors.Card,
            headerStyle: {
              backgroundColor: Colors.Primary,
            },
            contentStyle: {
              backgroundColor: Colors.Background,
            },
            // to align title right in iOS
            headerTitle: (props) => (
              <View style={{ flex: 1, flexDirection: "row", marginLeft: -10 }}>
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
            headerTintColor: Colors.Card,
            headerStyle: {
              backgroundColor: Colors.Primary,
            },
            contentStyle: {
              backgroundColor: Colors.Background,
            },
          }}
        ></Stack.Screen>
      </Stack>
    </ActivityContextProvider>
  );
}
