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
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function Detalhes() {
  const [data, setData] = useState<AnimalI>();
  const { id, destaque } = useLocalSearchParams();
  const [texto, setTexto] = useState("");
  const [pedidoEnviado, setPedidoEnviado] = useState(false);

  const { width } = Dimensions.get("window");
  const { user } = useAuth();

  useEffect(() => {
    async function buscaDados() {
      try {
        const URL = destaque
          ? `${URL_GestaoPet}/animais/${id}/destaque`
          : `${URL_Adocao}/animais/${id}`;
        const response = await fetch(URL);
        const dados = await response.json();
        setData(dados);
      } catch (error) {
        console.log("erro ao buscar os dados ", error);
      }
    }

    async function buscarPedidos() {
      const URL = destaque
        ? `${URL_GestaoPet}/interessados/pedidos?userId=${user?.id}`
        : `${URL_Adocao}/pedidos?userId=${user?.id}`;



      const response = await fetch(URL);
      const pedidos = await response.json();
      if (user) {
        const jaEnviado = pedidos.some(
          (pedido: any) =>
            pedido.animalId === Number(id) && pedido.userId === user?.id
        );
        setPedidoEnviado(jaEnviado);
      }
    }

    buscarPedidos();
    buscaDados();
  }, [id, user, destaque]);

  async function enviaForm() {
    try {
      const novoPedido = {
        userId: user?.id,
        animalId: Number(id),
        descricao: texto,
      };
      const URL = destaque
        ? `${URL_GestaoPet}/interessados`
        : `${URL_Adocao}/pedidos`;


      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoPedido),
      });
      if (response.ok) {
        alert("Pedido enviado com sucesso!");
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

          <View style={{ justifyContent: "center", flexDirection: "column", borderRadius: 5, padding: 20, gap: 10, backgroundColor: Color.CorFundo, width: "100%" }}>

            <View style={{ width: "100%" }}>
              <CarrosselFotos data={fotosParaCarrossel} />

            </View>

            <Text style={{ color: "#fff", textAlign: "left", fontWeight: "700", fontSize: 20, }}>
              {data.nome}</Text>
            <View style={{ marginLeft: 20 }}>

              <Text style={styles.Text}>
                <FontAwesome name="paw" size={18} color="white" /> Espécie:
                <Text style={styles.TextoInfoDesktop}>{data.especie.nome}</Text>
              </Text>
              <Text style={styles.Text}>
                <FontAwesome name="birthday-cake" size={18} color={Color.LetraCinza} /> Idade:
                <Text style={styles.TextoInfoDesktop}> {data.idade} ano(s) </Text>
              </Text>
              <Text style={styles.Text}>
                <FontAwesome name="venus-mars" size={18} color={Color.LetraCinza} /> Sexo:
                <Text style={styles.TextoInfoDesktop}>

                  {data.sexo}
                </Text>
              </Text>
              <Text style={styles.Text}>
                <Entypo name="resize-full-screen" size={18} color={Color.LetraCinza} /> Porte:
                <Text style={styles.TextoInfoDesktop}>
                  {data.porte}
                </Text>
              </Text>
              <Text style={styles.Text}>
                <MaterialIcons
                  name={data.castrado ? "check-circle" : "cancel"}
                  size={16}
                  color={data.castrado ? "green" : "red"}
                />{" "}
                <Text style={styles.TextoInfoDesktop}>
                  {data.castrado ? "Castrado" : "Não castrado"}
                </Text>
              </Text>
              <Text style={styles.Text}>
                <FontAwesome name="file-text" size={18} color={Color.LetraCinza} /> Descrição:
                <Text style={styles.TextoInfoDesktop}>
                  {data.descricao}
                </Text>
              </Text>
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

            <View style={{ flex: 1 }}>
              <CarrosselFotos data={fotosParaCarrossel} />

            </View>


            <View style={{ flex: 1.3 }}>

              <Text style={{
                marginBottom: 20,
                color: "#ffff",
                fontWeight: "700",
                fontSize: 20
              }}>{data.nome}</Text>

              <View style={{ flexDirection: "row", gap: 20, flexWrap: "wrap", marginLeft: 10 }}>

                <Text style={styles.TextoTituloInfoDesktop}>
                  <FontAwesome name="paw" size={18} color="white" /> Espécie:
                  <Text style={styles.TextoInfoDesktop}>{data.especie.nome}</Text>
                </Text>
                <Text style={styles.TextoTituloInfoDesktop}>
                  <FontAwesome name="birthday-cake" size={18} color="pink" /> Idade:
                  <Text style={styles.TextoInfoDesktop}> {data.idade} ano(s) </Text>
                </Text>
                <Text style={styles.TextoTituloInfoDesktop}>
                  <FontAwesome name="venus-mars" size={18} /> Sexo:
                  <Text style={styles.TextoInfoDesktop}>

                    {data.sexo}
                  </Text>
                </Text>
                <Text style={styles.TextoTituloInfoDesktop}>
                  <Entypo name="resize-full-screen" size={18} /> Porte:
                  <Text style={styles.TextoInfoDesktop}>
                    {data.porte}
                  </Text>
                </Text>
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
              <View style={{ marginTop: 20, marginLeft: 10 }}>
                <Text style={styles.TextoTituloInfoDesktop}>
                  <FontAwesome name="file-text" size={18} /> Descrição:
                  <Text style={styles.TextoInfoDesktop}>
                    {data.descricao}
                  </Text>
                </Text>
              </View>
            </View>
          </View>


          {user ? (
            <View style={
              [styles.containerTextAreaLarg,
              {
                width: "100%",
                maxWidth:1200
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
    color: Color.LetraCinza,
    fontWeight: "200",
    marginLeft: 5
  },
  containerTextArea: {
    borderRadius: 5,
    backgroundColor: "white",
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
    color: "green",
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
});
