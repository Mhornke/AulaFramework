import { ScrollView, Text, View, StyleSheet, Dimensions } from "react-native";
import Header from "../../components/header";
import { useEffect, useState } from "react";
import React from "react"
import Card from "../../components/card";
//import dados from "../dados.json";
//import { URL_API } from "@env";


import { AnimalI } from "../../utils/types/animias";
import Pesquisa from "@/components/pesquisa";



export default function Home() {
    const [animais, setAnimais] = useState<AnimalI[]>([])
    console.log(animais);
    const { width, height } = Dimensions.get('window')


    const styles = StyleSheet.create({
        containerText: {
            flexDirection: "row",
            flexWrap: "wrap",
            height: 20,
            alignItems: "flex-end",
            paddingLeft: 20,
        },
        text: {
            fontSize: 15,
            fontWeight: '600',
        },

        card: {

            justifyContent: "center",
            alignItems: "center",
            padding: 10,
        },
        cardTable: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            padding: 20,




        }
    });

    useEffect(() => {

        async function buscaDados() {

            try {
                const response = await fetch(`https://api-adocao-git-main-dieizons-projects.vercel.app/animais`)
                const dados = await response.json()
                console.log(response);
                console.log(response);

                setAnimais(dados)

            } catch (error) {
                console.log("erro ao buscar dados", error);

            }
        }
        buscaDados()

    }, []);


    const listaAnimais = animais.map((animal) => (
        <Card data={animal} key={animal.id} />
    ))
    // const listaPet = dados.pets.map((pet) => {
    //     console.log(pet);

    //     return <Card key={pet.id} pet={pet} />;
    // });
    if (!animais) return <Text>Carregando...</Text>;
    if (width < 600) {


        return (

            <ScrollView>
                <Header />
                <Pesquisa />
                <View>
                </View>
                <Text style={styles.containerText}>
                    <Text style={{ fontWeight: "700", fontSize: 20 }}>Seu<Text style={styles.text}>.Pet</Text></Text>
                    
                    <Text style={styles.text}>- Seu novo amigo está à sua espera</Text>
                </Text>
                <View style={styles.card}>
                    {listaAnimais}
                </View>
            </ScrollView>

        );
    } else if (width >= 600) {

        return (

            <ScrollView>
                <Header />
                <Pesquisa />
                <View style={styles.containerText}>
                    <Text style={{ fontWeight: "700", fontSize: 20 }}>Seu<Text style={styles.text}>.Pet</Text></Text>

                    <Text style={styles.text}>- Seu novo amigo está à sua espera</Text>
                </View>
                <View style={styles.cardTable}>
                    {listaAnimais}
                </View>

            </ScrollView>

        );



    }



}


