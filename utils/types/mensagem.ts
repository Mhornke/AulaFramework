import { User } from "./user"
import { Fotos } from "./fotos"
export interface ChatMensagem {

    id: number
    mensagem: string
    foto: Fotos
    createdAt: string
    user: User
}