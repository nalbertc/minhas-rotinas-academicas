import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EditarPerfilScreen } from '../screens/EditarPerfilScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator()

interface ProfileNavigatorProps {
}

export function ProfileNavigator({ }: ProfileNavigatorProps) {

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen
        name="Perfil"
        component={ProfileScreen}
      />

      <Stack.Screen
        name="Dados"
        component={ProfileScreen}
      />

      <Stack.Screen

        name="EditProfile"
        component={EditarPerfilScreen}
      />
    </Stack.Navigator>
  )
}