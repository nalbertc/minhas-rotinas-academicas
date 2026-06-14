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
    console.log("chamado");
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
