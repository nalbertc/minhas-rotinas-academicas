import { useNavigation } from '@react-navigation/native';
import { ChartLine, ChevronRight, LogOut, Pencil, SunMoon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Image, Switch, Text as TextComp, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Heading } from '../components/Heading';
import { Text } from '../components/Text';
import { useProfile } from '../hooks/useprofile';
import { supabase } from '../libs/supabase';

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

  return (
    <View className="flex-1  dark:bg-backgroundDark bg-backgroundLight" style={{ paddingTop: insets.top }} >

      <View className="h-20 w-full items-center justify-center px-4 flex-row">
        <Heading >
          Meu perfil
        </Heading>
      </View>

      <View className="px-6">

        <View className='bg-white dark:bg-cardDark h-28 rounded-2xl items-center flex-row justify-between px-4'>

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
      </View>


      <View className='w-full gap-4 px-6'>
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


