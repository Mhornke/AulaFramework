import { Dimensions, Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, ImageBackground } from "react-native";

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
import Colors from "@/theme/color";


export default function Home() {
    const [animais, setAnimais] = useState<AnimalI[]>([])
    const [animaisDestaque, setAnimaisDestaque] = useState<AnimalI[]>([])
    const [quantVisivelAdotados, setQuantVisivelAdotados] = useState(4)
    const scrollViewRef = useRef<ScrollView>(null)
    const { user } = useAuth()
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


        backgroundImage: {
            height: 400,
            width: width,     
            maxWidth:1200,
            marginBottom:100
        },

        imageStyle: {
            resizeMode: 'cover',
            maxHeight: 380,
            width: "100%",
            borderRadius: 4
        },
        overlayContainer: {
            padding: 20,
            borderRadius: 10,
            width: '100%',
            alignItems: 'center',
        },
        titleText: {
            fontWeight: "700",
            fontSize: 40,
            color: Colors.Butao,
            marginBottom: 20,
            textAlign: 'left',
        },
        bodyText: {
            fontWeight: "400",
            fontSize: 30,
            color: "white",
            textAlign: "center",
        }
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
                    showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: "white" }}
                >

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

                        <View style={{ flex: 1, top: 30, zIndex: 9999 }}>
                            <Pesquisa />
                        </View>
                        {animaisDestaque.length > 0 ? (

                            <View style={{ alignItems: "center", gap: 20, flex: 10 }}>
                                <View style={{ alignItems: "center", justifyContent: "center", flex: 10 }}>

                                    <View style={{ width: "100%", alignItems: "center", flex: 1, }}>
                                        <ImageBackground
                                            source={require('../../assets/images/fundo.jpg')}
                                            style={[styles.backgroundImage,]}
                                            imageStyle={styles.imageStyle}
                                        >

                                            <Text style={[styles.titleText, { left: 40,  }]}>
                                                Amor e Carinho
                                            </Text>
                                            <Text style={[styles.titleText, { left: 280, bottom:20 }]}>
                                                - Nunca é Demais
                                            </Text>
                                            <View style={{ width: 350, right:160, top:100, alignContent:"flex-end", position:"absolute"}}>

                                                <Text style={[styles.bodyText]}>
                                                   "O amor deles é puro. O nosso cuidado deve ser à altura."
                                                </Text>
                                            </View>


                                        </ImageBackground>


                                    </View>                                    
                                </View>


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
                            flexDirection: "row",
                            paddingTop: 50,

                        }]}>
                            <View style={{
                                flexDirection: "row", width: "100%", alignItems: "baseline"

                            }}>
                                <View style={{
                                    flexDirection: "row", flex: 1, backgroundColor: Colors.CardFundo,
                                    borderRadius: 5, padding: 5, alignItems: "center", gap: 5
                                }}>
                                    <Text style={[styles.text, { fontSize: 20, color: "white" }]}>Em busca do meu</Text>
                                    <Text style={[styles.text, { color: Colors.Butao, fontSize: 18 }]}>pet</Text>
                                    <View style={{ backgroundColor: Colors.Butao, width: 10, height: 1 }}></View>
                                </View>
                                <View style={{ flex: 2, backgroundColor: Colors.CardFundo, height: 15, borderEndEndRadius: 5 }}></View>
                            </View>

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


