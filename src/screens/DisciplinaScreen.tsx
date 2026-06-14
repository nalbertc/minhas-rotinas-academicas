import { useEffect, useState } from "react";
import { FlatList, View } from 'react-native';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Heading } from "../components/Heading";
import { Text } from "../components/Text";
import { Disciplina, getDisciplinas } from "../services/disciplinas";

export function DisciplinaScreen() {

  const insets =
    useSafeAreaInsets();



  const [
    disciplinas,
    setDisciplinas,
  ] =
    useState<
      Disciplina[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  async function loadData() {
    setLoading(true);

    const response =
      await getDisciplinas();

    setDisciplinas(
      response
    );

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);



  return (
    <View className="flex-1  bg-backgroundLight dark:bg-backgroundDark" style={{ paddingTop: insets.top }}>

      <View className="bg-red-400/50 h-20 w-full items-center justify-center px-4 flex-row">



        <Heading size="lg">
          Disciplinas
        </Heading>


      </View>

      <View>
        <FlatList
          data={
            disciplinas
          }

          keyExtractor={(
            item
          ) =>
            item.id
          }

          refreshing={
            loading
          }

          onRefresh={
            loadData
          }

          renderItem={({
            item,
          }) => (
            <View
              className="
            p-4
            bg-white
            rounded-xl
            mb-2
          "
            >
              <Text>
                {item.nome}
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
  );
}


