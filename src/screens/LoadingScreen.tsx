import { View } from "react-native";
import { Loading } from "../components/Loading";

export function LoadingScreen() {
  return (
    <View className="flex-1 bg-backgroundLight dark:bg-backgroundDark  justify-center itens-center ">
      <Loading size={42} />

    </View>
  );
}
