import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, View } from 'react-native';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { CardDisciplina } from "../components/CardDisciplina";
import { Heading } from "../components/Heading";
import { Loading } from "../components/Loading";
import { atualizarAtividadesAtrasadas } from "../services/atividades";
import { Disciplina, getDisciplinas } from "../services/disciplinas";
import { NavigationProps } from "./AticidadesScreen";

export function DisciplinaScreen() {
  const navigation = useNavigation<NavigationProps>();

  const insets = useSafeAreaInsets();

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);

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

  return (
    <View className="flex-1  bg-backgroundLight dark:bg-backgroundDark" style={{ paddingTop: insets.top }}>

      <View className="h-20 w-full items-center justify-center px-4 flex-row">
        <Heading >
          Disciplinas
        </Heading>
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

