import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Text,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { SeletorDeImagem, SeletorDeImagemRef } from '@/components/seletorDeImagens';
import { ImagePickerAsset } from 'expo-image-picker';
import { showAlert } from '@/components/swalAlert';
import imageCompression from 'browser-image-compression';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import PostCard from '@/components/comunidade/cardPost';
import { PostComunidadeI } from '@/utils/types/PostComuniade';
import { URL_Adocao } from '@/utils/url';
import { uploadParaCloudinary } from '@/utils/uploadParaCloundinary';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/theme/color';
import Swal from "sweetalert2";
import LinkLoginSigin from '@/components/levaLoginSigin';

export default function ComunidadeScreen() {
  // Estados para Imagens
  const [outrasFotosPreview, setOutrasFotosPreview] = useState<string[]>([]);
  const [outrasFotosFiles, setOutrasFotosFiles] = useState<{ uri: string; name: string; type: string }[]>([]);

  // Estados para o Post
  const [textoPost, setTextoPost] = useState("");
  const [listaPost, setListaPost] = useState<PostComunidadeI[]>([]);
  const [enviando, setEnviando] = useState(false);

  const seletorRef = useRef<SeletorDeImagemRef>(null);
  const { user } = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const { width } = useWindowDimensions();
  const isMobile = width < 800;

  // --- Carregar Posts ---
  useEffect(() => {
    carregarListaPost();
  }, []);

  async function carregarListaPost() {
    try {
      // Ajuste a rota conforme seu backend real
      const response = await fetch(`${URL_Adocao}/posts-comunidade`);

      if (response.ok) {
        const data = await response.json();
        setListaPost(data);
      }
    } catch (error) {
      console.log("Erro ao carregar ListaPost:", error);
    }
  }

  // --- Processamento de Imagem ---
  async function processarImagemSelecionada(asset: ImagePickerAsset) {
    const originalUri = asset.uri;
    let processedFile: { uri: string; name: string; type: string; };

    const MAX_SIZE_MB = 10;
    const options = { maxSizeMB: MAX_SIZE_MB, useWebWorker: true };

    if (Platform.OS === 'web') {
      try {
        const res = await fetch(originalUri);
        const blob = await res.blob();
        const webFile = new File([blob], asset.fileName || 'image.jpg', { type: blob.type });

        if (webFile.size > options.maxSizeMB * 1024 * 1024) {
          console.log("Comprimindo imagem web...");
        }

        const compressedFile = await imageCompression(webFile, options);
        const compressedBase64 = await imageCompression.getDataUrlFromFile(compressedFile);

        processedFile = {
          uri: compressedBase64,
          name: compressedFile.name,
          type: compressedFile.type,
        };
      } catch (error) {
        console.error("Erro web:", error);
        return null;
      }
    } else {
      try {
        const fileInfo = await FileSystem.getInfoAsync(originalUri);
        let finalAsset = asset;

        if (fileInfo.exists && fileInfo.size > options.maxSizeMB * 1024 * 1024) {
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            originalUri,
            [],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
          );
          finalAsset = manipulatedImage as any;
        }

        processedFile = {
          uri: finalAsset.uri,
          name: `image_${Date.now()}.jpg`,
          type: 'image/jpeg',
        };
      } catch (error) {
        console.error("Erro mobile:", error);
        return null;
      }
    }
    return { originalUri, processedFile };
  }

  // --- Remover Imagem Selecionada ---
  function removerImagem(index: number) {
    setOutrasFotosPreview(prev => prev.filter((_, i) => i !== index));
    setOutrasFotosFiles(prev => prev.filter((_, i) => i !== index));
  }

  // --- Enviar Publicação ---
  async function publicarPost() {
    if (!user) {
      showAlert("Atenção", "Você precisa estar logado para publicar.", "warning");
      return;
    }

    if (!textoPost.trim() && outrasFotosFiles.length === 0) {
      showAlert("Atenção", "Escreva algo ou adicione uma foto.", "warning");
      return;
    }

    try {
      setEnviando(true);

      // 1. Upload das imagens (se houver)
      let urlsImagens: string[] = [];
      if (outrasFotosFiles.length > 0) {
        urlsImagens = await Promise.all(
          outrasFotosFiles.map(file => uploadParaCloudinary(file))
        );
      }


      const body = {
        texto: textoPost,
        adotanteId: user.id,
        fotos: urlsImagens
      };

      console.log("Enviando post:", body);

      // 3. Enviar para API
      const response = await fetch(`${URL_Adocao}/posts-comunidade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user!.token}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const novoPost = await response.json();

        // Adiciona o novo post no topo da lista localmente
        setListaPost(prev => [novoPost, ...prev]);

        // Limpa formulário
        setTextoPost("");
        setOutrasFotosFiles([]);
        setOutrasFotosPreview([]);

        showAlert("Sucesso", "Publicação realizada!", "success");
      } else {
        const erro = await response.json();
        showAlert("Erro", erro.erro || "Falha ao publicar.", "error");
      }

    } catch (error) {
      console.error(error);
      showAlert("Erro", "Erro de conexão.", "error");
    } finally {
      setEnviando(false);
    }
  }

  function removerPostDaListaVisual(idPostDeletado: number) {
    setListaPost((listaAtual) => listaAtual.filter(post => post.id !== idPostDeletado));
  }
  return (
    <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>

      <View style={[styles.container, { width: isMobile ? '95%' : '100%', maxWidth: 800 }]}>


        {user ? (
          <View style={styles.createPostCard}>

            <View style={styles.inputRow}>



              <TextInput
                style={styles.textInput}
                placeholder={`No que você está pensando, ${user?.nome || 'visitante'}?`}
                placeholderTextColor="#888"
                multiline
                value={textoPost}
                onChangeText={setTextoPost}
              />
            </View>

            {/* Preview das Imagens Selecionadas */}
            {outrasFotosPreview.length > 0 && (
              <ScrollView horizontal style={styles.previewContainer}>
                {outrasFotosPreview.map((uri, index) => (
                  <View key={index} style={styles.previewWrapper}>
                    <Image source={{ uri }} style={styles.previewImage} />
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removerImagem(index)}
                    >
                      <FontAwesome name="times" size={12} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}

              </ScrollView>
            )}

            <View style={styles.divider} />

            {/* Botões de Ação (Foto e Publicar) */}
            <View style={styles.actionsRow}>

              <TouchableOpacity
                style={styles.mediaButton}
                onPress={() => seletorRef.current?.abrirGaleria()}
              >
                <FontAwesome name="image" size={20} color={Colors.Butao} />
                <Text style={styles.mediaText}>Foto/Vídeo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.publishButton,
                  (!textoPost && outrasFotosFiles.length === 0) && styles.publishButtonDisabled
                ]}
                onPress={publicarPost}
                disabled={enviando || (!textoPost && outrasFotosFiles.length === 0)}
              >
                {enviando ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.publishText}>Publicar</Text>
                )}
              </TouchableOpacity>

            </View>

            {/* Componente Invisível para Lógica de Seleção */}
            <SeletorDeImagem
              ref={seletorRef}
              onSelecionada={async (asset) => {
                const previewUri = Platform.OS === "web"
                  ? `data:image/jpeg;base64,${asset.base64}`
                  : asset.uri;

                setOutrasFotosPreview((prev) => [...prev, previewUri]);

                const resultado = await processarImagemSelecionada(asset);
                if (resultado && resultado.processedFile) {
                  setOutrasFotosFiles((prev) => [...prev, resultado.processedFile]);
                }
              }}
            />
          </View>
        ):(
<LinkLoginSigin/>
        // <View style={styles.loginWarningContainer}>
        //   <FontAwesome name="lock" size={40} color={Colors.LetraCinza} style={{ marginBottom: 10 }} />
        //   <Text style={styles.warningText}>
        //     Identificamos que você não está logado.
        //   </Text>
        //   <Text style={styles.subWarningText}>
        //     Para poder acessar as funções da comunidade, entre em sua conta.
        //   </Text>
        //   <View style={styles.authButtonsContainer}>
        //     <TouchableOpacity
        //       style={styles.loginButton}
        //       onPress={() => router.push('/(auth)/login')}
        //     >
        //       <Text style={styles.loginButtonText}>Fazer Login</Text>
        //     </TouchableOpacity>
        //     <TouchableOpacity
        //       style={styles.registerButton}
        //       onPress={() => router.push('/(auth)/register')}
        //     >
        //       <Text style={styles.registerButtonText}>Criar Conta</Text>
        //     </TouchableOpacity>
        //   </View>
        // </View>
)}
        {/* === LISTA DE POSTS === */}
        <View style={styles.feedContainer}>
          {listaPost.map((post) => (
            <PostCard key={post.id} data={post}
              onDelete={() => removerPostDaListaVisual(post.id)} />
          ))}
          {listaPost.length === 0 && (
            <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>
              Nenhuma publicação ainda. Seja o primeiro!
            </Text>
          )}
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#F0F2F5", // Fundo cinza estilo feed
    flexGrow: 1,
  },
  container: {
    alignItems: "center",
  },

  // Card de Criação
  createPostCard: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.Butao, // Cor do tema
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    minHeight: 40,
    maxHeight: 150,
    textAlignVertical: 'top',
    paddingTop: 8,

    ...Platform.select({
      web: { outlineStyle: 'none' } as any
    })
  },

  // Preview Imagens
  previewContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 5,
  },
  previewWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee'
  },
  removeBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: '#E4E6EB',
    marginVertical: 10,
  },

  // Ações
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 5,
  },
  mediaText: {
    color: '#65676B',
    fontWeight: '600',
  },
  publishButton: {
    backgroundColor: Colors.Butao,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  publishButtonDisabled: {
    backgroundColor: '#E4E6EB',
  },
  publishText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginWarningContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%'
  },
  warningText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  subWarningText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20
  },
  authButtonsContainer: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
    justifyContent: 'center'
  },
  loginButton: {
    backgroundColor: Colors.Butao, // Azul/Verde do seu tema
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  registerButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.Butao
  },
  registerButtonText: {
    color: Colors.Butao,
    fontWeight: 'bold'
  },
  // Feed
  feedContainer: {
    width: "100%",
    gap: 15, // Espaçamento entre posts
  }
});