import { ActivityContextProvider } from "@/context/ActivityContext";
import { Stack } from "expo-router";
import { Text } from "react-native";
import { useEffect, useState } from "react";
import { DB } from "@/utils/db";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      await DB.init();
      if (__DEV__) {
        await DB.seed();
      }
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
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        ></Stack.Screen>
      </Stack>
    </ActivityContextProvider>
  );
}
