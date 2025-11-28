import { Link } from "expo-router";
import { Image, StyleSheet, View, Text, TouchableOpacity, Linking } from "react-native";
import Color from "../theme/color";
import { AnimalPerdidoI } from "@/utils/types/animiasPerdidos";
import { FontAwesome } from "@expo/vector-icons";
const CONFIG_ETIQUETA = {
  'PERDI': { texto: 'PROCURA-SE', cor: "#f00606ff" },
  'ENCONTREI': { texto: 'ENCONTRADO', cor: "#f8e804ff" }
}
const LOCALIZACAO = {
  '': { texto: "none" },

}
export default function CardIIII({ data }: { data: AnimalPerdidoI }) {
  const config = CONFIG_ETIQUETA[data.tipoAnuncio] || { texto: '', cor: "transparent" }
  const fotoCapa = (data.fotos && data.fotos.length > 0)
    ? data.fotos[0].codigoFoto
    : "https://placehold.co/400x400/png?text=Sem+Foto";

  return (
    <View style={styles.conteiner} key={data.id}>

      <View style={{
        position: "absolute",
        zIndex: 999,
        left: 5,
        top: 5,
        backgroundColor: "white",
        padding: 5,
        flexDirection: "row",
        gap: 10,
        borderRadius: 2,
        alignItems: "center",
        justifyContent: "center"
      }}>
        <FontAwesome name="exclamation-triangle" size={20} color={config.cor} />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: Color.Preto,

          }}
        >
          {config.texto}
        </Text>
      </View>

      <Image
        source={{ uri: fotoCapa }}
        style={{
          width: 400,
          height: 400,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
        }}
      />

      <View style={styles.containerText}>
        <View>
          <Text style={{ color: Color.BrancoMaisNemTanto }}> {data.nome}</Text>
        </View>

        <View>
          <Text style={{ color: Color.BrancoMaisNemTanto }}>Poste criado em:</Text>
          <Text style={{ color: Color.BrancoMaisNemTanto }}>{data.createdAt}</Text>
        </View>

        <View>
          <Text
            style={[styles.Text, { width: "100%", flexShrink: 1 }]}
            numberOfLines={5}
            ellipsizeMode="tail"
          >
            <FontAwesome name="info-circle" size={16} style={{ margin: 10 }} />
            <Text style={{ fontWeight: "400", color: Color.BrancoMaisNemTanto }}>{data.descricao}</Text>
          </Text>
        </View>
        {data.localizacao && (
          <View style={[styles.tegs, { flexDirection: "row" }]}>
            <FontAwesome name="map-marker" size={20} color={"red"} />
            <TouchableOpacity
              onPress={() =>

                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.localizacao)}`)
              }
            >
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Text style={styles.Text}>
                  Ultimo lugar visto:
                </Text>
                <Text style={styles.Text}>
                  {data.localizacao}
                </Text>

              </View>

            </TouchableOpacity>
          </View>
        )}



        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ color: Color.BrancoMaisNemTanto }}>Ultima data Visto</Text>
            <Text style={{ color: Color.BrancoMaisNemTanto }}>{data.dataEncontrado}</Text>
          </View>
          <View>
            <Text
              style={[styles.Text, { width: "100%", flexShrink: 1 }]}
              numberOfLines={5}
              ellipsizeMode="tail"
            >
              <FontAwesome name="info-circle" size={16} style={{ margin: 10 }} />
              <Text style={{ fontWeight: "400", color: Color.BrancoMaisNemTanto }}>{data.localizacao}</Text>
            </Text>
          </View>
          <Text style={styles.Text}>
            <FontAwesome name="paw" size={16} /> {data.especie?.nome}
          </Text>

        </View>
      </View>

      <View style={styles.butao}>
        <Link href={`/datails/perdidos/${data.id}`} key={data.id}>
          <TouchableOpacity>
            <Text style={styles.botaoTexto}>
              <FontAwesome
                name="plus-circle"
                size={16}
                style={{ marginHorizontal: 10 }}
              />
              Saber mais!
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteiner: {
    backgroundColor: Color.CorFundo,
    marginVertical: 15,
    borderRadius: 5,
    overflow: "hidden",
  },
  butao: {
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
  containerText: {
    margin: 10,
    maxWidth: 380,
    height: 150,
    justifyContent: "space-between",
  },
  Text: {
    marginLeft: 5,
    color: Color.LetraCinza,
    marginBottom: 4,
    fontSize: 14,
  },
});
