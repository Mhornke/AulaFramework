// ChatAnimal.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  StyleSheet

} from "react-native";
import { ChatMensagem } from "@/utils/types/chatMensagens";
import Chat from "./chat";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/theme/color";
export default function Mensagem({ data }: { data: ChatMensagem }) {
  const [openChat, setOpenChat] = useState<Record<number, boolean>>({});

  function AbrirChat(idMensagem: number) {
    setOpenChat(prev => ({
      ...prev,
      [idMensagem]: !prev[idMensagem]
    }))
  }

  return (
    <View style={{ borderWidth: 1, borderRadius: 5, margin: 5, borderColor: "#ccc", padding: 20 }}>
      <TouchableOpacity
        onPress={() => AbrirChat(data.id)}
        style={{ flexDirection: "column", gap: 25 }} >

        <View style={{flexDirection:"row", justifyContent:"space-between"}}>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image source={{ uri: data.user.foto }} style={{ width: 40, height: 40 }} />
            <Text style={{ fontWeight: "500" }}>{data.user.nome}</Text>
          </View>
          <View>

          <FontAwesome name="bell" size={15} color={Colors.Butao} />
          <Text>{data.mensagem.length}</Text>
          </View>
        </View>

        <View>
          <Text>{data.mensagem}</Text>
        </View>

      </TouchableOpacity>

      {openChat[data.id] && (
        <View style={styles.chatOverlay}>
          <Chat  />
          <TouchableOpacity
            style={styles.fecharBotao}
            onPress={() => AbrirChat(data.id)}
          >
            <FontAwesome name="times" size={20} />
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}
const styles = StyleSheet.create({
  chatOverlay: {
    top: 19,
    marginBottom: "10%",
    backgroundColor: "#ffffffff",
    borderRadius: 12,
    paddingTop: 45,
    padding: 10,
    borderWidth: 1,
    borderColor: "#cccc"
  },
  fecharBotao: {
    position: "absolute",
    top: 10,
    right: 10,

    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },
});
