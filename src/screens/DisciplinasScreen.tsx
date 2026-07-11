import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, Plus } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from 'react-native';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { CardDisciplina } from "../components/CardDisciplina";
import { Heading } from "../components/Heading";
import { Loading } from "../components/Loading";
import { atualizarAtividadesAtrasadas } from "../services/atividades";
import { Disciplina, getDisciplinas } from "../services/disciplinas";
import { NavigationProps } from "./AtividadesScreen";
import { LoadingScreen } from "./LoadingScreen";

export function DisciplinaScreen() {
  const insets = useSafeAreaInsets();
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const navigation = useNavigation<NavigationProps>()
  const { colorScheme } = useColorScheme()

  const [loading, setLoading,] = useState(false);

  async function loadData() {
    setLoading(true);
    await atualizarAtividadesAtrasadas()

    const response = await getDisciplinas();

    setDisciplinas(response);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <View className="flex-1  bg-backgroundLight dark:bg-backgroundDark" style={{ paddingTop: insets.top }}>

      <View className="h-16 items-center justify-between px-4 flex-row">
        <TouchableOpacity className="relative rounded-lg" activeOpacity={0.7} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colorScheme === "dark" ? "white" : "black"} />
        </TouchableOpacity>
        <Heading >
          Disciplinas
        </Heading>

        <TouchableOpacity className="relative rounded-lg" activeOpacity={0.7} onPress={() => navigation.navigate("AddDisciplina")}>
          <Plus color={colorScheme === "dark" ? "white" : "black"} />
        </TouchableOpacity>
      </View>

      <View className="px-4">
        {!disciplinas ? <Loading /> :
          <FlatList
            data={disciplinas}
            keyExtractor={(item) => item.id}
            refreshing={loading}
            onRefresh={loadData}
            renderItem={({ item, }) => (
              <CardDisciplina item={item} />
            )}
          />
        }
      </View>
    </View>
  );
}

