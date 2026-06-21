import { useNavigation, } from '@react-navigation/native';
import { BookPlus, ChevronRight, ClipboardPlus, } from 'lucide-react-native';
import { TouchableOpacity, View, } from 'react-native';

import { useColorScheme } from 'nativewind';
import { Heading } from './Heading';
import { Text } from './Text';

export function BottomSheet() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-end bg-black/40">

      <TouchableOpacity
        className="flex-1"
        activeOpacity={1}
        onPress={() =>
          navigation.goBack()
        }
      />

      <View className="bg-white dark:bg-cardDark rounded-t-3xl px-6 py-6 gap-4 pb-14">

        <Heading >
          O que deseja adicionar?
        </Heading>

        <View className=' gap-3'>
          <TouchableOpacity className="flex-row justify-between items-center bg-background rounded-2xl px-6 bg-primary/15 h-14 "
            onPress={() => {
              navigation.goBack();
              // navigation.navigate(
              //   'AddDisciplina'
              // );
            }}
          >
            <View className="flex-row gap-3">
              <View className='flex-row gap-6'>
                <BookPlus color="#7453F9" />

                <Text className='font-semibold'>
                  Adicionar disciplina
                </Text>
              </View>

            </View>

            <ChevronRight color={colorScheme === "dark" ? "#fff" : "#000"} />

          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row justify-between items-center bg-background rounded-2xl px-6 bg-primary/15 h-14 "

            onPress={() => {
              navigation.goBack();
              navigation.navigate('AddAtividade');
            }}
          >

            <View
              className="flex-row gap-3"
            >
              <View className="flex-row gap-6">

                <ClipboardPlus color="#7453F9" />

                <Text className='font-semibold'>
                  Adicionar atividade
                </Text>
              </View>

            </View>

            <ChevronRight color={colorScheme === "dark" ? "#fff" : "#000"} />

          </TouchableOpacity>

        </View>
      </View>

    </View>

  );
}