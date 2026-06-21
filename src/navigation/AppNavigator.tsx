import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { AdicionarAtividadeScreen } from '../screens/AdicionarAtividadeScreen';
import { AdicionarDisciplinaScreen } from '../screens/AdicionarDisciplinaScreen';
import { AdicionarMenuScreen } from '../screens/AdicionarMenuScreen';
import { EditarPerfilScreen } from '../screens/EditarPerfilScreen';
import { TabsNavigator } from './TabsNavigator';

const Stack = createNativeStackNavigator()

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


    </Stack.Navigator>
  )
}