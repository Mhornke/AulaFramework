import { Image, StyleSheet, View, Text, Dimensions } from "react-native";
import { AnimalI } from "../utils/types/animias";
import { FontAwesome } from "@expo/vector-icons";

// Pega a largura da tela para calcular tamanho responsivo
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width / 2) - 20; // Divide por 2 e tira margens

export default function CardIII({ data }: { data: AnimalI }) {
  return (
    <View style={styles.container}>
      <Image
        // Dica: Verifique se sua API retorna 'foto' ou 'fotos[0]'
        source={{ uri: data.foto }} 
        style={styles.image}
        resizeMode="cover"
      />

      {/* Overlay com gradiente simulado (fundo escuro transparente) */}
      <View style={styles.overlay}>
        <Text style={styles.textName} numberOfLines={1}>{data.nome}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.patinhaContainer}>
             {/* Exemplo: Renderiza patinhas baseado no porte ou idade (lógica opcional) */}
            <FontAwesome name="paw" size={14} color="#FFD700" />
            <Text style={styles.subText}> Adotado</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH, 
    height: 220,
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 12,
    overflow: "hidden", // Garante que a imagem respeite a borda arredondada
    
    // Sombras (Elevation para Android, Shadow para iOS)
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Fundo preto com 60% de transparência
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)'
  },
  textName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  patinhaContainer: {
    flexDirection: "row",
    alignItems: 'center',
    gap: 5
  },
  subText: {
    color: '#eee',
    fontSize: 12,
    fontWeight: "500"
  }
});