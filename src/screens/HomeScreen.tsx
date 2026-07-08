import {
  useNavigation,
} from '@react-navigation/native';
import dayjs from 'dayjs';
import { Bell, Plus } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView, Text as TextComp, TouchableOpacity, View } from 'react-native';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { CardAtividade } from '../components/CardAtividade';
import { Heading } from "../components/Heading";
import { Text } from "../components/Text";
import { useProfile } from '../hooks/useprofile';
import { Atividade, atualizarAtividadesAtrasadas, getAtividadess } from '../services/atividades';
import { Disciplina, getDisciplinas } from '../services/disciplinas';
import { getInitials } from "./ProfileScreen";

export function HomeScreen() {
  const [open, setOpen] = useState(false);
  const { profile } = useProfile()
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [isModalVisibleModal, setModalVisibleModal] = useState(false);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [todasAsAtividades, setAtividades] = useState<Atividade[]>([]);

  const [loading, setLoading,] = useState(false);

  async function loadData() {
    setLoading(true);
    await atualizarAtividadesAtrasadas()

    const response = await getDisciplinas();
    const responseAtividades = await getAtividadess();

    setAtividades(responseAtividades);
    setDisciplinas(response);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const hoje = dayjs();
  const daquiUmaSemana = dayjs().add(7, 'day');

  const proximasEntregas = todasAsAtividades
    .filter(atv => atv.status !== "concluida" && atv.status !== "atrasada")
    .sort((a, b) => dayjs(a.data_entrega).diff(dayjs(b.data_entrega)))
    .slice(0, 3);

  const totalAtividades = todasAsAtividades.length;
  const concluidas = todasAsAtividades.filter(atv => atv.status === "concluida").length;
  const pendentes = todasAsAtividades.filter(atv => atv.status === "pendente" || atv.status === "em_andamento").length;
  const atrasadasNumber = todasAsAtividades.filter(atv => atv.status === "atrasada").length;

  const atrasadas = todasAsAtividades.filter(atv => atv.status === "atrasada");

  const percentualConclusao = totalAtividades > 0
    ? Math.round((concluidas / totalAtividades) * 100)
    : 0;

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
          />} className=" bg-backgroundLight dark:bg-backgroundDark relative " style={{ paddingTop: insets.top }} contentContainerStyle={{
            flexGrow: 1,
          }}>
        <View className="h-20 w-full items-center justify-between px-4 flex-row">

          <View className="flex-row gap-4">

            <View className="h-14 w-14 rounded-full overflow-hidden">
              {profile?.imageUrl ? <Image className="flex-1 " source={{
                uri: profile.imageUrl
              }} /> : <View className="bg-primary flex-1 items-center justify-center">
                <TextComp className="text-white font-regular text-3xl items-center justify-center">{getInitials(profile?.nome!)}</TextComp>
              </View>}
            </View>

            <View >
              <Text type="secondary">Olá!</Text>
              <Heading size="sm">
                {profile?.nome}
              </Heading>
            </View>
          </View>

          <TouchableOpacity className="relative bg-white dark:bg-tabsDark p-2 rounded-lg" activeOpacity={0.6} >
            <Bell color={colorScheme === "dark" ? "white" : "black"} />
            <View className="absolute bg-red-500 w-3 h-3 rounded-full top-1 right-2" />
          </TouchableOpacity>

        </View>

        <View className="flex-1 relative gap-8">
          <View className='px-4 gap-2'>
            <Heading size='sm'>Próximas entregas</Heading>

            <View className='gap-2'>
              {proximasEntregas.map(atv => (
                <CardAtividade key={atv.id} item={atv} />
              ))}
            </View>
          </View>

          {
            atrasadas.length &&

            <View className='px-4 gap-2'>
              <Heading size='sm'>Atividades atrasadas</Heading>

              <View className='gap-2'>
                {atrasadas.map(atv => (
                  <CardAtividade key={atv.id} item={atv} />
                ))}
              </View>
            </View>

          }

        </View>
        <View className='h-60' />
      </ScrollView>

      <TouchableOpacity activeOpacity={0.7} className="bg-primary rounded-full p-4 absolute bottom-28 right-6"
        onPress={() => {
          navigation.navigate('AddMenu')
        }}
      >
        <Plus size={32} color="#fff" />
      </TouchableOpacity>
    </>

  );
}


