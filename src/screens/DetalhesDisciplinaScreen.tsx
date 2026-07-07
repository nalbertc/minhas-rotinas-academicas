import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { Calendar, ChevronDown, ChevronLeft, EllipsisVertical } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { Dimensions, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView
} from "react-native-keyboard-controller";
import MaskInput from "react-native-mask-input";
import { useSafeAreaInsets, } from 'react-native-safe-area-context';

import { Button } from "../components/Button";
import { CardAtividade } from '../components/CardAtividade';
import { HORARIO } from '../components/CardDisciplina';
import { Heading } from "../components/Heading";
import { HorarioDisciplina } from '../components/HorarioDisciplina';
import { Input } from "../components/Input";
import { ModalComponent } from '../components/Modal copy';
import { Sheet } from '../components/Sheet';
import { Text } from "../components/Text";
import { deleteDisciplina, Disciplina, getDisciplinaById, updateDisciplina } from '../services/disciplinas';
import { showError, showInfo, showSuccess } from '../utils/toast';
import { formatDatePiker } from './DetalhesAtividadeScreen';
import { LoadingScreen } from './LoadingScreen';
import { RouteProps } from './MenuAtividadeScreen';


export function DetalheDisciplinaScreen() {
  const insets = useSafeAreaInsets();

  const { colorScheme, toggleColorScheme } = useColorScheme();
  const navigation = useNavigation()

  const [nome, setNome] = useState("");
  const [nomeIsValid, setNomeIsValid] = useState(true)
  const [descricao, setDescricao] = useState("");
  const [professor, setProfessor] = useState("");
  const [professorIsValid, setProfessorIsValid] = useState(true);
  const [sala, setSala] = useState("");
  const [salaIsValid, setSalaIsValid] = useState(true);
  const [semestre, setSemestre] = useState("");
  const [semestreIsValid, setSemestreIsValid] = useState(true);
  const [dataInicio, setDateInicio] = useState<Date>();
  const [dataInicioIsValid, setdataInicioIsValid] = useState(true)
  const [dataFim, setDataFim] = useState<Date>();
  const [dataFimIsValid, setdataFimIsValid] = useState(true)
  const [horario, sethoraio] = useState<"matutino" | "vespertino" | "noturno" | "integral" | "">("");
  const [horarioIsValid, setHorarioIsValid] = useState(true)

  const [showTimePikerInicio, setShowInicio] = useState(false);
  const [showTimePikerFim, setShowFim] = useState(false);
  const [isOpenTipo, setIsOpenTipo] = useState(false)

  const [loading, setLoading,] = useState(false);

  function toggleSheetHorario() {
    setIsOpenTipo((prevState) => !prevState)
  }

  const [editar, setEditar] = useState(false)
  const [options, setOptions] = useState(false)

  const route = useRoute<RouteProps>();
  const { id } = route.params

  async function handleUpdate() {
    try {

      const invalid =
        nome === disciplina?.nome &&
        descricao === disciplina.descricao &&
        professor === disciplina.professor &&
        sala === disciplina.sala &&
        dataInicio === disciplina.data_inicio &&
        dataFim === disciplina.data_fim &&
        semestre === disciplina.semestre &&
        horario === disciplina.horario

      if (invalid) {
        showInfo("Altere algum dado para poder editar a atividade")
        return;
      }


      await updateDisciplina(id, {
        nome,
        descricao,
        professor,
        sala,
        data_inicio: dayjs(dataInicio).format("YYYY-MM-DD"),
        data_fim: dayjs(dataFim).format("YYYY-MM-DD"),
        semestre,
        horario,
      });

      showSuccess("Disciplina atualizada com sucesso!");
      setEditar(false)

    } catch (error) {

      console.log(error);

      showError("Erro ao atualizar disciplina.");
    }
  }

  const [disciplina, setDisciplina] = useState<Disciplina | null>();
  const [atualizacaoDisciplina, setAtualizacaoDisciplina] = useState(false);

  const [modalExcluirDisciplina, setExcluirDisciplina] = useState(false);

  async function loadData() {
    setLoading(true);

    const response = await getDisciplinaById(id);


    setDisciplina(response);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [atualizacaoDisciplina]);

  useEffect(() => {
    if (disciplina) {
      setNome(disciplina.nome)
      setDescricao(disciplina.descricao ? disciplina.descricao : "")
      setProfessor(disciplina.professor)
      setSala(disciplina.sala)
      setDateInicio(disciplina.data_inicio)
      setDataFim(disciplina.data_fim)
      setSemestre(disciplina.semestre)
      sethoraio(disciplina.horario)

    }
  }, [disciplina]);

  const DIMENSIONS = Dimensions.get("window")

  const width = (DIMENSIONS.width - 48) / 2

  if (!disciplina) {
    return <LoadingScreen />
  }

  return (
    <View className="flex-1 bg-backgroundLight dark:bg-backgroundDark" style={{ paddingTop: insets.top }}>
      <KeyboardAvoidingView

        style={{
          flex: 1
        }}

        behavior={
          Platform.OS ===
            "ios"
            ?
            "padding"
            :
            "height"
        }

        keyboardVerticalOffset={
          insets.top
        }
      >
        <ScrollView

          contentContainerStyle={{
            flexGrow: 1
          }}

          keyboardShouldPersistTaps="handled"

          showsVerticalScrollIndicator={
            false
          }

        >

          <View className="h-20 items-center justify-between px-4 flex-row">

            <TouchableOpacity className="relative bg-white dark:bg-tabsDark p-2 rounded-lg" activeOpacity={0.7} onPress={() => {
              if (editar) {
                setEditar(false)
              } else {
                navigation.goBack()
              }
            }}>
              <ChevronLeft color={colorScheme === "dark" ? "white" : "black"} />

            </TouchableOpacity>


            <Heading >
              {
                editar ? "Editar disciplina" : "Disciplina"
              }

            </Heading>

            {!editar ? <TouchableOpacity className="relative bg-white dark:bg-tabsDark p-2 rounded-lg" activeOpacity={0.7} onPress={() => setOptions(true)}>
              <EllipsisVertical color={colorScheme === "dark" ? "white" : "black"} />

            </TouchableOpacity> : <View />}

          </View>

          <View className="flex-1 px-4 pb-10 gap-6">
            <View className="flex-1 gap-4">

              <View className="gap-2" >
                <Text>Disciplina</Text>

                <Input
                  value={nome}
                  onChangeText={setNome}
                  invalid={!nomeIsValid}
                  editable={editar}
                />
              </View>

              <View className="gap-2" >
                <Text>Descrição</Text>
                <TextInput
                  multiline
                  numberOfLines={5}
                  value={descricao}
                  onChangeText={setDescricao}
                  textAlignVertical="top"
                  className={clsx(" w-full min-h-16 rounded-2xl px-4 text-base justify-center border  dark:text-gray-300 text-gray-800 border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100")}
                  editable={editar}
                />

              </View>

              <View className="gap-2" >
                <Text>Professor (a)</Text>

                <Input
                  value={professor}
                  onChangeText={setProfessor}
                  invalid={!professorIsValid}
                  editable={editar}
                />
              </View>

              <View className="gap-2" >
                <Text>Sala</Text>

                <Input
                  value={sala}
                  onChangeText={setSala}
                  invalid={!salaIsValid}
                  editable={editar}
                />
              </View>

              <View className="gap-2">
                <Text>Período da disciplina</Text>

                <View className="flex-row gap-2">
                  <TouchableOpacity className={clsx("flex-1 h-12 rounded-2xl px-4 text-base border  dark:text-gray-300 text-gray-800 flex-row items-center justify-between", {
                    "border-red-500 bg-red-50 dark:bg-red-950 ": !dataInicioIsValid,
                    "border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100": dataInicioIsValid,
                  })} onPress={() => {
                    if (editar) {
                      setShowInicio(true)
                    }
                  }
                  } activeOpacity={editar ? 0.5 : 1} >

                    <Text
                      type={dataInicio ? 'primary' : 'secondary'}
                    >
                      {dayjs(dataInicio).format("DD/MM/YYYY")}
                    </Text>

                    {editar &&
                      <Calendar
                        size={20} color={colorScheme === "dark" ? "#fff" : "#000"}
                      />
                    }
                  </TouchableOpacity>

                  <TouchableOpacity className={clsx("flex-1 h-12 rounded-2xl px-4 text-base border  dark:text-gray-300 text-gray-800 flex-row items-center justify-between", {
                    "border-red-500 bg-red-50 dark:bg-red-950 ": !dataFimIsValid,
                    "border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100": dataFimIsValid,
                  })} onPress={() => {
                    if (editar)
                      setShowFim(true)
                  }
                  } activeOpacity={editar ? 0.5 : 1} >

                    <Text
                      type={dataFim ? 'primary' : 'secondary'}
                    >
                      {dayjs(dataFim).format("DD/MM/YYYY")}
                    </Text>

                    {editar &&

                      <Calendar
                        size={20} color={colorScheme === "dark" ? "#fff" : "#000"}
                      />
                    }
                  </TouchableOpacity>

                  {showTimePikerInicio || showTimePikerFim ? (
                    <DateTimePicker
                      value={showTimePikerInicio ? formatDatePiker(dataInicio) : showTimePikerFim ? formatDatePiker(dataFim) : new Date()}
                      mode="date"
                      display="default"
                      onValueChange={(_, selected) => {
                        setShowInicio(false);
                        setShowFim(false);
                        if (selected) {
                          if (showTimePikerInicio)
                            setDateInicio(selected)

                          if (showTimePikerFim)
                            setDataFim(selected);

                        }
                      }} />
                  ) : <></>}
                </View>
              </View>

              <View className="flex-row justify-between gap-2">
                <View className="gap-2 flex-1" >
                  <Text>Semestre</Text>

                  <KeyboardAwareScrollView>

                    <MaskInput
                      value={semestre}
                      onChangeText={setSemestre}
                      placeholder='0000.0'
                      mask={[/\d/, /\d/, /\d/, /\d/, ".", /[1-4]/,]}
                      className={clsx(" w-full h-12 rounded-2xl px-4 text-lg justify-center border  dark:text-gray-300 text-gray-800", {
                        "border-red-500 bg-red-50 dark:bg-red-950 ": !semestreIsValid,
                        "border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100 placeholder:text-gray-400": semestreIsValid,
                      })}
                      editable={editar}
                    />
                  </KeyboardAwareScrollView>
                </View>

                <View className="gap-2" style={{
                  width
                }}>
                  <Text>Horário</Text>

                  <TouchableOpacity className={clsx(" h-12 rounded-2xl px-4 text-base border  dark:text-gray-300 text-gray-800 flex-row items-center justify-between", {
                    "border-red-500 bg-red-50 dark:bg-red-950 ": !horarioIsValid,
                    "border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100": horarioIsValid,
                  })} onPress={() => {
                    if (editar)
                      toggleSheetHorario()
                  }} activeOpacity={editar ? 0.5 : 1} >

                    <Text type={horario ? "primary" : 'secondary'} >
                      {!horario ? 'Tipo' :
                        HORARIO.find(ti => ti.value === horario)?.title
                      }
                    </Text>

                    {editar &&

                      <ChevronDown
                        size={20} color={colorScheme === "dark" ? "#fff" : "#000"}
                      />
                    }
                  </TouchableOpacity>

                </View>
              </View>

              {
                !editar &&

                <View className='gap-2 mt-4'>
                  <Heading size='sm'>Atividades vinculadas</Heading>
                  <View className=''>
                    {
                      disciplina.atividades.map(atv => (
                        <CardAtividade item={atv} key={atv.id} />
                      ))
                    }
                  </View>
                </View>
              }
            </View>


            <View className='gap-4' >
              {
                editar ? <>
                  <Button type='secondary' onPress={() => {
                    setNome(disciplina.nome)
                    setDescricao(disciplina.descricao ? disciplina.descricao : "")
                    setProfessor(disciplina.professor)
                    setSala(disciplina.sala)
                    setDateInicio(disciplina.data_inicio)
                    setDataFim(disciplina.data_fim)
                    setSemestre(disciplina.semestre)
                    sethoraio(disciplina.horario)
                    setEditar(false)
                  }}>Cancelar</Button>

                  <Button onPress={() => {
                    handleUpdate()
                  }}  >Atualizar disciplina</Button>
                </> : <></>
              }
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {options && <Sheet onClose={() => {
        setOptions(false)
      }} title="Opções" content={

        <View className="gap-3">
          <TouchableOpacity className="flex-row justify-between items-center bg-background rounded-2xl px-6 bg-primary/15 h-14 "
            onPress={() => {
              // setTipo(value)
              setEditar(true)
              setOptions(false)
            }}
          >
            <View className="flex-row gap-3">
              <View className='flex-row gap-6'>
                <Text className='font-semibold'>
                  Editar disciplina
                </Text>
              </View>

            </View>

          </TouchableOpacity>

          <TouchableOpacity className="flex-row justify-between items-center bg-background rounded-2xl px-6 bg-primary/15 h-14 "
            onPress={() => {

              setExcluirDisciplina(true)
              // setTipo(value)
              // close()
            }}
          >
            <View className="flex-row gap-3">
              <View className='flex-row gap-6'>


                <Text className='font-semibold'>
                  Excluir disciplina
                </Text>
              </View>

            </View>

          </TouchableOpacity>

          <ModalComponent title='Excluir disciplina' isModalVisible={modalExcluirDisciplina} setModalVisible={setExcluirDisciplina} >
            <Text>Tem certeza que deseja excluir a disciplinas?</Text>
            <Text type='secondary' size='sm'>Todas as atividades vinculadas serão excluídas</Text>

            <View className='flex-row gap-4 mt-6'>
              <View className='flex-1'>
                <Button onPress={() => setExcluirDisciplina(false)} type='secondary'>Cancelar</Button>
              </View>
              <View className='flex-1'>
                <Button type='delete' onPress={async () => {

                  setExcluirDisciplina(false)
                  try {
                    await deleteDisciplina(id);
                    setAtualizacaoDisciplina(!atualizacaoDisciplina)

                    showSuccess("Disciplina excluída com sucesso!");
                    navigation.goBack();
                  } catch (error) {
                    console.error(error);
                    showError("Não foi possível excluir a disciplina.");
                  }

                }} >Confirmar</Button>
              </View>
            </View>
          </ModalComponent>
        </View>
      } />}

      {isOpenTipo && <Sheet title='Horário da disciplina' onClose={toggleSheetHorario} content={
        <HorarioDisciplina tipoSelected={horario} setTipo={sethoraio} onClose={toggleSheetHorario} />
      } />}
    </View>
  );
}

