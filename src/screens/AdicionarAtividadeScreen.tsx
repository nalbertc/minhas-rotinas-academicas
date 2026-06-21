import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import clsx from 'clsx';
import { Calendar, ChevronDown, ChevronLeft } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { Alert, Dimensions, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { Input } from "../components/Input";
import { ModalComponent } from '../components/Modal';
import { PRIORIDADE, PrioridadeAtividade } from '../components/PrioridadeAtividade';
import { Sheet } from '../components/Sheet';
import { STATUS, StatusAtividade } from '../components/StatusAtividade';
import { Text } from "../components/Text";
import { TipoAtividade, TIPOS } from '../components/TipoAtividade';
import { createAtividade } from '../services/atividades';
import { Disciplina } from '../services/disciplinas';

export function formatDate(value?: Date) {
  if (!value)
    return 'Data';

  return value.toLocaleDateString('pt-BR');
}

export function formatDateToDB(
  date: Date
) {
  return date
    .toISOString()
    .split("T")[0];
}

export function AdicionarAtividadeScreen() {
  const insets = useSafeAreaInsets();

  const { colorScheme, toggleColorScheme } = useColorScheme();
  const navigation = useNavigation()

  const [titulo, setTitulo] = useState("");
  const [tituloIsValid, setTituloIsValid] = useState(true)
  const [descricao, setDescricao] = useState("");
  const [date, setDate] = useState<Date>();
  const [dateIsValid, setDateIsValid] = useState(true)
  const [prioridade, setPrioridade] = useState<"alta" | "media" | "baixa" | "">("");
  const [prioridadeIsValid, setPrioridadeIsValid] = useState(true)
  const [disciplina, setDisciplina] = useState<Disciplina>({} as Disciplina)
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

  const [showTimePiker, setShow] = useState(false);
  const [isModalVisibleModal, setModalVisibleModal] = useState(false);
  const [isOpenTipo, setIsOpenTipo] = useState(false)
  const [isOpenPrioridade, setIsOpenPrioridade] = useState(false)
  const [isOpenStatus, setIsOpenStatus] = useState(false)

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

  async function handleCreate() {
    try {

      const invalid =
        !titulo ||
        !date ||
        !prioridade ||
        !tipo ||
        !disciplina?.id;

      if (
        invalid
      ) {

        setTituloIsValid(
          !!titulo
        );

        setDateIsValid(
          !!date
        );

        setPrioridadeIsValid(
          !!prioridade
        );

        setTipoIsValid(
          !!tipo
        );

        setDisciplinaIsValid(
          !!disciplina?.id
        );

        Alert.alert(
          "Campos obrigatórios",
          "Preencha todos os campos."
        );

        return;
      }

      await createAtividade({

        titulo,

        descricao,

        status,

        prioridade,

        tipo,

        data_entrega:
          formatDateToDB(date),

        disciplina_id:
          disciplina.id,
      });

      Alert.alert(
        "Sucesso",

        "Atividade criada com sucesso!",

        [
          {
            text:
              "OK",

            onPress:
              () =>
                navigation.navigate("Atividade"),
          },
        ]
      );

    } catch (
    error
    ) {

      console.log("Erro",
        error
      );

      Alert.alert(
        "Erro",
        "Não foi possível criar a atividade."
      );
    }
  }



  const DIMENSIONS = Dimensions.get("window")

  const width = (DIMENSIONS.width - 48) / 2

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

          <View className="h-20 items-center justify-between px-6 flex-row">
            <View className="w-1/6 items-start" >
              <TouchableOpacity className="relative bg-white dark:bg-tabsDark p-2 rounded-lg" activeOpacity={0.7} onPress={() => navigation.goBack()}>
                <ChevronLeft color={colorScheme === "dark" ? "white" : "black"} />

              </TouchableOpacity>
            </View>

            <Heading >
              Nova Atividade
            </Heading>

            <View className="w-1/6 " />

          </View>

          <View className="flex-1 px-6 mb-6">
            <View className="flex-1 gap-4">

              <View className="gap-2" >
                <Text>Título da atividade</Text>

                <Input
                  value={titulo}
                  onChangeText={setTitulo}
                  invalid={!tituloIsValid}
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
                />

              </View>

              <View className="gap-2">
                <Text>Entrega do trabalho</Text>

                <View className="flex-row gap-2">
                  <TouchableOpacity className={clsx("flex-1 h-12 rounded-2xl px-4 text-base border  dark:text-gray-300 text-gray-800 flex-row items-center justify-between", {
                    "border-red-500 bg-red-50 dark:bg-red-950 ": !dateIsValid,
                    "border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100": dateIsValid,
                  })} onPress={() =>
                    setShow(
                      true
                    )
                  }>

                    <Text
                      type={
                        date
                          ? 'primary'
                          : 'secondary'
                      }
                    >
                      {formatDate(date)}
                    </Text>

                    <Calendar
                      size={20} color={colorScheme === "dark" ? "#fff" : "#000"}
                    />
                  </TouchableOpacity>

                  {showTimePiker && (
                    <DateTimePicker
                      value={date ?? new Date()}
                      mode="date"
                      display="default"
                      onValueChange={(_, selected) => {
                        setShow(false);
                        if (selected) {
                          setDate(selected);
                        }
                      }} />
                  )}

                  <TouchableOpacity
                    style={{ width: width }}
                    className={clsx("h-12 rounded-2xl px-4 text-base border  dark:text-gray-300 text-gray-800 flex-row items-center justify-between", {
                      "border-red-500 bg-red-50 dark:bg-red-950 ": !prioridadeIsValid,
                      "border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100": prioridadeIsValid,
                    })} onPress={toggleSheetPrioridade}>

                    <Text type={prioridade ? "primary" : 'secondary'} >
                      {!prioridade ? 'Prioridade' : PRIORIDADE.find(pri => pri.value === prioridade)?.title}
                    </Text>

                    <ChevronDown
                      size={20} color={colorScheme === "dark" ? "#fff" : "#000"}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="gap-2">
                <Text>Caracteristicas do trabalho</Text>

                <View className="flex-row justify-between gap-2">
                  <TouchableOpacity className={clsx("flex-1 h-12 rounded-2xl px-4 text-base border  dark:text-gray-300 text-gray-800 flex-row items-center justify-between border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100")}

                    onPress={toggleSheetStatus}

                  >
                    <Text type={status ? 'primary' : 'secondary'}>
                      {STATUS.find(st => st.value === status)?.title}
                    </Text>

                  </TouchableOpacity>

                  <TouchableOpacity className={clsx("flex-1 h-12 rounded-2xl px-4 text-base border  dark:text-gray-300 text-gray-800 flex-row items-center justify-between", {
                    "border-red-500 bg-red-50 dark:bg-red-950 ": !tipoIsValid,
                    "border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100": tipoIsValid,
                  })} onPress={toggleSheetTipo}>

                    <Text type={tipo ? "primary" : 'secondary'} >
                      {!tipo ? 'Tipo' :
                        TIPOS.find(ti => ti.value === tipo)?.title
                      }
                    </Text>

                    <ChevronDown
                      size={20} color={colorScheme === "dark" ? "#fff" : "#000"}
                    />
                  </TouchableOpacity>
                </View>

                <View className="flex-row justify-between gap-2">
                  <TouchableOpacity className={clsx("flex-1 h-12 rounded-2xl px-4 text-base border  dark:text-gray-300 text-gray-800 flex-row items-center justify-between", {
                    "border-red-500 bg-red-50 dark:bg-red-950 ": !disciplinaIsValid,
                    "border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100": disciplinaIsValid,
                  })} onPress={toggleModal}>

                    <Text type={disciplina ? 'primary' : 'secondary'}>
                      {!disciplina ? "Selecione a disciplina" : disciplina.nome}
                    </Text>

                  </TouchableOpacity>
                </View>
              </View>

              <ModalComponent disciplina={disciplina} setDisciplina={setDisciplina} isModalVisible={isModalVisibleModal} setModalVisible={setModalVisibleModal} />
            </View>

            <Button onPress={() => {
              setTituloIsValid(titulo === "" ? false : true)
              setDateIsValid(date ? true : false)
              setPrioridadeIsValid(prioridade === "" ? false : true)
              setTipoIsValid(tipo === "" ? false : true)
              setDisciplinaIsValid(!disciplina.id ? false : true)

              handleCreate()

            }}  >Salvar Atividade</Button>
          </View>

          {isOpenTipo && <Sheet title='Tipo da atividade' onClose={toggleSheetTipo} content={
            <TipoAtividade tipoSelected={tipo} setTipo={setTipo} onClose={toggleSheetTipo} />
          } />}

          {isOpenPrioridade && <Sheet title='Prioridade da atividade' onClose={toggleSheetPrioridade} content={
            <PrioridadeAtividade tipoSelected={prioridade} setTipo={setPrioridade} onClose={toggleSheetPrioridade} />
          } />}

          {isOpenStatus && <Sheet title='Status da atividade' onClose={toggleSheetStatus} content={
            <StatusAtividade statusSelected={status} setStatus={setStatus} onClose={toggleSheetStatus} />
          } />}


        </ScrollView></KeyboardAvoidingView>
    </View>
  );
}

