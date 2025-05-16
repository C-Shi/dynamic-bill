import { CurrentActivityDetailContext } from "@/context/CurrentActivityDetailContext";
import { useContext, useState } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Colors from "@/constant/Color";
import ActivitySettlement from "@/components/activities/ActivitySettlement";
import { useHeaderHeight } from "@react-navigation/elements";

import Carousel from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Settlement() {
  const { participants } = useContext(CurrentActivityDetailContext);
  const { width, height } = Dimensions.get("window");
  const [index, setIndex] = useState(0);

  const inset = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const paymentView = [
    <ActivitySettlement
      strategy="minimum"
      participants={participants}
    ></ActivitySettlement>,
    <ActivitySettlement
      strategy="proportional"
      participants={participants}
    ></ActivitySettlement>,
  ];
  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel
          width={width}
          height={height - inset.top - inset.bottom - headerHeight}
          data={paymentView}
          loop={false}
          renderItem={({ item, index }) => (
            <ScrollView style={styles.carouselCard} key={index}>
              {item}
            </ScrollView>
          )}
          onProgressChange={(_, progress) => setIndex(progress)}
        />
      </View>
      <View style={[styles.dotGroup, { paddingBottom: 0 }]}>
        {paymentView.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, index === i ? styles.dotActive : {}]}
          ></View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  carouselContainer: {
    flex: 1,
    marginBottom: 40000,
  },
  carouselCard: {
    flex: 1,
    margin: 10,
  },
  dotGroup: {
    position: "absolute",
    bottom: 0,
    height: 80,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.Light,
  },
  dot: {
    height: 20,
    width: 20,
    backgroundColor: Colors.SubText,
    borderRadius: "100%",
    marginHorizontal: 2,
  },
  dotActive: {
    backgroundColor: Colors.Primary,
  },
});
