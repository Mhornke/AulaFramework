import { Fotos } from "./fotos";
import { EspecieI } from "./especies";
import { User } from "./user";

export interface AnimalPerdidoI {
  id: number;
  nome?: string;
  descricao: string;
  tipoAnuncio: "PERDI" | "ENCONTREI";
  localizacao?: string;
  contato?: string;
  

  encontrado: boolean; 
  dataEncontrado?: Date | string | null;
  
  adotante: User | null;
  adotanteId: string | null;
  
  especieId?: number;
  especie?: EspecieI;
  
  createdAt: string;
  updatedAt: string;
   
  fotos: Fotos[]; 
  chats?: any[]; 
 
}