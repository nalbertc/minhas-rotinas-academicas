import dayjs from "dayjs";

export function normalizarData(
  dataOriginal: string | Date | number | undefined | null,
): string {
  if (!dataOriginal) return "";

  if (typeof dataOriginal === "string" && dataOriginal.includes("T")) {
    const apenasData = dataOriginal.split("T")[0];
    return dayjs(apenasData).format("YYYY-MM-DD");
  }

  const dataInstancia = dayjs(dataOriginal);

  return dataInstancia.isValid() ? dataInstancia.format("YYYY-MM-DD") : "";
}

export function normalizarDataVisualizacaoBr(
  dataOriginal: string | Date | number | undefined | null,
): string {
  if (!dataOriginal) return "";

  if (typeof dataOriginal === "string" && dataOriginal.includes("T")) {
    const apenasData = dataOriginal.split("T")[0];
    return dayjs(apenasData).format("DD-MM-YYYY");
  }

  const dataInstancia = dayjs(dataOriginal);

  return dataInstancia.isValid() ? dataInstancia.format("DD/MM/YYYY") : "";
}
