import { Check } from "lucide-react-native"
import { useColorScheme } from "nativewind"
import { TouchableOpacity, View } from "react-native"
import { useSharedValue } from "react-native-reanimated"
import { IconTipoAtividade } from "./IconTipoAtividade"
import { Text } from "./Text"

interface TipoAtividadeProps {
  statusSelected: "pendente" | "em_andamento" | "concluida" | "atrasada",
  setStatus: React.Dispatch<React.SetStateAction<"pendente" | "em_andamento" | "concluida" | "atrasada">>,
  onClose: () => void,
}

export const STATUS = [
  {
    value: "em_andamento",
    title: "Em andamento",
  },
  {
    value: "pendente",
    title: "Pendente",
  },
  {
    value: "concluida",
    title: "Concluída",
  },
  {
    value: "atrasada",
    title: "Atrasada",
  },


] as const;

export function StatusAtividade({ setStatus, statusSelected, onClose }: TipoAtividadeProps) {

  const offset = useSharedValue(0)


  function closeSheet() {
    offset.value = 0
    onClose()
  }


  return (
    <View className='gap-3'>

      {
        STATUS.map(
          item => (
            <StatusAtividades
              key={item.value}
              title={item.title}
              value={item.value}
              statusSelected={statusSelected}
              setStatus={setStatus}
              close={closeSheet}
            />
          )
        )}


    </View>
  )
}

interface SheetProps {

  statusSelected: "pendente" | "em_andamento" | "concluida" | "atrasada",
  setStatus: React.Dispatch<React.SetStateAction<"pendente" | "em_andamento" | "concluida" | "atrasada">>,
  title: string,
  value: "pendente" | "em_andamento" | "concluida" | "atrasada"

  close(): void
}



export function StatusAtividades({ title, value, statusSelected, setStatus, close }: SheetProps) {
  const { colorScheme } = useColorScheme()


  return (
    <TouchableOpacity className="flex-row justify-between items-center bg-background rounded-2xl px-6 bg-primary/15 h-14 "
      onPress={() => {
        setStatus(value)
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
        statusSelected === value &&

        <Check color={colorScheme === "dark" ? "#fff" : "#000"} />
      }



    </TouchableOpacity>
  )
}