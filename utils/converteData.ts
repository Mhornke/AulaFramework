export default function ConverteData(dataString: string): Date | null {
  const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

  if (!regex.test(dataString)) return null;

  const [dia, mes, ano] = dataString.split("/").map(Number);

  if (mes < 1 || mes > 12) return null;

  const ultimoDiaMes = new Date(ano, mes, 0).getDate();

  if (dia < 1 || dia > ultimoDiaMes) return null;

  return new Date(ano, mes - 1, dia);
}
