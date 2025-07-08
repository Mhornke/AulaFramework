import { Image, StyleSheet, View, Text } from "react-native";
import { AnimalI } from "../utils/types/animias";
import { FontAwesome } from "@expo/vector-icons";

export default function CardIII({ data }: { data: AnimalI }) {
  return (
    <View style={styles.conteiner} key={data.id}>
      <Image
        source={{ uri: data.foto }}
        style={styles.image}
      />

      {/* Overlay do nome e ícones */}
      <View style={styles.overlay}>
        <Text style={styles.TextName}>{data.nome}</Text>
        <View style={styles.patinhaContainer}>
          <FontAwesome name="paw" size={18} color="#fff" />
          <FontAwesome name="paw" size={18} color="#fff" style={{ marginLeft: 8 }} />
          <FontAwesome name="paw" size={18} color="#fff" style={{ marginLeft: 8 }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteiner: {
    width: 250,
    height: 250,
    backgroundColor: "#182f92",
    marginVertical: 15,
    borderRadius: 5,
    overflow: "hidden",
  
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 6,
  },
  TextName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  patinhaContainer: {
    flexDirection: "row",
  },
});
