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
  Platform,
} from "react-native";
import Color from "../../theme/color"; // Seu tema
import { AnimalI } from "../../utils/types/animias";
import { FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";
import CarrosselFotos from "../../components/carrosselFotos";
import { URL_Adocao } from "@/utils/url";
import { showAlert } from "@/components/swalAlert";
import Colors from "../../theme/color"; // Alias para Color se necessário

export default function Detalhes() {
  const [data, setData] = useState<AnimalI>();
  const { id } = useLocalSearchParams();
  const [texto, setTexto] = useState("");
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  
  // Lógica original mantida
  const sex = data?.sexo == "MACHO";
  const { width } = Dimensions.get("window");
  const { user } = useAuth();
  

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
      if (!user) return;
      try {
        const response = await fetch(`${URL_Adocao}/pedidos/verificar?adotanteId=${user.id}&animalId=${id}`);
        const dataRes = await response.json();
        setPedidoEnviado(dataRes.jaEnviado);
      } catch (error) {
        console.error("Erro ao verificar pedido", error);
      }
    }

    verificarStatusPedido();
    buscaDados();
  }, [id, user]);
  console.log(`estatus pedido ${pedidoEnviado}`);

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
        showAlert("O pedido foi enviado 😍!", "Seu pedido logo sera respondido, fique atento! 😊", "success");
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

  // Cores dinâmicas para manter a lógica visual original, mas organizadas
  const shadowSex = sex ? '#c523da' : '#23a6da';
  const shadowCastrado = data.castrado ? "#15fc00" : "#f50202";

  return (
    <>
      {width < 1100 ? (
        // ================== VERSÃO MOBILE / TABLET ==================
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.cardContainer}>
            
            <View style={styles.fullWidth}>
              <CarrosselFotos data={fotosParaCarrossel} />
            </View>

            <Text style={styles.titleName}>{data.nome}</Text>

            <View style={styles.contentWrapper}>
              
              {/* Box Descrição */}
              <View style={styles.sectionGap}>
                <Text style={styles.labelTitle}>Descrição:</Text>
                <View style={styles.descriptionBox}>
                  <Text style={styles.infoText}>{data.descricao}</Text>
                </View>
              </View>

              {/* Tags Info */}
              <View style={styles.tagsWrapper}>
                
                <View style={[styles.tagItem, { shadowColor: '#6d6601' }]}>
                  <FontAwesome name="paw" size={18} color='#6d6601' />
                  <Text style={styles.infoText}>{data.especie.nome}</Text>
                </View>

                <View style={[styles.tagItem, { shadowColor: 'pink' }]}>
                  <FontAwesome name="birthday-cake" size={18} color='pink' />
                  <Text style={styles.infoText}> {data.idade} ano(s) </Text>
                </View>

                <View style={[styles.tagItem, { shadowColor: shadowSex }]}>
                  <FontAwesome name="venus-mars" size={18} color={shadowSex} />
                  <Text style={styles.infoText}>{data.sexo}</Text>
                </View>

                <View style={[styles.tagItem, { shadowColor: '#da7c23' }]}>
                  <Entypo name="resize-full-screen" size={18} color={Color.Preto} />
                  <Text style={styles.infoText}>{data.porte}</Text>
                </View>

                <View style={[styles.tagItem, { shadowColor: shadowCastrado }]}>
                  <MaterialIcons
                    name={data.castrado ? "check-circle" : "cancel"}
                    size={16}
                    color={data.castrado ? "green" : "red"}
                  />
                  <Text style={styles.infoText}>
                    {data.castrado ? "Castrado" : "Não castrado"}
                  </Text>
                </View>

              </View>
            </View>

            {/* Formulário ou Login */}
            <View style={styles.formContainer}>
              {user ? (
                pedidoEnviado ? (
                  <View style={styles.successBox}>
                    <Text style={styles.successText}>
                      Pedido de adoção enviado com sucesso! Em breve entraremos em contato.
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.formTitle}>Formulário de Adoção</Text>
                    <Text style={styles.formSubtitle}>
                      Em poucas palavras, diga se você já tem animais e por que gostaria de adotar este animal.
                    </Text>
                    <Text style={styles.formLabel}>Pedido:</Text>

                    <TextInput
                      multiline
                      numberOfLines={6}
                      placeholder="Insira aqui seu pedido de adoção"
                      value={texto}
                      onChangeText={setTexto}
                      style={styles.textArea}
                    />

                    <View style={styles.buttonContainer}>
                      <TouchableOpacity style={styles.button} onPress={enviaForm}>
                        <Text style={styles.buttonText}>Enviar</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )
              ) : (
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity style={styles.loginLinkButton}>
                    <Text style={styles.loginLinkText}>Tenho interesse (Faça Login)</Text>
                  </TouchableOpacity>
                </Link>
              )}
            </View>

          </View>
        </ScrollView>

      ) : (

        // ================== VERSÃO DESKTOP ==================
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.desktopContainer}>
            
            {/* Coluna Esquerda: Fotos */}
            <View style={styles.desktopLeftCol}>
              <CarrosselFotos data={fotosParaCarrossel} />
            </View>

            {/* Coluna Direita: Informações */}
            <View style={styles.desktopRightCol}>
              
              <Text style={styles.desktopTitleName}>{data.nome}</Text>

              <View style={styles.desktopContent}>
                
                {/* Descrição */}
                <View style={styles.descriptionBoxDesktop}>
                  <View style={{ flexDirection: "row", marginBottom: 5 }}>
                    <FontAwesome name="file-text" size={18} color={Colors.Preto} />
                    <Text style={[styles.infoText, { marginLeft: 5, fontWeight: 'bold' }]}>
                      Descrição:
                    </Text>
                  </View>
                  <Text style={styles.infoText}>{data.descricao}</Text>
                </View>

                {/* Tags Desktop */}
                <View style={styles.tagsWrapper}>
                  
                  <View style={[styles.tagItem, { shadowColor: '#da7c23' }]}>
                    <FontAwesome name="paw" size={18} color="#da7c23" />
                    <Text style={styles.infoText}>{data.especie.nome}</Text>
                  </View>

                  <View style={[styles.tagItem, { shadowColor: 'pink' }]}>
                    <FontAwesome name="birthday-cake" size={18} color="pink" />
                    <Text style={styles.infoText}> {data.idade} ano(s) </Text>
                  </View>

                  <View style={[styles.tagItem, { shadowColor: shadowSex }]}>
                    <FontAwesome name="venus-mars" size={18} color={shadowSex} />
                    <Text style={styles.infoText}>{data.sexo}</Text>
                  </View>

                  <View style={[styles.tagItem, { shadowColor: '#7fa80c' }]}>
                    <Entypo name="resize-full-screen" size={18} color="#7fa80c" />
                    <Text style={styles.infoText}>{data.porte}</Text>
                  </View>

                  <View style={[styles.tagItem, { shadowColor: shadowCastrado }]}>
                    <MaterialIcons
                        name={data.castrado ? "check-circle" : "cancel"}
                        size={16}
                        color={data.castrado ? "green" : "red"}
                      />
                    <Text style={styles.infoText}>
                        {data.castrado ? "Castrado" : "Não castrado"}
                    </Text>
                  </View>

                </View>
              </View>
            </View>
          </View>

          {/* Área do Formulário Desktop (Full Width abaixo das colunas) */}
          <View style={[styles.formContainer, { width: "100%", maxWidth: 1200, marginTop: 20 }]}>
            {user ? (
              pedidoEnviado ? (
                <View style={styles.successBox}>
                  <Text style={styles.successText}>
                    Pedido de adoção enviado com sucesso! Em breve entraremos em contato.
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={styles.formTitle}>Formulário de Adoção</Text>
                  <Text style={styles.formSubtitle}>
                    Em poucas palavras, diga se você já tem animais e por que gostaria de adotar este animal.
                  </Text>
                  <Text style={styles.formLabel}>Pedido:</Text>

                  <TextInput
                    multiline
                    numberOfLines={6}
                    placeholder="Insira aqui seu pedido de adoção"
                    value={texto}
                    onChangeText={setTexto}
                    style={styles.textArea}
                  />

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={enviaForm}>
                      <Text style={styles.buttonText}>Enviar</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )
            ) : (
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity style={styles.loginLinkButton}>
                  <Text style={styles.loginLinkText}>Tenho interesse (Faça Login)</Text>
                </TouchableOpacity>
              </Link>
            )}
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  // Geral
  loading: {
    color: Color.LetraCinza,
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f4f4f4", // Fundo neutro
  },
  fullWidth: {
    width: "100%",
  },
  
  // Card Container (Mobile e Base)
  cardContainer: {
    backgroundColor: Color.CorFundo, // Branco ou cor do tema
    width: "100%",
    maxWidth: 600,
    borderRadius: 12,
    padding: 16,
    gap: 20,
    // Sombras
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  // Desktop Container
  desktopContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 24,
    width: "100%",
    maxWidth: 1200,
    backgroundColor: Color.CorFundo,
    padding: 24,
    borderRadius: 12,
    // Sombras
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  desktopLeftCol: {
    flex: 1.5,
  },
  desktopRightCol: {
    flex: 1,
    height: '100%',
  },
  desktopContent: {
    flex: 1,
    justifyContent: "space-between",
    gap: 20
  },

  // Tipografia
  titleName: {
    color: Color.Butao,
    textAlign: "left",
    fontWeight: "700",
    fontSize: 24,
    marginBottom: 5,
  },
  desktopTitleName: {
    color: Color.Butao,
    fontWeight: "700",
    fontSize: 28,
    marginBottom: 20,
  },
  labelTitle: {
    fontWeight: "bold",
    color: Colors.Preto,
    marginBottom: 5,
    fontSize: 16
  },
  infoText: {
    color: Colors.Preto,
    fontWeight: "500",
    fontSize: 15,
    lineHeight: 22,
  },

  // Descrição e Conteúdo
  contentWrapper: {
    gap: 20,
  },
  sectionGap: {
    gap: 8,
  },
  descriptionBox: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    borderLeftWidth: 4,
    borderLeftColor: Color.Butao,
  },
  descriptionBoxDesktop: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 16,
    minHeight: 150,
    borderWidth: 1,
    borderColor: "#eee",
  },

  // Tags (Padronizado para Mobile e Desktop)
  tagsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "flex-start",
    marginTop: 10,
  },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
    // Sombra das tags (mantida a lógica de cor dinâmica no componente via inline style)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
    minWidth: 100, // Garante um tamanho mínimo
    flexGrow: 1,   // Permite esticar para preencher espaços
  },

  // Formulário
  formContainer: {
    backgroundColor: Color.CardFundo, // Fundo escuro do tema para o formulário
    borderRadius: 12,
    padding: 24,
    width: "100%",
    marginTop: 10,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  formSubtitle: {
    marginVertical: 6,
    fontWeight: "400",
    color: "#e0e0e0",
    fontSize: 14,
  },
  formLabel: {
    marginTop: 12,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 6,
  },
  textArea: {
    backgroundColor: "#fff", // Input branco para contraste
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
    fontSize: 16,
    height: 120,
    color: Color.Preto,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: Color.Butao,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    elevation: 2,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  
  // Feedback e Login
  successBox: {
    backgroundColor: "#27ae60",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  successText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  loginLinkButton: {
    backgroundColor: "#27ae60", // Verde chamativo para ação
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  loginLinkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});