import { useFocusEffect, useNavigation } from "@react-navigation/native";
import clsx from "clsx";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, FlatList, Text as TextReact, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heading } from "../components/Heading";
import { STATUS } from "../components/StatusAtividade";
import { Text } from "../components/Text";
import { useProfile } from '../hooks/useprofile';
import { Atividade, atualizarAtividadesAtrasadas, getAtividadess } from "../services/atividades";
import { Disciplina, getDisciplinas } from "../services/disciplinas";
import { gerarCorPorTexto } from "../utils/erarCorPorTexto";
import { normalizarData } from "../utils/normalizarData";
import { NavigationProps } from "./AticidadesScreen";

dayjs.locale('pt-br');

export function CalendarioScreen() {
  const { profile } = useProfile();
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<NavigationProps>();

  const isDarkMode = colorScheme === 'dark';

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 ESTADO 1: Controla qual dia está marcado em foco (Inicia sempre em HOJE)
  const [diaSelecionado, setDiaSelecionado] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [dataAtual, setDataAtual] = useState(dayjs());

  // 🔥 REFERÊNCIA: Permite rolar a FlatList programaticamente
  const flatListRef = useRef<FlatList>(null);

  async function loadData() {
    setLoading(true);
    await atualizarAtividadesAtrasadas();
    const responseDisciplina = await getDisciplinas();
    const response = await getAtividadess();
    setAtividades(response);
    setDisciplinas(responseDisciplina);
    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const diasDoMes = useMemo(() => {
    const inicioDoMes = dataAtual.startOf("month");
    const fimDoMes = dataAtual.endOf("month");
    const numeroDeDias = fimDoMes.date();
    const diaDaSemanaInicial = inicioDoMes.day();

    const matriz = [];
    for (let i = 0; i < diaDaSemanaInicial; i++) {
      matriz.push(null);
    }
    for (let i = 1; i <= numeroDeDias; i++) {
      matriz.push(dataAtual.date(i));
    }
    while (matriz.length % 7 !== 0) {
      matriz.push(null);
    }
    return matriz;
  }, [dataAtual]);

  const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const CELL_SIZE = (Dimensions.get("window").width - 32) / 7;

  const agendaOrdenada = useMemo(() => {
    const eventosPorDia: { data: string; dateObj: dayjs.Dayjs; disciplinas: Disciplina[]; atividades: Atividade[] }[] = [];
    const inicioMes = dataAtual.startOf("month");
    const fimMes = dataAtual.endOf("month");

    let diaAux = inicioMes;
    while (diaAux.isBefore(fimMes) || diaAux.isSame(fimMes, 'day')) {
      const dataString = diaAux.format("YYYY-MM-DD");
      const distDoDia = disciplinas.filter(d => dataString >= normalizarData(d.data_inicio) && dataString <= normalizarData(d.data_fim));
      const atvDoDia = atividades.filter(a => normalizarData(a.data_entrega) === dataString);

      if (distDoDia.length > 0 || atvDoDia.length > 0) {
        eventosPorDia.push({
          data: dataString,
          dateObj: diaAux,
          disciplinas: distDoDia,
          atividades: atvDoDia
        });
      }
      diaAux = diaAux.add(1, "day");
    }
    return eventosPorDia.sort((a, b) => a.data.localeCompare(b.data));
  }, [dataAtual, disciplinas, atividades]);

  // 🔥 FUNÇÃO DE FOCO: Rola a agenda de baixo até o dia escolhido
  const focarDiaNaAgenda = useCallback((dataString: string) => {
    setDiaSelecionado(dataString);
    const index = agendaOrdenada.findIndex(item => item.data === dataString);

    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0, // Alinha o dia no topo da tela de compromissos
      });
    }
  }, [agendaOrdenada]);

  // 🔥 AUTO-FOCUS AO CARREGAR: Executa a rolagem automática para Hoje assim que os dados carregarem
  useEffect(() => {
    if (agendaOrdenada.length > 0 && !loading) {
      const hojeStr = dayjs().format("YYYY-MM-DD");

      // Tenta achar exatamente o dia de hoje na agenda
      let indexAlvo = agendaOrdenada.findIndex(item => item.data === hojeStr);

      // Se hoje não tiver eventos, busca o primeiro evento futuro mais próximo do mês
      if (indexAlvo === -1) {
        indexAlvo = agendaOrdenada.findIndex(item => item.dateObj.isAfter(dayjs(), 'day'));
      }

      // Se mesmo assim não achar nada futuro, foca no primeiríssimo compromisso da lista
      if (indexAlvo === -1) {
        indexAlvo = 0;
      }

      if (agendaOrdenada[indexAlvo]) {
        setDiaSelecionado(agendaOrdenada[indexAlvo].data);
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: indexAlvo,
            animated: false, // Inicial sem animação brusca ao carregar a tela
            viewPosition: 0
          });
        }, 150);
      }
    }
  }, [agendaOrdenada, loading]);

  return (
    <View className="flex-1 bg-backgroundLight dark:bg-backgroundDark" style={{ paddingTop: insets.top }}>
      <View className="h-16 w-full items-center justify-center px-4 flex-row">
        <Heading>Calendário</Heading>
      </View>

      <View className="flex-1">
        <View className="px-4">
          <View className="flex-row justify-between mb-2">
            <TouchableOpacity onPress={() => {
              setDataAtual(prev => prev.subtract(1, "month"));
            }}>
              <ChevronLeft color={colorScheme === "dark" ? "#fff" : "#000"} />
            </TouchableOpacity>
            <Text className="font-semibold capitalize">
              {dataAtual.format("MMMM YYYY")}
            </Text>
            <TouchableOpacity onPress={() => {
              setDataAtual(prev => prev.add(1, "month"));
            }}>
              <ChevronRight color={colorScheme === "dark" ? "#fff" : "#000"} />
            </TouchableOpacity>
          </View>

          {/* DIAS DA SEMANA */}
          <View className="flex-row justify-between mb-2">
            {diasDaSemana.map((dia) => (
              <Text type="secondary" size="xs" key={dia} style={{ textAlign: "center", width: CELL_SIZE }}>
                {dia}
              </Text>
            ))}
          </View>

          {/* GRADE DE DIAS */}
          <View className="flex-row flex-wrap justify-between">
            {diasDoMes.map((date, index) => {
              if (!date) {
                return <View key={`empty-${index}`} className="h-12" style={{ width: CELL_SIZE }} />;
              }

              const dataString = date.format("YYYY-MM-DD");
              const atividadesDoDia = atividades.filter(a => normalizarData(a.data_entrega) === dataString);
              const temAtividade = atividadesDoDia.length > 0;

              const disciplinasDoDia = disciplinas.filter(
                d => dataString >= normalizarData(d.data_inicio) && dataString <= normalizarData(d.data_fim)
              );

              const ehHj = date.isSame(dayjs(), 'day');
              const ehSelecionado = dataString === diaSelecionado;

              return (
                <TouchableOpacity
                  key={dataString}
                  className="h-12 items-center justify-between my-0.5 relative"
                  style={{ width: CELL_SIZE }}
                  onPress={() => focarDiaNaAgenda(dataString)}
                >
                  {/* CONTAINER DAS BARRINHAS DE DISCIPLINA */}
                  <View className="w-full h-12 absolute">
                    {disciplinasDoDia.map((disc, dIdx) => {
                      const isStart = dataString === normalizarData(disc.data_inicio);
                      const isEnd = dataString === normalizarData(disc.data_fim);
                      const corDisciplina = gerarCorPorTexto(disc.nome);

                      return (
                        <View
                          key={dIdx}
                          className={`absolute h-12 w-full ${isStart ? 'rounded-l-full' : ''} ${isEnd ? 'rounded-r-full' : ''}`}
                          style={{ backgroundColor: corDisciplina, opacity: 0.25 }}
                        />
                      );
                    })}
                  </View>

                  {/* Número do Dia */}
                  <View
                    className={clsx("w-12 h-12 items-center justify-center  relative", {
                      "bg-primary rounded-full ": ehHj && !ehSelecionado,
                      "border-primary border-2 rounded-full": ehSelecionado && !ehHj,
                      "bg-primary rounded-full": ehHj && ehSelecionado
                    })}
                  >
                    <TextReact
                      className={clsx(`font-regular text-black dark:text-white`, {
                        "font-semibold text-white": ehHj,
                        "font-semibold": temAtividade || ehSelecionado
                      })}
                    >
                      {date.date()}
                    </TextReact>

                    {/* BADGES PARA AS ATIVIDADES */}
                    {atividadesDoDia.length > 0 && (
                      <View className="absolute bottom-1 flex-row justify-center space-x-[2px] w-full px-1">
                        {atividadesDoDia.map((atv, aIdx) => (
                          <View
                            key={aIdx}
                            className={clsx("w-1.5 h-1.5 rounded-full", {
                              "bg-pendente": atv.status === "pendente",
                              "bg-concluida": atv.status === "concluida",
                              "bg-emAndamento": atv.status === "em_andamento",
                              "bg-atrasada": atv.status === "atrasada",
                            })}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Agenda Modificada para FlatList */}
        <View className="flex-1 px-4 mt-4 mb-2">
          <View className="mb-4">
            <Text className="font-semibold">Agenda do Mês</Text>
          </View>

          <FlatList
            ref={flatListRef}
            data={agendaOrdenada}
            keyExtractor={(item) => item.data}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            onScrollToIndexFailed={(info) => {
              const wait = new Promise((resolve) => setTimeout(resolve, 80));
              wait.then(() => {
                flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
              });
            }}
            ListEmptyComponent={() => (
              <View className="py-8 items-center justify-center">
                <Text type="secondary" size="sm">
                  Nenhum compromisso este mês.
                </Text>
              </View>
            )}
            renderItem={({ item: itemAgenda }) => {
              const isHoje = itemAgenda.dateObj.isSame(dayjs(), 'day');

              return (
                <View key={itemAgenda.data} className="flex-row mb-6 gap-2 transition-all">
                  {/* COLUNA DA ESQUERDA: DATA */}
                  <View className="items-center pt-2">
                    <Text type="secondary" size="sm" className="uppercase">
                      {itemAgenda.dateObj.format("ddd")}
                    </Text>
                    <View className={clsx("w-9 h-9 items-center justify-center rounded-full", {
                      "bg-primary": isHoje
                    })}>
                      <Text size="lg" className={clsx(`font-semibold`, {
                        "text-white": isHoje
                      })}>
                        {itemAgenda.dateObj.date()}
                      </Text>
                    </View>
                  </View>

                  {/* LINHA VERTICAL DIVISÓRIA */}
                  <View className="w-[2px] bg-neutral-200 dark:bg-neutral-800 relative" />

                  {/* COLUNA DA DIREITA: LISTA DE CARDS */}
                  <View className="flex-1 gap-2">
                    {itemAgenda.atividades.map((atv: Atividade, index: string) => (
                      <TouchableOpacity
                        onPress={() => navigation.navigate("DetalheAtividade", {
                          id: atv.id
                        })}
                        key={`atv-${index}`}
                        className={clsx("px-4 py-2 rounded-xl border flex-col min-h-16", {
                          "border-pendente bg-pendenteCard dark:bg-pendenteCardDark": atv.status === "pendente",
                          "border-concluida bg-concluidaCard dark:bg-concluidaCardDark": atv.status === "concluida",
                          "border-emAndamento bg-emAndamentoCard dark:bg-emAndamentoCardDark": atv.status === "em_andamento",
                          "border-atrasada bg-atrasadaCard dark:bg-atrasadaCardDark": atv.status === "atrasada",
                        })}
                      >
                        <View className="flex-row items-center gap-3 flex-1">
                          <View className={clsx("w-2 h-2 rounded-full", {
                            "bg-pendente": atv.status === "pendente",
                            "bg-concluida": atv.status === "concluida",
                            "bg-emAndamento": atv.status === "em_andamento",
                            "bg-atrasada": atv.status === "atrasada",
                          })} />
                          <View className="flex-row justify-between flex-1 items-center">
                            <Text type="secondary" size="xs">Entrega de atividade</Text>
                            <TextReact className={clsx("font-semibold text-sm", {
                              "text-pendente": atv.status === "pendente",
                              "text-concluida": atv.status === "concluida",
                              "text-emAndamento": atv.status === "em_andamento",
                              "text-atrasada": atv.status === "atrasada",
                            })}>
                              {STATUS.find(status => status.value === atv.status)?.title}
                            </TextReact>
                          </View>
                        </View>
                        <Text className="font-semibold">{atv.titulo}</Text>
                      </TouchableOpacity>
                    ))}

                    {itemAgenda.disciplinas.map((disc: Disciplina, index: string) => {
                      const corHex = gerarCorPorTexto(disc.nome);
                      return (
                        <View
                          key={`disc-${index}`}
                          className="pl-3 pr-4 py-2 rounded-xl border-l-4 bg-white dark:bg-cardDark flex-col min-h-16"
                          style={{ borderLeftColor: corHex }}
                        >
                          <Text className="font-semibold">{disc.nome}</Text>
                          <Text type="secondary" size="sm">
                            Período: {dayjs(disc.data_inicio).format("DD/MM/YY")} até {dayjs(disc.data_fim).format("DD/MM/YY")}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}