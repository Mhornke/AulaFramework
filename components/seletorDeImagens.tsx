import React, { forwardRef, useImperativeHandle } from "react";
import * as ImagePicker from "expo-image-picker";
import { Platform, Alert } from "react-native";

export interface SeletorDeImagemRef {
  abrirGaleria: () => void;
}

export const SeletorDeImagem = forwardRef<SeletorDeImagemRef, {
  onSelecionada: (asset: ImagePicker.ImagePickerAsset) => void;
}>(({ onSelecionada }, ref) => {
  
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
      base64: Platform.OS === 'web',
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return;
    }

    onSelecionada(result.assets[0]);
  };

  // expõe a função selecionarImagem para o componente pai
  useImperativeHandle(ref, () => ({
    abrirGaleria: selecionarImagem
  }));

  // NÃO renderiza nada!
  return null;
});
