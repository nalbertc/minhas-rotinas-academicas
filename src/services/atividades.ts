import { supabase } from "../libs/supabase";

export interface Atividades {
  id: string;
  titulo: string;
  descricao?: string;
  status: "pendente" | "em_andamento" | "concluida" | "atrasada";
  tipo:
    | "prova"
    | "trabalho"
    | "seminario"
    | "lista_exercicios"
    | "relatorio"
    | "projeto"
    | "leitura"
    | "outro";
  data_entrega: Date;
  created_at: string;
  disciplina: {
    id: string;
    nome: string;
  };
}

export async function getAtividadess() {
  try {
    const { data, error } = await supabase
      .from("atividade")
      .select(`*,disciplina (id,nome)`)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return data as Atividades[];
  } catch (error) {
    console.log(error);

    return [];
  }
}

interface CreateAtividadeDTO {
  titulo: string;
  descricao?: string;
  status: "pendente" | "em_andamento" | "concluida" | "atrasada";
  prioridade: "alta" | "media" | "baixa";
  tipo:
    | "prova"
    | "trabalho"
    | "seminario"
    | "lista_exercicios"
    | "relatorio"
    | "projeto"
    | "leitura"
    | "outro";
  data_entrega: string;
  disciplina_id: string;
}

export async function createAtividade(atividade: CreateAtividadeDTO) {
  try {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      throw new Error("Usuário não autenticado");
    }

    const { data, error } = await supabase
      .from("atividade")

      .insert({
        titulo: atividade.titulo,
        descricao: atividade.descricao,
        status: atividade.status,
        prioridade: atividade.prioridade,
        tipo: atividade.tipo,
        data_entrega: atividade.data_entrega,
        disciplina_id: atividade.disciplina_id,
      })

      .select()

      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.log(error);

    throw error;
  }
}
