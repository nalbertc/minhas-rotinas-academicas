import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import clsx from 'clsx';
import { Calendar, ChevronDown, ChevronLeft, EllipsisVertical } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { Dimensions, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import dayjs from 'dayjs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { Input } from "../components/Input";
import { ModalComponent } from '../components/Modal copy';
import { PRIORIDADE, PrioridadeAtividade } from '../components/PrioridadeAtividade';
import { Sheet } from '../components/Sheet';
import { STATUS, StatusAtividade } from '../components/StatusAtividade';
import { Text } from "../components/Text";
import { TipoAtividade, TIPOS } from '../components/TipoAtividade';
import { Atividade, deleteAtividade, getAtividadeById, updateAtividade } from '../services/atividades';
import { Disciplina, getDisciplinas } from '../services/disciplinas';
import { showError, showInfo, showSuccess } from '../utils/toast';
import { LoadingScreen } from './LoadingScreen';
import { RouteProps } from './MenuAtividadeScreen';

export function formatDateForce(value: Date) {
  if (!value) return new Date().toISOString().split("T")[0];

  const ano = value.getFullYear();
  const mes = String(value.getMonth() + 1).padStart(2, '0');
  const dia = String(value.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}


export function formatDatePiker(value?: Date | string | null): Date {
  if (!value) return new Date();
  const dataInstancia = dayjs(value);

  return dataInstancia.isValid() ? dataInstancia.toDate() : new Date();
}

export function DetalhesAtividadeScreen() {
  const insets = useSafeAreaInsets();

  const { colorScheme, toggleColorScheme } = useColorScheme();
  const navigation = useNavigation()
  const route = useRoute<RouteProps>();
  const { id } = route.params

  const [titulo, setTitulo] = useState("");
  const [tituloIsValid, setTituloIsValid] = useState(true)
  const [descricao, setDescricao] = useState<string | undefined>("");
  const [descricaoIsValide, setDescricaoIsValide] = useState(true);
  const [date, setDate] = useState<Date>();
  const [dateIsValid, setDateIsValid] = useState(true)
  const [prioridade, setPrioridade] = useState<"alta" | "media" | "baixa" | "">("");
  const [prioridadeIsValid, setPrioridadeIsValid] = useState(true)
  // const [disciplina, setDisciplina] = useState<Disciplina>({} as Disciplina)
  const [disciplinaIsValid, setDisciplinaIsValid] = useState(true)
  const [status, setStatus] = useState<"pendente" | "em_andamento" | "concluida" | "atrasada">("pendente")

  const [tipo, setTipo] = useState<"prova"
    | "trabalho"
    | "seminario"
    | "lista_exercicios"
    | "relatorio"
    | "projeto"
    | "leitura"
    | "outro" | "">("");
  const [tipoIsValid, setTipoIsValid] = useState(true)

  const [showTimePiker, setShowTimePiker] = useState(false);
  const [isModalVisibleModal, setModalVisibleModal] = useState(false);
  const [isOpenTipo, setIsOpenTipo] = useState(false)
  const [isOpenPrioridade, setIsOpenPrioridade] = useState(false)
  const [isOpenStatus, setIsOpenStatus] = useState(false)
  const [modalExcluirAtividade, setExcluirAtividade] = useState(false);
  const [atualizacaoAtividade, setAtualizacaoAtividade] = useState(false);

  function toggleSheetTipo() {
    setIsOpenTipo((prevState) => !prevState)
  }

  function toggleSheetPrioridade() {
    setIsOpenPrioridade((prevState) => !prevState)
  }

  function toggleSheetStatus() {
    setIsOpenStatus((prevState) => !prevState)
  }

  const toggleModal = () => {
    setModalVisibleModal(!isModalVisibleModal);
  };

  async function handleUpdate() {
    console.log(atividade?.data_entrega)
    console.log(date)

    try {
      const invalid = titulo === atividade?.titulo && descricao === atividade.descricao && disciplina === atividade?.disciplina && date === atividade.data_entrega && prioridade === atividade.prioridade && status === atividade.status && tipo === atividade.tipo;

      if (invalid) {
        showInfo("Altere algum dado para poder editar a atividade")
        return;
      }

      await updateAtividade(id, {
        titulo,
        descricao,
        disciplina_id: disciplina.id,
        data_entrega: dayjs(date).format("YYYY-MM-DD"),
        prioridade,
        status,
        tipo
      });

      showSuccess("Atividade atualizada com sucesso")
      setEditar(false)
    } catch (error) {
      console.log("Erro", error);
      showError("Erro ao atualizar atividade")
    }
  }

  const [editar, setEditar] = useState(false)
  const [options, setOptions] = useState(false)

  const [disciplinas, setDisciplinas,] = useState<Disciplina[]>([]);
  const [atividade, setAtividade] = useState<Atividade | null>();
  const [disciplina, setDisciplina] = useState<{
    id: string;
    nome: string;
  }>(atividade?.disciplina as {
    id: string;
    nome: string;
  })

  const [searchDisciplinas, setSearchDisciplinas,] = useState("");
  const [loading, setLoading,] = useState(false);

  const filteredDisciplinas = searchDisciplinas.trim().length > 0 ? disciplinas.filter(disc => disc.nome.toLocaleLowerCase().includes(searchDisciplinas.toLowerCase())) : []

  async function loadData() {
    setLoading(true);

    const response = await getDisciplinas();
    const responseAtividade = await getAtividadeById(id);

    setDisciplinas(response);
    setAtividade(responseAtividade);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [atualizacaoAtividade]);

  useEffect(() => {
    if (atividade) {
      setTitulo(atividade.titulo);
      setDescricao(atividade.descricao)
      setDisciplina(atividade.disciplina)
      setDate(atividade.data_entrega)
      setPrioridade(atividade.prioridade)
      setTipo(atividade.tipo)
      setStatus(atividade.status)

    }
  }, [atividade]);

  const DIMENSIONS = Dimensions.get("window")

  const width = (DIMENSIONS.width - 48) / 2
  const MAX_HEIGHT =
    DIMENSIONS.height
    * 0.6;

  if (!atividade) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <View className="flex-1 bg-backgroundLight dark:bg-backgroundDark" style={{ paddingTop: insets.top }}>

      <KeyboardAvoidingView
        style={{
          flex: 1
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          <View className="h-16 items-center justify-between px-4 flex-row">
            <View className=" items-start" >
              <TouchableOpacity className="relative bg-white dark:bg-tabsDark p-2 rounded-lg" activeOpacity={0.7} onPress={() => {
                if (editar) {
                  setEditar(false)
                } else {
                  navigation.goBack()
                }
              }}>
                <ChevronLeft color={colorScheme === "dark" ? "white" : "black"} />

              </TouchableOpacity>
            </View>

            <Heading >
              {
                editar ?
                  "Editar Atividade" : "Atividade"
              }
            </Heading>

            {
              !editar ?
                <TouchableOpacity className="relative bg-white dark:bg-tabsDark p-2 rounded-lg" activeOpacity={0.7} onPress={() => setOptions(true)}>
                  <EllipsisVertical color={colorScheme === "dark" ? "white" : "black"} />

                </TouchableOpacity> : <View />
            }

          </View>

          <View className="flex-1 px-4 mb-6">
            <View className="flex-1 gap-4">

              <View className="gap-2" >
                <Text>Título da atividade</Text>

                <Input
                  value={titulo}
                  onChangeText={setTitulo}
                  invalid={!tituloIsValid}
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
                  editable={editar}
                  className={clsx(" w-full min-h-16 rounded-2xl px-4 text-lg justify-center border  dark:text-gray-300 text-gray-800 border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100")}
                />

              </View>
              <View className="flex justify-between gap-2">
                <Text>Disciplina</Text>
                <TouchableOpacity className={clsx(" h-12 rounded-2xl px-4 text-base border  dark:text-gray-300 text-gray-800 flex-row items-center justify-between", {
                  "border-red-500 bg-red-50 dark:bg-red-950 ": !disciplinaIsValid,
                  "border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100": disciplinaIsValid,
                })} onPress={() => {
                  if (editar) {
                    toggleModal()
                  } else {

                  }
                }} activeOpacity={editar ? 0.5 : 1} >

                  <Text type={disciplina ? 'primary' : 'secondary'}>
                    {!disciplina ? "Selecione a disciplina" : disciplina.nome}
                  </Text>

                </TouchableOpacity>
              </View>

              <View className="flex-row gap-2">
                <View className="flex-1 gap-2">
                  <Text>Data de entrega</Text>

                  <TouchableOpacity className={clsx("flex-1 h-12 rounded-2xl px-4 text-base border  dark:text-gray-300 text-gray-800 flex-row items-center justify-between", {
                    "border-red-500 bg-red-50 dark:bg-red-950 ": !dateIsValid,
                    "border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100": dateIsValid,
                  })} onPress={() => {
                    if (editar) {
                      setShowTimePiker(true)
                    }
                  }
                  } activeOpacity={editar ? 0.5 : 1} >

                    <Text
                      type={
                        date
                          ? 'primary'
                          : 'secondary'
                      }
                    >
                      {/* {date ? formatDateToDB(date) : "Data"} */}
                      {dayjs(date).format("DD/MM/YYYY")}

                    </Text>

                    {
                      editar &&

                      <Calendar
                        size={20} color={colorScheme === "dark" ? "#fff" : "#000"}
                      />
                    }
                  </TouchableOpacity>

                  {showTimePiker && (
                    <DateTimePicker
                      value={formatDatePiker(date)}
                      mode="date"
                      display="default"
                      onValueChange={(_, selected) => {
                        setShowTimePiker(false);
                        if (selected) {
                          setDate(selected);
                        }
                      }} />
                  )}

                </View>
                <View className='flex-1 gap-2'>
                  <Text>Prioridade</Text>

                  <TouchableOpacity
                    style={{ width: width }}
                    className={clsx("h-12 rounded-2xl px-4 text-base border  dark:text-gray-300 text-gray-800 flex-row items-center justify-between", {
                      "border-red-500 bg-red-50 dark:bg-red-950 ": !prioridadeIsValid,
                      "border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100": prioridadeIsValid,
                    })} onPress={() => {
                      if (editar) {

                        toggleSheetPrioridade()
                      }
                    }} activeOpacity={editar ? 0.5 : 1}>

                    <Text type={prioridade ? "primary" : 'secondary'} >
                      {!prioridade ? 'Prioridade' : PRIORIDADE.find(pri => pri.value === prioridade)?.title}
                    </Text>

                    {
                      editar &&

                      <ChevronDown
                        size={20} color={colorScheme === "dark" ? "#fff" : "#000"}
                      />
                    }
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row  gap-2">

                <View className='flex-1 gap-2'>
                  <Text>Status</Text>
                  <TouchableOpacity className={clsx("h-12 rounded-2xl px-4 text-base border  dark:text-gray-300 text-gray-800 flex-row items-center justify-between border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100")}
                    onPress={() => {
                      toggleSheetStatus()
                    }}
                    activeOpacity={editar ? 0.5 : 1}
                  >
                    <Text type={status ? 'primary' : 'secondary'}>
                      {STATUS.find(st => st.value === status)?.title}
                    </Text>


                    <ChevronDown
                      size={20} color={colorScheme === "dark" ? "#fff" : "#000"}
                    />

                  </TouchableOpacity>
                </View>
                <View className='flex-1 gap-2'>
                  <Text>Tipo</Text>
                  <TouchableOpacity className={clsx("h-12 rounded-2xl px-4 text-base border  dark:text-gray-300 text-gray-800 flex-row items-center justify-between", {
                    "border-red-500 bg-red-50 dark:bg-red-950 ": !tipoIsValid,
                    "border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100": tipoIsValid,
                  })} onPress={() => {
                    if (editar) {
                      toggleSheetTipo()
                    }
                  }} activeOpacity={editar ? 0.5 : 1}>

                    <Text type={tipo ? "primary" : 'secondary'} >
                      {!tipo ? 'Tipo' :
                        TIPOS.find(ti => ti.value === tipo)?.title
                      }
                    </Text>

                    {
                      editar &&
                      <ChevronDown
                        size={20} color={colorScheme === "dark" ? "#fff" : "#000"}
                      />}
                  </TouchableOpacity>
                </View>
              </View>

              <ModalComponent showClose isModalVisible={isModalVisibleModal} setModalVisible={setModalVisibleModal} title='Selecione a disciplina' >
                <View className='gap-4'>
                  <Input placeholder='Buscar disciplina...'
                    value={searchDisciplinas}
                    onChangeText={setSearchDisciplinas} />

                  <ScrollView style={{

                    maxHeight: MAX_HEIGHT
                  }} >

                    <View className='gap-2'>

                      {searchDisciplinas.length > 0 ?
                        filteredDisciplinas.map((disc) => (

                          <TouchableOpacity key={disc.id} className="min-h-12 flex-row justify-between items-center bg-background rounded-2xl px-2 bg-primary/15 py-1"
                            onPress={() => {
                              setDisciplina(disc)
                              setModalVisibleModal(false)

                            }}
                          >
                            <View className="flex-row gap-3">
                              <View className='flex-row gap-6'>
                                <Text className=''>
                                  {disc.nome}
                                </Text>
                              </View>

                            </View>
                          </TouchableOpacity>))
                        :
                        disciplinas.map((disc) => (
                          <TouchableOpacity key={disc.id} className="min-h-12 flex-row justify-between items-center bg-background rounded-2xl px-2 bg-primary/15 py-1"
                            onPress={() => {
                              setModalVisibleModal(false)
                              setDisciplina(disc)
                            }}
                          >
                            <View className="flex-row gap-3">
                              <View className='flex-row gap-6'>
                                <Text className=''>
                                  {disc.nome}
                                </Text>
                              </View>

                            </View>
                          </TouchableOpacity>))
                      }
                    </View>
                  </ScrollView>
                </View>
              </ModalComponent>
            </View>

            <View className='gap-4 mb-4'>
              {editar || status !== atividade.status ? <>
                <Button type='secondary' onPress={() => {
                  setTitulo(atividade.titulo)
                  setDescricao(atividade.descricao)
                  setDisciplina(atividade.disciplina)
                  setDate(atividade.data_entrega)
                  setPrioridade(atividade.prioridade)
                  setStatus(atividade.status)
                  setTipo(atividade.tipo)
                  setEditar(false)
                }}>Cancelar</Button>

                <Button onPress={() => {
                  handleUpdate()
                }}  >Atualizar Atividade</Button>
              </> : <></>
              }
            </View>
          </View>

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
                      Editar atividade
                    </Text>
                  </View>

                </View>

              </TouchableOpacity>

              <TouchableOpacity className="flex-row justify-between items-center bg-background rounded-2xl px-6 bg-primary/15 h-14 "
                onPress={() => {

                  setExcluirAtividade(true)
                  // setTipo(value)
                  // close()
                }}
              >
                <View className="flex-row gap-3">
                  <View className='flex-row gap-6'>


                    <Text className='font-semibold'>
                      Excluir atividade
                    </Text>
                  </View>

                </View>

              </TouchableOpacity>

              <ModalComponent title='Excluir atividade' isModalVisible={modalExcluirAtividade} setModalVisible={setExcluirAtividade} >
                <Text>Tem certeza que deseja excluir a atividade?</Text>

                <View className='flex-row gap-4 mt-6'>
                  <View className='flex-1'>
                    <Button onPress={() => setExcluirAtividade(false)} type='secondary'>Cancelar</Button>
                  </View>
                  <View className='flex-1'>
                    <Button type='delete' onPress={async () => {

                      setExcluirAtividade(false)
                      try {
                        await deleteAtividade(id);
                        setAtualizacaoAtividade(!atualizacaoAtividade)

                        showSuccess("Atividade excluída com sucesso!");
                        navigation.goBack();
                      } catch (error) {
                        console.error(error);
                        showError("Não foi possível excluir a atividade.");
                      }

                    }} >Confirmar</Button>
                  </View>
                </View>
              </ModalComponent>
            </View>
          } />}

          {isOpenTipo && <Sheet title='Tipo da atividade' onClose={toggleSheetTipo} content={
            <TipoAtividade tipoSelected={tipo} setTipo={setTipo} onClose={toggleSheetTipo} />
          } />}

          {isOpenPrioridade && <Sheet title='Prioridade da atividade' onClose={toggleSheetPrioridade} content={
            <PrioridadeAtividade tipoSelected={prioridade} setTipo={setPrioridade} onClose={toggleSheetPrioridade} />
          } />}

          {isOpenStatus && <Sheet title='Status da atividade' onClose={toggleSheetStatus} content={
            <StatusAtividade statusSelected={status} setStatus={setStatus} onClose={toggleSheetStatus} />
          } />}

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

