import { Dimensions, FlatList, ScrollView, StyleSheet, Text, View } from "react-native";

import React, { useEffect, useState } from "react";
import CardII from "../../components/cardAnimalNormal";
import Card from "../../components/cardAnimalDestaque"
//import dados from "../dados.json";
//import { URL_API } from "@env";
import Carrossel from "@/components/carrossel";

import Pesquisa from "@/components/pesquisa";
import { AnimalI } from "../../utils/types/animias";
import Colors from "@/theme/color";



export default function Home() {
    const [animais, setAnimais] = useState<AnimalI[]>([])
    const [animaisDestaque, setAnimaisDestaque] = useState<AnimalI[]>([])

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

        async function buscaDadosDestaque() {

            try {
                const response = await fetch(`http://localhost:3004/animais`)
                const dados = await response.json()
                console.log(response);
                console.log(response);

                setAnimaisDestaque(dados)

            } catch (error) {
                console.log("erro ao buscar dados", error);

            }
        }
        buscaDados()
        buscaDadosDestaque()
    }, []);


    const listaAnimais = animais.map((animal) => (

        <CardII key={animal.id} data={animal as AnimalI} />


    )
    )

    // const listaAnimaisDestaque = animaisDestaque.map((animal) => (
    //     <Card key={animal.id} data={animal} />
    // ))




    // const listaPet = dados.pets.map((pet) => {
    //     console.log(pet);

    //     return <Card key={pet.id} pet={pet} />;
    // });
    if (!animais) return <Text>Carregando...</Text>;
    if (width < 600) {


        return (

            <ScrollView>

                <Pesquisa />
                <View>
                </View>
                <Text style={styles.containerText}>
                    

                    <Text style={styles.text}>- Seu novo amigo está à sua espera</Text>
                </Text>
               <Carrossel data={animaisDestaque} />
                <View style={styles.card}>
                    {listaAnimais}
                </View>
            </ScrollView>

        );
    } else if (width >= 600) {

        return (

            <ScrollView keyboardShouldPersistTaps='handled'>
                <Pesquisa />
                <View style={styles.containerText}>
                
                    <Text style={styles.text}>- Seu novo amigo está à sua espera</Text>
                </View>
                                              
                <Carrossel data={animaisDestaque} />
                
                <View style={styles.cardTable}>
                    {listaAnimais}
                </View>

            </ScrollView>

        );



    }



}


