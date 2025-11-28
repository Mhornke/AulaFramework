export interface Mensagem {
  id: number;
  conteudo: string;

  remetenteId: string;
  destinatarioId: string;
  chatId: string;
  animalId: number;

  lida: boolean;
  dataEnvio: string; 
}
