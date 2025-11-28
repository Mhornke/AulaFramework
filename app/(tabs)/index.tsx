import { Dimensions, Image, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";

import React, { useEffect, useRef, useState } from "react";
import CardII from "../../components/cardAnimalNormal";
import CardIII from "../../components/cardAnimalNormalAdotado"


import Carrossel from "../../components/carrossel";
import Footer from "../../components/footer";
import Pesquisa from "../../components/pesquisa";
import { AnimalI } from "../../utils/types/animias";

import { FontAwesome } from "@expo/vector-icons";
import { URL_Adocao, URL_GestaoPet } from "@/utils/url";
import { useAuth } from "@/context/AuthContext";


export default function Home() {
    const [animais, setAnimais] = useState<AnimalI[]>([])
    const [animaisDestaque, setAnimaisDestaque] = useState<AnimalI[]>([])
    const [quantVisivelAdotados, setQuantVisivelAdotados] = useState(4)
    const scrollViewRef = useRef<ScrollView>(null)
const {user} = useAuth()
    const scrollParaTopo = () => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    };
    console.log(animais);
    const { width } = Dimensions.get('window')
console.log(user?.token);


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

        },
        botaoFlutuante: {
            zIndex: 9999,
            position: "absolute",
            right: 20,
            bottom: 40,
            backgroundColor: "#333",
            padding: 15,
            borderRadius: 30,
            elevation: 5,
        },
        cardTableAdotados: {
            flexWrap: "wrap",
            justifyContent: "space-around",
            padding: 20,
            width: "100%",
            alignItems: "center",
            marginTop: 200
        },

        contentWrapper: {
            width: '100%',
            maxWidth: 1200,
            alignSelf: 'center',
            paddingHorizontal: 20,
        },
    });



    useEffect(() => {

        async function buscaDados() {

            try {
                // const response = await fetch(`https://api-adocao-git-main-dieizons-projects.vercel.app/animais`)
                const response = await fetch(`${URL_Adocao}/animais`)
                const responseI = await fetch(`${URL_Adocao}/animais-perdidos`)
                const dados = await response.json()
                const dadosI = await responseI.json()

                setAnimais(dados)
                setAnimaisDestaque(dadosI)
            } catch (error) {
                console.log("erro ao buscar dados", error);

            }
        }


        buscaDados()

    }, []);

    const animaisDisponiveis = animais.filter(animais => animais.disponivel === true)
    const animaisAdotados = animais.filter(animais => animais.disponivel === false)

    const listaAnimais = animaisDisponiveis.map((animal) => (

        <CardII key={animal.id} data={animal as AnimalI} />


    )
    )
    const listaAnimaisAdotados = animaisAdotados.slice(0, quantVisivelAdotados).map((animal) => (

        <CardIII key={animal.id} data={animal as AnimalI} />


    )
    )


    if (!animais) return <Text>Carregando...</Text>;
    if (width < 600) {


        return (
            <>
                <ScrollView ref={scrollViewRef}
                    showsVerticalScrollIndicator={false}>

                    <Pesquisa />
                    <View>
                        <Text style={styles.text}>- Seu novo amigo está à sua espera</Text>
                    </View>

                    {animaisDestaque.length > 0 ? (
                        <View style={{ alignItems: "center", marginTop: 20 }}>

                            <Carrossel data={animaisDestaque} />
                        </View>
                    ) : (
                        <Text style={{ color: "#fff", textAlign: "center" }}>Nenhum animal em destaque no momento.</Text>
                    )}
                    <View style={styles.card}>

                        {listaAnimais}
                    </View>
                    <Footer />
                </ScrollView>
                <TouchableOpacity style={styles.botaoFlutuante} onPress={scrollParaTopo}>
                    <FontAwesome name="arrow-up" size={15} color="#fff" />
                </TouchableOpacity>
            </>
        );
    } else if (width >= 600) {

        return (
            < >
                <ScrollView keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                    ref={scrollViewRef}
                >
                    <View style={[styles.contentWrapper, {}]}>

                        <View style={{ flex: 1,  }}>
                            <Pesquisa />
                        </View>
                        {animaisDestaque.length > 0 ? (
                            
                            <View style={{ alignItems: "center", justifyContent:"center", flex: 10 }}>
                                <Text>Nos ajude a encontrar -</Text>

                                <Carrossel data={animaisDestaque} />

                            </View>

                        ) : (
                            <View style={{ alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                                <Text style={{ color: "black", textAlign: "center", marginBottom: 10 }}>
                                    Nenhum animal em destaque no momento.
                                </Text>

                                <Image
                                    source={require('../../assets/images/imagenVazia.jpg')}
                                    style={{ width: 150, height: 150 }}
                                />
                            </View>
                        )
                        }

                        <View style={[styles.cardTable,
                        {
                            flexDirection: "column",                           
                            paddingTop: 50,
                            
                        }]}>
                            <Text style={styles.text}>- Seu novo amigo está à sua espera</Text>

                            {listaAnimais}
                        </View>

                        <View style={styles.cardTableAdotados}>
                            <Text style={{ fontWeight: "700", textAlign: "center", fontSize: 18, marginBottom: 10, width: "100%" }}>
                                Amigos que Já Encontraram um Lar
                            </Text>

                            <View style={{ flexWrap: "wrap", flexDirection: "row", gap: 100, justifyContent: "center" }}>
                                {listaAnimaisAdotados}

                            </View>
                            <TouchableOpacity
                                style={{ marginTop: 10, padding: 10, }}
                                onPress={() => setQuantVisivelAdotados((prev) => prev + 4)}
                            >
                                <Text style={{ textAlign: "center", color: "blue" }}>Ver mais</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <Footer />
                   
                </ScrollView>
                <TouchableOpacity style={styles.botaoFlutuante} onPress={scrollParaTopo}>
                    <FontAwesome name="arrow-up" size={15} color="#fff" />
                </TouchableOpacity>
            </>
        );



    }



}


