import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Heading } from "../components/Heading";
import { Text } from "../components/Text";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Atividades, atualizarAtividadesAtrasadas, getAtividadeById } from "../services/atividades";

interface DetalhesAtividadeScreenProps {
}

type RouteProps =
  RouteProp<
    RootStackParamList,
    'DetalheAtividade'
  >;

export function DetalhesAtividadeScreen({ }: DetalhesAtividadeScreenProps) {
  const route = useRoute<RouteProps>();
  const { id } = route.params
  const insets = useSafeAreaInsets();
  const navigation = useNavigation()
  const { colorScheme } = useColorScheme()

  const [atividade, setAtividade] = useState<Atividades | null>();

  const [loading, setLoading,] = useState(false);

  async function loadData() {
    setLoading(true);
    await atualizarAtividadesAtrasadas()

    const response = await getAtividadeById(id);

    setAtividade(response);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);


  return (
    <View className="flex-1  bg-backgroundLight dark:bg-backgroundDark" style={{ paddingTop: insets.top }}>
      <View className="h-20 items-center justify-between px-6 flex-row">
        <View className="w-1/6 items-start" >
          <TouchableOpacity className="relative bg-white dark:bg-tabsDark p-2 rounded-lg" activeOpacity={0.7} onPress={() => navigation.goBack()}>
            <ChevronLeft color={colorScheme === "dark" ? "white" : "black"} />

          </TouchableOpacity>
        </View>

        <Heading >
          Atividade
        </Heading>

        <View className="w-1/6 " />

      </View>


      <Text>{JSON.stringify(atividade)}</Text>


    </View>
  )
}