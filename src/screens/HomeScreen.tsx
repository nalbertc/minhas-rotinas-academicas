import BottomSheet from "@gorhom/bottom-sheet";
import {
  useNavigation,
} from '@react-navigation/native';
import { Bell, Plus } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useRef, useState } from "react";
import { Image, RefreshControl, ScrollView, Text as TextComp, TouchableOpacity, View } from 'react-native';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Heading } from "../components/Heading";
import { Text } from "../components/Text";
import { useProfile } from '../hooks/useprofile';
import { getInitials } from "./ProfileScreen";

export function HomeScreen() {
  const [open, setOpen] = useState(false);
  const { profile } = useProfile()
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  const [refreshing, setRefreshing] =
    useState(false);

  async function onRefresh() {
    setRefreshing(true);

    try {
      // buscar dados
      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            1500
          )
      );
    } finally {
      setRefreshing(false);
    }
  }

  const bottomSheetRef =
    useRef<BottomSheet>(
      null
    );

  const navigation =
    useNavigation();

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />} className=" bg-backgroundLight dark:bg-backgroundDark relative" style={{ paddingTop: insets.top }} contentContainerStyle={{
          flexGrow: 1,
        }}>

      <View className="h-20 w-full items-center justify-between px-6 flex-row">

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

      <View className=" flex-1 relative">






        <TouchableOpacity activeOpacity={0.7} className="bg-primary rounded-full p-4 absolute bottom-28 right-6"
          onPress={() => {
            navigation.navigate('AddMenu')
          }}
        >
          <Plus size={32} color="#fff" />
        </TouchableOpacity>

      </View>



    </ScrollView>
  );
}


