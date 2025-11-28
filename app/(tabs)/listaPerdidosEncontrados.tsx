import { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Colors from "../../theme/color";
import { useAuth } from "../../context/AuthContext";
import { URL_Adocao } from "@/utils/url";
import { showAlert } from "@/components/swalAlert";
import Mensagem from "@/components/listaMensagem";
import { FontAwesome } from "@expo/vector-icons";
import { AnimalPerdidoI } from "@/utils/types/animiasPerdidos";
import { Link } from "expo-router"; // Importante para navegar para o chat

export default function ListaCadastro() {
  const { width } = Dimensions.get("window");
  const { user, isLoading } = useAuth();

  const [listaAnimais, setListaAnimais] = useState<AnimalPerdidoI[]>([]);

  // Estados de edição
  const [openEditDescricao, setOpenEditDescricao] = useState<Record<number, boolean>>({});
  const [conteudoEditDescricao, setConteudoEditDescricao] = useState<Record<number, string>>({});

  useEffect(() => {
    const buscarAnimais = async () => {
      if (!user?.id || !user?.token) return;

      try {
        // Chama a rota /meus-animais que já traz os CHATS e FOTOS via 'include'
        const res = await fetch(`${URL_Adocao}/animais-perdidos/meus-animais`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`,
          },
        });

        if (res.ok) {
          const dados = await res.json();
          setListaAnimais(dados);
        } else {
          console.error("Erro ao buscar animais:", res.statusText);
        }
      } catch (err) {
        console.error("Erro de conexão:", err);
      }
    };

    if (!isLoading) {
      buscarAnimais();
    }
  }, [user, isLoading]);

  // --- Funções Auxiliares ---
  async function DeletarChat(chatId: string, animalId: number) {
    const confirmacao = await showAlert(
      'Apagar conversa?',
      "Todas as mensagens desse chat serão apagadas permanentemente.",
      'question'
    );

    if (!confirmacao) return;

    try {
      // Chama a rota que cria no backend (plural ou singular conforme sua rota)
      const response = await fetch(`${URL_Adocao}/mensagens/chat/${chatId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        }
      });

      if (response.ok) {
        // Atualiza o estado removendo apenas o chat específico da lista do animal
        setListaAnimais(prev => prev.map(animal => {
          if (animal.id === animalId) {
            // Filtra os chats removendo o deletado
            const chatsAtualizados = (animal as any).chats.filter((c: any) => c.id !== chatId);
            return { ...animal, chats: chatsAtualizados };
          }
          return animal;
        }));

        showAlert("Sucesso", "Conversa apagada.", "success");
      } else {
        showAlert("Erro", "Não foi possível apagar a conversa.", "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Erro", "Erro de conexão.", "error");
    }
  }
  const AtualizaInputDescricao = (animalId: number, text: string) => {
    setConteudoEditDescricao(prev => ({ ...prev, [animalId]: text }));
  };

  function OpenEditDescricao(animalId: number, descricaoAtual: string) {
    setOpenEditDescricao(prev => {
      const isOpening = !prev[animalId];
      if (isOpening) {
        setConteudoEditDescricao(prevContent => ({ ...prevContent, [animalId]: descricaoAtual || '' }));
      }
      return { ...prev, [animalId]: isOpening };
    });
  }
  async function DeletarAnimal(animalId: number) {
    // 1. Pergunta se o usuário tem certeza (Segurança)
    const confirmacao = await showAlert(
      'Tem certeza que deseja deletar o poste?',
      "Você não poderá reverter isso!",
      'question'
    );

    if (!confirmacao) return;

    try {
      // 2. Correção da URL (Adicionada a barra /)
      const response = await fetch(`${URL_Adocao}/animais-perdidos/${animalId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        }
      });

      if (response.ok) {
        // 3. Atualiza a lista no Front-end removendo o item (sem chamar a API de novo)
        setListaAnimais((prev) => prev.filter((animal) => animal.id !== animalId));

        showAlert("Sucesso", "Animal excluído com sucesso!", "success");

        // Se precisar fechar algum modal de edição aberto desse animal:
        setOpenEditDescricao(prev => {
          const newState = { ...prev };
          delete newState[animalId];
          return newState;
        });

      } else {
        const erroData = await response.json(); // Adicionado await
        console.error(erroData);
        showAlert("Erro", "Não foi possível excluir o animal.", "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Erro", "Erro de conexão com o servidor.", "error");
    }


  }
  const EnviarEditDescricao = async (animalId: number) => {
    const novoConteudo = conteudoEditDescricao[animalId];

    // 1. Validação básica
    if (!novoConteudo || novoConteudo.trim().length === 0) {
      showAlert("Atenção", "A descrição não pode ser vazia.", "warning");
      return;
    }

    try {
      // 2. Chamada ao Backend (PATCH)
      const response = await fetch(`${URL_Adocao}/animais-perdidos/${animalId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        },
        body: JSON.stringify({ descricao: novoConteudo }), // Envia apenas o campo alterado
      });

      if (response.ok) {
        // 3. Sucesso: Atualiza o estado local para refletir a mudança na tela
        setListaAnimais(prev =>
          prev.map(animal =>
            animal.id === animalId ? { ...animal, descricao: novoConteudo } : animal
          )
        );

        showAlert("Sucesso", "Descrição alterada com sucesso!", "success");

        // Fecha o modo de edição
        setOpenEditDescricao(prev => ({ ...prev, [animalId]: false }));
      } else {
        // Erro do Backend
        const erroMsg = await response.text();
        console.error("Erro API:", erroMsg);
        showAlert("Erro", "Não foi possível salvar as alterações.", "error");
      }

    } catch (error) {
      // Erro de Rede / Código
      console.error("Erro Network:", error);
      showAlert("Erro", "Erro de conexão com o servidor.", "error");
    }
  };

  const isMobile = width < 600;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Meus Animais Cadastrados</Text>

      {listaAnimais.length > 0 ? (
        listaAnimais.map((animal) => {

          // Lógica da Foto
          const fotoCapa = (animal.fotos && animal.fotos.length > 0)
            ? animal.fotos[0].codigoFoto
            : "https://placehold.co/400x400/png?text=Sem+Foto";

          // Lógica das Mensagens (Chats) deste animal
          // Se 'chats' vier do backend, usamos ele. Se não, array vazio.
          const chatsDoAnimal = (animal as any).chats || [];

          return isMobile ? (

            // === MOBILE CARD ===
            <View key={animal.id} style={styles.cardMobile}>
              <Text style={styles.nomeAnimal}>🐾 {animal.nome || "Sem nome"}</Text>

              <TouchableOpacity
                onPress={() => DeletarAnimal(animal.id)}
                style={{ position: "absolute", right: 20, top: 15 }} // Ajuste a posição conforme seu layout
              >
                <FontAwesome name="trash" size={20} color="red" />
              </TouchableOpacity>
              <Image source={{ uri: fotoCapa }} style={styles.imagemMobile} resizeMode='cover' />

              <Text style={styles.data}>
                <Text style={styles.label}>Data:</Text> {new Date(animal.createdAt).toLocaleDateString()}
              </Text>

              {/* Edição Descrição */}
              <View style={styles.boxEdicao}>
                <Text style={{ fontWeight: "500", display: openEditDescricao[animal.id] ? "none" : "flex" }}>
                  {animal.descricao}
                </Text>
                <View style={{ display: openEditDescricao[animal.id] ? "flex" : "none", gap: 5 }}>
                  <TextInput
                    style={styles.inputEdicao}
                    value={conteudoEditDescricao[animal.id] ?? ""}
                    onChangeText={(text) => AtualizaInputDescricao(animal.id, text)}
                    placeholder="Alterar Descrição..."
                    multiline
                  />
                  <TouchableOpacity style={styles.btnSalvar} onPress={() => EnviarEditDescricao(animal.id)}>
                    <Text style={{ color: "#ffff", fontWeight: "500" }}>Salvar</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => OpenEditDescricao(animal.id, animal.descricao || '')}
                  style={{ position: "absolute", right: 10, top: 10 }}>
                  <FontAwesome name="edit" size={20} color={Colors.Butao} />
                </TouchableOpacity>
              </View>

              {/* Status */}
              <View style={styles.statusRow}>
                <Text style={styles.label}>Status: </Text>
                <Text style={{ color: !animal.encontrado ? "red" : "green", fontWeight: "bold" }}>
                  {!animal.encontrado ? "Perdido" : "Encontrado"}
                </Text>
                {!animal.encontrado && (
                  <TouchableOpacity onPress={() => StatusAdocao(animal.id)} style={styles.botaoAdotarMobile}>
                    <Text style={styles.botaoTexto}>Marcar como Encontrado</Text>
                  </TouchableOpacity>
                )}
              </View>


              <View style={{ marginTop: 10 }}>
                <Text style={[styles.label, { marginBottom: 5 }]}>Conversas / Mensagens:</Text>

                {chatsDoAnimal.length > 0 ? (
                  chatsDoAnimal.map((chat: any) => {
                    // Pega a última mensagem para exibir
                    const ultimaMsg = chat.mensagens && chat.mensagens.length > 0
                      ? chat.mensagens[chat.mensagens.length - 1].conteudo
                      : "Nova conversa iniciada";

                    // Descobre o nome da outra pessoa
                    const outroParticipante = chat.participante1.id === user?.id
                      ? chat.participante2.nome
                      : chat.participante1.nome;

                    return (
                      <View>
                        <Link key={chat.id} href={`/mensagens/${chat.id}`} asChild>
                          <TouchableOpacity style={styles.chatItem}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                              <Text style={{ fontWeight: 'bold', color: Colors.Butao }}>{outroParticipante}</Text>
                              <Text style={{ fontSize: 10, color: '#888' }}>Ver chat</Text>
                            </View>
                            <Text numberOfLines={1} style={{ color: '#555', marginTop: 2 }}>
                              {ultimaMsg}
                            </Text>
                          </TouchableOpacity>
                        </Link>
                        <TouchableOpacity
                          style={styles.deleteChatButton}
                          onPress={() => DeletarChat(chat.id, animal.id)}
                        >
                          <FontAwesome name="trash-o" size={18} color="#ff4444" />
                        </TouchableOpacity>
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.texto}>Nenhuma mensagem para este animal ainda.</Text>
                )}
              </View>

            </View>
          ) : (

            // === DESKTOP CARD ===
            <View key={animal.id} style={styles.cardDesktop}>
              <View style={[styles.infoContainer, { borderWidth: 1, borderColor: "#cccc", width: "100%" }]}>

                <Image source={{ uri: fotoCapa }} style={styles.imagemDesktop} resizeMode='cover' />

                <View style={{ flex: 1, marginLeft: 10, padding: 10 }}>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.nomeAnimal}>🐾 {animal.nome || "Sem nome"}</Text>
                    <Text style={styles.data}>{new Date(animal.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => DeletarAnimal(animal.id)}
                    style={{ position: "absolute", right: 100, top: 10 }} // Ajuste a posição conforme seu layout
                  >
                    <FontAwesome name="trash" size={20} color="red" />
                  </TouchableOpacity>
                  <View style={styles.boxEdicao}>
                    <Text style={{ display: openEditDescricao[animal.id] ? "none" : "flex" }}>{animal.descricao}</Text>

                    <View style={{ display: openEditDescricao[animal.id] ? "flex" : "none" }}>
                      <TextInput
                        style={styles.inputEdicao}
                        value={conteudoEditDescricao[animal.id] ?? animal.descricao}
                        onChangeText={(text) => AtualizaInputDescricao(animal.id, text)}
                        multiline
                      />
                      <TouchableOpacity style={styles.btnSalvar} onPress={() => EnviarEditDescricao(animal.id)}>
                        <Text style={{ color: "#fff" }}>Salvar</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => OpenEditDescricao(animal.id, animal.descricao || '')}
                      style={{ position: "absolute", right: 10, top: 10 }}>
                      <FontAwesome name="edit" size={20} color={Colors.Butao} />
                    </TouchableOpacity>
                  </View>

                  <View style={{ marginTop: 10, flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.label}>Status: </Text>
                      <Text style={{ color: !animal.encontrado ? "red" : "green", fontWeight: "bold", marginRight: 10 }}>
                        {!animal.encontrado ? "Perdido" : "Encontrado"}
                      </Text>

                      {!animal.encontrado && (
                        <TouchableOpacity onPress={() => StatusAdocao(animal.id)} style={styles.botaoAdotarMobile}>
                          <Text style={styles.botaoTexto}>Marcar como Encontrado</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Botão de Chat para Desktop - Opcional: Pode expandir lista igual mobile */}
                    <View>
                      <Text style={{ fontSize: 12, color: '#888' }}>
                        {chatsDoAnimal.length} conversas ativas
                      </Text>


                    </View>
                  </View>

                  {chatsDoAnimal.length > 0 && (
                    <View style={{ marginTop: 15, borderTopWidth: 1, borderColor: '#eee', paddingTop: 10 }}>
                      {chatsDoAnimal.map((chat: any) => (
                        <View>

                          <Link key={chat.id} href={`/mensagens/${chat.id}`} asChild>
                            <TouchableOpacity style={{ padding: 8, backgroundColor: '#f9f9f9', marginBottom: 5, borderRadius: 4 }}>
                              <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
                                Conversa com {chat.participante1.id === user?.id ? chat.participante2.nome : chat.participante1.nome}
                              </Text>
                              <Text style={{ fontSize: 12, color: '#666' }}>
                                {chat.mensagens?.[chat.mensagens.length - 1]?.conteudo || '...'}
                              </Text>
                            </TouchableOpacity>
                          </Link>
                          <TouchableOpacity
                            style={styles.deleteChatButton}
                            onPress={() => DeletarChat(chat.id, animal.id)}
                          >
                            <FontAwesome name="trash-o" size={18} color="#ff4444" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}

                </View>
              </View>
            </View>
          );
        })
      ) : (
        <Text style={{ color: Colors.LetraCinza, marginTop: 20 }}>Você não tem animais cadastrados.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: "center",
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.Butao
  },
  cardMobile: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardDesktop: {
    width: "100%",
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden"
  },
  imagemMobile: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginBottom: 10,
  },
  imagemDesktop: {
    width: 200,
    height: '100%', // Ocupa toda altura do card no desktop
    minHeight: 200
  },
  nomeAnimal: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 5,
    color: "#333"
  },
  data: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    flexWrap: "wrap",
  },
  label: {
    fontWeight: "bold",
    color: "#333"
  },
  botaoAdotarMobile: {
    backgroundColor: Colors.Butao,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12
  },
  boxEdicao: {
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    position: 'relative',
    width: '100%'
  },
  inputEdicao: {
    height: 100,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    backgroundColor: "#fff",
    textAlignVertical: "top",
    marginBottom: 5,
    width: '100%'
  },
  btnSalvar: {
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: Colors.Butao,
    alignSelf: 'flex-end',
    width: 100
  },
  texto: {
    color: "#777",
    fontStyle: 'italic',
    marginTop: 5
  },

  chatItem: {
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e4e8',
    marginBottom: 8
  },
  deleteChatButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#e1e4e8',
    position:"absolute",
    right:0,
  }
});