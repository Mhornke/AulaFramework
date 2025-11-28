import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "./cardAnimalDestaque";
import { AnimalI } from "../utils/types/animias";
import Colors from "../theme/color";

const { width } = Dimensions.get("window");

type Props = {
  data: AnimalI[];
};

export default function Carrossel({ data }: Props) {
  const [indexAtual, setIndexAtual] = useState(0);

  useEffect(() => {
    const INTERVALO = 5000;

    const intervaloId = setInterval(() => {
      setIndexAtual((prevIndex) =>
        prevIndex === data.length - 1 ? 0 : prevIndex + 1)
    }, INTERVALO)
    return () => clearInterval(intervaloId)
  }, [indexAtual, data.length])

  const handlePrev = () => {
    if (indexAtual > 0) {
      setIndexAtual(indexAtual - 1);
    }
  };

  const handleNext = () => {
    if (indexAtual < data.length - 1) {
      setIndexAtual(indexAtual + 1);
    }
  };

  const itemAtual = data[indexAtual];

  return (
    <View style={styles.container}>      

      {/* Card central */}
      <View style={{ alignItems: "center",width:"99%" }}>
        <Card data={itemAtual} />
      </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    
    backgroundColor: Colors.CorFundo,


  },
  arrowButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    position: "absolute",
    zIndex: 1,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
});
