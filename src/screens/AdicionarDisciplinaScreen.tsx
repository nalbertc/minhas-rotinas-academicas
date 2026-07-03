import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import clsx from 'clsx';
import { Calendar, ChevronDown, ChevronLeft } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { Alert, Dimensions, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView
} from "react-native-keyboard-controller";
import MaskInput from "react-native-mask-input";
import { useSafeAreaInsets, } from 'react-native-safe-area-context';
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { HorarioDisciplina } from '../components/HorarioDisciplina';
import { Input } from "../components/Input";
import { Sheet } from '../components/Sheet';
import { Text } from "../components/Text";
import { createDisciplina } from '../services/disciplinas';
import { HORARIO } from './DisciplinasScreen';

export function formatDate(value?: Date) {
  if (!value)
    return 'Data';

  return value.toLocaleDateString('pt-BR');
}

export function AdicionarDisciplinaScreen() {
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

  function toggleSheetHorario() {
    setIsOpenTipo((prevState) => !prevState)
  }

  async function handleCreate() {
    try {

      const invalid =
        !nome ||
        !professor ||
        !sala ||
        !semestre ||
        !horario ||
        !dataInicio ||
        !dataFim;

      if (invalid) {

        setNomeIsValid(
          !!nome
        );

        setProfessorIsValid(
          !!professor
        );

        setSalaIsValid(
          !!sala
        );

        setSemestreIsValid(
          !!semestre
        );

        setHorarioIsValid(
          !!horario
        );

        setdataInicioIsValid(
          !!dataInicio
        );

        setdataFimIsValid(
          !!dataFim
        );

        Alert.alert(
          "Campos obrigatórios",
          "Preencha todos os campos para continuar."
        );

        return;
      }

      await createDisciplina({
        nome,
        descricao,
        professor,
        sala,
        semestre,
        horario,
        data_inicio:
          dataInicio,

        data_fim:
          dataFim,
      });

      Alert.alert(
        "Sucesso",
        "Disciplina criada com sucesso!",
        [
          {
            text: "OK",

            onPress: () =>
              navigation.navigate("Disciplina"),
          },
        ]
      );

    } catch (error) {

      console.log(
        error
      );

      Alert.alert(
        "Erro",
        "Não foi possível criar a disciplina."
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
              Nova disciplina
            </Heading>

            <View className="w-1/6 " />

          </View>

          <View className="flex-1 px-6 pb-10">
            <View className="flex-1 gap-4">

              <View className="gap-2" >
                <Text>Nome da disciplina</Text>

                <Input
                  value={nome}
                  onChangeText={setNome}
                  invalid={!nomeIsValid}
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

              <View className="gap-2" >
                <Text>Professor (a)</Text>

                <Input
                  value={professor}
                  onChangeText={setProfessor}
                  invalid={!professorIsValid}
                />
              </View>

              <View className="gap-2" >
                <Text>Sala</Text>

                <Input
                  value={sala}
                  onChangeText={setSala}
                  invalid={!salaIsValid}
                />
              </View>

              <View className="gap-2">
                <Text>Período da disciplina</Text>

                <View className="flex-row gap-2">
                  <TouchableOpacity className={clsx("flex-1 h-12 rounded-2xl px-4 text-base border  dark:text-gray-300 text-gray-800 flex-row items-center justify-between", {
                    "border-red-500 bg-red-50 dark:bg-red-950 ": !dataInicioIsValid,
                    "border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100": dataInicioIsValid,
                  })} onPress={() =>
                    setShowInicio(true)
                  }>

                    <Text
                      type={dataInicio ? 'primary' : 'secondary'}
                    >
                      {formatDate(dataInicio)}
                    </Text>

                    <Calendar
                      size={20} color={colorScheme === "dark" ? "#fff" : "#000"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity className={clsx("flex-1 h-12 rounded-2xl px-4 text-base border  dark:text-gray-300 text-gray-800 flex-row items-center justify-between", {
                    "border-red-500 bg-red-50 dark:bg-red-950 ": !dataFimIsValid,
                    "border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100": dataFimIsValid,
                  })} onPress={() =>
                    setShowFim(true)
                  }>

                    <Text
                      type={dataFim ? 'primary' : 'secondary'}
                    >
                      {formatDate(dataFim)}
                    </Text>

                    <Calendar
                      size={20} color={colorScheme === "dark" ? "#fff" : "#000"}
                    />
                  </TouchableOpacity>

                  {showTimePikerInicio || showTimePikerFim ? (
                    <DateTimePicker
                      value={new Date()}
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
                      className={clsx(" w-full h-12 rounded-2xl px-4 text-base justify-center border  dark:text-gray-300 text-gray-800", {
                        "border-red-500 bg-red-50 dark:bg-red-950 ": !semestreIsValid,
                        "border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100 placeholder:text-gray-400": semestreIsValid,
                      })}
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
                  })} onPress={toggleSheetHorario}>

                    <Text type={horario ? "primary" : 'secondary'} >
                      {!horario ? 'Tipo' :
                        HORARIO.find(ti => ti.value === horario)?.title
                      }
                    </Text>

                    <ChevronDown
                      size={20} color={colorScheme === "dark" ? "#fff" : "#000"}
                    />
                  </TouchableOpacity>

                </View>
              </View>





            </View>

            <Button onPress={() => {
              setNomeIsValid(nome === "" ? false : true)
              setProfessorIsValid(professor === "" ? false : true)
              setSalaIsValid(sala === "" ? false : true)
              setdataInicioIsValid(dataInicio ? true : false)
              setdataFimIsValid(dataFim ? true : false)
              setHorarioIsValid(horario === "" ? false : true)
              setSemestreIsValid(semestre === "" ? false : true)

              handleCreate()

            }}  >Salvar disciplina</Button>
          </View>

          {isOpenTipo && <Sheet title='Horário da disciplina' onClose={toggleSheetHorario} content={
            <HorarioDisciplina tipoSelected={horario} setTipo={sethoraio} onClose={toggleSheetHorario} />
          } />}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

