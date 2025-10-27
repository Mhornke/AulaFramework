import { EspecieI } from "./especies"
import { Fotos } from "./fotos"
export interface AnimalII {
  id: number;
  status: string;
  status2: boolean;  
  especie: string;
  sexo: string;
  porte: string;
  descricao: string;
  foto: string;      
  fotos?: string[];    
  especieId?: number;  
  createdAt?: string;  
  updatedAt?: string;  
}