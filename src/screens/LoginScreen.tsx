import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Heading } from '../components/Heading';
import { Input } from '../components/Input';
import { Text } from '../components/Text';
import { supabase } from '../libs/supabase';
import { AuthStackParamList } from '../types/navigationtypes';

type NavigationProps =
  NativeStackNavigationProp<AuthStackParamList>;

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProps>();

  const insets = useSafeAreaInsets();

  async function handleLogin() {
    try {
      setLoading(true);


      console.log(email, password)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Erro', error.message);
        console.log(error)
        return;
      }

      Alert.alert('Sucesso', 'Login realizado!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-backgroundLight dark:bg-backgroundDark" style={{ paddingTop: insets.top }}>

      <View className='h-1/3 items-center flex-row px-6 justify-center'>


        <Heading size='lg'>Cadastr</Heading>


      </View>


      <View className='bg-white dark:bg-cardDark w-full rounded-t-2xl px-6 justify-between flex-1 pb-10  pt-6'>


        <View className='gap-6'>
          <Heading>Faça seu login</Heading>

          <View className="gap-4">
            <View className="gap-2">
              <Text>E-mail</Text>
              <Input
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="gap-2">
              <Text>Senha</Text>
              <Input
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>
        </View>

        <View className="items-center ">
          <Button onPress={handleLogin}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          <Text type='secondary'
            className="mt-4"
            onPress={() => {
              navigation.navigate('Register')

            }}>
            Não possui conta? Criar uma agora mesmo
          </Text>
        </View>
      </View>
    </View>
  );
}



