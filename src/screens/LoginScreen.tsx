import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Text as TextComp, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Heading } from '../components/Heading';
import { Input } from '../components/Input';
import { Logo } from '../components/Logo';
import { Text } from '../components/Text';
import { supabase } from '../libs/supabase';
import { AuthStackParamList } from '../types/navigationtypes';
import { showError, showSuccess } from '../utils/toast';

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

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showError(error.message)
        console.log(error)
        return;
      }

      showSuccess("Bem vindo, login realizado")
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-backgroundLight dark:bg-backgroundDark" style={{ paddingTop: insets.top }}>

      <View className='h-1/3 items-center  px-4 justify-center gap-4'>


        <Logo height={80} />
        <View className='items-center '>

          <TextComp className='text-primary font-semibold text-3xl' >Minhas rotinas


          </TextComp>
          <TextComp className='text-primary font-semibold text-3xl' >
            Acadêmicas
          </TextComp>
        </View>


      </View>


      <View className='bg-white dark:bg-cardDark w-full rounded-t-2xl px-4 justify-between flex-1 pb-10  pt-6'>
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

        <View className="items-center mt-2">
          <Button onPress={handleLogin}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          <Text size='sm' type='secondary'
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



