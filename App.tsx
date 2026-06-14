import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "./global.css";

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { StatusBar } from "react-native";
import { Loading } from './src/components/Loading';
import { AuthProvider } from "./src/contexts/AuthContext";
import { RootNavigator } from "./src/navigation/RootNavigator";



export default function App() {

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
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
      <StatusBar barStyle="default" backgroundColor="transparent" translucent />
    </GestureHandlerRootView>

  );
}

// 1988652104Nlc@
