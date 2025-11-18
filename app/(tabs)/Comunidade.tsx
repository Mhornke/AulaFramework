// screens/ComunidadeScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image, Alert, Platform, useWindowDimensions, TouchableOpacity, TextInput, ScrollView } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import { SeletorDeImagem, SeletorDeImagemRef } from '@/components/seletorDeImagens';
import { ImagePickerAsset } from 'expo-image-picker';
import { showAlert } from '@/components/swalAlert';
import imageCompression from 'browser-image-compression';
import * as ImageManipulator from 'expo-image-manipulator';
import { dadosPost } from "@/dadosPost"
import PostCard from "../../components/cardPost"
import { PostComunidadeI } from '@/utils/types/PostComuniade';
// Dados de exemplo (virão da sua API no futuro)

export default function ComunidadeScreen() {

  const [outrasFotosPreview, setOutrasFotosPreview] = useState<string[]>([]);
  const [outrasFotosFiles, setOutrasFotosFiles] = useState<{ uri: string; name: string; type: string }[]>([]);
  const seletorRef = useRef<SeletorDeImagemRef>(null);
  const [ListaPost, setListaPost] = useState<PostComunidadeI[]>([]);


  const scrollRef = useRef<ScrollView>(null);

  const { width } = useWindowDimensions();
  const isMobile = width < 800;
 

  useEffect(() => {
    // async function carregarListaPost() {
    //   try {
    //     const response = await fetch("https://SEU_BACKEND.com/ListaPost");
    //     const data = await response.json();

    //     setListaPost(data); // ← apenas os ListaPost do backend
    //   } catch (error) {
    //     console.log("Erro ao carregar ListaPost:", error);
    //     Alert.alert("Erro", "Não foi possível carregar as publicações.");
    //   }
    // }

    // carregarListaPost();
    setListaPost(dadosPost.postsComunidade)
  }, []);

  async function processarImagemSelecionada(asset: ImagePickerAsset) {
    // Para o preview imediato, usamos a URI que recebemos
    const originalUri = asset.uri;
    let processedFile: { uri: string; name: string; type: string; };

    const MAX_SIZE_MB = 10;
    const options = {
      maxSizeMB: MAX_SIZE_MB,
      useWebWorker: true,
    };


    if (Platform.OS === 'web') {
      // LÓGICA PARA WEB
      console.log("Processando imagem na Web...");
      try {
        // A biblioteca browser-image-compression precisa de um objeto File.
        // Convertemos a URI Base64 para um File.
        const res = await fetch(originalUri);
        const blob = await res.blob();
        const webFile = new File([blob], asset.fileName || 'image.jpg', { type: blob.type });

        if (webFile.size > options.maxSizeMB * 1024 * 1024) {
          Alert.alert("Imagem grande", "A imagem será otimizada para o envio.");
        }

        const compressedFile = await imageCompression(webFile, options);

        // Convertemos o arquivo comprimido de volta para uma URI Base64 para o upload
        const compressedBase64 = await imageCompression.getDataUrlFromFile(compressedFile);

        processedFile = {
          uri: compressedBase64,
          name: compressedFile.name,
          type: compressedFile.type,
        };

      } catch (error) {
        console.error("Erro ao comprimir na web:", error);
        showAlert("Erro", "Não foi possível processar a imagem.", "error");
        return null;
      }
    } else {
      // LÓGICA PARA MOBILE
      console.log("Processando imagem no Mobile...");
      try {
        const fileInfo = await FileSystem.getInfoAsync(originalUri);
        let finalAsset = asset;

        if (fileInfo.exists && fileInfo.size > options.maxSizeMB * 1024 * 1024) {
          Alert.alert("Imagem grande", "A imagem será otimizada para o envio.");
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            originalUri,
            [], // Sem redimensionamento explícito, deixamos a compressão atuar
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
          );
          finalAsset = manipulatedImage;
        }

        processedFile = {
          uri: finalAsset.uri,
          name: `image_${Date.now()}.jpg`,
          type: 'image/jpeg',
        };
      } catch (error) {
        console.error("Erro ao processar no mobile:", error);
        showAlert("Erro", "Não foi possível processar a imagem.", "error");
        return null;
      }
    }

    return { originalUri, processedFile };
  }





  const listaListaPost = ListaPost.map((post) => (
    <PostCard key={post.id} data={post}     
    />
  ));



  return (
    <ScrollView ref={scrollRef}
    >
      



        <View style={[styles.container,{marginHorizontal: isMobile ? 30 : 0}]}>


          <View style={{ maxWidth:1100, }}>

            <View style={{
              backgroundColor: "#FFFFFF", borderRadius: 5,
              maxWidth: 1100,
              width: "100%",


            }}>

              <TextInput
                style={[styles.createPostButton, styles.createPostText, {
                  height: "50%", borderWidth: 0,
                  outlineStyle: "none" as any
                }]}
                placeholder="Crie uma nova Publicação..."
                placeholderTextColor="#888"
                multiline
                textAlignVertical="top"
                underlineColorAndroid="transparent"
              />


              <View style={{ flexDirection: "row", gap: 20, }}>

                <TouchableOpacity
                  onPress={() => seletorRef.current?.abrirGaleria()}
                  style={{ justifyContent: "flex-end", margin: 10 }}
                >
                  <FontAwesome name="image" size={20} color="#007BFF" />
                </TouchableOpacity>


                <SeletorDeImagem
                  ref={seletorRef}
                  onSelecionada={async (asset) => {
                    const previewUri =
                      Platform.OS === "web"
                        ? `data:image/jpeg;base64,${asset.base64}`
                        : asset.uri;

                    setOutrasFotosPreview((prev) => [...prev, previewUri]);

                    const resultado = await processarImagemSelecionada(asset);
                    if (resultado) {
                      setOutrasFotosFiles((prev) => [...prev, resultado.processedFile]);
                    }
                  }}
                />


                {outrasFotosPreview.map((uri, index) => (
                  <Image
                    key={index}
                    source={{ uri }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      margin: 5

                    }}
                  />
                ))}

              </View>
            </View>
            <View style={{ top: 50, alignItems: "center", width: "100%" }}>
              {listaListaPost}
            </View>


          </View>


        </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,

  },
  createPostButton: {
    padding: 15,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
  },
  createPostText: {
    fontSize: 16,
    color: '#888',

  },
  iconMore: {
    flexDirection: "row",
    margin: 10,
    left: 20,
    gap: 10
  },
  ModelIconMore: {
    // backgroundColor: 'red',
    width: 100,
    position: "relative"
  }
});