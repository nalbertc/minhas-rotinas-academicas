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

export async function atualizarAtividadesAtrasadas() {
  try {
    const hoje = new Date().toISOString().split("T")[0];

    const { error } = await supabase
      .from("atividade")
      .update({
        status: "atrasada",
      })
      .lt("data_entrega", hoje)
      .neq("status", "concluida");

    if (error) {
      throw error;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getAtividadeById(id: string) {
  try {
    const { data, error } = await supabase
      .from("atividade")
      .select(`*,disciplina (id,nome)`)

      .eq("id", id)

      .single();

    if (error) {
      throw error;
    }

    return data as Atividades;
  } catch (error) {
    console.log(error);

    return null;
  }
}

export async function updateStatusAtividade(
  id: string,
  status: Atividades["status"],
) {
  try {
    const { data, error } = await supabase
      .from("atividade")
      .update({ status })
      .eq("id", id)
      .select(`*,disciplina (id,nome)`)
      .single();

    if (error) {
      throw error;
    }

    return data as Atividades;
  } catch (error) {
    console.log(error, "Aqui");
    return null;
  }
}

export async function deleteAtividade(id: string) {
  try {
    const { error } = await supabase.from("atividade").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
