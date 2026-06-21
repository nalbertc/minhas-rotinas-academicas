import { Check } from "lucide-react-native"
import { useColorScheme } from "nativewind"
import { TouchableOpacity, View } from "react-native"
import { useSharedValue } from "react-native-reanimated"
import { IconTipoAtividade } from "./IconTipoAtividade"
import { Text } from "./Text"

interface TipoAtividadeProps {
  tipoSelected: "prova"
  | "trabalho"
  | "seminario"
  | "lista_exercicios"
  | "relatorio"
  | "projeto"
  | "leitura"
  | "outro" | "",
  setTipo: React.Dispatch<React.SetStateAction<"" | "prova" | "trabalho" | "seminario" | "lista_exercicios" | "relatorio" | "projeto" | "leitura" | "outro">>,
  onClose: () => void,
}

export const TIPOS = [
  {
    value: "prova",
    title: "Prova",
  },
  {
    value: "trabalho",
    title: "Trabalho",
  },
  {
    value: "seminario",
    title: "Seminário",
  },
  {
    value: "lista_exercicios",
    title: "Lista de exercícios",
  },
  {
    value: "relatorio",
    title: "Relatório",
  },
  {
    value: "projeto",
    title: "Projeto",
  },
  {
    value: "leitura",
    title: "Leitura",
  },
  {
    value: "outro",
    title: "Outro",
  },
] as const;

export function TipoAtividade({ setTipo, tipoSelected, onClose }: TipoAtividadeProps) {

  const offset = useSharedValue(0)

  function closeSheet() {
    offset.value = 0
    onClose()
  }

  return (
    <View className='gap-3'>

      {TIPOS.map(
        item => (
          <TipoAtividades
            key={item.value}
            title={item.title}
            value={item.value}
            tipoSelected={tipoSelected}
            setTipo={setTipo}
            close={closeSheet}
          />
        )
      )}
    </View>
  )
}

interface SheetProps {

  tipoSelected: "prova"
  | "trabalho"
  | "seminario"
  | "lista_exercicios"
  | "relatorio"
  | "projeto"
  | "leitura"
  | "outro" | "",
  setTipo: React.Dispatch<React.SetStateAction<"" | "prova" | "trabalho" | "seminario" | "lista_exercicios" | "relatorio" | "projeto" | "leitura" | "outro">>,
  title: string,
  value: "prova"
  | "trabalho"
  | "seminario"
  | "lista_exercicios"
  | "relatorio"
  | "projeto"
  | "leitura"
  | "outro",

  close(): void
}



export function TipoAtividades({ title, value, tipoSelected, setTipo, close }: SheetProps) {
  const { colorScheme } = useColorScheme()


  return (
    <TouchableOpacity className="flex-row justify-between items-center bg-background rounded-2xl px-6 bg-primary/15 h-14 "
      onPress={() => {
        setTipo(value)
        close()
      }}
    >
      <View className="flex-row gap-3">
        <View className='flex-row gap-6'>
          <IconTipoAtividade tipo={value} />

          <Text className='font-semibold'>
            {title}
          </Text>
        </View>

      </View>
      {
        tipoSelected === value &&

        <Check color={colorScheme === "dark" ? "#fff" : "#000"} />
      }



    </TouchableOpacity>
  )
}