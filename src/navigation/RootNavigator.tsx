import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';

export function RootNavigator() {
  const { session, loadingProfile } = useAuth();

  if (loadingProfile) {
    return null;
  }

  return (
    <NavigationContainer>
      {session ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}