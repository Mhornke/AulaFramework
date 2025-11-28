import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Fotos } from "../utils/types/fotos";

const { width } = Dimensions.get("window");

type Props = {
  data: Fotos[];
};

export default function CarrosselFotos({ data }: Props) {
  const [indexAtual, setIndexAtual] = useState(0);

  const imagemAtual = data[indexAtual];

  const proximaImagem = () => {
    if (indexAtual < data.length - 1) {
      setIndexAtual(indexAtual + 1);
    }
  };

  const imagemAnterior = () => {
    if (indexAtual > 0) {
      setIndexAtual(indexAtual - 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={imagemAnterior}
        disabled={indexAtual === 0}
        style={[styles.botao, { left: 5 }]}
      >
        <Ionicons
          name="chevron-back"
          size={30}
          color={indexAtual === 0 ? "black" : "white"}
        />
      </TouchableOpacity>

      <Image
        source={{ uri: imagemAtual.codigoFoto }}
        style={styles.imagem}
        resizeMode="cover"
      />

      <TouchableOpacity
        onPress={proximaImagem}
        disabled={indexAtual === data.length - 1}
        style={[styles.botao, { right: 5 }]}
      >
        <Ionicons
          name="chevron-forward"
          size={30}
          color={indexAtual === data.length - 1 ? "black" : "white"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 700,
    height: 600,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#fff",
    
  },
  imagem: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  botao: {
    padding: 10,
    position: "absolute",
    zIndex: 2,

  },

});
