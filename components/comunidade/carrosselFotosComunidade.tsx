import { useState } from "react";
import { View, Image, TouchableOpacity, Text, Dimensions, } from "react-native";
import { Fotos } from "@/utils/types/fotos";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/theme/color";
export default function CarrosselFotos({ fotos }: { fotos: Fotos[] }) {
  const [indexAtual, setIndexAtual] = useState(0);

  const larguraTela = Dimensions.get("window").width;
  const fotoAtual = fotos[indexAtual].codigoFoto;

  function proxima() {
    if (indexAtual < fotos.length - 1) {
      setIndexAtual(indexAtual + 1);
    }
  }

  function anterior() {
    if (indexAtual > 0) {
      setIndexAtual(indexAtual - 1);
    }
  }


  return (
    <View style={{ width: "100%", alignItems: "center" }}>


      <Image
        source={{ uri: fotoAtual }}
        style={{
          width: "100%",
          height: 400,
          borderRadius: 10
        }}
        resizeMode='contain'
      />

      {/* BOTÕES */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          marginTop: 10
        }}
      >
        <TouchableOpacity
          onPress={anterior}
          disabled={indexAtual === 0}
          style={{
            padding: 10,
            opacity: indexAtual === fotos.length - 1 ? 0.4 : 1,
            position: "absolute",
            bottom: 200,
            left: 5,

            marginLeft: 10,
            borderRadius: 100,
            backgroundColor: "#2564eb6e"
          }}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={indexAtual === 0 ? "black" : "white"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={proxima}
          disabled={indexAtual === fotos.length - 1}
          style={{
            padding: 10,
            opacity: indexAtual === fotos.length - 1 ? 0.4 : 1,
            position: "absolute",

            bottom: 200,

            right: 5,
            borderRadius: 100,
            backgroundColor: "#2564eb94"
          }}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={indexAtual === fotos.length - 1 ? "black" : "white"}
          />
        </TouchableOpacity>
      </View>


      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 10 }}>
        {fotos.map((_, index) => (
          <View
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,             
              backgroundColor: index === indexAtual ? Colors.Butao :"#ccc"
            }}
          />
        ))}
      </View>
    </View>
  );
}
