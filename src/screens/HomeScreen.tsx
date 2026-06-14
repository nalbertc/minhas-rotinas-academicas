import { Bell } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { RefreshControl, ScrollView, Switch, TouchableOpacity, View } from 'react-native';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Heading } from "../components/Heading";
import { Text } from "../components/Text";
import { useProfile } from '../hooks/useprofile';

export function HomeScreen() {
  const { profile } = useProfile()
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const insets =
    useSafeAreaInsets();

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

  return (
    <ScrollView

      refreshControl={
        <RefreshControl
          refreshing={
            refreshing
          }
          onRefresh={
            onRefresh
          }
        />
      }

      className="flex-1  bg-backgroundLight dark:bg-backgroundDark" style={{ paddingTop: insets.top }}>

      <View className="h-20 w-full items-center justify-between px-6 flex-row">

        <View className="flex-row gap-4">

          <View className="bg-primary h-14 w-14 rounded-full"></View>

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

      <View>


        <Switch value={colorScheme === "dark"} onChange={toggleColorScheme} />
      </View>



    </ScrollView>
  );
}


