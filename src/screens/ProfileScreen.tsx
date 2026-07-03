import { useNavigation } from '@react-navigation/native';
import { ChartLine, ChevronRight, LogOut, Pencil, SunMoon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Dimensions, Image, Switch, Text as TextComp, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEffect, useState } from 'react';
import { Heading } from '../components/Heading';
import { Text } from '../components/Text';
import { useProfile } from '../hooks/useprofile';
import { supabase } from '../libs/supabase';
import { Atividades, atualizarAtividadesAtrasadas, getAtividadess } from '../services/atividades';
import { Disciplina, getDisciplinas } from '../services/disciplinas';

export function getInitials(nome?: string) {
  if (!nome?.trim()) {
    return "";
  }

  const partes = nome
    .trim()
    .split(/\s+/);

  const primeira = partes[0]?.[0] ?? "";

  const ultima = partes.length > 1 ? partes[partes.length - 1]?.[0] : primeira;

  return (primeira + ultima).toUpperCase();
}

export function ProfileScreen() {
  const { profile } = useProfile()
  const insets = useSafeAreaInsets();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const navigation = useNavigation()

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [atividades, setAtividades] = useState<Atividades[]>([]);
  const [loading, setLoading,] = useState(false);

  async function loadData() {
    setLoading(true);
    await atualizarAtividadesAtrasadas()

    const response = await getDisciplinas();
    const responseAtividades = await getAtividadess();

    setDisciplinas(response);
    setAtividades(responseAtividades);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);


  const totalAtividades =
    atividades.length;

  const atividadesConcluidas =
    atividades.filter(
      atividade =>
        atividade.status ===
        "concluida"
    ).length;

  const atividadesPendentes =
    atividades.filter(
      atividade =>
        atividade.status ===
        "pendente"
    ).length;

  const atividadesAtrasadas =
    atividades.filter(
      atividade =>
        atividade.status ===
        "atrasada"
    ).length;

  const atividadesEmAndamento =
    atividades.filter(
      atividade =>
        atividade.status ===
        "em_andamento"
    ).length;

  const DIMENSIONS = Dimensions.get("window")
  const WIDTH =
    DIMENSIONS.width - (4 * 14);

  return (
    <View className="flex-1  dark:bg-backgroundDark bg-backgroundLight" style={{ paddingTop: insets.top }} >

      <View className="h-20 w-full items-center justify-center px-4 flex-row">
        <Heading >
          Meu perfil
        </Heading>
      </View>

      <View className="px-4">

        <View className='bg-white dark:bg-cardDark  rounded-2xl  px-4 '>
          <View className='h-28 flex-row items-center justify-between'>


            <View className='flex-row justify-between gap-2 items-center'>

              <View className='w-16 h-16 overflow-hidden rounded-full '>

                {profile?.imageUrl ? <Image className="flex-1 " source={{
                  uri: profile.imageUrl
                }} /> : <View className="bg-primary flex-1 items-center justify-center">
                  <TextComp className="text-white font-regular  text-3xl items-center justify-center">{getInitials(profile?.nome!)}</TextComp>
                </View>}

              </View>

              <View>
                <Text className='font-semibold' >
                  {profile?.nome}
                </Text>
                <Text type='secondary' size='sm' numberOfLines={1}
                  style={{
                    flexShrink: 1
                  }}>
                  {profile?.email}
                </Text>
              </View>
            </View>

            <TouchableOpacity className='bg-primary/30 p-3 rounded-full' onPress={() => {
              navigation.navigate("EditProfile")
            }} activeOpacity={0.7}>
              <Pencil color="#7453F9" />
            </TouchableOpacity>

          </View>
          <View className='border-t border-gray-300 dark:border-gray-700 py-4 gap-1'>
            <View>
              <Text size='sm' type='secondary'>Curso</Text>
              <Text>{profile?.curso}</Text>
            </View>

            <View className='flex-row justify-between'>
              <View>
                <Text size='sm' type='secondary'>Ano</Text>
                <Text>{profile?.ano}</Text>
              </View>

              <View>
                <Text size='sm' type='secondary'>Quant. Disciplinas</Text>
                <Text>{disciplinas.length}</Text>
              </View>
            </View>

            <View className='gap-2'>
              <Text size='sm' type='secondary'>Atividades</Text>

              <View className='h-4 rounded-full overflow-hidden flex-row' style={{ width: WIDTH }}>
                <View className='h-full bg-atrasada' style={{ width: WIDTH * (atividadesAtrasadas / totalAtividades) }} />
                <View className='h-full bg-pendente' style={{ width: WIDTH * (atividadesPendentes / totalAtividades) }} />
                <View className='h-full bg-emAndamento' style={{ width: WIDTH * (atividadesEmAndamento / totalAtividades) }} />
                <View className='h-full bg-concluida' style={{ width: WIDTH * (atividadesConcluidas / totalAtividades) }} />
              </View>
            </View>
            <View className='flex-row justify-between'>

              <View className=''>

                <View className='flex-row gap-2 items-center'>
                  <Text>{atividadesAtrasadas}</Text>
                  <View className='h-4 w-4 bg-atrasada rounded' />
                  <Text size='xs' type='secondary'>Atrasada</Text>
                </View>
                <View className='flex-row gap-2 items-center'>
                  <Text>{atividadesPendentes}</Text>
                  <View className='h-4 w-4 bg-pendente rounded' />
                  <Text size='xs' type='secondary'>Pendente</Text>
                </View>


              </View>
              <View>
                <View className='flex-row gap-2 items-center'>
                  <Text>{atividadesEmAndamento}</Text>
                  <View className='h-4 w-4 bg-emAndamento rounded' />
                  <Text size='xs' type='secondary'>Em andamento</Text>
                </View>
                <View className='flex-row gap-2 items-center'>
                  <Text>{atividadesConcluidas}</Text>
                  <View className='h-4 w-4 bg-concluida rounded' />
                  <Text size='xs' type='secondary'>Concluída</Text>
                </View>
              </View>
            </View>

          </View>
        </View>

      </View>
      <View className='w-full gap-4 px-4'>
        <View className='border-t border-gray-300 dark:border-gray-700 py-2 gap-2 mt-4'>

          <TouchableOpacity className='flex-row h-12 items-center gap-4 justify-between'>
            <View className='flex-row gap-4'>

              <ChartLine color={colorScheme === "dark" ? "#fff" : "#000"} />
              <Text className='font-medium'>Dados e estatísiticas</Text>
            </View>

            <ChevronRight color={colorScheme === "dark" ? "#fff" : "#000"} />
          </TouchableOpacity>

          <View className='flex-row h-12 items-center gap-4 justify-between'>
            <View className='flex-row gap-4'>

              <SunMoon color={colorScheme === "dark" ? "#fff" : "#000"} />
              <Text className='font-medium'>Modo escuro</Text>
            </View>

            <Switch value={colorScheme === "dark"} onChange={toggleColorScheme} />
          </View>

          <TouchableOpacity className='flex-row  h-12 items-center gap-4' onPress={async () => {
            await supabase.auth.signOut()
          }}>
            <LogOut color={colorScheme === "dark" ? "#fff" : "#000"} />
            <Text className='font-medium'>Sair</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}


