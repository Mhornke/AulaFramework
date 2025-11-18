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
import { dadosMensagem } from "@/dadosMensagem"
import Mensagem from "@/components/listaMensagem";
import { ChatMensagem } from "@/utils/types/mensagem";
import { FontAwesome } from "@expo/vector-icons";
// Interfaces
interface Pedido {
  id: number;
  descricao: string;
  resposta?: string;
  animalId: number;
  userId: string;
}

interface Animal {
  id: number;
  nome: string;
  idade: number;
  sexo: string;
  foto: string;
  descricao: string;
  status: boolean;
  porte: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  destaque: boolean;
  pedidos?: Pedido[];
  especie: {
    id: number;
    nome: string;
  };
}

export default function ListaCadastro() {
  const { width, height } = Dimensions.get("window");
  const { user, isLoading } = useAuth();
  // Adicione [] para dizer que é uma LISTA de mensagens
  const [listaMensagem, setListaMensagem] = useState<ChatMensagem[]>([]);
  const [listaAnimais, setListaAnimais] = useState<Animal[]>([]);
  const [respostasEditadas, setRespostasEditadas] = useState<{ [id: number]: string }>({});
  const [openEditDescricao, setOpenEditDescricao] = useState<Record<number, boolean>>({})
 const [conteudoEditDescricao, setConteudoEditDescricao] = useState<Record<number, string>>({})


  useEffect(() => {
    const buscarAnimais = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(`${URL_Adocao}/animais`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`,
          },
        });
        if (res.ok) {
          const dados = await res.json();
          const filtrados = dados.filter((animal: Animal) => animal.userId === user.id);
          setListaAnimais(filtrados);
        } else {
          console.error("Erro ao buscar animais:", res.statusText);
        }
      } catch (err) {
        console.error("Erro ao buscar animais:", err);
      }
    };

    async function BuscaMensagem() {
      setListaMensagem(dadosMensagem)
    }
    if (!isLoading) {
      buscarAnimais();
      BuscaMensagem()
    };
  }, [user, isLoading]);



  const AreaResposta = (pedidoId: number, texto: string) => {
    setRespostasEditadas((prev) => ({ ...prev, [pedidoId]: texto }));
  };

  const EnviaResposta = async (pedidoId: number) => {
    const resposta = respostasEditadas[pedidoId];
    if (!resposta?.trim()) return alert("Digite uma resposta antes de salvar.");

    try {
      const res = await fetch(`${URL_Adocao}/pedidos/${pedidoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resposta }),
      });

      if (res.ok) {

        showAlert("Sucesso", "Resposta enviada", 'success')

        setListaAnimais((prev) =>
          prev.map((animal) => ({
            ...animal,
            pedidos: animal.pedidos?.map((pedido) =>
              pedido.id === pedidoId ? { ...pedido, resposta } : pedido
            ),
          }))
        );

        setRespostasEditadas((prev) => {
          const novo = { ...prev };
          delete novo[pedidoId];
          return novo;
        });
      } else {
        console.error(await res.text());

        showAlert("Erro", "Erro ao enviar resposta", 'error')
      }
    } catch (err) {
      console.error("Erro ao salvar resposta:", err);
      showAlert("Erro", "Erro ao enviar resposta", 'error')
    }
  };
  function OpenEditDescricao(animalId: number, descricaoAtual: string) {
    setOpenEditDescricao(prev => {
      const isOpening = !prev[animalId];
      if (isOpening) {
        // Se estiver abrindo, pré-preencha com a descrição atual do animal
        setConteudoEditDescricao(prevContent => ({ ...prevContent, [animalId]: descricaoAtual || '' }));
      }
      return {
        ...prev,
        [animalId]: isOpening
      };
    });
  }
  const AtualizaInputDescricao = (animalId: number, text: string) => {
    setConteudoEditDescricao(prev => ({ ...prev, [animalId]: text }));
  };

  const EnviarEditDescricao = async (animalId: number) => {
    const novoConteudo = conteudoEditDescricao[animalId];

    if (!novoConteudo || novoConteudo.trim().length === 0) {
      showAlert("Atenção", "A descrição não pode ser vazia.", "warning");
      return;
    }
    // await fetch

    setListaAnimais(prev =>
      prev.map(animal =>
        animal.id === animalId ? { ...animal, descricao: novoConteudo } : animal
      )
    );

    showAlert("Descrição Alterada", "", "success");
    setOpenEditDescricao(prev => ({ ...prev, [animalId]: false }));

    setConteudoEditDescricao(prev => {
      const novo = { ...prev };
      delete novo[animalId];
      return novo;
    });
  };
  
  const StatusAdocao = async (animalId: number) => {
    try {
      const response = await fetch(`${URL_Adocao}/animais/${animalId}/adotar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: false }),
      });
      if (response.ok) {

        showAlert("Estatus Alterado com sucesso", "Agradeçemos por arrumar um lar ao nossos amiguinos", 'success')
        setListaAnimais((prev) =>
          prev.map((animal) =>
            animal.id === animalId ? { ...animal, status: false } : animal
          )
        );
      } else {

        showAlert("Erro", "erro ao alterar estatus", 'error')
      }
    } catch (error) {
      alert("Erro ao alterar status.");
      console.error(error);
    }
  };

  const isMobile = width < 600;

  const listaMensagens = dadosMensagem.map(chat => (
    <Mensagem key={chat.id} data={chat} />
  ));


  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.titulo}>Lista de Encontrados ou Perdidos</Text>

      {listaAnimais.length > 0 ? (
        listaAnimais.map((animal) =>
          isMobile ? (
            // Layout Mobile (vertical)
            <View key={animal.id} style={styles.cardMobile}>
              <Text style={styles.nomeAnimal}>🐾 {animal.nome}</Text>
              <Image source={{ uri: animal.foto }} style={styles.imagemMobile}
                resizeMode='contain' />
              <Text style={styles.data}>
                <Text style={styles.label}>Data:</Text> {new Date(animal.createdAt).toLocaleDateString()}
              </Text>

              <View style={{ borderWidth: 1, borderColor: "#cccc", marginBottom: 10, minHeight: 55, borderRadius: 5, padding: 15, marginRight: 5, backgroundColor: "#ebebebff" }}>

                <Text style={{ fontWeight: "500", display: openEditDescricao[animal.id] ? "none" : "flex" }}>{animal.descricao}</Text>

                <View style={{
                  display: openEditDescricao[animal.id] ? "flex" : "none",
                  gap: 5
                }}>
                  <TextInput
                    style={{
                      height: 200, borderRadius: 5,
                      borderWidth: 1, borderColor: "#cccc",
                      padding: 10,
                      backgroundColor: "#ffff",
                      outlineStyle: "none" as any
                    }}
                    value={conteudoEditDescricao[animal.id] ?? ""}

                    onChangeText={(text) => AtualizaInputDescricao(animal.id, text)}

                    placeholder="Alterar Descrição..."
                    placeholderTextColor="#888"
                    multiline
                    textAlignVertical="top"
                    underlineColorAndroid="transparent"

                  />
                  <TouchableOpacity style={{
                    padding: 10, borderRadius: 5, alignItems: "center",
                    backgroundColor: Colors.Butao
                  }}
                    onPress={() => EnviarEditDescricao(animal.id)}
                  >
                    <Text style={{ color: "#ffff", fontWeight: "500" }}>Enviar</Text>
                  </TouchableOpacity>

                </View>
                <TouchableOpacity
                  onPress={() => OpenEditDescricao(animal.id, animal.descricao || '')}
                  style={{ position: "absolute", right: 15 }}>
                  <FontAwesome name="edit" size={20} color={Colors.Butao} />
                </TouchableOpacity>

              </View>
              <View style={styles.statusRow}>
                <Text style={styles.label}>Status: </Text>
                <Text style={{ color: animal.status ? "red" : "green", fontWeight: "bold" }}>
                  {animal.status ? "Perdido" : "Tutor encontrado"}
                </Text>

                {animal.status && (
                  <TouchableOpacity onPress={() => StatusAdocao(animal.id)} style={styles.botaoAdotarMobile}>
                    <Text style={styles.botaoTexto}>Encontrou seu tutor</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>Mensagens:</Text>
              {dadosMensagem.length > 0 ? (
                listaMensagens


              ) : (
                <Text style={styles.texto}>Nenhuma mensagem no momento.</Text>
              )}
            </View>
          ) : (
            // Layout Tablet/Desktop (horizontal)
            <View key={animal.id} style={styles.cardDesktop}>

              <View style={[styles.infoContainer, { borderWidth: 1, borderColor: "#cccc", width: "100%", }]}>
                <Image source={{ uri: animal.foto }} style={styles.imagemDesktop}
                  resizeMode='contain' />

                <View style={{ flex: 1, width: "100%", height: "100%", marginLeft: 10, marginTop: 10 }}>
                  <View style={{ flex: 0.3 }}>

                    <Text style={styles.nomeAnimal}>🐾 {animal.nome}</Text>
                  </View>

                  <View style={{ flex: 1, borderWidth: 1, borderColor: "#cccc", borderRadius: 5, padding: 10, marginRight: 5, backgroundColor: "#ebebebff" }}>

                    <Text style={{ fontWeight: "500", display: openEditDescricao[animal.id] ? "none" : "flex" }}>{animal.descricao}</Text>


                    <View style={{ display: openEditDescricao[animal.id] ? "flex" : "none" }}>

                      <TextInput
                        style={{
                          borderRadius: 5,
                          borderWidth: 1, borderColor: "#cccc",
                          padding: 10,
                          backgroundColor: "#ffff",
                          outlineStyle: "none" as any
                        }}

                        value={conteudoEditDescricao[animal.id] ?? animal.descricao}
                      onChangeText={(text) => AtualizaInputDescricao(animal.id, text)}




                        placeholderTextColor="#888"
                        multiline
                        textAlignVertical="top"
                        underlineColorAndroid="transparent"

                      />

                      <TouchableOpacity style={{
                        padding: 10, borderRadius: 5, alignItems: "center",
                        backgroundColor: Colors.Butao
                      }}
                        onPress={() => EnviarEditDescricao(animal.id)}
                      >
                        <Text style={{ color: "#ffff", fontWeight: "500" }}>Enviar</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => OpenEditDescricao(animal.id,  animal.descricao)}
                      style={{ position: "absolute", right: 15 }}>
                      <FontAwesome name="edit" size={20} color={Colors.Butao} />
                    </TouchableOpacity>

                  </View>

                  <View style={{ width: "100%", justifyContent: 'space-between', flexDirection: "row" }}>

                    <View style={{ flexDirection: "row", left: 10 }}>
                      <Text style={styles.label}>Status: </Text>

                      <Text style={{ color: animal.status ? "red" : "green", fontWeight: "bold" }}>
                        {animal.status ? "Perdido" : "Tutor encontrado"}
                      </Text>
                    </View>

                    <View style={{ right: 10 }}>
                      <Text style={styles.data}>
                        <Text style={styles.label}>Data:</Text> {new Date(animal.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>




              </View>
              <View>

              </View>
              {animal.status && (
                <TouchableOpacity onPress={() => StatusAdocao(animal.id)} style={styles.botaoAdotarMobile}>
                  <Text style={styles.botaoTexto}>Encontrou seu tutor?</Text>
                </TouchableOpacity>
              )}
              <View style={{ width: "100%" }}>

                <Text style={styles.label}>Mensagens:</Text>
                {dadosMensagem.length > 0 ? (
                  listaMensagens


                ) : (
                  <Text style={styles.texto}>Nenhuma mensagem no momento.</Text>
                )}
              </View>

            </View>
          )
        )
      ) : (
        <Text style={{ color: Colors.LetraCinza }}>Você não tem animais cadastrados.</Text>
      )}
    </ScrollView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",

    // Para web (opcional)
    alignSelf: "center",
    maxWidth: 1200,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  // Mobile Card
  cardMobile: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#ffff",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  imagemMobile: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 10,
  },
  // Desktop Card
  cardDesktop: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#ffff",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#cccc",
  },
  imagemDesktop: {
    flex: 0.4,
    height: 150,


  },
  infoContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 50,
    borderRadius: 5,
    height: 200,

  },
  nomeAnimal: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  data: {
    fontStyle: "italic",
    fontSize: 14,
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  label: {
    fontWeight: "bold",
  },
  texto: {
    fontSize: 15,
  },
  pedidoContainer: {
    marginTop: 10,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#fff",
  },
  botao: {
    marginTop: 8,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 6,
  },
  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  respostaBox: {
    backgroundColor: "#dff0d8",
    padding: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  respostaTexto: {
    color: "#3c763d",
    fontSize: 14,
  },

  botaoAdotarMobile: {
    backgroundColor: "green",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  botaoAdotarDesktop: {
    backgroundColor: "green",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 16,
  },
});
