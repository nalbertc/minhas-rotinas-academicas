import { useNavigation } from "@react-navigation/native"
import clsx from "clsx"
import { Text as TextReact, TouchableOpacity, View } from "react-native"
import { NavigationProps } from "../screens/AticidadesScreen"
import { Atividade } from "../services/atividades"
import { normalizarDataVisualizacaoBr } from "../utils/normalizarData"
import { IconTipoAtividade } from "./IconTipoAtividade"
import { Text } from "./Text"

interface CardAtividadeProps {
  item: Atividade
}

export function CardAtividade({ item }: CardAtividadeProps) {
  const navigation = useNavigation<NavigationProps>();
  return (
    <TouchableOpacity
      className={clsx(`px-4 py-4 rounded-2xl mb-3 mx-4`,
        {
          "bg-emAndamentoCard dark:bg-emAndamentoCardDark border-emAndamento": item.status === "em_andamento",
          "bg-concluidaCard dark:bg-concluidaCardDark border-concluida": item.status === "concluida",
          "bg-pendenteCard dark:bg-pendenteCardDark border-pendente": item.status === "pendente",
          "bg-atrasadaCard dark:bg-atrasadaCardDark border-atrasada": item.status === "atrasada",
        }
      )}
      activeOpacity={0.9}
      onPress={() => {
        navigation.navigate("AtividadeMenu", { id: item.id })
      }}
    >
      <View className="">
        <View className="flex-row justify-between gap-2">
          <Text className="font-semibold">
            {item.titulo}
          </Text>
          <IconTipoAtividade tipo={item.tipo} />
        </View>


        {
          item.disciplina ?

            <Text type="secondary" size="sm"
              numberOfLines={1}
              style={{
                flexShrink: 1
              }}
            >

              {item.disciplina.nome}
            </Text> : <></>
        }


        <View className="flex-row justify-between">

          <Text type="secondary">{normalizarDataVisualizacaoBr(item.data_entrega)}</Text>

          <TextReact className={clsx("font-semibold text-lg", {
            "text-atrasada": item.status === "atrasada",
            "text-concluida": item.status === "concluida",
            "text-pendente": item.status === "pendente",
            "text-emAndamento": item.status === "em_andamento",
          })}>

            {item.status === "atrasada" ? "Atrasada" : item.status === "concluida" ? "Concluída" : item.status === "em_andamento" ? "Em andamento" : "Pendente"}
          </TextReact>

        </View>

      </View>
    </TouchableOpacity>
  )
}