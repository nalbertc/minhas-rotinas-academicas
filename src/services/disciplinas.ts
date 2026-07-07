import { supabase } from "../libs/supabase";
import { Atividade } from "./atividades";

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
  atividades: Atividade[];
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

export async function getDisciplinaById(id: string) {
  try {
    const { data, error } = await supabase
      .from("disciplina")
      .select(`*,atividades:atividade(*)`)

      .eq("id", id)

      .single();

    if (error) {
      throw error;
    }

    return data as Disciplina;
  } catch (error) {
    console.log(error);

    return null;
  }
}

export async function deleteDisciplina(id: string) {
  try {
    const { error } = await supabase.from("disciplina").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export interface UpdateDisciplinaDTO {
  nome?: string;
  descricao?: string;
  professor?: string;
  sala?: string;
  semestre?: string;
  horario?: string;
  data_inicio?: string;
  data_fim?: string;
}

export async function updateDisciplina(id: string, data: UpdateDisciplinaDTO) {
  try {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      throw new Error("Usuário não autenticado");
    }

    const { data: disciplina, error } = await supabase
      .from("disciplina")
      .update({
        nome: data.nome,
        descricao: data.descricao,
        professor: data.professor,
        sala: data.sala,
        data_inicio: data.data_inicio,
        data_fim: data.data_fim,
        semestre: data.semestre,
        horario: data.horario,
      })
      .eq("id", id)
      .eq("usuario_id", userData.user.id)
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
