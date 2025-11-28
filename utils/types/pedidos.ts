import { User } from "./user";
import { AnimalI } from "./animias";

export interface Pedido {
  id: string;
  animal: AnimalI;
  descricao: string;
  resposta?: string;
  createdAt: string;
  adotante: User;
}