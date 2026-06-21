import { BookOpen, Briefcase, ClipboardCheck, FileText, FolderKanban, ListChecks, Presentation, Shapes } from "lucide-react-native";
import { useColorScheme } from "nativewind";

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
}

export function IconTipoAtividade({ tipo }: IconTipoAtividadeProps) {

  const { colorScheme } = useColorScheme()

  return (
    <>
      {
        tipo ===
          "prova"
          ? <ClipboardCheck color={colorScheme === "dark" ? "#fff" : "#000"} />

          : tipo ===
            "trabalho"
            ? <Briefcase color={colorScheme === "dark" ? "#fff" : "#000"} />

            : tipo ===
              "seminario"
              ? <Presentation color={colorScheme === "dark" ? "#fff" : "#000"} />

              : tipo ===
                "lista_exercicios"
                ? <ListChecks color={colorScheme === "dark" ? "#fff" : "#000"} />

                : tipo ===
                  "relatorio"
                  ? <FileText color={colorScheme === "dark" ? "#fff" : "#000"} />

                  : tipo ===
                    "projeto"
                    ? <FolderKanban color={colorScheme === "dark" ? "#fff" : "#000"} />

                    : tipo ===
                      "leitura"
                      ? <BookOpen color={colorScheme === "dark" ? "#fff" : "#000"} />

                      : <Shapes color={colorScheme === "dark" ? "#fff" : "#000"} />
      }

    </>
  )
}

