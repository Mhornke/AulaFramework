import { useLocalSearchParams, Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator, Modal
} from "react-native";
import { FontAwesome, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../../context/AuthContext";
import Color from "../../../theme/color"; // Seu tema
import CarrosselFotos from "../../../components/carrosselFotos";
import * as Linking from "expo-linking";
import { URL_Adocao } from "@/utils/url";
import { showAlert } from "@/components/swalAlert";
import AbrirNoMapa from "@/utils/abrirLocalizacao";
import { AnimalPerdidoI } from "@/utils/types/animiasPerdidos";
import ChatLayout from "@/app/mensagens/[chatId]";
import Colors from "../../../theme/color";
import { Chat } from "@/utils/types/chat";


export default function DetalhesPerdido() {
  const [dados, setDados] = useState<AnimalPerdidoI>();
  const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { width } = Dimensions.get("window");

  const [openMensagens, setOpenMensagens] = useState(false)
  const [idChat, setIdChat] = useState<number | undefined>()
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);

  const isMobile = width < 768;

  useEffect(() => {
    async function BuscaDados() {
      try {
        setLoading(true);
        const response = await fetch(`${URL_Adocao}/animais-perdidos/${id}`);
        if (response.ok) {
          const dadosRes = await response.json();
          setDados(dadosRes);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    async function carregarMensagensDoChat() {

      if (!user?.token || !idChat) return;

      try {
        setLoading(true);
        const response = await fetch(`${URL_Adocao}/mensagens/chat/${idChat}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (response.ok) {
          const dadosDoChat = await response.json();


          setChat(dadosDoChat);


          if (dadosDoChat.mensagens) {
            setMensagens(dadosDoChat.mensagens);
          }
        } else {
          console.log("Erro ao buscar o chat específico:", response.status);
        }

      } catch (e) {
        console.error("Erro de conexão:", e);
      } finally {
        setLoading(false);
      }
    }

    carregarMensagensDoChat();
    BuscaDados();
  }, [id, user, idChat]);

  if (loading || !dados) return <ActivityIndicator style={styles.loading} size="large" color={Color.Butao} />;

  const fotosParaCarrossel = (dados.fotos ?? [])
    .filter(f => f.codigoFoto && f.codigoFoto.trim() !== "") // remove fotos vazias
    .map(f => ({
      ...f,
      codigoFoto: f.codigoFoto.startsWith("http")
        ? f.codigoFoto
        : `${URL_Adocao}/fotos/${f.codigoFoto}` // garante URL completa
    }));


  // --- LÓGICA DE CONTATO E CHAT (Mantida Original) ---
  const handleContatoWhatsapp = () => {
    if (!dados.adotante?.fone) {
      showAlert("Indisponível", "O usuário não informou telefone.");
      return;
    }
    const phoneNumber = dados.adotante.fone.replace(/\D/g, "");
    const config = dados.tipoAnuncio === 'PERDI'
      ? { texto: "Perdido" }
      : { texto: "Encontrado" };

    const message = encodeURIComponent(`Olá! Vi o anúncio sobre o animal ${config.texto}.`);
    Linking.openURL(`https://wa.me/${phoneNumber}?text=${message}`);
  };

  const handleContato = () => {
    if (!dados.adotante?.fone) {
      showAlert("Indisponível", "O usuário não informou telefone.");
      return;
    }
    const phoneNumber = dados.adotante.fone.replace(/\D/g, "");
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const enviarMensagemInicial = async () => {
    try {
      if (!user) {
        showAlert("Atenção", "Faça login para enviar mensagens.");
        setOpenMensagens(true)
        return;
      }

      const destinatarioId = dados.adotanteId;
      const remetenteId = String(user.id);

      if (!destinatarioId) {
        showAlert("Erro", "Autor não identificado.");
        return;
      }

      if (destinatarioId === remetenteId) {

        router.push("/(tabs)/listaPerdidosEncontrados");
        return;
      }
      const resChats = await fetch(`${URL_Adocao}/mensagens/chats`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      let chatExistente = null;

      if (resChats.ok) {
        const listaChats = await resChats.json();
        chatExistente = listaChats.find((c: any) => c.animalId === Number(id));
      }
      if (chatExistente) {
        const jaEnviouOla = chatExistente.mensagens?.some((msg: any) =>
          msg.conteudo === "Olá! Vi o anúncio e gostaria de conversar." &&
          String(msg.remetenteId) === remetenteId
        );

        setIdChat(chatExistente.id);
        setOpenMensagens(true);

        if (jaEnviouOla) {
          console.log("Mensagem já enviada anteriormente. Apenas abrindo chat.");
          setLoading(false);
          return; 
        }
      }

      const body = {
        animalId: Number(id),
        destinatarioId: String(destinatarioId),
        conteudo: "Olá! Vi o anúncio e gostaria de conversar.",
      };

      const response = await fetch(`${URL_Adocao}/mensagens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      setIdChat(result.chatId || result.id);
      setOpenMensagens(true);

      if (!response.ok) {
        showAlert("Erro", result.erro || "Erro ao enviar.");
        return;
      }



    } catch (error) {
      console.log(error);
      showAlert("Erro", "Falha na conexão.");
    }
  };



  const isPerdido = dados.tipoAnuncio === 'PERDI';
  const statusColor = isPerdido ? "#e74c3c" : "#f1c40f"; // Vermelho ou Amarelo
  const statusText = isPerdido ? "PROCURA-SE" : "ENCONTRADO";

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>


      <View style={[styles.cardContainer, { marginHorizontal: isMobile ? 10 : 0 }]}>


        <View style={styles.headerPost}>
          <View style={styles.userInfo}>
            {/* Avatar Genérico */}
            <View style={styles.avatar}>
              <FontAwesome name="user" size={24} color="#fff" />
            </View>
            <View>
              <Text style={styles.userName}>{dados.adotante?.nome || "Usuário Anônimo"}</Text>
              <Text style={styles.postDate}>
                {new Date(dados.createdAt).toLocaleDateString()} • {dados.localizacao}
              </Text>
            </View>
          </View>

          {/* Etiqueta de Status no canto */}
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>

        {/* 2. Descrição (Texto do Post) */}
        <View style={styles.bodyPost}>
          <Text style={styles.postTitle}>{dados.nome}</Text>
          <Text style={styles.postDescription}>{dados.descricao}</Text>
        </View>

        {/* 3. Mídia (Carrossel) */}
        <View style={styles.mediaContainer}>
          <CarrosselFotos data={fotosParaCarrossel} />
        </View>

        {/* 4. Detalhes Técnicos (Tags discretas) */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <FontAwesome name="paw" size={16} color={Color.Butao} />
            <Text style={styles.detailText}>{dados.especie?.nome}</Text>
          </View>
          {/* Se tiver data encontrado/visto, pode mostrar aqui */}
          {dados.localizacao && (
            <View style={styles.detailItem}>

              <AbrirNoMapa endereco={dados.localizacao} />

            </View>
          )}
        </View>

        {/* 5. Barra de Ações (Rodapé) */}
        <View style={styles.actionFooter}>
          {user ? (
            <>
              <TouchableOpacity style={styles.actionButton} onPress={handleContato}>
                <FontAwesome name="phone" size={20} color="#65676b" />
                <Text style={styles.actionText}>Ligar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleContatoWhatsapp}>
                <FontAwesome name="whatsapp" size={20} color="#25D366" />
                <Text style={[styles.actionText, { color: "#25D366" }]}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={enviarMensagemInicial}>
                {/* Ícone azul para destacar o chat principal */}
                <FontAwesome name="comment-o" size={20} color={Color.Butao} />
                <Text style={[styles.actionText, { color: Color.Butao }]}>Mensagem</Text>
              </TouchableOpacity>
              <Modal visible={openMensagens} onRequestClose={() => setOpenMensagens(false)} transparent animationType="fade">
                <TouchableOpacity style={styles.overlayDesktop}>
                  <View style={styles.dropdownDesktopNavegacao}>

                    <ChatLayout idChat={idChat} onClose={() => setOpenMensagens(false)} />
                  </View>
                </TouchableOpacity>
              </Modal>
            </>
          ) : (
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Entre para entrar em contato</Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#F0F2F5", 
    alignItems: "center",
    paddingVertical: 20,
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    maxWidth: 700, 
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, 
    overflow: "hidden",
  },

  
  headerPost: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#050505",
  },
  postDate: {
    fontSize: 12,
    color: "#65676b",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 10,
    textTransform: "uppercase",
  },


  bodyPost: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
    color: "#333"
  },
  postDescription: {
    fontSize: 15,
    color: "#050505",
    lineHeight: 22,
  },


  mediaContainer: {
    width: "100%",
    backgroundColor: "#000", 
    
    minHeight: 300,
  },

  
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 15,
    gap: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#CED0D4",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    color: "#65676b",
    fontSize: 14,
    fontWeight: "500",
  },


  actionFooter: {
    flexDirection: "row",
    justifyContent: "space-around", 
    paddingVertical: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    flex: 1, 
    gap: 8,
    borderRadius: 5,
    
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#65676b",
  },
  loginButton: {
    width: '100%',
    padding: 15,
    alignItems: 'center'
  },
  loginButtonText: {
    color: Color.Butao,
    fontWeight: 'bold'
  },
  dropdownDesktopNavegacao: {
    position: 'absolute',
    bottom: 0,
    right: 20,

    width: 350,
    height: 500,

    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,


    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,

    overflow: 'hidden',
  },

  overlayDesktop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',

  }
});