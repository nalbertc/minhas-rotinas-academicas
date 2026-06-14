import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { FlatList, View } from 'react-native';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Heading } from "../components/Heading";
import { Text } from "../components/Text";
import { useProfile } from '../hooks/useprofile';
import { Atividades, getAtividadess } from "../services/atividades";

export function CalendarioScreen() {
  const { profile } = useProfile()
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const insets =
    useSafeAreaInsets();

  const [
    atividades,
    setAtividades,
  ] =
    useState<
      Atividades[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  async function loadData() {
    setLoading(true);

    const response =
      await getAtividadess();

    setAtividades(
      response
    );

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);



  return (
    <View className="flex-1  bg-backgroundLight dark:bg-backgroundDark" style={{ paddingTop: insets.top }}>

      <View className="bg-red-400/5 h-20 w-full items-center justify-center px-4 flex-row">



        <Heading size="lg">
          Calendário
        </Heading>


      </View>

      <View className="bg-red-100/5 flex-1 px-4">

        <View className="dark:bg-cardDark bg-[#E6E9E8] h-12 rounded-xl flex-row p-1">
          <View className="dark:bg-[#36384E] bg-white  justify-center items-center px-4 rounded-xl" >
            <Text size="lg">Todas</Text>
          </View>

          <View className="justify-center items-center px-4 rounded-2xl" >
            <Text size="lg">Em andamento</Text>
          </View>


          <View className="justify-center items-center px-4 rounded-2xl" >
            <Text size="lg">Concluídas</Text>
          </View>
        </View>

        <View>

          <FlatList
            data={atividades}

            keyExtractor={(item) =>
              item.id
            }

            refreshing={
              loading
            }

            onRefresh={
              loadData
            }

            renderItem={({ item, }) => (
              <View
                className="p-4 bg-white rounded-xl mb-2"
              >
                <Text>
                  {item.titulo}
                </Text>

                <Text>
                  {
                    item.descricao
                  }
                </Text>
              </View>
            )}
          />





        </View>



      </View>
    </View>
  );
}


