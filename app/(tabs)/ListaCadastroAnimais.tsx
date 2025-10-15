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

  const [listaAnimais, setListaAnimais] = useState<Animal[]>([]);
  const [respostasEditadas, setRespostasEditadas] = useState<{ [id: number]: string }>({});

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

    if (!isLoading) buscarAnimais();
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Animais encontrados</Text>

      {listaAnimais.length > 0 ? (
        listaAnimais.map((animal) =>
          isMobile ? (
            // Layout Mobile (vertical)
            <View key={animal.id} style={styles.cardMobile}>
              <Text style={styles.nomeAnimal}>🐾 {animal.nome}</Text>
              <Image source={{ uri: animal.foto }} style={styles.imagemMobile} />
              <Text style={styles.data}>
                <Text style={styles.label}>Data:</Text> {new Date(animal.createdAt).toLocaleDateString()}
              </Text>
              <View style={styles.statusRow}>
                <Text style={styles.label}>Status: </Text>
                <Text style={{ color: animal.status ? "red" : "green", fontWeight: "bold" }}>
                  {animal.status ? "Disponível" : "Adotado"}
                </Text>
                {animal.status && (
                  <TouchableOpacity onPress={() => StatusAdocao(animal.id)} style={styles.botaoAdotarMobile}>
                    <Text style={styles.botaoTexto}>Marcar como adotado</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>Pedidos:</Text>
              {animal.pedidos && animal.pedidos.length > 0 ? (
                animal.pedidos.map((pedido) => (
                  <View key={pedido.id} style={styles.pedidoContainer}>
                    <Text style={styles.label}>Usuário:</Text>
                    <Text style={styles.texto}>{pedido.userId}</Text>

                    <Text style={[styles.label, { marginTop: 8 }]}>Mensagem:</Text>
                    <Text style={styles.texto}>{pedido.descricao}</Text>

                    <Text style={[styles.label, { marginTop: 8 }]}>Resposta:</Text>

                    {pedido.resposta ? (
                      <View style={styles.respostaBox}>
                        <Text style={styles.respostaTexto}>{pedido.resposta}</Text>
                      </View>
                    ) : (
                      <>
                        <TextInput
                          multiline
                          placeholder="Digite sua resposta"
                          value={respostasEditadas[pedido.id] ?? ""}
                          onChangeText={(text) => AreaResposta(pedido.id, text)}
                          style={styles.input}
                        />
                        <TouchableOpacity onPress={() => EnviaResposta(pedido.id)} style={styles.botao}>
                          <Text style={styles.botaoTexto}>Enviar</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                ))
              ) : (
                <Text style={styles.texto}>Nenhum pedido no momento.</Text>
              )}
            </View>
          ) : (
            // Layout Tablet/Desktop (horizontal)
            <View key={animal.id} style={styles.cardDesktop}>
              <Image source={{ uri: animal.foto }} style={styles.imagemDesktop} />
              <View style={styles.infoContainer}>
                <Text style={styles.nomeAnimal}>🐾 {animal.nome}</Text>
                <Text style={styles.data}>
                  <Text style={styles.label}>Data:</Text> {new Date(animal.createdAt).toLocaleDateString()}
                </Text>
                <View style={styles.statusRow}>
                  <Text style={styles.label}>Status: </Text>
                  <Text style={{ color: animal.status ? "red" : "green", fontWeight: "bold" }}>
                    {animal.status ? "Disponível" : "Adotado"}
                  </Text>
                  {animal.status && (
                    <TouchableOpacity onPress={() => StatusAdocao(animal.id)} style={styles.botaoAdotarDesktop}>
                      <Text style={styles.botaoTexto}>Marcar como adotado</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={[styles.label, { marginTop: 10 }]}>Pedidos:</Text>
                {animal.pedidos && animal.pedidos.length > 0 ? (
                  animal.pedidos.map((pedido) => (
                    <View key={pedido.id} style={styles.pedidoContainer}>
                      <Text style={styles.label}>Usuário:</Text>
                      <Text style={styles.texto}>{pedido.userId}</Text>

                      <Text style={[styles.label, { marginTop: 8 }]}>Mensagem:</Text>
                      <Text style={styles.texto}>{pedido.descricao}</Text>

                      <Text style={[styles.label, { marginTop: 8 }]}>Resposta:</Text>

                      {pedido.resposta ? (
                        <View style={styles.respostaBox}>
                          <Text style={styles.respostaTexto}>{pedido.resposta}</Text>
                        </View>
                      ) : (
                        <>
                          <TextInput
                            multiline
                            placeholder="Digite sua resposta"
                            value={respostasEditadas[pedido.id] ?? ""}
                            onChangeText={(text) => AreaResposta(pedido.id, text)}
                            style={styles.input}
                          />
                          <TouchableOpacity onPress={() => EnviaResposta(pedido.id)} style={styles.botao}>
                            <Text style={styles.botaoTexto}>Enviar</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={styles.texto}>Nenhum pedido no momento.</Text>
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
    alignItems: "center",
    padding: 16,
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
    backgroundColor: "#f5f5f5",
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
    flexDirection: "row",
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  imagemDesktop: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
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
