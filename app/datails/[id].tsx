import { useAuth } from "../../context/AuthContext";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,

  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import Color from "../../theme/color";
import { AnimalI } from "../../utils/types/animias";
import { FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";
import CarrosselFotos from "../../components/carrosselFotos";
import { URL_Adocao, URL_GestaoPet } from "@/utils/url";

import { showAlert } from "@/components/swalAlert";
import Colors from "../../theme/color";

export default function Detalhes() {
  const [data, setData] = useState<AnimalI>();
  const { id, destaque } = useLocalSearchParams();
  const [texto, setTexto] = useState("");
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const sex = data?.sexo == "MACHO"

  const { width } = Dimensions.get("window");
  const { user } = useAuth();
  console.log(`estatus pedido ${pedidoEnviado}`);

  useEffect(() => {
    async function buscaDados() {
      try {

        const response = await fetch(`${URL_Adocao}/animais/${id}`);
        const dados = await response.json();
        setData(dados);
      } catch (error) {
        console.log("erro ao buscar os dados ", error);
      }
    }

    async function verificarStatusPedido() {
      if (!user) return; // Se não tiver usuário logado, não verifica

      try {
        // Chama a rota que criamos
        const response = await fetch(`${URL_Adocao}/pedidos/verificar?adotanteId=${user.id}&animalId=${id}`);
        const data = await response.json();

        // Atualiza o estado com a resposta do banco (True ou False)
        setPedidoEnviado(data.jaEnviado);
      } catch (error) {
        console.error("Erro ao verificar pedido", error);
      } finally {

      }
    }



    verificarStatusPedido();
    buscaDados();
  }, [id, user, id]);

  async function enviaForm() {
    try {
      const novoPedido = {
        adotanteId: user?.id,
        animalId: Number(id),
        descricao: texto,
      };

      console.log(novoPedido);

      const response = await fetch(`${URL_Adocao}/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoPedido),
      });
      if (response.ok) {
        showAlert("Pedido enviado com sucesso!", "Seu pedido Logo sera respondi", "success");
        setPedidoEnviado(true);
        setTexto("");
      } else {
        alert("Erro ao enviar pedido.");
      }
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      alert("Erro na comunicação com o servidor.");
    }
  }

  if (!data) return <Text style={styles.loading}>Carregando...</Text>;


  const fotosParaCarrossel = data.foto
    ? [{ id: -1, codigoFoto: data.foto, descricao: "Foto principal" }, ...(data.fotos ?? [])]
    : data.fotos ?? [];

  return (


    <>
      {width < 1100 ? (

        <ScrollView contentContainerStyle={styles.container} >

          <View style={{
            justifyContent: "center",
            flexDirection: "column",
            borderRadius: 5,
            padding: 20,
            gap: 25,
            backgroundColor: "#ffff",
            width: "100%",
            borderWidth: 1,
            borderColor: "#cccc",
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
          }}>

            <View style={{ width: "100%" }}>
              <CarrosselFotos data={fotosParaCarrossel} />

            </View>

            <Text style={{ color: Colors.Butao, textAlign: "left", fontWeight: "700", fontSize: 20, }}>
              {data.nome}</Text>
            <View style={{ marginLeft: 20 }}>

              <View style={{ gap: 10 }}>
                <Text style={styles.TextoInfoDesktop}>Descrição:</Text>

                <View style={{
                  flexDirection: "row",
                  gap: 2,
                  backgroundColor: "#f8f8f8d8",
                  borderRadius: 10,
                  padding: 5,
                  minHeight: 100,

                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,
                }}>



                  <Text style={styles.TextoInfoDesktop}>
                    {data.descricao}
                  </Text>
                </View>
              </View>

              <View style={{ gap: 15, flexDirection: "row", marginTop: 20, marginBottom: 20, width: "100%", flexWrap: "wrap", alignItems: "center", justifyContent: "space-around", }}>

                <View style={[styles.containerTagsInfo, {
                  justifyContent: "center",
                  shadowColor: '#6d6601ff',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.50,
                  shadowRadius: 3.84,

                  elevation: 5,
                }]}>
                  <FontAwesome name="paw" size={18} color='#6d6601ff' />

                  <Text style={styles.TextoInfoDesktop}>{data.especie.nome}</Text>
                </View>


                <View style={[styles.containerTagsInfo, {
                  justifyContent: "center",
                  shadowColor: 'pink',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.50,
                  shadowRadius: 3.84,

                  elevation: 5,
                }]}>
                  <FontAwesome name="birthday-cake" size={18} color='pink' />
                  <Text style={styles.TextoInfoDesktop}> {data.idade} ano(s) </Text>
                </View>

                <View style={[styles.containerTagsInfo, {
                  justifyContent: "center",
                  shadowColor: sex ? '#c523daff' : '#23a6daff',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.50,
                  shadowRadius: 3.84,

                  elevation: 5,
                }]}>
                  <FontAwesome name="venus-mars" size={18} color={sex ? "#c523daff" : "#23a6daff"} />
                  <Text style={styles.TextoInfoDesktop}>

                    {data.sexo}
                  </Text>
                </View>

                <View style={[styles.containerTagsInfo, {
                  justifyContent: "center",
                  shadowColor: '#da7c23ff',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.50,
                  shadowRadius: 3.84,

                  elevation: 5,
                }]}>

                  <Text style={styles.Text}>
                    <Entypo name="resize-full-screen" size={18} color={Color.Preto} />
                    <Text style={styles.TextoInfoDesktop}>
                      {data.porte}
                    </Text>
                  </Text>
                </View>

                <View style={[styles.containerTagsInfo, {
                  justifyContent: "center",
                  shadowColor: data.castrado ? "#15fc00ff" : "#f50202ff",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.50,
                  shadowRadius: 3.84,

                  elevation: 5,
                }]}>


                  <MaterialIcons
                    name={data.castrado ? "check-circle" : "cancel"}
                    size={16}
                    color={data.castrado ? "green" : "red"}
                  />{" "}
                  <Text style={[styles.TextoInfoDesktop]}>
                    {data.castrado ? "Castrado" : "Não castrado"}
                  </Text>

                </View>


              </View>

            </View>

            {user ? (
              <View style={[styles.containerTextArea]}>

                {pedidoEnviado ? (
                  <Text style={styles.sucessoMensagem}>
                    Pedido de adoção enviado com sucesso! Em breve entraremos em contato.
                  </Text>
                ) : (
                  <>
                    <Text style={[styles.tituloFormulario, { color: Color.CorFundo }]}>Formulário de Adoção</Text>
                    <Text style={[styles.TextFormulario, { color: Color.CorFundo }]}>
                      Em poucas palavras, diga se você já tem animais e por que gostaria de adotar este
                      animal.
                    </Text>
                    <Text style={[styles.TextFormulario, { color: Color.CorFundo }]}>Pedido:</Text>

                    <TextInput
                      multiline
                      numberOfLines={6}
                      placeholder="Insira aqui seu pedido de adoção"
                      value={texto}
                      onChangeText={setTexto}
                      style={styles.TextAreaInput}
                    />

                    <View style={styles.botaoContainer}>
                      <TouchableOpacity style={styles.botao} onPress={enviaForm}>
                        <Text style={styles.botaoTexto}>Enviar</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            ) : (
              <Link href="/(auth)/login" style={{ textAlign: "center", borderWidth: 1, borderRadius: 5, padding: 10, marginTop: 20, backgroundColor: "green" }}>
                <TouchableOpacity>
                  <Text style={styles.linkLoginText}>Tenho interesse</Text>
                </TouchableOpacity>
              </Link>
            )}
          </View>
        </ScrollView>

      ) : (

        <ScrollView contentContainerStyle={styles.container} >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 20,
              marginTop: 30,
              width: "100%",
              maxWidth: 1200,
              backgroundColor: Color.CorFundo,
              padding: 16,
              borderTopStartRadius: 5,
              borderTopEndRadius: 5
            }}
          >

            <View style={{ flex: 2 }}>
              <CarrosselFotos data={fotosParaCarrossel} />

            </View>


            <View style={{ flex: 1.3, height: '100%' }}>

              <View style={{ flex: 1 }}>
                <Text style={{
                  color: "#fffff6",
                  fontWeight: "700",
                  fontSize: 20
                }}>{data.nome}</Text>
              </View>

              <View style={{ flex: 10, flexDirection: "column", gap: 20, marginLeft: 10, height: "100%", justifyContent: "space-around" }}>

                <View style={{
                  marginLeft: 10,
                  flexDirection: "column",
                  gap: 20, backgroundColor: "#fffffff6",
                  borderRadius: 5,
                  padding: 10,
                  minHeight: 200,
                  flex: 1
                }}>

                  <View style={{ flexDirection: "row" }}>
                    <FontAwesome name="file-text" size={18} color={Colors.Preto} />
                    <Text style={[styles.TextoInfoDesktop, { color: Colors.Preto }]}>
                      Descrição:
                    </Text>
                  </View>

                  <View>
                    <Text style={styles.TextoInfoDesktop}>
                      {data.descricao}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: "row", flex: 0.2, flexWrap: "wrap", gap: 10, justifyContent: "center", alignContent:"center" }}>

                  <View style={[styles.containerTagsInfo, {
                    justifyContent: "center",
                    shadowColor: '#da7c23ff',
                    backgroundColor: "#fffff6",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.50,
                    shadowRadius: 3.84,
                    height: "30%",
                    width: "30%",
                    elevation: 5,
                  }]}>


                    <FontAwesome name="paw" size={18} color="#da7c23ff" />
                    <Text style={styles.TextoInfoDesktop}>{data.especie.nome}</Text>


                  </View>
                  <View style={[styles.containerTagsInfo, {
                    justifyContent: "center",
                    shadowColor: 'pink',
                    backgroundColor: "#fffff6",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.50,
                    shadowRadius: 3.84,
                    height: "30%",
                    width: "30%",
                    elevation: 5,
                  }]}>

                    <Text style={styles.TextoTituloInfoDesktop}>
                      <FontAwesome name="birthday-cake" size={18} color="pink" />
                      <Text style={styles.TextoInfoDesktop}> {data.idade} ano(s) </Text>
                    </Text>
                  </View>

                  <View style={[styles.containerTagsInfo, {
                    justifyContent: "center",
                    shadowColor: sex ? "#c523daff" : "#23a6daff",
                    backgroundColor: "#fffff6",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.50,
                    shadowRadius: 3.84,
                    height: "30%",
                    width: "30%",
                    elevation: 5,
                  }]}>
                    <FontAwesome name="venus-mars" size={18} color={sex ? "#c523daff" : "#23a6daff"} />
                    <Text style={styles.TextoInfoDesktop}>
                      {data.sexo}
                    </Text>
                  </View>

                  <View style={[styles.containerTagsInfo, {
                    justifyContent: "center",
                    shadowColor: "#7fa80cff",
                    backgroundColor: "#fffff6",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.50,
                    shadowRadius: 3.84,
                    height: "30%",
                    width: "30%",
                    elevation: 5,
                  }]}>

                    <Entypo name="resize-full-screen" size={18} />
                    <Text style={styles.TextoInfoDesktop}>
                      {data.porte}
                    </Text>
                  </View>

                  <View style={[styles.containerTagsInfo, {
                    justifyContent: "center",
                    shadowColor: data.castrado ? "#15fc00ff" : "#f50202ff",
                    backgroundColor: "#fffff6",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.50,
                    shadowRadius: 3.84,
                    height: "30%",
                    width: "35%",
                    elevation: 5,
                  }]}>
                    <Text style={styles.TextoTituloInfoDesktop}>
                      <MaterialIcons
                        name={data.castrado ? "check-circle" : "cancel"}
                        size={16}
                        color={data.castrado ? "green" : "red"}
                      />{" "}
                      <Text style={styles.TextoInfoDesktop}>
                        {data.castrado ? "Castrado" : "Não castrado"}
                      </Text>
                    </Text>
                  </View>

                </View>
              </View>
            </View>
          </View>


          {user ? (
            <View style={
              [styles.containerTextAreaLarg,
              {
                width: "100%",
                maxWidth: 1200
              }
              ]

            }>
              {pedidoEnviado ? (
                <View style={{ backgroundColor: "green", padding: 20 }}>
                  <Text style={[styles.sucessoMensagem, { color: "white" }]}>
                    Pedido de adoção enviado com sucesso! Em breve entraremos em contato.
                  </Text>
                </View>
              ) : (
                <View style={{ margin: 15 }}>
                  <Text style={[styles.tituloFormulario, { color: "white" }]}>Formulário de Adoção</Text>
                  <Text style={[styles.TextFormulario, { color: Color.LetraCinza }]}>
                    Em poucas palavras, diga se você já tem animais e por que gostaria de adotar este
                    animal.
                  </Text>
                  <Text style={[styles.TextFormulario, { color: Color.LetraCinza }]}>Pedido:</Text>

                  <TextInput
                    multiline
                    numberOfLines={6}
                    placeholder="Insira aqui seu pedido de adoção"
                    value={texto}
                    onChangeText={setTexto}
                    style={styles.TextAreaInput}
                  />

                  <View style={styles.botaoContainer}>
                    <TouchableOpacity style={styles.botao} onPress={enviaForm}>
                      <Text style={styles.botaoTexto}>Enviar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <Link href="/(auth)/login" style={styles.linkLogin}>
              <TouchableOpacity>
                <Text style={styles.linkLoginText}>Tenho interesse (faça login)</Text>
              </TouchableOpacity>
            </Link>
          )}
        </ScrollView>

      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  loading: {
    color: Color.LetraCinza,
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
  },
  containerGeral: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    width: "100%",


  },
  conteudo: {
    width: "100%",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    maxWidth: 600,
    backgroundColor: Color.CorFundo


  },
  conteudoLargura: {
    backgroundColor: Color.CardFundo,
    borderWidth: 1,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.50,
    shadowRadius: 6.84,
    flexDirection: "row",

  },
  image: {
    width: "100%",
    height: 350,
    borderRadius: 15,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Color.Butao,
  },
  containerText: {
    marginBottom: 20,
    alignItems: "flex-start",
    width: "100%",
  },
  containerTextoLarge: {
    marginTop: 40,
    marginBottom: 40,

    maxWidth: "60%",
    flexWrap: "wrap",
    gap: 30,
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
  },
  TextName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  Text: {
    color: Color.LetraCinza,
    fontWeight: "500",
    marginVertical: 4,
    fontSize: 16,
    flexDirection: "row",
  },
  TextoTituloInfoDesktop: {
    color: Color.LetraCinza,
    fontWeight: "500",
    marginVertical: 4,
    fontSize: 16,
    flexDirection: "row",
  },
  TextoInfoDesktop: {
    color: Colors.Preto,
    fontWeight: "500",
    marginLeft: 5
  },
  containerTextArea: {
    borderRadius: 5,
    backgroundColor: "#0f8604ff",
    padding: 20,
    width: "100%",
  },
  containerTextAreaLarg: {

    width: "90%",
    backgroundColor: Color.CardFundo,
    borderBottomStartRadius: 5,
    borderBottomEndRadius: 5,
  },
  tituloFormulario: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,

  },
  TextFormulario: {
    marginVertical: 6,
    fontWeight: "500"
  },
  TextAreaInput: {
    backgroundColor: Color.inputCor,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    textAlignVertical: "top",
    fontSize: 16,
    height: 120,
    color: Color.LetraCinza
  },
  botaoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  botao: {
    backgroundColor: Color.Butao,
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 8,
    elevation: 2,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  sucessoMensagem: {
    color: Colors.BrancoMaisNemTanto,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  linkLogin: {
    marginTop: 20,
  },
  linkLoginText: {
    color: "#fff",
    fontSize: 16,

    fontWeight: "600",
  },
  containerTagsInfo: {
    flexDirection: "row",

    borderRadius: 10,
    padding: 5,
    width: "30%",
    height: "45%",
    alignItems: "center",

  }
});
