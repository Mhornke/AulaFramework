import { Dimensions, Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import Color from "../theme/color";
import { AnimalI } from "../utils/types/animias";

const { width } = Dimensions.get("window");

export default function Card({ data }: { data: AnimalI }) {
  return (
    <View style={styles.container}>

      <Image
        source={{ uri: data.foto }}
        style={{ width: "100%", height: 400 }} // margem de 20px dos lados
      />

      <View style={styles.containerText}>

        <Text style={styles.TextName}>{data.nome}</Text>
        <Text style={styles.Text}>{data.especie.nome}</Text>
        <Text style={styles.Text}>{data.idade}</Text>
        <Text style={styles.Text}>{data.sexo}</Text>
        <Text style={styles.Text}>{
          data.castrado ? 'Castrado' : 'Não castrado'}</Text>
        <Text style={styles.Text}>{data.porte}</Text>
        <Text style={styles.Text}>{data.descricao}</Text>
      </View>
      <View style={styles.butao}>
        <Link href={`/datails/${data.id}`}>
          <TouchableOpacity>
            <Text
              style={{
                backgroundColor: Color.Butao,
                color: "#ffffff",
                padding: 10,
                borderRadius: 3,
                width: 200,
                margin: 5,
                textAlign: "center",
              }}
            >
              Adotar
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
    borderRadius: 5,
    width: "80%",


  },
  butao: {
    margin: 10,
    color: "white",
  },
  containerText: {
    margin: 10,
  },
  Text: {
    marginLeft: 5,
    color: Color.LetraCinza,
  },
  TextName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
