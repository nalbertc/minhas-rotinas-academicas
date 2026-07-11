import { RouteProp, useNavigation, useRoute, } from '@react-navigation/native';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { ChevronRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { Text as TextReact, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Button } from '../components/Button';
import { Heading } from '../components/Heading';
import { ModalComponent } from '../components/Modal copy';
import { Text } from '../components/Text';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Atividade, atualizarAtividadesAtrasadas, deleteAtividade, getAtividadeById, updateStatusAtividade } from '../services/atividades';
import { showError, showSuccess } from '../utils/toast';
import { NavigationProps } from './AtividadesScreen';

export type RouteProps = RouteProp<RootStackParamList, 'AtividadeMenu'>;

export function MenuAtividadeScreen() {
  const route = useRoute<RouteProps>();
  const { id } = route.params
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const navigation = useNavigation<NavigationProps>();

  const [atividade, setAtividade] = useState<Atividade | null>();
  const [modalExcluirAtividade, setExcluirAtividade] = useState(false);

  const [loading, setLoading,] = useState(false);
  const [atualizacaoAtividade, setAtualizacaoAtividade] = useState(false);

  async function loadData() {
    setLoading(true);
    await atualizarAtividadesAtrasadas()

    const response = await getAtividadeById(id);

    setAtividade(response);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [atualizacaoAtividade]);


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

        {!loading ? <>
          <View>
            <Heading size='sm' >
              {atividade?.titulo}
            </Heading>

            <Text type='secondary'>{atividade?.disciplina.nome}</Text>

            <View className="flex-row justify-between">

              <Text type="secondary">{dayjs(atividade?.data_entrega).format("DD/MM/YYYY")}</Text>

              <TextReact className={clsx("font-semibold text-lg", {
                "text-atrasada": atividade?.status === "atrasada",
                "text-concluida": atividade?.status === "concluida",
                "text-pendente": atividade?.status === "pendente",
                "text-emAndamento": atividade?.status === "em_andamento",
              })}>

                {atividade?.status === "atrasada" ? "Atrasada" : atividade?.status === "concluida" ? "Concluída" : atividade?.status === "em_andamento" ? "Em andamento" : "Pendente"}
              </TextReact>

            </View>
          </View>

          <View className=' gap-3'>
            <TouchableOpacity className="flex-row justify-between items-center bg-background rounded-2xl px-6 bg-primary/15 h-14 "
              onPress={() => {
                navigation.goBack();
                navigation.navigate("DetalheAtividade", { id })
              }}
            >
              <Text className='font-semibold'>
                Mostrar detalhes
              </Text>

              <ChevronRight color={colorScheme === "dark" ? "#fff" : "#000"} />

            </TouchableOpacity>

            {
              atividade?.status !== "concluida" ?
                <TouchableOpacity className="flex-row justify-between items-center bg-background rounded-2xl px-6 bg-primary/15 h-14 "
                  onPress={async () => {
                    const result = await updateStatusAtividade(
                      atividade?.id!, "concluida");

                    if (result) {
                      showSuccess("Atividade marcada como concluída!");

                      setAtualizacaoAtividade(!atualizacaoAtividade)

                    } else {
                      showError("Não foi possível atualizar a atividade.");
                    }
                  }}
                >

                  <Text className='font-semibold'>
                    Marcar como concluída
                  </Text>

                </TouchableOpacity>
                : <></>
            }

            <TouchableOpacity className="flex-row justify-between items-center bg-background rounded-2xl px-6 bg-primary/15 h-14 "
              onPress={() => {
                setExcluirAtividade(true)

                // navigation.goBack();
                // navigation.navigate('AtividadeMenu');
              }}
            >
              <Text className='font-semibold'>
                Excluir atividade
              </Text>
            </TouchableOpacity>


            <ModalComponent title='Excluir atividade' isModalVisible={modalExcluirAtividade} setModalVisible={setExcluirAtividade} >
              <Text>Tem certeza que deseja excluir a atividade?</Text>

              <View className='flex-row gap-4 mt-6'>
                <View className='flex-1'>
                  <Button onPress={() => setExcluirAtividade(false)} type='secondary'>Cancelar</Button>
                </View>
                <View className='flex-1'>
                  <Button type='delete' onPress={async () => {

                    setExcluirAtividade(false)
                    try {
                      await deleteAtividade(id);
                      setAtualizacaoAtividade(!atualizacaoAtividade)

                      showSuccess("Atividade excluída com sucesso!");
                      navigation.goBack();
                    } catch (error) {
                      console.error(error);
                      showError("Não foi possível excluir a atividade.");
                    }

                  }} >Confirmar</Button>
                </View>
              </View>
            </ModalComponent>


          </View>
        </> : <><ActivityIndicator color="#7453F9" size={32} /></>

        }
      </View>

    </View>

  );
}