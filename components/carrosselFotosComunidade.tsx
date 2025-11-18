import { useState } from "react";
import { View, Image, TouchableOpacity, Text, Dimensions,  } from "react-native";
import { Fotos } from "@/utils/types/fotos";

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
            opacity: indexAtual === 0 ? 0.4 : 1,
            backgroundColor: "#ddd",
            borderRadius: 8,
            marginLeft: 10
          }}
        >
          <Text>◀</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={proxima}
          disabled={indexAtual === fotos.length - 1}
          style={{
            padding: 10,
            opacity: indexAtual === fotos.length - 1 ? 0.4 : 1,
            backgroundColor: "#ddd",
            borderRadius: 8,
            marginRight: 10
          }}
        >
          <Text>▶</Text>
        </TouchableOpacity>
      </View>

      {/* INDICADOR */}
      <Text style={{ marginTop: 5, color: "#555" }}>
        {indexAtual + 1} / {fotos.length}
      </Text>

    </View>
  );
}
