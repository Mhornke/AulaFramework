import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Colors from '@/theme/color'; // Certifique-se de que este caminho está correto

interface CarrosselPreviewProps {
  fotosUri: string[];
  onRemoverFoto: (index: number) => void;
}

export default function CarrosselPreview({ fotosUri, onRemoverFoto }: CarrosselPreviewProps) {
  const [indexAtual, setIndexAtual] = useState(0);

  // Ajusta o índice se a foto atual for apagada para não quebrar a visualização
  useEffect(() => {
    if (indexAtual >= fotosUri.length && fotosUri.length > 0) {
      setIndexAtual(fotosUri.length - 1);
    }
  }, [fotosUri.length]);

  // Se não houver fotos, mostra um placeholder simples
  if (!fotosUri || fotosUri.length === 0) {
    return (
      <View style={[styles.container, styles.placeholder]}>
        <FontAwesome name="image" size={50} color="#ccc" />
        <Text style={{ color: '#888', marginTop: 10 }}>Nenhuma foto selecionada</Text>
      </View>
    );
  }

  const fotoAtual = fotosUri[indexAtual];
  
  // Proteção caso o índice fique dessincronizado momentaneamente
  if (!fotoAtual) return null;

  const isFirst = indexAtual === 0;
  const isLast = indexAtual === fotosUri.length - 1;

  const proximaImagem = () => {
    if (!isLast) setIndexAtual(indexAtual + 1);
  };

  const imagemAnterior = () => {
    if (!isFirst) setIndexAtual(indexAtual - 1);
  };

  return (
    <View style={styles.container}>
      
      {/* Botão de Remover (Lixeira) - Apaga a foto que está a ser vista */}
      <TouchableOpacity 
        style={styles.botaoFechar}
        onPress={() => onRemoverFoto(indexAtual)}
      >
        <FontAwesome name="remove" size={20} color="white" />
      </TouchableOpacity>

      {/* Seta Esquerda (Anterior) */}
      {fotosUri.length > 1 && (
        <TouchableOpacity
            onPress={imagemAnterior}
            disabled={isFirst}
            style={[styles.botao, { left: 10, opacity: isFirst ? 0.3 : 1 }]}
        >
            <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
      )}

      {/* Imagem Principal */}
      <Image
        source={{ uri: fotoAtual }}
        style={styles.imagem}
        resizeMode="contain"
      />

      {/* Seta Direita (Próxima) */}
      {fotosUri.length > 1 && (
        <TouchableOpacity
            onPress={proximaImagem}
            disabled={isLast}
            style={[styles.botao, { right: 10, opacity: isLast ? 0.3 : 1 }]}
        >
            <Ionicons name="chevron-forward" size={30} color="white" />
        </TouchableOpacity>
      )}
      
      {/* Indicador de Posição (Ex: 1 / 3) */}
      <View style={styles.indicador}>
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>
          {indexAtual + 1} / {fotosUri.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 500,
    height: 350,
    backgroundColor: "#222", // Fundo escuro para destacar as fotos
    borderRadius: 12,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#444',
    alignSelf: 'center'
  },
  placeholder: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderWidth: 2,
  },
  imagem: {
    width: "100%",
    height: "100%",
  },
  botao: {
    padding: 8,
    position: "absolute",
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
  },
  botaoFechar: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: 'rgba(220, 53, 69, 0.8)', // Vermelho para indicar exclusão
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicador: {
    position: 'absolute',
    bottom: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 2,
  }
});