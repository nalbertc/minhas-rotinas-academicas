import { supabase } from "../libs/supabase";
import { Atividades } from "./atividades";

export interface Disciplina {
  id: string;
  nome: string;
  descricao?: string;
  created_at: string;
  professor: string;
  horario: "matutino" | "vespertino" | "noturno" | "integral";
  semestre: string;
  sala: string;
  data_inicio: Date;
  data_fim: Date;
  atividades: Atividades[];
}

export async function getDisciplinas() {
  try {
    const { data, error } = await supabase
      .from("disciplina")
      .select(
        `*,
          atividades:atividade(*)
        `,
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return data as Disciplina[];
  } catch (error) {
    console.log(error);

    return [];
  }
}

interface CreateDisciplinaDTO {
  nome: string;
  descricao?: string;
  professor: string;
  sala: string;
  semestre: string;
  horario: "matutino" | "vespertino" | "noturno" | "integral";
  data_inicio: Date;
  data_fim: Date;
}

export async function createDisciplina(data: CreateDisciplinaDTO) {
  try {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      throw new Error("Usuário não autenticado");
    }

    const { data: disciplina, error } = await supabase
      .from("disciplina")
      .insert({
        nome: data.nome,
        descricao: data.descricao,
        professor: data.professor,
        sala: data.sala,
        semestre: data.semestre,
        horario: data.horario,
        data_inicio: data.data_inicio,
        data_fim: data.data_fim,
        usuario_id: userData.user.id,
      })

      .select()

      .single();

    if (error) {
      throw error;
    }

    return disciplina;
  } catch (error) {
    console.log(error);

    throw error;
  }
}
