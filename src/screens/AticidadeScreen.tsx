import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, Text as TextReact, View } from 'react-native';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Heading } from "../components/Heading";
import { Text } from "../components/Text";
import { Atividades, getAtividadess } from "../services/atividades";

import clsx from "clsx";
import {
  BookOpen,
  Briefcase,
  ClipboardCheck,
  FileText,
  FolderKanban,
  ListChecks,
  Presentation,
  Shapes,
} from 'lucide-react-native';
import { useColorScheme } from "nativewind";

export function AtividadeScreen() {
  const insets =
    useSafeAreaInsets();

  const { colorScheme, toggleColorScheme } = useColorScheme();

  const [atividades, setAtividades] =
    useState<Atividades[]>([]);

  const [loading, setLoading] =
    useState(false);

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
    <FlatList
      className="
        flex-1
        bg-backgroundLight
        dark:bg-backgroundDark
      "

      contentContainerStyle={{
        paddingTop:
          insets.top,

        paddingBottom:
          24,
      }}

      data={atividades}

      keyExtractor={(item) =>
        item.id
      }

      refreshing={loading}

      onRefresh={
        loadData
      }

      ListHeaderComponent={() => (
        <>

          <View className="h-20 items-center justify-center px-6">

            <Heading size="lg">
              Atividades
            </Heading>

          </View>

          <ScrollView
            className="h-12 flex-row mb-6 w-full"
            horizontal
            showsHorizontalScrollIndicator={false}

          >

            <View className="h-full flex-row gap-4 w-full px-6">


              <View className={clsx("bg-primary rounded-xl items-center justify-center px-4 ", {

              })}>
                <TextReact className="font-regular text-white ">
                  Todas
                </TextReact>
              </View>

              <View className="flex-1 items-center justify-center rounded-xl px-4 bg-primary/20">
                <TextReact className="font-regular text-primary dark:text-white">
                  Em andamento
                </TextReact>
              </View>

              <View className="flex-1 items-center justify-center rounded-xl px-4 bg-primary/20">
                <TextReact className="font-regular text-primary dark:text-white">
                  Pendente
                </TextReact>
              </View>

              <View className="flex-1 items-center justify-center rounded-xl px-4 bg-primary/20">
                <TextReact className="font-regular text-primary dark:text-white">
                  Concluídas
                </TextReact>
              </View>

              <View className="flex-1 items-center justify-center rounded-xl px-4 bg-primary/20">
                <TextReact className="font-regular text-primary dark:text-white">
                  Atrasadas
                </TextReact>
              </View>

            </View>
          </ScrollView>

        </>
      )}

      renderItem={({ item }) => (
        <View
          className={clsx(`px-4 py-4 rounded-2xl mb-3 mx-6`,
            {
              "bg-[#A9C0E2] dark:bg-[#1E2A4A] border-[#094BAC]":
                item.status ===
                "em_andamento",

              "bg-[#bfebd2] dark:bg-[#1E3A2A] border-[#34AF68]":
                item.status ===
                "concluida",

              "bg-[#FFF2C5] dark:bg-[#3A371E] border-[#E4B926]":
                item.status ===
                "pendente",

              "bg-[#F3A9A9] dark:bg-[#3A1E1E] border-[#FF5757]":
                item.status ===
                "atrasada",
            }
          )}
        >
          <View className="">
            <View className="flex-row justify-between">
              <Text type="secondary">
                {item.disciplina.nome}
              </Text>

              {
                item.tipo ===
                  "prova"
                  ? <ClipboardCheck color={colorScheme === "dark" ? "#fff" : "#000"} />

                  : item.tipo ===
                    "trabalho"
                    ? <Briefcase color={colorScheme === "dark" ? "#fff" : "#000"} />

                    : item.tipo ===
                      "seminario"
                      ? <Presentation color={colorScheme === "dark" ? "#fff" : "#000"} />

                      : item.tipo ===
                        "lista_exercicios"
                        ? <ListChecks color={colorScheme === "dark" ? "#fff" : "#000"} />

                        : item.tipo ===
                          "relatorio"
                          ? <FileText />

                          : item.tipo ===
                            "projeto"
                            ? <FolderKanban color={colorScheme === "dark" ? "#fff" : "#000"} />

                            : item.tipo ===
                              "leitura"
                              ? <BookOpen color={colorScheme === "dark" ? "#fff" : "#000"} />

                              : <Shapes color={colorScheme === "dark" ? "#fff" : "#000"} />
              }

            </View>

            <Text size="lg" className="font-semibold">
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
      )}
    />
  );
}

