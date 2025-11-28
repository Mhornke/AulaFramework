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
  ActivityIndicator
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

export default function DetalhesPerdido() {
  const [dados, setDados] = useState<AnimalPerdidoI>();
  const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { width } = Dimensions.get("window");
  
  // Define se é mobile ou desktop para ajustes finos de margem
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
    BuscaDados();
  }, [id]);

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

    if (!response.ok) {
      showAlert("Erro", result.erro || "Erro ao enviar.");
      return;
    }

    const chatId = result?.chat?.id || result?.mensagem?.chatId || result?.chatId;
    if (chatId) {
      router.push({
        pathname: "/mensagens/[chatId]",
        params: { chatId: String(chatId) },
      });
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
                        <Text style={[styles.actionText, {color: "#25D366"}]}>WhatsApp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={enviarMensagemInicial}>
                         {/* Ícone azul para destacar o chat principal */}
                        <FontAwesome name="comment-o" size={20} color={Color.Butao} />
                        <Text style={[styles.actionText, {color: Color.Butao}]}>Mensagem</Text>
                    </TouchableOpacity>
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
    backgroundColor: "#F0F2F5", // Cor de fundo clássica de redes sociais (Facebook/LinkedIn)
    alignItems: "center",
    paddingVertical: 20,
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    maxWidth: 700, // Largura máxima estilo feed
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, // Sombra no Android
    overflow: "hidden",
  },
  
  // Header
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

  // Body
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

  // Media
  mediaContainer: {
    width: "100%",
    backgroundColor: "#000", // Fundo preto para fotos
    // Altura é gerenciada pelo Carrossel, mas garantimos que não vaze
    minHeight: 300, 
  },

  // Details
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

  // Footer Actions
  actionFooter: {
    flexDirection: "row",
    justifyContent: "space-around", // Distribui os botões igualmente
    paddingVertical: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    flex: 1, // Cada botão ocupa 1/3
    gap: 8,
    borderRadius: 5,
    // Efeito de hover/toque pode ser adicionado aqui
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
  }
});