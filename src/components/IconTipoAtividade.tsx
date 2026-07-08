import { BookOpen, Briefcase, ClipboardCheck, FileText, FolderKanban, ListChecks, Presentation, Shapes } from "lucide-react-native";
import { ColorValue } from "react-native";

interface IconTipoAtividadeProps {
  tipo:
  | "prova"
  | "trabalho"
  | "seminario"
  | "lista_exercicios"
  | "relatorio"
  | "projeto"
  | "leitura"
  | "outro";
  color?: ColorValue,
  size?: number
}

export function IconTipoAtividade({ tipo, color, size = 24 }: IconTipoAtividadeProps) {

  return (
    <>{tipo ===
      "prova"
      ? <ClipboardCheck color={color} size={size} />
      : tipo ===
        "trabalho"
        ? <Briefcase color={color} size={size} />
        : tipo ===
          "seminario"
          ? <Presentation color={color} size={size} />
          : tipo ===
            "lista_exercicios"
            ? <ListChecks color={color} size={size} />
            : tipo ===
              "relatorio"
              ? <FileText color={color} size={size} />
              : tipo ===
                "projeto"
                ? <FolderKanban color={color} size={size} />
                : tipo ===
                  "leitura"
                  ? <BookOpen color={color} size={size} />
                  : <Shapes color={color} size={size} />}
    </>
  )
}

