import { Fotos } from "./fotos"
import { Comentario } from "./comentario"
import { User } from "./user"
export interface PostComunidadeI{
    id: number,
    texto: string,
    curtida: number,
    fotos: string[],
    comentarios: Comentario[],
    user: User,
    createdAt: string
}