import { AnimalPerdidoI } from "./animiasPerdidos"
import { Mensagem } from "./mensagens"

export interface Chat{
    id: string,
    participante1Id: string
    participante2Id: string
    animalId: number
    animal: AnimalPerdidoI
    mensagens: Mensagem[]
    createdAt: string
    updatedAt: string
}