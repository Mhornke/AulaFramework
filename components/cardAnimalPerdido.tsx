import { Link } from "expo-router";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Color from "../theme/color";
import { AnimalII } from "../utils/types/animiasPerdidos";
import { FontAwesome } from "@expo/vector-icons";

export default function CardIIII({ data }: { data: AnimalII }) {
  return (
    <View style={styles.conteiner} key={data.id}>
      <Text
        style={{
          color: "red",
          position: "absolute",
          zIndex: 999,
          fontSize: 20,
          fontWeight: "700",
          left: 5,
          top: 5,
          backgroundColor: "white",
          padding: 3,
        }}
      >
        {data.status}
      </Text>

      <Image
        source={{ uri: data.foto }}
        style={{
          width: 400,
          height: 400,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
        }}
      />

      <View style={styles.containerText}>
        <View>
          <Text
            style={[styles.Text, { width: "100%", flexShrink: 1 }]}
            numberOfLines={5}
            ellipsizeMode="tail"
          >
            <FontAwesome name="info-circle" size={16} style={{ margin: 10 }} />
            <Text style={{ fontWeight: "400" }}>{data.descricao}</Text>
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Text style={styles.Text}>
            <FontAwesome name="paw" size={16} /> {data.especie}
          </Text>
          <Text style={styles.Text}>
            <FontAwesome name="venus-mars" size={16} /> {data.sexo}
          </Text>
          <Text style={styles.Text}>
            <FontAwesome name="arrows-v" size={16} /> {data.porte}
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
