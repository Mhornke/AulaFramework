import { ScrollView, Text, View, StyleSheet } from "react-native";
import Header from "./componts/header";
import { useEffect, useState } from "react";
import React from "react"
import Card from "./componts/card";
//import dados from "../dados.json";
import { AnimalI } from "../utils/types/animias";



export default function Index() {
  const [animais, setAnimais] = useState<AnimalI[]>([])
console.log(animais);


  useEffect(() => {

    async function buscaDados() {

      try {
        const response = await fetch(`${process.env.URL_API}/animais`)
        const dados = await response.json()
        console.log(response);
console.log(response);

        setAnimais(dados)

      } catch (error) {
        console.log("erro ao buscar dados", error);

      }
    }
    buscaDados()

  },[]);


  const listaAnimais = animais.map((animal) => (
    <Card data={animal} key={animal.id} />
  ))
  // const listaPet = dados.pets.map((pet) => {
  //   console.log(pet);

  //   return <Card key={pet.id} pet={pet} />;
  // });

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
        {listaAnimais}
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

