import { User } from "./user"
export interface Comentario{
   id: number,
  texto: string,
  curtida: number,
  adotante:  User,
  createdAt: string,
  
}