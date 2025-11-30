import { Link } from "expo-router";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Color from "../theme/color";
import { AnimalI } from "../utils/types/animias";
import { FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function CardII({ data }: { data: AnimalI }) {
  const sex = data?.sexo == "MACHO";
  const shadowSex = sex ? '#c523da' : '#23a6da';
  return (
    <View style={styles.conteiner} key={data.id}>
      <Image
        source={{ uri: data.fotos[0].codigoFoto }}
        style={{ width: 400, height: 400, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
      />

      <Text style={[styles.TextName, {
        textShadowRadius: 20,
        elevation: 5, textShadowColor: sex ? 'rgba(53, 3, 59, 0.88)' : "#08041df1"
      }]}>{data.nome}</Text>

      <View style={[styles.containerText, { flexWrap: "wrap", flexDirection: "row", justifyContent: "center", gap: 5 }]}>
        <Text style={styles.Text}><FontAwesome name="paw" size={16} color='#6d6601' /> Espécie: {data.especie.nome}</Text>
        <Text style={styles.Text}><FontAwesome name="birthday-cake" size={16} color='pink' /> Idade: {data.idade} ano(s)</Text>
        <Text style={styles.Text}><FontAwesome name="venus-mars" size={16} color={shadowSex} /> Sexo: {data.sexo}</Text>
        <Text style={styles.Text}><Entypo name="resize-full-screen" size={18} color={"white"} /> Porte: {data.porte}</Text>
        <Text style={styles.Text}>
          <MaterialIcons
            name={data.castrado ? "check-circle" : "cancel"}
            size={16}
            color={data.castrado ? "green" : "red"}
          />{" "}
          {data.castrado ? "Castrado" : "Não castrado"}
        </Text>
        <Text style={[styles.Text, { width: "100%", flexShrink: 1 }]} numberOfLines={2} ellipsizeMode="tail" >
          <FontAwesome name="info" size={16} color={Color.Butao} /> Descrição:
          <Text style={{ fontWeight: "400" }}>{data.descricao}</Text></Text>
      </View>

      <View style={styles.butao}>
        <Link href={`/datails/${data.id}`} key={data.id}>
          <TouchableOpacity>
            <Text style={styles.botaoTexto}>
              <FontAwesome name="heart" size={16} /> Adotar
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteiner: {
    top: 20,
    backgroundColor: Color.CorFundo,
    marginVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    maxWidth: 400
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
    maxWidth: 300
  },
  Text: {
    marginLeft: 5,
    color: Color.LetraCinza,
    marginBottom: 4,
    fontSize: 14,
  },
  TextName: {
    position: "absolute",
    fontSize: 30,
    fontWeight: "bold",
    color: Color.Butao,
    marginBottom: 8,



  },
});
