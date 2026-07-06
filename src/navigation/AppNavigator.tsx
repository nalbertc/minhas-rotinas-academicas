import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { AdicionarAtividadeScreen } from '../screens/AdicionarAtividadeScreen';
import { AdicionarDisciplinaScreen } from '../screens/AdicionarDisciplinaScreen';
import { DetalhesAtividadeScreen } from '../screens/DetalhesAtividadeScreen';
import { DetalheDisciplinaScreen } from '../screens/DetalhesDisciplinaScreen';
import { EditarPerfilScreen } from '../screens/EditarPerfilScreen';
import { AdicionarMenuScreen } from '../screens/MenuAdicionarScreen';
import { MenuAtividadeScreen } from '../screens/MenuAtividadeScreen';
import { TabsNavigator } from './TabsNavigator';

export type RootStackParamList = {
  Tabs: undefined;
  AddMenu: undefined;
  AtividadeMenu: {
    id: string;
  };
  AddDisciplina: undefined;
  AddAtividade: undefined;
  EditProfile: undefined;
  DetalheAtividade: {
    id: string;
  };
  DetalheDisciplina: {
    id: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>()

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen
        name="Tabs"
        component={TabsNavigator}
      />

      <Stack.Screen
        name="AddMenu"

        component={
          AdicionarMenuScreen
        }

        options={{
          presentation:
            'transparentModal',

          headerShown:
            false,
        }}
      />

      <Stack.Screen
        name="AtividadeMenu"

        component={
          MenuAtividadeScreen
        }

        options={{
          presentation:
            'transparentModal',

          headerShown:
            false,
        }}
      />



      <Stack.Screen
        name="AddDisciplina"
        component={AdicionarDisciplinaScreen}
      />

      <Stack.Screen
        name="AddAtividade"
        component={AdicionarAtividadeScreen}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditarPerfilScreen}
      />

      <Stack.Screen
        name="DetalheAtividade"
        component={DetalhesAtividadeScreen}
      />

      <Stack.Screen
        name="DetalheDisciplina"
        component={DetalheDisciplinaScreen}
      />




    </Stack.Navigator>
  )
}