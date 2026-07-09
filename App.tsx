import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "./global.css";

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { StatusBar } from "react-native";
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { PaperProvider } from 'react-native-paper';
import { Toaster } from 'sonner-native';
import { AuthProvider } from "./src/contexts/AuthContext";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { LoadingScreen } from './src/screens/LoadingScreen';

dayjs.extend(isBetween);

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Esconde o splash screen explicitamente
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <KeyboardProvider>


          <PaperProvider>

            <AuthProvider>
              <RootNavigator />
            </AuthProvider>
          </PaperProvider>
        </KeyboardProvider>
      </BottomSheetModalProvider>
      <StatusBar barStyle={colorScheme === "light" ? "dark-content" : "light-content"} backgroundColor="transparent" translucent />
      <Toaster
        richColors
        theme={
          colorScheme === "dark"
            ? "dark"
            : "light"
        }
      />
    </GestureHandlerRootView>

  );
}

// 1988652104Nlc@
