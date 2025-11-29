import React, { useState, useEffect } from "react";
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
import Colors from "@/theme/color";

const { width } = Dimensions.get("window");

type Props = {
  data: Fotos[];
};

export default function CarrosselFotos({ data }: Props) {

  const [indexAtual, setIndexAtual] = useState(0);
  console.log("o que vem no index", indexAtual);

  useEffect(() => {
    setIndexAtual(0);
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#777" }}>Nenhuma foto disponível</Text>
      </View>
    );
  }

  const imagemAtual = data?.[indexAtual];


  const proximaImagem = () => {
    if (indexAtual < data.length - 1) {
      setIndexAtual(indexAtual + 1);
    }
  }

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
    
      <View style={{
        flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 10, position:"absolute", bottom:20

      }}>
        {data.map((_, index) => (
          <View
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: index === indexAtual ? Colors.Butao : "#ccc"
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 700,
    height: 400,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#fff",

  },
  imagem: {
    width: "100%",
    height: "100%",

  },
  botao: {
    padding: 10,
    position: "absolute",
    zIndex: 2,
    borderRadius: 100,
    backgroundColor: "#2564eb6e"


  },

});
