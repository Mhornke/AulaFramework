import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, ActivityIndicator, useWindowDimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/theme/color";
import { URL_Adocao } from "@/utils/url";
import { useAuth } from "@/context/AuthContext";
import ChatLayout from "./[chatId]"; 

interface ChatResumo {
  id: number;
  animal: { nome: string; foto?: string };
  participante1: { id: string; nome: string; foto?: string };
  participante2: { id: string; nome: string; foto?: string };
  mensagens: { conteudo: string; dataEnvio: string }[]; 
}

export default function PainelMensagens() {
  const [listaChats, setListaChats] = useState<ChatResumo[]>([]);
  const [chatSelecionadoId, setChatSelecionadoId] = useState<number | undefined>();
  const [loadingList, setLoadingList] = useState(true);
  
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  
  const isMobile = width < 700; 
console.log(listaChats);

 
  useEffect(() => {
    async function buscarChats() {
      if (!user?.token) return;
      try {
        const response = await fetch(`${URL_Adocao}/mensagens/chats`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setListaChats(data);
        }
      } catch (error) {
        console.error("Erro ao buscar lista de chats", error);
      } finally {
        setLoadingList(false);
      }
    }
    buscarChats();
  }, [user]);


const getDadosOutroUsuario = (chat: ChatResumo) => {
  if (!chat || !chat.participante1 || !chat.participante2) {
    return { nome: "Usuário Desconhecido", foto: undefined };
  }

  if (chat.participante1.id === user?.id) {
    return chat.participante2;
  }
  return chat.participante1;
};


  const renderChatItem = ({ item }: { item: ChatResumo }) => {
    const outroUsuario = getDadosOutroUsuario(item);
    const ultimaMensagem = item.mensagens && item.mensagens.length > 0 
      ? item.mensagens[item.mensagens.length - 1].conteudo 
      : "Inicie a conversa...";
    
    const isSelected = item.id === chatSelecionadoId;

    return (
      <TouchableOpacity 
        style={[styles.chatItem, isSelected && styles.chatItemSelected]} 
        onPress={() => setChatSelecionadoId(item.id)}
      >
        <Image 
          source={{ uri: outroUsuario?.foto || "https://placekitten.com/50/50" }} 
          style={styles.avatarItem} 
        />
        <View style={styles.chatInfo}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
             <Text style={styles.nomeUser} numberOfLines={1}>{outroUsuario?.nome || "Usuário"}</Text>
          
          </View>
          
          <Text style={styles.animalTag}>Assunto: {item.animal?.nome}</Text>
          <Text style={styles.ultimaMsg} numberOfLines={1}>{ultimaMensagem}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.containerPrincipal}>
      
      
      <View style={styles.ladoEsquerdo}>
        <View style={styles.headerLista}>
            <Text style={styles.tituloLista}>Minhas Conversas</Text>
        </View>

        {loadingList ? (
          <ActivityIndicator color={Colors.Butao} style={{marginTop: 20}} />
        ) : (
          <FlatList
            data={listaChats}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderChatItem}
            contentContainerStyle={{ padding: 5 }}
            ListEmptyComponent={<Text style={styles.vazioText}>Nenhuma conversa iniciada.</Text>}
          />
        )}
      </View>

     
      <View style={styles.ladoDireito}>
        {chatSelecionadoId ? (
          <ChatLayout 
            idChat={chatSelecionadoId} 
            onClose={() => setChatSelecionadoId(undefined)} 
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <FontAwesome name="comments-o" size={80} color="#333" />
            <Text style={styles.placeholderText}>
                Selecione uma conversa para ver as mensagens
            </Text>
          </View>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    flexDirection: 'row', 
    backgroundColor: '#fff',
    height: '100%', 
    overflow: 'hidden',
    borderRadius: 10, 
  },

  ladoEsquerdo: {
    flex: 1, 
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    backgroundColor: '#f7f7f7'
  },
  headerLista: {
    padding: 15,
    backgroundColor: '#ededed',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  tituloLista: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333'
  },
  chatItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center'
  },
  chatItemSelected: {
    backgroundColor: '#e3f2fd', 
    borderLeftWidth: 4,
    borderLeftColor: Colors.Butao
  },
  avatarItem: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
    backgroundColor: '#ccc'
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center'
  },
  nomeUser: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000'
  },
  animalTag: {
    fontSize: 11,
    color: Colors.Butao,
    marginBottom: 2
  },
  ultimaMsg: {
    fontSize: 12,
    color: '#666'
  },
  vazioText: {
    padding: 20,
    textAlign: 'center',
    color: '#888'
  },

  ladoDireito: {
    flex: 2, 
    backgroundColor: '#e5ddd5' 
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5'
  },
  placeholderText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666'
  }
});