import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, Text as TextReact, TouchableOpacity, View } from 'react-native';

import { ChevronLeft } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heading } from '../components/Heading';
import { AuthStackParamList } from '../types/navigationtypes';

import clsx from 'clsx';
import { useWindowDimensions, } from 'react-native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Text } from '../components/Text';
import { supabase } from '../libs/supabase';
import { showError, showSuccess } from '../utils/toast';

type NavigationProps = NativeStackNavigationProp<AuthStackParamList>;

export function RegisterScreen() {
  const navigation = useNavigation<NavigationProps>();

  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [loading, setLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState(1)
  const insets = useSafeAreaInsets();

  const { width, height, } = useWindowDimensions();

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [curso, setCurso] = useState("")
  const [matricula, setMatricula] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmSenha, setConfirmSenha] = useState("")

  const [nomeInvalid, setNomeInvalid] = useState(false)
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [cursoInvalid, setCursoInvalid] = useState(false)
  const [matriculaInvalid, setMatriculaInvalid] = useState(false)
  const [senhaInvalid, setSenhaInvalid] = useState(false)
  const [confirmSenhaInvalid, setConfirmSenhaInvalid] = useState(false)

  const terca = width - 32
  const tercaCard = (terca - 16) / 3

  async function handleRegister() {
    try {
      setLoading(true);

      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email:
            email
              .trim()
              .toLowerCase(),

          password:
            senha,
          options: {
            data: {
              nome,
            },
          },
        });

      if (authError) {

        showError(authError.message)

        return;
      }

      if (!authData.user) {
        showError('Usuário não criado')

        return;
      }

      // cria perfil
      const { error: profileError } =
        await supabase
          .from('user')
          .upsert(
            {
              id: authData.user.id,
              nome,
              email,
              curso,
              matricula,
            },
            {
              onConflict: 'id',
            }
          );

      if (profileError) {
        Alert.alert('Erro', profileError.message);

        return;
      }

      showSuccess('Conta criada. Faça login para continuar.')
    } catch (error) {
      console.log(error);
      showError('Não foi possível cadastrar')
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-backgroundLight dark:bg-backgroundDark" style={{ paddingTop: insets.top }}>

      <View className='h-20 items-center flex-row justify-between px-4'>
        <View className='w-1/6 h-full justify-center'>
          <TouchableOpacity
            className='px-1'
            onPress={() => {
              navigation.goBack()
            }}

          >
            <ChevronLeft size={32} color={colorScheme === "dark" ? "#fff" : "#000"} />
          </TouchableOpacity>

        </View>

        <Heading size='lg'>Cadastro</Heading>

        <View className='w-1/6 h-full'></View>
      </View>

      <View className='items-center flex-1'>

        <View className='gap-2 flex-row w-full justify-between pb-6' style={{
          width: terca
        }}>

          <View className='items-center' style={{
            width: tercaCard
          }}>
            <TextReact className={clsx('font-regular', {
              "text-primary ": currentStep === 1,
              "dark:text-gray-600 text-gray-400": currentStep !== 1,
            })} numberOfLines={1}
              style={{
                flexShrink: 1
              }}>Dados pessoais</TextReact>
            <View className={clsx('h-2 rounded-full w-full', {
              "bg-primary": currentStep === 1,
              "dark:bg-gray-600 bg-gray-400": currentStep !== 1,
            })}></View>
          </View>

          <View className='items-center' style={{
            width: tercaCard
          }}>
            <TextReact className={clsx('font-regular', {
              "text-primary ": currentStep === 2,
              "dark:text-gray-600 text-gray-400": currentStep !== 2,
            })} numberOfLines={1}
              style={{
                flexShrink: 1
              }}>Dados acadêmicos</TextReact>


            <View className={clsx('h-2 rounded-full w-full', {
              "bg-primary": currentStep === 2,
              "dark:bg-gray-600 bg-gray-400": currentStep !== 2,
            })}></View>
          </View>

          <View className='items-center' style={{
            width: tercaCard
          }}>
            <TextReact className={clsx('font-regular', {
              "text-primary ": currentStep === 3,
              "dark:text-gray-600 text-gray-400": currentStep !== 3,
            })}>Senha</TextReact>
            <View className={clsx('h-2 rounded-full w-full', {
              "bg-primary": currentStep === 3,
              "dark:bg-gray-600 bg-gray-400": currentStep !== 3,
            })}></View>
          </View>


        </View>

        <View className='bg-white dark:bg-cardDark w-full rounded-t-2xl px-4 justify-between flex-1 pb-10 py-4'>
          <View className=''>

            {
              currentStep === 1 ?
                <View className='gap-6'>

                  <Heading>Informe seus dados pessoais</Heading>

                  <View className='gap-4'>

                    <View className='gap-2'>
                      <Text>Nome completo</Text>
                      <Input value={nome}
                        invalid={nomeInvalid}
                        onChangeText={setNome} />
                    </View>

                    <View className='gap-2'>
                      <Text>E-mail</Text>
                      <Input value={email}
                        invalid={emailInvalid}
                        onChangeText={setEmail}
                      />
                    </View>
                  </View>

                </View>
                : <></>
            }

            {
              currentStep === 2 ?
                <View className='gap-6'>

                  <Heading>Informe seus dados acadêmicos</Heading>

                  <View className='gap-4'>

                    <View className='gap-2'>
                      <Text>Curso</Text>
                      <Input value={curso}
                        invalid={cursoInvalid}
                        onChangeText={setCurso} />
                    </View>

                    <View className='gap-2'>
                      <Text>Matrícula</Text>
                      <Input value={matricula} invalid={matriculaInvalid} onChangeText={setMatricula} />
                    </View>
                  </View>

                </View>
                : <></>
            }

            {
              currentStep === 3 ?
                <View className='gap-6'>

                  <Heading>Cadastre sua senha</Heading>

                  <View className='gap-4'>

                    <View className='gap-2'>
                      <Text>Senha</Text>
                      <Input value={senha} invalid={senhaInvalid} onChangeText={setSenha} />
                    </View>

                    <View className='gap-2'>
                      <Text>Confirme sua senha</Text>
                      <Input value={confirmSenha} invalid={confirmSenhaInvalid} onChangeText={setConfirmSenha} />
                    </View>
                  </View>

                </View>
                : <></>
            }

          </View>


          <View className='items-center gap-4'>

            {
              currentStep !== 1 && <Button type='secondary'
                onPress={() => setCurrentStep(currentStep - 1)}
              >Voltar</Button>
            }


            <Button onPress={() => {




              if (currentStep === 1) {

                if (nome === "" || email === "") {
                  setNomeInvalid(nome === "" ? true : false)
                  setEmailInvalid(email === "" ? true : false)
                } else {
                  setNomeInvalid(false)
                  setEmailInvalid(false)

                  setCurrentStep(2)
                }
              }

              if (currentStep === 2) {
                if (curso === "" || matricula === "") {
                  setMatriculaInvalid(matricula === "" ? true : false)
                  setCursoInvalid(curso === "" ? true : false)
                } else {
                  setMatriculaInvalid(false)
                  setCursoInvalid(false)

                  setCurrentStep(3)
                }
              }

              if (currentStep === 3) {
                if (senha === "" || confirmSenha === "") {
                  setSenhaInvalid(senha === "" ? true : false)
                  setConfirmSenhaInvalid(confirmSenha === "" ? true : false)
                } else {
                  if (senha !== confirmSenha) {
                    setSenhaInvalid(true)
                    setConfirmSenhaInvalid(true)

                  } else {



                    setSenhaInvalid(false)
                    setConfirmSenhaInvalid(false)





                    handleRegister()
                  }
                }
              }
            }}>{currentStep === 3 ? "Cadastrar" : "Avançar"}</Button>

            <Text size='sm' type='secondary'
              className=""
              onPress={() => {
                navigation.navigate('Login')

              }}>
              Já possui conta? Ir para login
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
