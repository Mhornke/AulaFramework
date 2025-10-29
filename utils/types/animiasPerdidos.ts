import { EspecieI } from "./especies"
import { Fotos } from "./fotos"
export interface AnimalII {
  id: number;
  status: boolean;
  status2: boolean;  
  especie: EspecieI;
  sexo: string;
  porte: string;
  descricao: string;
  foto: string;      
  fotos?: Fotos[];    
  especieId?: number;  
  createdAt?: string;  
  updatedAt?: string;  
}