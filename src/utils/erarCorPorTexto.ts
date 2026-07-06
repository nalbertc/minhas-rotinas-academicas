export function gerarCorPorTexto(texto: string): string {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = texto.charCodeAt(i) + ((hash << 5) - hash);
  }

  let cor = "#";
  for (let i = 0; i < 3; i++) {
    const valor = (hash >> (i * 7)) & 0xff;
    const valorEscuro = Math.floor(valor * 0.8);
    cor += ("00" + valorEscuro.toString(16)).slice(-2);
  }

  return cor;
}
