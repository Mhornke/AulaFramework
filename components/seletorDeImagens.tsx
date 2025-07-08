// components/SeletorDeImagem.tsx
import React from "react";
import * as ImagePicker from "expo-image-picker";
import { Platform, Alert, Text, TouchableOpacity } from "react-native";
import Colors from "@/theme/color";

// O componente agora retorna o objeto 'asset' inteiro do ImagePicker
export function SeletorDeImagem({
  onSelecionada,
}: {
  onSelecionada: (asset: ImagePicker.ImagePickerAsset) => void;
}) {
  const selecionarImagem = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "É preciso permitir o acesso às imagens.");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // Na web, precisamos pedir o Base64 para poder processá-lo depois
      base64: Platform.OS === 'web', 
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return;
    }

    // Retorna o asset 'bruto' para o componente pai
    onSelecionada(result.assets[0]);
  };

  return (
    <TouchableOpacity onPress={selecionarImagem} style={{ padding: 10, backgroundColor: Colors.Butao, borderRadius: 5 }}>
      <Text style={{ color: "#fff" }}>+ adicionar Fotos</Text>
    </TouchableOpacity>
  );
}