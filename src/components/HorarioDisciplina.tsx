import { Check } from "lucide-react-native"
import { useColorScheme } from "nativewind"
import { TouchableOpacity, View } from "react-native"
import { useSharedValue } from "react-native-reanimated"
import { HORARIO } from "../screens/DisciplinasScreen"
import { IconTipoAtividade } from "./IconTipoAtividade"
import { Text } from "./Text"

interface TipoAtividadeProps {
  tipoSelected: "matutino" | "vespertino" | "noturno" | "integral" | "",
  setTipo: React.Dispatch<React.SetStateAction<"" | "matutino" | "vespertino" | "noturno" | "integral">>,
  onClose: () => void,
}



export function HorarioDisciplina({ setTipo, tipoSelected, onClose }: TipoAtividadeProps) {

  const offset = useSharedValue(0)

  function closeSheet() {
    offset.value = 0
    onClose()
  }

  return (
    <View className='gap-3'>

      {HORARIO.map(
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

  tipoSelected: "matutino" | "vespertino" | "noturno" | "integral" | "",
  setTipo: React.Dispatch<React.SetStateAction<"" | "matutino" | "vespertino" | "noturno" | "integral">>,
  title: string,
  value: "matutino" | "vespertino" | "noturno" | "integral",

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