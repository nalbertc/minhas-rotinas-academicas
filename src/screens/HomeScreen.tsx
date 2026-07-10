import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { ChevronRight, Plus } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, Image, Pressable, RefreshControl, ScrollView, Text as TextComp, TouchableOpacity, View } from 'react-native';
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
import { IconTipoAtividade } from '../components/IconTipoAtividade';
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

  const proximasEntregas = useMemo(() => {
    const hoje = dayjs().startOf("day");

    return todasAsAtividades
      .filter((atv) => {
        const dataEntrega = dayjs(atv.data_entrega).startOf("day");
        return (
          atv.status !== "concluida" &&
          (dataEntrega.isSame(hoje) || dataEntrega.isAfter(hoje))
        );
      })
      .sort((a, b) => dayjs(a.data_entrega).diff(dayjs(b.data_entrega)))
      .slice(0, 3);
  }, [todasAsAtividades]);

  const atividadesAtrasadas = useMemo(() => {
    const hoje = dayjs().startOf("day");

    return todasAsAtividades.filter((atv) => {
      const dataEntrega = dayjs(atv.data_entrega).startOf("day");

      // Pega o que não tá concluído e já venceu
      return atv.status !== "concluida" && dataEntrega.isBefore(hoje);
    });
  }, [todasAsAtividades]);

  const dadosProgresso = useMemo(() => {
    const concluidas = todasAsAtividades.filter(atv => atv.status === "concluida").length;
    const total = todasAsAtividades.length;

    const pendentes = todasAsAtividades.filter(
      (atv) => atv.status === "pendente" || atv.status === "em_andamento"
    ).length;

    const percentual = total > 0 ? Math.round((concluidas / total) * 100) : 0;

    return { pendentes, percentual };
  }, [todasAsAtividades]);

  const CELL_SIZE = (Dimensions.get("window").width);

  return (
    <View className=" bg-backgroundLight dark:bg-backgroundDark relative flex-1">

      <View className='bg-tabsLigth dark:bg-tabsDark' style={{ height: insets.top }} />
      <View className="h-20 w-full items-center gap-4 px-4 flex-row bg-tabsLigth dark:bg-tabsDark" >
        <View className="h-14 w-14 rounded-full overflow-hidden">
          {profile?.imageUrl ? <Image className="flex-1 " source={{
            uri: profile.imageUrl
          }} /> : <View className="bg-primary flex-1 items-center justify-center">
            <TextComp className="text-white font-regular text-3xl items-center justify-center">{getInitials(profile?.nome!)}</TextComp>
          </View>}
        </View>

        <View className="flex-row gap-4">
          <View >
            <Text type="secondary">Olá!</Text>
            <Heading size="sm">
              {profile?.nome}
            </Heading>
          </View>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
          />} contentContainerStyle={{
            // flexGrow: 1,
          }}>

        <View className="flex-1 relative gap-8 pt-4">

          <Pressable
            onPress={() => navigation.navigate("Estatisticas")}
            className="mx-4 p-4 rounded-2xl bg-primary active:opacity-95 gap-2"
          >

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <View className='flex-row justify-between'>
                  <TextComp className="text-xl font-poppins_bold text-white">
                    {dadosProgresso.percentual}% Concluído
                  </TextComp>
                  <ChevronRight color={"white"} />
                </View>

                <TextComp className="text-[13px] text-gray-300 font-regular">
                  {dadosProgresso.pendentes === 0
                    ? "Nenhuma pendência por aqui! 🎉"
                    : `Resta(m) ${dadosProgresso.pendentes} atividade(s) em aberto`}
                </TextComp>
              </View>
            </View>


            <View className="w-full">
              <View className="w-full h-3 bg-white/90  rounded-full overflow-hidden">

                <View
                  className="h-full bg-concluida"
                  style={{ width: `${dadosProgresso.percentual}%` }}
                />
              </View>


            </View>
          </Pressable>

          {atividadesAtrasadas.length > 0 &&

            <View className='px-4 gap-2'>
              <Heading size='sm'>Atividades atrasadas</Heading>

              <View className='gap-2'>
                {atividadesAtrasadas.map(atv => (
                  <TouchableOpacity key={atv.id}
                    className={clsx(`px-4 py-2 rounded-2xl flex-row items-center gap-4 `,
                      {
                        "bg-emAndamentoCard dark:bg-emAndamentoCardDark border-emAndamento": atv.status === "em_andamento",
                        "bg-concluidaCard dark:bg-concluidaCardDark border-concluida": atv.status === "concluida",
                        "bg-pendenteCard dark:bg-pendenteCardDark border-pendente": atv.status === "pendente",
                        "bg-atrasadaCard dark:bg-atrasadaCardDark border-atrasada": atv.status === "atrasada",
                      }
                    )}
                    onPress={() => {
                      navigation.navigate("DetalheAtividade", { id: atv.id })
                    }}
                  >

                    <IconTipoAtividade tipo={atv.tipo} color={atv.status === "atrasada" ? "#FF5757" : atv.status === "pendente" ? "#E4B926" : atv.status === "concluida" ? "#34AF68" : "#094BAC"} size={28} />

                    <View className='gap-1 flex-1'>
                      <Text className='font-semibold'>{atv.titulo}</Text>

                      <View className='flex-row items-center justify-between gap-4 flex-1' >
                        <Text type='secondary' size='sm'>{atv.disciplina.nome}</Text>

                        <Text type='secondary' >{dayjs(atv.data_entrega).format("DD/MM/YYYY")}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                ))}
              </View>
            </View>
          }

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
                      {HORARIO.find(hor => hor.value === disc.horario)?.title} ({dayjs(disc.data_inicio).format("DD/MM")} - {dayjs(disc.data_fim).format("DD/MM")})

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
                    className={clsx(`px-4 py-2 rounded-2xl bg-pendenteCard dark:bg-pendenteCardDark`
                    )}

                    onPress={() => {
                      navigation.navigate("DetalheAtividade", { id: atv.id })
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
            <View className='flex-row justify-between'>
              <Heading size='sm'>Próximas entregas</Heading>
              <TouchableOpacity className='pl-6' activeOpacity={0.7} onPress={() => navigation.navigate("Tabs", {
                screen: "Atividades"
              })}>

                <ChevronRight color={colorScheme === "dark" ? "white" : "black"} />
              </TouchableOpacity>
            </View>

            <View className='gap-2'>
              {proximasEntregas.map(atv => (

                <CardAtividade key={atv.id} item={atv} />

              ))}
            </View>
          </View>




        </View>


        <View className='h-48' />
      </ScrollView>

      <TouchableOpacity activeOpacity={0.7} className="bg-primary rounded-full p-4 absolute bottom-28 right-6"
        onPress={() => {
          navigation.navigate('AddMenu')
        }}
      >
        <Plus size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}


