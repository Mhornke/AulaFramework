import { User } from "./user"
import { Fotos } from "./fotos"
export interface ChatMensagem {

    id: number
    mensagem: string
    foto: string
    createdAt: string
    user: User
}