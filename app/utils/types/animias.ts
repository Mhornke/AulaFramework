import { EspecieI } from "./especies"

export interface AnimalI {
id: number
nome: string
idade: number
sexo: string
destaque: boolean
foto: string     
descricao: string
createdAt: Date
updatedAt: Date
porte: string
especie: EspecieI
especieId: number
      
}