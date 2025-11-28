import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/theme/color";
import { URL_Adocao } from "@/utils/url";
import { useLocalSearchParams } from "expo-router";
import { Chat } from "@/utils/types/chat";
import { useAuth } from "@/context/AuthContext";

export default function ChatLayout() {
  const [chat, setChat] = useState<Chat | null>(null);
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(true);

  const { chatId } = useLocalSearchParams();
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    async function carregarDados() {
      if (!user?.token || !chatId || chatId === "undefined") return;

      try {
        setLoading(true);

        // 1. BUSCAR O CHAT (Para saber quem é quem)
        // Rota PLURAL: /mensagens/chats
        const resChat = await fetch(`${URL_Adocao}/mensagens/chats`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (resChat.ok) {
          const listaChats = await resChat.json();
          // Acha o chat certo na lista
          const chatEncontrado = listaChats.find((c: any) => c.id === chatId);

          if (chatEncontrado) {
            setChat(chatEncontrado);
            console.log("Chat encontrado:", chatEncontrado); // O P2 deve ver seus dados aqui
          } else {
            console.log("Chat não encontrado na lista."); // Se o P2 cair aqui, é um problema.
          }
        }

        // 2. BUSCAR MENSAGENS
        // Rota PLURAL: /mensagens/:id
        const resMsg = await fetch(`${URL_Adocao}/mensagens/${chatId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (resMsg.ok) {
          const dadosMsgs = await resMsg.json();
          setMensagens(dadosMsgs);
        } else {
          console.log("Erro ao buscar mensagens (404 ou 500)");
        }

      } catch (e) {
        console.error("Erro de conexão:", e);
      } finally {
        setLoading(false);
      }
    }

    console.log("Usuário logado (userId):", userId);
    console.log("Chat ID recebido:", chatId);
    carregarDados();
  }, [chatId, user]);

  const enviarMensagem = async () => {
    if (!chat || !userId) {
      console.error("Chat ou UserId está faltando:", { chat, userId });
      return;
    }

    
    
    let idDestino = "";
    if (String(chat.participante1Id) === String(userId)) {
      idDestino = chat.participante2Id; // Sou o 1, mando pro 2
    } else {
      idDestino = chat.participante1Id; // Sou o 2, mando pro 1
    }
    console.log("ID do P1 (idDestino):", chat.participante1Id);
    console.log("ID do P2 (idDestino):", chat.participante2Id);
    console.log('Mensagens[]:', chat.mensagens);
    

    const body = {
      conteudo: texto,
      animalId: chat.animalId,
      destinatarioId: idDestino,
    };

    try {
      // Rota PLURAL: /mensagens
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
        console.log("Erro ao enviar:", response.status);
        Alert.alert("Erro", "Não foi possível enviar a mensagem.");
      }
    } catch (error) {
      console.log("Erro de rede:", error);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    // Verifica se a mensagem é minha
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

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={Colors.Butao} />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <FlatList
        data={mensagens}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.CorFundo },

  mensagemContainer: {
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "flex-end"
  },

  // Alinhamentos simplificados (sem row-reverse para não confundir)
  alinharEsquerda: {
    justifyContent: "flex-start"
  },
  alinharDireita: {
    justifyContent: "flex-end"
  },

  avatar: { width: 30, height: 30, borderRadius: 15, marginRight: 8 },

  balao: { maxWidth: "75%", padding: 10, borderRadius: 10 },

  // Estilos dos balões
  balaoOutro: { // Recebido (Cinza)
    backgroundColor: "#333",
    borderBottomLeftRadius: 2
  },
  balaoEu: { // Enviado (Azul/Cor do tema)
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
});