// ChatAnimal.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image
} from "react-native";
import { ChatMensagem } from "@/utils/types/mensagem";

export default function Mensagem({data}:{data: ChatMensagem}) { 



  return (
    <View style={{ flex: 1, padding: 20 }}>
    <View>
        <Text>{data.mensagem}</Text>
    </View>
    </View>
  );
}
