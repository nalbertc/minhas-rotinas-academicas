import { X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { Disciplina, getDisciplinas } from '../services/disciplinas';
import { Heading } from './Heading';
import { Input } from './Input';
import { Text } from './Text';

interface ModalProps {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  isModalVisible: boolean,
  disciplina: Disciplina
  setDisciplina: React.Dispatch<React.SetStateAction<Disciplina>>

}

export function ModalComponent({ isModalVisible, disciplina, setDisciplina, setModalVisible }: ModalProps) {


  const [disciplinas, setDisciplinas,] = useState<Disciplina[]>([]);
  const [searchDisciplinas, setSearchDisciplinas,] = useState("");
  const [loading, setLoading,] = useState(false);

  const filteredDisciplinas = searchDisciplinas.trim().length > 0 ? disciplinas.filter(disc => disc.nome.toLocaleLowerCase().includes(searchDisciplinas.toLowerCase())) : []

  const { colorScheme } = useColorScheme()

  async function loadData() {
    setLoading(true);

    const response =
      await getDisciplinas();

    setDisciplinas(
      response
    );

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const DIMENSIONS = Dimensions.get("window")
  const MAX_HEIGHT =
    DIMENSIONS.height
    * 0.6;

  return (
    <View style={{ flex: 1 }} >
      <Modal isVisible={isModalVisible}>
        <View style={{ flex: 1 }} className='justify-center items-center '>
          <View className='bg-white dark:bg-cardDark p-5 rounded-3xl w-[95%] relative gap-6'>

            <TouchableOpacity className='absolute right-5 top-5 bg-red-500/20 p-1 rounded-md z-10' onPress={() => setModalVisible(false)}>
              <X color={colorScheme === "dark" ? "#fff" : "#000"} />
            </TouchableOpacity>

            <Heading size='sm'>Selecione a disciplina</Heading>

            <View>
              <View className='gap-4'>
                <Input placeholder='Buscar disciplina...'
                  value={searchDisciplinas}
                  onChangeText={setSearchDisciplinas} />


                <ScrollView style={{

                  maxHeight: MAX_HEIGHT
                }} >

                  <View className='gap-2'>

                    {searchDisciplinas.length > 0 ?
                      filteredDisciplinas.map((disc) => (

                        <TouchableOpacity key={disc.id} className="min-h-12 flex-row justify-between items-center bg-background rounded-2xl px-2 bg-primary/15 py-1"
                          onPress={() => {
                            setModalVisible(false)
                            setDisciplina(disc)

                          }}
                        >
                          <View className="flex-row gap-3">
                            <View className='flex-row gap-6'>
                              <Text className=''>
                                {disc.nome}
                              </Text>
                            </View>

                          </View>
                        </TouchableOpacity>))
                      :

                      disciplinas.map((disc) => (

                        <TouchableOpacity key={disc.id} className="min-h-12 flex-row justify-between items-center bg-background rounded-2xl px-2 bg-primary/15 py-1"
                          onPress={() => {
                            setModalVisible(false)
                            setDisciplina(disc)

                          }}
                        >
                          <View className="flex-row gap-3">
                            <View className='flex-row gap-6'>
                              <Text className=''>
                                {disc.nome}
                              </Text>
                            </View>

                          </View>
                        </TouchableOpacity>))

                    }


                  </View>
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}