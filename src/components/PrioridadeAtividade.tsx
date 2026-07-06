import { Check } from "lucide-react-native"
import { useColorScheme } from "nativewind"
import { TouchableOpacity, View } from "react-native"
import { useSharedValue } from "react-native-reanimated"
import { Text } from "./Text"

interface TipoAtividadeProps {
  tipoSelected: "baixa"
  | "media"
  | "alta"
  | "",
  setTipo: React.Dispatch<React.SetStateAction<"baixa"
    | "media"
    | "alta"
    | "">>,
  onClose: () => void,
}

export const PRIORIDADE = [
  {
    value: "baixa",
    title: "Baixa",
  },
  {
    value: "media",
    title: "Média",
  },
  {
    value: "alta",
    title: "Alta",
  },

] as const;

export function PrioridadeAtividade({ setTipo, tipoSelected, onClose }: TipoAtividadeProps) {

  const offset = useSharedValue(0)


  function closeSheet() {
    offset.value = 0
    onClose()
  }


  return (
    <View className='gap-3'>

      {
        PRIORIDADE.map(
          item => (
            <PrioridadeAtividades
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

  tipoSelected: "baixa"
  | "media"
  | "alta"
  | "",
  setTipo: React.Dispatch<React.SetStateAction<"baixa"
    | "media"
    | "alta"
    | "">>,
  title: string,
  value: "baixa"
  | "media"
  | "alta"

  close(): void
}



export function PrioridadeAtividades({ title, value, tipoSelected, setTipo, close }: SheetProps) {
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