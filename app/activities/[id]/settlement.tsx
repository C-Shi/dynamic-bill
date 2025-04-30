import { ActivityContext } from "@/context/ActivityContext";
import { CurrentActivityDetailContext } from "@/context/CurrentActivityDetailContext";
import { minimumTrasactionStrategy, dollar } from "@/utils/Helper";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState, useRef } from "react";
import { Dimensions, View } from "react-native";
import { Activity } from "@/model/Activity";
import Colors from "@/constant/Color";
import MinimumTrasactionSettlement from "@/components/activities/MinimumTransactionSettlement";

import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";

export default function Settlement() {
  const { id } = useLocalSearchParams();
  const { participants } = useContext(CurrentActivityDetailContext);
  const { get } = useContext(ActivityContext);

  const { width, height } = Dimensions.get("window");

  const activity: Activity = get(id as string);

  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const paymentView = [
    <MinimumTrasactionSettlement
      activity={activity}
      participants={participants}
    ></MinimumTrasactionSettlement>,
  ];
  return (
    <View style={styles.container}>
      <Carousel
        ref={ref}
        width={width}
        height={height - 100}
        data={paymentView}
        // onProgressChange={progress}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1, margin: 10 }}>{item}</View>
        )}
      />

      <Pagination.Basic
        progress={progress}
        data={paymentView}
        dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
        containerStyle={{ gap: 5, marginTop: 10 }}
        // onPress={onPressPagination}
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
};
