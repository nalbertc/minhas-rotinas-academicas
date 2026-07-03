import { ActivityIndicator, View } from "react-native";

export function Loading() {
  return (
    <View className="flex-1 bg-backgroundLight dark:bg-backgroundDark  justify-center itens-center ">
      <ActivityIndicator color="#7453F9" size={42} />

    </View>
  );
}
