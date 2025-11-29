import { URL_Adocao } from "@/utils/url";

export async function deletar(id: number, tipo: "comentario" | "post", token: string) {
  try {
    
    // função interna para deletar comentário
    async function deletarComentario(id: number) {
      return await fetch(`${URL_Adocao}/comentario/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    // função interna para deletar post
    async function deletarPost(id: number) {
      return await fetch(`${URL_Adocao}/posts-comunidade/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
    }
 // decide qual função usar
    if (tipo === "comentario") {
      return await deletarComentario(id);
    } else {
      return await deletarPost(id);
    }

  } catch (error) {
    console.log("Erro ao deletar:", error);
    return null;
  }
}
