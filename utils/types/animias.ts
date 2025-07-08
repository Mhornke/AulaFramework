import { EspecieI } from "./especies"
import { Fotos } from "./fotos"
export interface AnimalI {
id: number
nome: string
idade: number
sexo: string
status: boolean
destaque?: boolean
foto: string     
descricao?: string
createdAt: Date
updatedAt: Date
porte: string
especie: EspecieI
especieId: number
castrado?:Boolean
fotos: Fotos[]
      
};