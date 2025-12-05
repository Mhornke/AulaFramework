import { Image, StyleSheet, View, Text, Dimensions } from "react-native";
import { AnimalI } from "../utils/types/animias";
import { FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width / 2) - 20; 

export default function CardIII({ data }: { data: AnimalI }) {
   const uriImagem = (data.fotos && data.fotos.length > 0) 
      ? data.fotos[0].codigoFoto // <--- Pega a primeira foto do array
      : "https://placehold.co/400x400/png?text=Sem+Foto";
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: uriImagem}} 
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.overlay}>
        <Text style={styles.textName} numberOfLines={1}>{data.nome}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.patinhaContainer}>
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
    overflow: "hidden", 
    
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
    backgroundColor: "rgba(0, 0, 0, 0.6)", 
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