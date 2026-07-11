import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { BarChart3, BookOpen, CheckCircle, ChevronLeft, Clock } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, RefreshControl, ScrollView, Text as TextComp, TouchableOpacity, View } from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import { useSafeAreaInsets, } from 'react-native-safe-area-context';
import Svg, { Circle } from "react-native-svg";
import { Heading } from "../components/Heading";
import { Text } from "../components/Text";
import { TIPOS } from "../components/TipoAtividade";
import { Atividade, atualizarAtividadesAtrasadas, getAtividadess } from "../services/atividades";
import { Disciplina, getDisciplinas } from "../services/disciplinas";
import { gerarCorPorTexto } from "../utils/erarCorPorTexto";
import { LoadingScreen } from "./LoadingScreen";

export function EstatisticasScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation()
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [todasAsAtividades, setAtividades] = useState<Atividade[]>([]);
  const { colorScheme } = useColorScheme();

  const [loading, setLoading,] = useState(false);

  async function loadData() {
    setLoading(true);
    await atualizarAtividadesAtrasadas()

    const response = await getDisciplinas();
    const responseAtividades = await getAtividadess();

    setAtividades(responseAtividades);
    setDisciplinas(response);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const hoje = dayjs().startOf("day");

    const totalDisciplinas = disciplinas.length;
    const totalAtividades = todasAsAtividades.length;

    let concluidas = 0;
    let emAndamento = 0;
    let pendentes = 0;
    let atrasadas = 0;

    const disciplinasMap: Record<
      string, {
        nome: string;
        total: number;
        concluidas: number;
        pendencias: number;
      }> = {};

    const tiposMap: Record<string, number> = {};

    todasAsAtividades.forEach((atividade) => {
      // status
      switch (atividade.status) {
        case "concluida":
          concluidas++;
          break;

        case "em_andamento":
          emAndamento++;
          break;

        case "pendente":
          pendentes++;
          break;
      }

      if (atividade.status !== "concluida" &&
        dayjs(atividade.data_entrega).startOf("day").isBefore(hoje)) {
        atrasadas++;
      }
      // Distribuição por tipo
      tiposMap[atividade.tipo] =
        (tiposMap[atividade.tipo] ?? 0) + 1;

      // Dados por disciplina
      const id = atividade.disciplina.id;

      if (!disciplinasMap[id]) {
        disciplinasMap[id] = {
          nome: atividade.disciplina.nome,
          total: 0,
          concluidas: 0,
          pendencias: 0,
        };
      }

      disciplinasMap[id].total++;

      if (atividade.status === "concluida") {
        disciplinasMap[id].concluidas++;
      } else {
        disciplinasMap[id].pendencias++;
      }
    });

    const totalPendencias = emAndamento + pendentes + atrasadas;

    const percentualConclusao =
      totalAtividades > 0
        ? Math.round((concluidas / totalAtividades) * 100)
        : 0;

    const disciplinasArray = Object.values(disciplinasMap);

    // Top 3 conclusão
    const topConclusao = disciplinasArray
      .map((d) => ({
        nome: d.nome,
        percentual:
          d.total > 0
            ? Math.round((d.concluidas / d.total) * 100)
            : 0,
        total: d.total,
      }))
      .sort((a, b) => b.percentual - a.percentual)
      .slice(0, 3);

    // Top 5 carga
    const cargaDisciplinas = disciplinasArray
      .map((d) => ({
        nome: d.nome,
        total: d.total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const maisPesada = cargaDisciplinas[0]?.total ?? 0;

    // Distribuição por tipo
    const distribuicaoTipos = Object.entries(tiposMap)
      .map(([tipo, quantidade]) => ({
        tipo,
        quantidade,
      }))
      .sort((a, b) => b.quantidade - a.quantidade);

    return {
      totalDisciplinas,
      totalAtividades,

      concluidas,
      atrasadas,
      emAndamento,
      pendentes,

      totalPendencias,
      percentualConclusao,

      maisPesada,

      topConclusao,
      cargaDisciplinas,
      distribuicaoTipos,
    };
  }, [disciplinas, todasAsAtividades]);

  const CELL_SIZE = (Dimensions.get("window").width);
  const WIDTH_DONUT = (CELL_SIZE - 44) / 2;

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <View className="flex-1  bg-backgroundLight dark:bg-backgroundDark" style={{ paddingTop: insets.top }}>

      <View className="h-16 items-center justify-between px-4 flex-row">
        <TouchableOpacity className="relative rounded-lg" activeOpacity={0.7} onPress={() => {

          navigation.goBack()

        }}>
          <ChevronLeft color={colorScheme === "dark" ? "white" : "black"} />

        </TouchableOpacity>

        <Heading >
          Resumo acadêmico
        </Heading>

        <View />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
      >
        <View className="px-4 gap-8">
          <View className="p-5 rounded-2xl bg-primary flex-row items-center justify-between">
            <View className="flex-1 pr-2">
              <TextComp className="text-xs font-semibold uppercase tracking-wider text-white">
                Índice Geral de Conclusão
              </TextComp>
              <TextComp className="text-3xl font-bold mt-1 text-white">
                {stats.percentualConclusao}%
              </TextComp>

              <TextComp className="text-sm text-gray-300 mt-2 font-regular">
                {
                  stats.totalAtividades > 0 ?
                    `Você concluiu ${stats.concluidas} de um total de ${stats.totalAtividades} atividades propostas.`
                    : "Você não possui atividades cadastradas"}
              </TextComp>
            </View>

            {/* Gráfico de Progresso Circular simplificado via CSS */}

            <MiniChart current={stats.concluidas} total={stats.totalAtividades} />
          </View>

          {/* 2. GRID DE QUANTIDADES - CUMPRINDO EXATAMENTE O REQUISITO RF15 */}
          <View className="flex-row flex-wrap justify-between gap-y-4">

            {/* Card: Total Disciplinas */}
            <View style={{ width: (CELL_SIZE - 44) / 2 }} className="p-4 rounded-xl bg-cardLigth dark:bg-cardDark">
              <View className="p-2 rounded-lg bg-blue-50 dark:bg-[#1C1C27] self-start mb-2">
                <BookOpen size={20} color="#3B82F6" />
              </View>
              <Heading>{stats.totalDisciplinas}</Heading>

              <Text type="secondary" size="xs">Disciplinas Matriculadas</Text>
            </View>

            {/* Card: Total Atividades */}
            <View style={{ width: (CELL_SIZE - 44) / 2 }} className="p-4 rounded-xl bg-cardLigth dark:bg-cardDark">
              <View className="p-2 rounded-lg bg-purple-50 dark:bg-[#1C1C27] self-start mb-2">
                <BarChart3 size={20} color="#7453F9" />
              </View>

              <Heading>{stats.totalAtividades}</Heading>
              <Text type="secondary" size="xs">Total de Atividades</Text>
            </View>

            {/* Card: Concluídas (Verde Calibrado) */}
            <View style={{ width: (CELL_SIZE - 44) / 2 }} className="p-4 rounded-xl bg-concluidaCard dark:bg-concluidaCardDark  border border-concluida">
              <View className="p-2 rounded-lg bg-[#DCFCE7] dark:bg-[#1C1C27] self-start mb-2">
                <CheckCircle size={20} color="#22C55E" />
              </View>
              <Heading>{stats.concluidas}</Heading>
              <Text type="secondary" size="xs">Entregues / Concluídas</Text>
            </View>

            {/* Card: Pendências Gerais (Amarelo/Azul Calibrado) */}
            <View style={{ width: (CELL_SIZE - 44) / 2 }} className="p-4 rounded-xl bg-pendenteCard dark:bg-pendenteCardDark border border-pendente">
              <View className="p-2 rounded-lg bg-[#FEF3C7] dark:bg-[#1C1C27] self-start mb-2">
                <Clock size={20} color="#F59E0B" />
              </View>
              <Heading>{stats.totalPendencias}</Heading>
              <Text type="secondary" size="xs">Total de Pendências</Text>
            </View>
          </View>



          <View className="gap-2">
            <Heading size="sm">Conclusão por disciplina</Heading>
            <View className="gap-3">
              {stats.topConclusao.map(item => (
                item.percentual > 0 &&
                <View key={item.nome} className="gap-2">
                  <View className="justify-between flex-row">

                    <Text type="secondary" className="font-semibold">{item.nome}</Text>
                    <Text>{item.percentual}%</Text>
                  </View>
                  <View
                    className="bg-gray-300 dark:bg-gray-800 h-4 rounded-full overflow-hidden"
                  >
                    <View className="h-full bg-concluida" style={{
                      width: `${item.percentual}%`
                    }} />

                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className="gap-2">
            <Heading size="sm">Atividades por disciplina</Heading>


            <View className="gap-3">
              {stats.cargaDisciplinas.map(item => (


                <View key={item.nome} className="gap-2">
                  <View className="justify-between flex-row">

                    <Text type="secondary" className="font-semibold">{item.nome}</Text>
                    <Text>{item.total}</Text>
                  </View>
                  <View
                    className="bg-gray-300 dark:bg-gray-800 h-4 rounded-full overflow-hidden"
                  >
                    <View className="h-full bg-primary" style={{
                      width: `${(item.total / stats.maisPesada) * 100}%`
                    }} />

                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className="gap-4">
            <Heading size="sm">Tipos de atividade</Heading>

            <View className="flex-row justify-between gap-4">
              <PieChart
                donut
                radius={WIDTH_DONUT / 2}
                sectionAutoFocus
                innerRadius={(WIDTH_DONUT / 2) * 0.6}
                innerCircleColor={colorScheme === "dark" ? "#1C1C27" : "#F2F2F2"}
                data={stats.distribuicaoTipos.map(item => {
                  return {
                    value: item.quantidade,
                    color: gerarCorPorTexto(item.tipo)
                  }
                })}
              />
              <View>

                {
                  stats.distribuicaoTipos.map(item => (
                    <View key={item.tipo} className="flex-row items-center gap-2">
                      <View className="h-4 w-4 rounded" style={{
                        backgroundColor: gerarCorPorTexto(item.tipo)
                      }} />

                      <Text size="sm">{item.quantidade} {TIPOS.find(tipo => tipo.value === item.tipo)?.title}</Text>

                    </View>
                  ))
                }
              </View>
            </View>


          </View>
        </View>
      </ScrollView>
    </View>
  );
}

interface MiniChartProps {
  total: number
  current: number
}

function MiniChart({ current, total }: MiniChartProps) {


  const size = 56

  const strokeWidth = 8

  const color = "#22C55E"

  const backgroundColor = "#E5E5E5"
  const radius = (size - strokeWidth) / 2;

  const circumference = 2 * Math.PI * radius;

  const progress = total !== 0 ? current / total : 0;

  const offset = circumference * (1 - progress);

  return (
    <View className="items-center relative gap-1 " style={{
      width: size,
      height: size
    }}>
      <Svg
        width={size}
        height={size}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progresso */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />

      </Svg>
      <View className="absolute w-full h-full items-center justify-center">

        <TextComp className="text-white font-semibold text-sm"> {current}/{total}</TextComp>
      </View>
    </View>
  )
}