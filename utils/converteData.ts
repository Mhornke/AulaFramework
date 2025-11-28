export default function ConverteData(dataString: string): Date | null {
  const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

  if (!regex.test(dataString)) return null;

  const [dia, mes, ano] = dataString.split("/").map(Number);

  if (mes < 1 || mes > 12) return null;

  const ultimoDiaMes = new Date(ano, mes, 0).getDate();

  if (dia < 1 || dia > ultimoDiaMes) return null;

  function formatarDataPTBR(dataISO: string): string {
  const data = new Date(dataISO);

  if (isNaN(data.getTime())) return "-"; // Caso data inválida

  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    // Se quiser hora:
    // hour: "2-digit",
    // minute: "2-digit",
  });
}

formatarDataPTBR()
  return new Date(ano, mes - 1, dia);
}
