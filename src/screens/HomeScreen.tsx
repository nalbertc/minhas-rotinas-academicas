import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Bell, ChevronRight, Plus } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, Image, RefreshControl, ScrollView, Text as TextComp, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets, } from 'react-native-safe-area-context';
import { CardAtividade } from '../components/CardAtividade';
import { HORARIO } from '../components/CardDisciplina';
import { Heading } from "../components/Heading";
import { Text } from "../components/Text";
import { useProfile } from '../hooks/useprofile';
import { Atividade, atualizarAtividadesAtrasadas, getAtividadess } from '../services/atividades';
import { Disciplina, getDisciplinas } from '../services/disciplinas';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import clsx from 'clsx';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getInitials } from "./ProfileScreen";

type NavigationProps = NativeStackNavigationProp<RootStackParamList>

export function HomeScreen() {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation<NavigationProps>();
  const { profile } = useProfile()
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

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

  const atrasadas = todasAsAtividades.filter(atv => atv.status === "atrasada");

  const percentualConclusao = totalAtividades > 0
    ? Math.round((concluidas / totalAtividades) * 100)
    : 0;

  const disciplinasAtuais = disciplinas.filter(item => {
    const inicio = dayjs(item.data_inicio).startOf('day');
    const fim = dayjs(item.data_fim).endOf('day');
    return hoje.startOf("day").isBetween(inicio, fim, 'day', '[]');
  });

  const ultimasDisciplinas = disciplinas

  const disciplinasHome = useMemo(() => {
    const LIMITE_CARDS = 5;
    const vigentes = disciplinas
      .filter((disc) => hoje.isBetween(dayjs(disc.data_inicio), dayjs(disc.data_fim), "day", "[]"))
      .sort((a, b) => dayjs(a.data_fim).diff(dayjs(b.data_fim)));

    if (vigentes.length >= LIMITE_CARDS) {
      return vigentes.slice(0, LIMITE_CARDS);
    }

    const proximas = disciplinas
      .filter((disc) => dayjs(disc.data_inicio).isAfter(hoje, "day"))
      .sort((a, b) => dayjs(a.data_inicio).diff(dayjs(b.data_inicio)));

    const resultadoCronograma = [...vigentes, ...proximas];

    if (resultadoCronograma.length === 0) {
      return disciplinas
        .sort((a, b) => dayjs(b.created_at).diff(dayjs(a.created_at))) // Últimas cadastradas
        .slice(0, LIMITE_CARDS);
    }

    return resultadoCronograma.slice(0, LIMITE_CARDS);
  }, [disciplinas]);


  const provasProximas = useMemo(() => {
    const limiteDias = hoje.add(14, "day");
    const provasFiltradas = todasAsAtividades.filter((atv) => {
      const dataEntrega = dayjs(atv.data_entrega);

      return (
        atv.tipo === "prova" &&
        atv.status !== "concluida" &&
        (dataEntrega.isSame(hoje, "day") || (dataEntrega.isAfter(hoje) && dataEntrega.isBefore(limiteDias, "day")))
      );
    });

    provasFiltradas.sort((a, b) => dayjs(a.data_entrega).diff(dayjs(b.data_entrega)));
    return provasFiltradas.slice(0, 3);
  }, [todasAsAtividades]);


  const CELL_SIZE = (Dimensions.get("window").width);

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
        <View className="h-20 w-full items-center justify-between px-4 flex-row mb-6">

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

        <View className="flex-1 relative gap-6">

          <View className='bg-primary mx-4 p-4 rounded-2xl'>
            <Text>r</Text>
          </View>

          <View className="gap-2">
            <View className='flex-row justify-between px-4'>
              <Heading size='sm' >Disciplinas</Heading>
              <TouchableOpacity className='pl-6' activeOpacity={0.7} onPress={() => navigation.navigate("Tabs", {
                screen: "Disciplinas"
              })}>

                <ChevronRight color={colorScheme === "dark" ? "white" : "black"} />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <View className='flex-row gap-4 px-4'>
                {disciplinasHome.map(disc => (
                  <TouchableOpacity key={disc.id} className='dark:bg-cardDark bg-cardLigth rounded-xl p-4 gap-2' activeOpacity={0.7} onPress={() => navigation.navigate("DetalheDisciplina", { id: disc.id })} style={{
                    width: (CELL_SIZE - 32) * (2 / 3)
                  }}>
                    <Text
                      className="font-semibold"
                      numberOfLines={1}
                      style={{
                        flexShrink: 1
                      }}
                    >
                      {disc.nome}
                    </Text>

                    <Text type="secondary" size="sm">
                      {HORARIO.find(hor => hor.value === disc.horario)?.title} ({dayjs(disc.data_inicio).format("DD/MM")} -
                      {dayjs(disc.data_fim).format("DD/MM")})

                    </Text>
                  </TouchableOpacity>
                ))}

              </View>
            </ScrollView>
          </View>

          {
            provasProximas.length > 0 &&
            <View className='px-4 gap-2'>
              <Heading size='sm'>Provas próximas</Heading>

              <View className='gap-2'>
                {provasProximas.map(atv => (

                  <TouchableOpacity key={atv.id}
                    className={clsx(`px-4 py-2 rounded-2xl bg-pendenteCard dark:bg-pendenteCardDark border-pendente border`
                    )}

                    onPress={() => {
                      navigation.navigate("AtividadeMenu", { id: atv.id })
                    }}
                    activeOpacity={0.7}
                  >
                    <Text className='font-semibold'>{atv.titulo}</Text>

                    <View className='flex-row justify-between'>
                      <Text type='secondary'>{atv.disciplina.nome}</Text>

                      <Text type='secondary' >{dayjs(atv.data_entrega).format("DD/MM/YYYY")}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          }

          <View className='px-4 gap-2'>
            <Heading size='sm'>Próximas </Heading>

            <View className='gap-2'>
              {proximasEntregas.map(atv => (
                <CardAtividade key={atv.id} item={atv} />
              ))}
            </View>
          </View>

          {atrasadas.length > 0 &&

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


