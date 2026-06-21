import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, Text as TextReact, TouchableOpacity, View } from 'react-native';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Text } from "../components/Text";
import { Atividades, getAtividadess } from "../services/atividades";

import clsx from "clsx";
import { useColorScheme } from "nativewind";
import { Heading } from "../components/Heading";
import { IconTipoAtividade } from "../components/IconTipoAtividade";
import { Input } from "../components/Input";
import { STATUS } from "../components/StatusAtividade";

export function AtividadeScreen() {

  const insets = useSafeAreaInsets();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const [filterAtividades, setFilterAtividades,] = useState<"pendente" | "em_andamento" | "concluida" | "atrasada" | "">("");
  const [searchAtividades, setSearchAtividades,] = useState("");
  const [atividades, setAtividades] = useState<Atividades[]>([]);

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
    );


  async function loadData() {
    setLoading(true);

    const response =
      await getAtividadess();

    setAtividades(response);

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (

    <View className="flex-1  bg-backgroundLight dark:bg-backgroundDark" style={{ paddingTop: insets.top }}>

      <View className="h-20 items-center justify-center px-6">

        <Heading >
          Atividades
        </Heading>

      </View>

      <View className="gap-4 mb-4">

        <View className="px-6">
          <Input value={searchAtividades}

            placeholder="Buscar atividade..."

            onChangeText={setSearchAtividades} />
        </View>

        <ScrollView
          className="h-12 flex-row w-full"
          horizontal
          showsHorizontalScrollIndicator={false}
        >

          <View className="h-full flex-row gap-4 w-full px-6">

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
        className="flex-1 bg-backgroundLight dark:bg-backgroundDark"
        contentContainerStyle={{
          paddingBottom:
            84,
        }}

        data={filteredAtividades}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadData}
        renderItem={({ item }) => (
          <>
            <View
              className={clsx(`px-4 py-4 rounded-2xl mb-3 mx-6`,
                {
                  "bg-[#A9C0E2] dark:bg-[#1E2A4A] border-[#094BAC]": item.status === "em_andamento",
                  "bg-[#bfebd2] dark:bg-[#1E3A2A] border-[#34AF68]": item.status === "concluida",
                  "bg-[#FFF2C5] dark:bg-[#3A371E] border-[#E4B926]": item.status === "pendente",
                  "bg-[#F3A9A9] dark:bg-[#3A1E1E] border-[#FF5757]": item.status === "atrasada",
                }
              )}
            >
              <View className="">
                <View className="flex-row justify-between gap-2">
                  <Text type="secondary" size="sm"
                    numberOfLines={1}
                    style={{
                      flexShrink: 1
                    }}
                  >
                    {item.disciplina.nome}
                  </Text>
                  <IconTipoAtividade tipo={item.tipo} />
                </View>

                <Text className="font-semibold">
                  {item.titulo}
                </Text>


                <View className="flex-row justify-between">

                  <Text type="secondary">{new Date(item.data_entrega).toLocaleDateString()}</Text>

                  <TextReact className={clsx("font-semibold", {
                    "text-[#FF5757]": item.status === "atrasada",
                    "text-[#34AF68]": item.status === "concluida",
                    "text-[#E4B926]": item.status === "pendente",
                    "text-[#094BAC]": item.status === "em_andamento",
                  })}>

                    {item.status === "atrasada" ? "Atrasada" : item.status === "concluida" ? "Concluída" : item.status === "em_andamento" ? "Em andamento" : "Pendente"}
                  </TextReact>

                </View>

              </View>
            </View>

          </>
        )}
      />

    </View>

  );
}

