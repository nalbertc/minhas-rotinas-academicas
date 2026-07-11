import { useNavigation } from "@react-navigation/native"
import clsx from "clsx"
import dayjs from "dayjs"
import { Text as TextReact, TouchableOpacity, View } from "react-native"
import { NavigationProps } from "../screens/AtividadesScreen"
import { Atividade } from "../services/atividades"
import { IconTipoAtividade } from "./IconTipoAtividade"
import { Text } from "./Text"

interface CardAtividadeProps {
  item: Atividade
}

export function CardAtividade({ item }: CardAtividadeProps) {
  const navigation = useNavigation<NavigationProps>();
  return (
    <TouchableOpacity key={item.id}
      className={clsx(`px-4 py-2 rounded-2xl flex-row items-center gap-4`,
        {
          "bg-emAndamentoCard dark:bg-emAndamentoCardDark border-emAndamento": item.status === "em_andamento",
          "bg-concluidaCard dark:bg-concluidaCardDark border-concluida": item.status === "concluida",
          "bg-pendenteCard dark:bg-pendenteCardDark border-pendente": item.status === "pendente",
          "bg-atrasadaCard dark:bg-atrasadaCardDark border-atrasada": item.status === "atrasada",
        }
      )}

      onPress={() => {
        navigation.navigate("AtividadeMenu", { id: item.id })
      }}
    >

      <IconTipoAtividade tipo={item.tipo} color={item.status === "atrasada" ? "#FF5757" : item.status === "pendente" ? "#E4B926" : item.status === "concluida" ? "#34AF68" : "#094BAC"} size={28} />
      <View className='flex-1'>

        <Text className='font-semibold'>{item.titulo}</Text>

        {item.disciplina ?
          <Text type='secondary' size='sm'>{item.disciplina.nome}</Text>
          : <></>}

        <View className='flex-row justify-between'>

          <Text type='secondary' >{dayjs(item.data_entrega).format("DD/MM/YYYY")}</Text>

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