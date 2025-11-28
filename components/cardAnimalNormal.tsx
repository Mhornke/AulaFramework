import { Link } from "expo-router";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Color from "../theme/color";
import { AnimalI } from "../utils/types/animias";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

export default function CardII({ data }: { data: AnimalI }) {

  return (
    <View style={styles.conteiner} key={data.id}>
      <Image
        source={{ uri: data.fotos[0].codigoFoto }}
        style={{ width: 400, height: 400, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
      />

      <View style={styles.containerText}>
        <Text style={styles.TextName}>{data.nome}</Text>
        
        <Text style={styles.Text}><FontAwesome name="paw" size={16} /> Espécie: {data.especie.nome}</Text>
        <Text style={styles.Text}><FontAwesome name="birthday-cake" size={16} /> Idade: {data.idade} ano(s)</Text>
        <Text style={styles.Text}><FontAwesome name="venus-mars" size={16} /> Sexo: {data.sexo}</Text>
        <Text style={styles.Text}><FontAwesome name="arrows-v" size={16} /> Porte: {data.porte}</Text>
         <Text style={styles.Text}>
          <MaterialIcons
            name={data.castrado ? "check-circle" : "cancel"}
            size={16}
            color={data.castrado ? "green" : "red"}
          />{" "}
          {data.castrado ? "Castrado" : "Não castrado"}
        </Text>
        <Text style={[styles.Text, {width:"100%", flexShrink:1}]} numberOfLines={2} ellipsizeMode="tail" >
          <FontAwesome name="file-text" size={16} /> Descrição: 
          <Text style={{fontWeight:"400"}}>{data.descricao}</Text></Text>
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
    maxWidth:300
  },
  Text: {
    marginLeft: 5,
    color: Color.LetraCinza,
    marginBottom: 4,
    fontSize: 14,
  },
  TextName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
});
