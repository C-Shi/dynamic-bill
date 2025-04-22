import NewExpense from "@/components/expenses/NewExpense";
import Colors from "@/constant/Color";
import { ActivityContext } from "@/context/ActivityContext";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect } from "react";
import { TouchableOpacity } from "react-native";

export default function NewExpenseMoal() {
  const { get } = useContext(ActivityContext);
  const { id } = useLocalSearchParams();
  const activity = get(id as string);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={navigation.goBack}>
          <AntDesign name="close" color={Colors.Card} size={24}></AntDesign>
        </TouchableOpacity>
      ),
    });
  }, []);

  return <NewExpense activity={activity}></NewExpense>;
}
