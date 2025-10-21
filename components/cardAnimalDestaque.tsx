import { Dimensions, Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import Color from "../theme/color";
import { AnimalI } from "../utils/types/animias";
import { FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";

const { width } = Dimensions.get("window")

export default function Card({ data }: { data: AnimalI }) {
  return (
    <View style={{ width: "100%", alignItems: "center" }} >
      {/* criar caminho para animais perdidos */}
      <TouchableOpacity
        onPress={() => {
          router.push("/perdidos")
        }}>
        <Text style={{ color: "red", margin: 20, textAlign: "center", fontWeight: "700" }}>Animais Perdidos</Text>
        <View style={styles.container}>
          <Image
            source={{ uri: data.foto }}
            style={{ width: "100%", maxWidth: 1200, height: 400 }}
            resizeMode="cover"
          />

          <View style={width > 600 ? styles.containerTextLarge : styles.containerText}>
            <Text style={styles.TextName}>{data.nome}</Text>
            <View style={width > 600 && styles.containerTextInfoLarge}>
              <Text style={styles.Text}>
                <FontAwesome name="paw" size={16} /> Espécie: {data.especie.nome}
              </Text>
              <Text style={styles.Text}>
                <FontAwesome name="birthday-cake" size={16} /> Idade: {data.idade} ano(s)
              </Text>
              <Text style={styles.Text}>
                <FontAwesome name="venus-mars" size={16} /> Sexo: {data.sexo}
              </Text>
              <Text style={styles.Text}>
                <MaterialIcons
                  name={data.castrado ? "check-circle" : "cancel"}
                  size={16}
                  color={data.castrado ? "green" : "red"}
                />{" "}
                {data.castrado ? "Castrado" : "Não castrado"}
              </Text>
              <Text style={styles.Text}>
                <Entypo name="resize-full-screen" size={16} /> Porte: {data.porte}
              </Text>
              <Text style={[styles.Text, { width: "100%", flexShrink: 1 }]} numberOfLines={1} ellipsizeMode="tail">
                <FontAwesome name="file-text" size={16} /> Descrição:
                {data.descricao}
              </Text></View>
          </View>

          <View style={styles.butao}>
            <Link href={`/datails/${data.id}?destaque=${data.destaque}`} asChild>
              <TouchableOpacity>
                <Text style={styles.botaoTexto}>
                  <FontAwesome name="heart" size={16} /> Adotar
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 1200,
    height: "100%",
    width: "100%",
    borderRadius: 5,
    marginBottom: 20,
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
  },
  containerTextLarge: {
    margin: 10,
    flexDirection: "column",

  },
  containerTextInfoLarge: {
    margin: 10,
    flexDirection: "row",
    gap: 20,
    justifyContent: "center"

  },
  Text: {
    marginLeft: 5,
    color: Color.LetraCinza,
    marginBottom: 5,
    fontSize: 14,
    maxWidth: 300
  },
  TextName: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
});
