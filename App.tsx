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
import { useColorScheme } from 'nativewind';
import { StatusBar } from "react-native";
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { PaperProvider } from 'react-native-paper';
import { Loading } from './src/components/Loading';
import { AuthProvider } from "./src/contexts/AuthContext";
import { RootNavigator } from "./src/navigation/RootNavigator";



export default function App() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <Loading />;
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
    </GestureHandlerRootView>

  );
}

// 1988652104Nlc@
