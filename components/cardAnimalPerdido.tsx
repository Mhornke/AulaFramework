import { Link } from "expo-router";
import { Image, StyleSheet, View, Text, TouchableOpacity, Linking } from "react-native";
import Color from "../theme/color";
import { AnimalPerdidoI } from "@/utils/types/animiasPerdidos";
import { FontAwesome } from "@expo/vector-icons";

const CONFIG_ETIQUETA = {
  PERDI: { texto: 'PROCURA-SE', cor: "#f00606ff" },
  ENCONTREI: { texto: 'ENCONTRADO', cor: "#f8e804ff" }
};



export default function CardIIII({ data }: { data: AnimalPerdidoI }) {
  const config = CONFIG_ETIQUETA[data.tipoAnuncio] || { texto: '', cor: "transparent" };

  // Garante que sempre haja uma foto válida
  const fotoCapa = (data.fotos && data.fotos.length > 0 && data.fotos[0].codigoFoto)
    ? data.fotos[0].codigoFoto.startsWith("http")
      ? data.fotos[0].codigoFoto
      : `https://placehold.co/400x400/png?text=Sem+Foto`
    : "https://placehold.co/400x400/png?text=Sem+Foto";

  function formatarDataPTBR(dataString: string): string {
  const data = new Date(dataString);
  if (isNaN(data.getTime())) return "-"; // data inválida

  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

  return (
    <View style={styles.container} key={data.id}>

      {/* Etiqueta de status */}
      <View style={styles.etiqueta}>
        <FontAwesome name="exclamation-triangle" size={20} color={config.cor} />
        <Text style={styles.etiquetaTexto}>{config.texto}</Text>
      </View>

      {/* Imagem */}
      <Image
        source={{ uri: fotoCapa }}
        style={styles.foto}
      />

      {/* Conteúdo do card */}
      <View style={styles.containerText}>
        <View style={{flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={{ color: Color.BrancoMaisNemTanto, fontWeight: "700" }}>{data.nome}</Text>
        
        <Text style={styles.Text}>{formatarDataPTBR(data.createdAt)}</Text>


        </View>

        <Text
          style={styles.Text}
          numberOfLines={5}
          ellipsizeMode="tail"
        >
          <FontAwesome name="info-circle" size={16} style={{ marginRight: 5 }} />
          {data.descricao}
        </Text>

        {data.localizacao && (
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            onPress={() =>
              Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.localizacao)}`)
            }
          >
            <FontAwesome name="map-marker" size={20} color="red" />
            <Text style={styles.Text}>Último local visto: {data.localizacao}</Text>
          </TouchableOpacity>
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
          <Text style={styles.Text}>Espécie: {data.especie?.nome}</Text>
          <Text style={styles.Text}>Visto em: {data.dataEncontrado}</Text>
        </View>
      </View>

      {/* Botão de detalhes */}
      <View style={styles.botao}>
        <Link href={`/datails/perdidos/${data.id}`}>
          <TouchableOpacity>
            <Text style={styles.botaoTexto}>
              <FontAwesome name="plus-circle" size={16} style={{ marginRight: 5 }} />
              Saber mais!
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.CorFundo,
    marginVertical: 15,
    borderRadius: 5,
  
   maxWidth:500,
    overflow: "hidden",
  },
  etiqueta: {
    position: "absolute",
    zIndex: 999,
    left: 5,
    top: 5,
    backgroundColor: "white",
    padding: 5,
    flexDirection: "row",
    gap: 5,
    borderRadius: 2,
    alignItems: "center",
  },
  etiquetaTexto: {
    fontSize: 16,
    fontWeight: "700",
    color: Color.Preto,
  },
  foto: {
    width: "100%",
    height: 400,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  containerText: {
    margin: 10,
    gap:20
  },
  Text: {
    marginTop: 5,
    color: Color.LetraCinza,
    fontSize: 14,
  },
  botao: {
    margin: 10,
    alignItems: "center",
  },
  botaoTexto: {
    backgroundColor: Color.Butao,
    color: "#ffffff",
    padding: 10,
    borderRadius: 3,
    width: 200,
    textAlign: "center",
    fontWeight: "600",
  },
});
