import { Dimensions, Image, StyleSheet, View, Text, TouchableOpacity, Linking } from "react-native";
import { Link, router } from "expo-router";
import Color from "../theme/color";
import { AnimalPerdidoI } from "@/utils/types/animiasPerdidos";
import { FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";
import Colors from "../theme/color";

const { width } = Dimensions.get("window")
const CONFIG_ETIQUETA = {
  'PERDI': { texto: 'PROCURA-SE', cor: "#f00606ff" },
  'ENCONTREI': { texto: 'ENCONTRADO', cor: "#f8e804ff" }
}
export default function Card({ data }: { data: AnimalPerdidoI }) {
  const config = CONFIG_ETIQUETA[data.tipoAnuncio] || { texto: '', cor: "transparent" }
 
  return (
    <View style={{ width: "100%", alignItems: "center" }} >
      {/* criar caminho para animais perdidos */}
      <TouchableOpacity
        onPress={() => {
          router.push("/perdidos")
        }}
        style={{ width: "100%" }}>

        <Text style={{ color: "red", margin: 20, textAlign: "center", fontWeight: "700" }}>Animais Perdidos</Text>
        <View style={styles.container}>

          {data?.fotos?.length > 0 ? (
            <Image
              source={{ uri: data.fotos[0].codigoFoto }}
              style={{ width: "100%", height: 400 }}
            />
          ) : (
            <View style={{ width: "100%", height: 400, backgroundColor: "#ccc", justifyContent: "center", }}>
              <Text style={{ color: "#555" }}>Sem foto disponível</Text>
            </View>
          )}


          <Text style={styles.TextName}>{data.nome}</Text>
          <View style={styles.containerTextInfoLarge}>

            <View style={[styles.tegs, { flexDirection: "row", paddingHorizontal: 5, gap: 2 }]}>
              <FontAwesome name="paw" size={16} color={Colors.Butao}/>
              <Text style={styles.Text}>
                {data.especie?.nome}
              </Text>
            </View>

            <View style={[styles.tegs, { flexDirection: "row" }]}>
              <FontAwesome name="map-marker" size={20} color={"red"} />
              <TouchableOpacity
                onPress={() =>

                  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.localizacao)}`)
                }
              >

                <Text style={styles.Text}>
                  Ultimo lugar visto
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.tegs, { flexDirection: "row", paddingHorizontal: 6, gap: 5 }]}>

              <FontAwesome name="exclamation-triangle" size={16} color={config.cor} />
              <Text style={styles.Text}>
                {config.texto}
              </Text>
            </View>

          </View>


          <View style={styles.containerbutao}>

            <TouchableOpacity
              onPress={() => {
                router.push(`/datails/perdidos/${data.id}`)
              }}>
              <View style={[styles.botao,{backgroundColor:'white'}]}>
                <FontAwesome name="info-circle" size={16} color={Colors.Preto} />
                <Text style={[styles.botaoTexto,{ color:Colors.Preto}]}>
                  Informações                  
                  </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                router.push("/perdidos")
                
              }}>
              

              <View style={styles.botao}>
                <FontAwesome name="plus-circle" size={16}  color={"white"}/>
                 <Text style={styles.botaoTexto}>
                 Outros animais
                  </Text>
              </View>
              

            </TouchableOpacity>

          </View>
        </View>
      </TouchableOpacity >
    </View >
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
  containerbutao: {
    margin: 10,
   
    flexDirection:"row",
     justifyContent:"center",
     gap:100
  },
  botaoTexto: {    
    color: "#ffffff",    
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
    color: Colors.CorLetraSecundaria,
    fontWeight: "500"

  },
  TextName: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  tegs: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#fdfdfdff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderWidth: 1,
    borderColor: "#ccc",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  botao:{
backgroundColor: Colors.Butao,
padding:10,
paddingHorizontal:15,
borderRadius:5,
flexDirection:"row",
gap:5,
justifyContent:"center",
alignItems:"center"
  }
});
