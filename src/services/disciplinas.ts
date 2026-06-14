import { supabase } from "../libs/supabase";

export interface Disciplina {
  id: string;
  nome: string;
  descricao?: string;
  created_at: string;
}

export async function getDisciplinas() {
  try {
    const { data, error } = await supabase
      .from("disciplina")
      .select("*")
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
