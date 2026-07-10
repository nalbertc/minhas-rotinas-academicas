import { useNavigation } from "@react-navigation/native"
import dayjs from "dayjs"
import { TouchableOpacity, View } from "react-native"
import { NavigationProps } from "../screens/AticidadesScreen"
import { Disciplina } from "../services/disciplinas"
import { MiniChart } from "./MiniChart"
import { Text } from "./Text"

interface CardDisciplinaProps {
  item: Disciplina
}

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

export function CardDisciplina({ item }: CardDisciplinaProps) {
  const navigation = useNavigation<NavigationProps>();

  return (
    <TouchableOpacity className="px-4 py-2 dark:bg-cardDark bg-white rounded-xl mb-4" onPress={() => navigation.navigate("DetalheDisciplina", { id: item.id })} activeOpacity={0.7}>
      <Text
        className="font-semibold"
        numberOfLines={1}
        style={{
          flexShrink: 1
        }}
      >
        {item.nome}
      </Text>

      <View className="flex-row  justify-between gap-5 items-center">
        <View className="flex-1 ">
          <Text >Profº {item.professor}</Text>
          <Text size="sm"
            numberOfLines={1}
            style={{
              flexShrink: 1
            }} >{item.sala}</Text>


          <Text type="secondary" size="sm">
            {HORARIO.find(hor => hor.value === item.horario)?.title} ({dayjs(item.data_inicio).format("DD/MM/YYYY")} -
            {dayjs(item.data_fim).format("DD/MM/YYYY")})

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
    </TouchableOpacity>
  )
}