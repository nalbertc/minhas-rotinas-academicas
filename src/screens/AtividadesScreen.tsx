import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, Text as TextReact, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets, } from 'react-native-safe-area-context';

import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, Plus } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { CardAtividade } from "../components/CardAtividade";
import { Heading } from "../components/Heading";
import { Input } from "../components/Input";
import { STATUS } from "../components/StatusAtividade";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Atividade, atualizarAtividadesAtrasadas, getAtividadess } from "../services/atividades";
import { LoadingScreen } from "./LoadingScreen";

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export function AtividadeScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme()
  const navigation = useNavigation<NavigationProps>()

  const [filterAtividades, setFilterAtividades,] = useState<"pendente" | "em_andamento" | "concluida" | "atrasada" | "">("");
  const [searchAtividades, setSearchAtividades,] = useState("");
  const [atividades, setAtividades] = useState<Atividade[]>([]);

  const [loading, setLoading] = useState(false);

  const filteredAtividades =
    atividades.filter(
      atividade => {

        const matchStatus =
          !filterAtividades ||
          atividade.status ===
          filterAtividades;

        const matchTitulo =
          !searchAtividades.trim() ||

          atividade.titulo
            .toLowerCase()
            .includes(
              searchAtividades
                .trim()
                .toLowerCase()
            );

        return (
          matchStatus &&
          matchTitulo
        );
      }
    ).sort(
      (a, b) =>
        new Date(a.data_entrega).getTime() -
        new Date(b.data_entrega).getTime()
    );


  async function loadData() {
    setLoading(true);

    await atualizarAtividadesAtrasadas()

    const response = await getAtividadess();

    setAtividades(response);

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
          Atividades
        </Heading>

        <TouchableOpacity className="relative rounded-lg" activeOpacity={0.7} onPress={() => navigation.navigate("AddAtividade")}>
          <Plus color={colorScheme === "dark" ? "white" : "black"} />
        </TouchableOpacity>
      </View>

      <View className="gap-6 mb-6">

        <View className="px-4">
          <Input value={searchAtividades}

            placeholder="Buscar atividade..."

            onChangeText={setSearchAtividades} />
        </View>

        <ScrollView
          className="h-12 flex-row w-full"
          horizontal
          showsHorizontalScrollIndicator={false}
        >

          <View className="h-full flex-row gap-4 w-full px-4">

            <TouchableOpacity className={clsx(" rounded-xl items-center justify-center px-4 ", {
              "bg-primary": filterAtividades === "",
              "bg-primary/20 ": filterAtividades !== ""

            })} activeOpacity={0.7}
              onPress={() => setFilterAtividades("")}>
              <TextReact className={clsx("", {
                "text-white font-medium": filterAtividades === "",
                "text-primary dark:text-white font-regular": filterAtividades !== ""
              })}>
                Todas
              </TextReact>
            </TouchableOpacity>

            {STATUS.map(sta => (
              <TouchableOpacity key={sta.value} className={clsx(" rounded-xl items-center justify-center px-4 ", {
                "bg-primary": filterAtividades === sta.value,
                "bg-primary/20 ": filterAtividades !== sta.value

              })} activeOpacity={0.7} onPress={() => setFilterAtividades(sta.value)}>
                <TextReact className={clsx("", {
                  "text-white font-medium": filterAtividades === sta.value,
                  "text-primary dark:text-white font-regular": filterAtividades !== sta.value
                })}>
                  {sta.title}
                </TextReact>
              </TouchableOpacity>
            ))}

          </View>
        </ScrollView>
      </View>

      <FlatList
        className="flex-1 bg-backgroundLight dark:bg-backgroundDark px-4"
        contentContainerStyle={{
          paddingBottom:
            84,
        }}

        data={filteredAtividades}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadData}
        renderItem={({ item }) => (
          <View className="mb-4">
            <CardAtividade item={item} />
          </View>
        )}
      />

    </View>

  );
}

