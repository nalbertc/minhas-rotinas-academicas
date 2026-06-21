import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import clsx from 'clsx';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BookOpen, Calendar, ClipboardList, Home, User } from 'lucide-react-native';

import { AtividadeScreen } from '../screens/AticidadeScreen';
import { DisciplinaScreen } from '../screens/DisciplinaScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export function TabsNavigator() {

  const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    return (
      <View className="absolute bottom-0 left-0 right-0 ">
        <View className="flex-row h-24 bg-white dark:bg-tabsDark" style={styles.container}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;

            const tabBarIcon = options.tabBarIcon;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={index}
                onPress={onPress}
                activeOpacity={0.9}
                className={`flex-1 items-center justify-center ${!isFocused && 'scale-95'} ${isFocused && 'scale-105'} `}>
                {tabBarIcon &&
                  tabBarIcon({
                    focused: isFocused,
                    size: 22,
                    color: isFocused ? '#7453F9' : '#6B7280',
                  })}
                <Text key={index} className={clsx("text-sm", {

                  'text-primary font-semibold': isFocused, 'text-gray-500 font-regular ': !isFocused
                })}>
                  {String(label)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };


  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />

      <Tab.Screen
        name="Calendario"
        component={DisciplinaScreen}
        options={{
          title: "Calendário",
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />
        }}
      />

      <Tab.Screen
        name="Disciplina"
        component={DisciplinaScreen}
        options={{
          title: "Disciplinas",
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />
        }}
      />

      <Tab.Screen
        name="Atividade"
        component={AtividadeScreen}
        options={{
          title: "Atividades",
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={({
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 3, // Esta propriedade é específica do Android para elevar a sombra
  },
});
