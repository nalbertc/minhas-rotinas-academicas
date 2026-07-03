import { useEffect, useState } from "react";
import { FlatList, View } from 'react-native';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Svg, { Circle } from "react-native-svg";
import { Heading } from "../components/Heading";
import { Text } from "../components/Text";
import { atualizarAtividadesAtrasadas } from "../services/atividades";
import { Disciplina, getDisciplinas } from "../services/disciplinas";

export const HORARIO = [
  {
    value: "matutino",
    title: "Manhã",
  },
  {
    value: "vespertino",
    title: "Tarde",
  },
  {
    value: "noturno",
    title: "Noite",
  }, {
    value: "integral",
    title: "Integral",
  },
]

export function DisciplinaScreen() {

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
        <FlatList
          data={disciplinas}
          keyExtractor={(item) => item.id}
          refreshing={loading}
          onRefresh={loadData}
          renderItem={({ item, }) => (
            <>
              <View className="p-4 dark:bg-cardDark bg-white rounded-xl mb-4">
                <Text
                  className="font-semibold"
                  numberOfLines={1}
                  style={{
                    flexShrink: 1
                  }}
                >
                  {item.nome}
                </Text>

                <View className="flex-row  justify-between gap-5">

                  <View className="flex-1 justify-end">
                    <Text >Profº {item.professor}</Text>
                    <Text size="sm"
                      numberOfLines={1}
                      style={{
                        flexShrink: 1
                      }} >{item.sala}</Text>


                    <Text type="secondary" size="sm">
                      {HORARIO.find(hor => hor.value === item.horario)?.title} ({new Date(item.data_inicio).toLocaleDateString('pt-BR')} -
                      {new Date(item.data_fim).toLocaleDateString('pt-BR')})

                    </Text>
                  </View>

                  <View className="items-center relative gap-1">
                    <MiniChart current={item
                      .atividades
                      .filter(
                        a =>
                          a.status ===
                          "concluida"
                      )
                      .length} total={item.atividades.length} />
                  </View>
                </View>
              </View>
            </>

          )}
        />
      </View>
    </View>
  );
}

interface MiniChartProps {
  total: number
  current: number
}

export function MiniChart({ current, total }: MiniChartProps) {


  const size = 48

  const strokeWidth = 6

  const color = "#7453F9"

  const backgroundColor = "#E5E5E5"
  const radius = (size - strokeWidth) / 2;

  const circumference = 2 * Math.PI * radius;

  const progress = total !== 0 ? current / total : 0;

  const offset = circumference * (1 - progress);

  return (
    <View className="items-center relative gap-1">
      <Svg
        width={size}
        height={size}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progresso */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />

      </Svg>
      <Text size="sm"> {current}/{total}</Text>
    </View>
  )
}
