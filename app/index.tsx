import { ScrollView, Text, View, StyleSheet } from "react-native";
import Header from "./componts/header";

import { Link } from "expo-router";
import Card from "./componts/card";
import dados from "../dados.json";

export default function Index() {
  const listaPet = dados.pets.map((pet) => {
    console.log(pet);

    return <Card key={pet.id} pet={pet} />;
  });

  return (
    <ScrollView>
      <View>
        <Header />
      </View>
      <View style={styles.containerText}>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>Seu</Text>
        <Text style={styles.text}>.Pet</Text>
        <Text style={styles.text}>- Seu novo amigo está à sua espera</Text>
      </View>
      <View style={styles.card}>
        <Text>Lista de animais com map</Text>
        {listaPet}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  containerText: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 15,
    fontWeight: "semibold",
  },

  card: {
    flex: 1,
    alignItems: "center",
  },
});
// troca de email e nome
