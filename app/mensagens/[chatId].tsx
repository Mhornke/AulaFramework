import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons"; 
import Colors from "@/theme/color";
import { URL_Adocao } from "@/utils/url";
import { useAuth } from "@/context/AuthContext";

interface ChatLayoutProps {
  idChat?: number;
  onClose?: () => void;
}

export default function ChatLayout({ idChat, onClose }: ChatLayoutProps) {
  // Ajustei para 'any' para aceitar os objetos participante1/participante2
  const [chat, setChat] = useState<any | null>(null);
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(true);
  
  const flatListRef = useRef<FlatList>(null);
  const { user } = useAuth();
  const userId = user?.id;
console.log(mensagens);

  useEffect(() => {
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
  }, [idChat, user]); 

  const enviarMensagem = async () => {
    if (!chat || !userId) return;

    let idDestino = "";
    if (String(chat.participante1Id) === String(userId)) {
      idDestino = chat.participante2Id; 
    } else {
      idDestino = chat.participante1Id; 
    }

    const body = {
      conteudo: texto,
      animalId: chat.animalId,
      destinatarioId: idDestino,
    };

    try {
      const response = await fetch(`${URL_Adocao}/mensagens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const resultado = await response.json();
        const novaMsg = resultado.mensagem || resultado;
        setMensagens((prev) => [...prev, novaMsg]);
        setTexto("");
      } else {
        Alert.alert("Erro", "Não foi possível enviar a mensagem.");
      }
    } catch (error) {
      console.log("Erro de rede:", error);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const souEu = String(item.remetenteId) === String(userId);

    return (
      <View style={[
        styles.mensagemContainer,
        souEu ? styles.alinharDireita : styles.alinharEsquerda
      ]}>
        {!souEu && (
          <Image
            source={{ uri: "https://placekitten.com/50/50" }}
            style={styles.avatar}
          />
        )}
        <View style={[
          styles.balao,
          souEu ? styles.balaoEu : styles.balaoOutro
        ]}>
          <Text style={styles.conteudo}>{item.conteudo}</Text>
          <Text style={styles.data}>
            {new Date(item.dataEnvio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  
  const destinatario = (() => {
    if (!chat || !user) return null;
    if (String(chat.participante1Id) === String(user.id)) {
        return chat.participante2; 
    } 
    return chat.participante1;
  })();

  const nomeHeader = destinatario?.nome || "Usuário";
  const fotoHeader = destinatario?.foto || "https://placekitten.com/100/100"; 

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={Colors.Butao} />;

  return (
    <View style={styles.container}> 
      
     
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
           
            <TouchableOpacity onPress={onClose} style={{ padding: 5, marginRight: 10 }}>
                <Ionicons name="arrow-back" size={24} color={Colors.Butao} /> 
            </TouchableOpacity>
            
          
            <Image source={{ uri: fotoHeader }} style={styles.headerImage} />
            
            
            <View>
                <Text style={styles.headerName} numberOfLines={1}>
                    {nomeHeader}
                </Text>
                {chat?.animal && (
                    <Text style={styles.headerSubTitle}>
                        Assunto: {chat.animal.nome}
                    </Text>
                )}
            </View>
        </View>
      </View> 
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={flatListRef}
          data={mensagens}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={texto}
            onChangeText={setTexto}
            placeholder="Digite uma mensagem..."
            placeholderTextColor="#aaa"
            style={styles.input}
          />
          <TouchableOpacity style={styles.botaoEnviar} onPress={enviarMensagem}>
            <FontAwesome name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  // MANTIVE SEUS ESTILOS ORIGINAIS ABAIXO:
  container: { flex: 1, backgroundColor: Colors.CorFundo },

  mensagemContainer: {
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "flex-end"
  },

  alinharEsquerda: {
    justifyContent: "flex-start"
  },
  alinharDireita: {
    justifyContent: "flex-end"
  },

  avatar: { width: 30, height: 30, borderRadius: 15, marginRight: 8 },

  balao: { maxWidth: "75%", padding: 10, borderRadius: 10 },

  balaoOutro: { 
    backgroundColor: "#333",
    borderBottomLeftRadius: 2
  },
  balaoEu: { 
    backgroundColor: Colors.Butao,
    borderBottomRightRadius: 2
  },

  conteudo: { color: "#fff", fontSize: 15 },
  data: { color: "#ccc", fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },

  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#1b1b1d",
    alignItems: 'center'
  },
  input: {
    flex: 1,
    backgroundColor: "#2b2b2f",
    borderRadius: 20,
    paddingHorizontal: 15,
    color: "#fff",
    height: 45
  },
  botaoEnviar: {
    backgroundColor: Colors.Butao,
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10
  },

  // === NOVOS ESTILOS APENAS PARA O HEADER ===
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.CorFundo, // Fundo do header (branco para destacar ou a cor que preferir)
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    elevation: 3, // Sombra
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#ccc'
  },
  headerName: {
    color: '#e6e2e2ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerSubTitle: {
    color: '#666',
    fontSize: 12,
  },
});