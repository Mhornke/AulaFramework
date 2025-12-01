import { Dimensions, Image, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";

import React, { useEffect, useRef, useState } from "react";
import CardIIII from "../../components/cardAnimalPerdido";
import CardIII from "../../components/cardAnimalNormalAdotado"
import Carrossel from "../../components/carrossel";
import Footer from "../../components/footer";
import { AnimalPerdidoI } from "@/utils/types/animiasPerdidos";
import { FontAwesome } from "@expo/vector-icons";
import { URL_Adocao } from "@/utils/url";
import Colors from "@/theme/color";

export default function Perdidos() {
    const [animais, setAnimais] = useState<AnimalPerdidoI[]>([])
    const [quantVisivelAdotados, setQuantVisivelAdotados] = useState(4)
    const scrollViewRef = useRef<ScrollView>(null)

    const scrollParaTopo = () => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    };
    console.log(animais);
    const { width } = Dimensions.get('window')


    const styles = StyleSheet.create({
        containerText: {
            flexDirection: "row",       
            height: 70,
            borderRadius: 5,       
            backgroundColor: "white"
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
            paddingBottom: 40
        },
    });



    useEffect(() => {

        async function buscaDados() {

            try {
                // const response = await fetch(`https://api-adocao-git-main-dieizons-projects.vercel.app/animais`)
                const response = await fetch(`${URL_Adocao}/animais-perdidos`)
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


    const animalEntregue = animais.filter(
        (animal) => animal.encontrado === true
    );

    const listaAnimaisEncontrados = animalEntregue
        .slice(0, quantVisivelAdotados)
        .map((animal) => (
            <CardIII key={animal.id} data={animal as AnimalPerdidoI} />
        ));
    const animalPerdido = animais.filter(
        (animal) => animal.encontrado === false
    );

    const listaAnimais = animalPerdido.map((animal) => (
        <CardIIII key={animal.id} data={animal as AnimalPerdidoI} />
    ));



    if (!animais) return <Text>Carregando...</Text>;
    if (width < 600) {


        return (
            <>
                <ScrollView ref={scrollViewRef}
                    showsVerticalScrollIndicator={false}
                    >

                    

                  <View style={[styles.containerText, { flexDirection: "column",padding:80, justifyContent:"center", alignItems:"center" }]}>
                            
                            <View style={{}}>
                                <Text style={[
                                    styles.text,
                                    { color: Colors.Butao, fontSize: 30, fontWeight: '700', }]}>
                                    - Volte pra casa
                                </Text>
                            </View>

                            <View style={{flexDirection:"column", gap:10, }}>
                                <Text style={[styles.text,{color:Colors.Preto}]} >
                                    Perdidos, mas não esquecidos.<FontAwesome name="heart" size={10} />
                                </Text>
                                <Text style={[styles.text,{color:Colors.Preto}]}>
                                    Cada rostinho aqui tem alguém esperando. Fique alerta e ajude a reunir famílias!
                                </Text>
                            </View>
                        </View>
                    <View style={[styles.card, { top: 30 }]}>

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
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    ref={scrollViewRef}
                    style={{

                    }}
                >
                    <View style={[styles.contentWrapper, { top: 40, alignContent:"center",  }]}>
                        
                        <View style={[styles.containerText, { flexDirection: "column",padding:80, justifyContent:"center", alignItems:"center" }]}>
                            
                            <View style={{}}>
                                <Text style={[
                                    styles.text,
                                    { color: Colors.Butao, fontSize: 30, fontWeight: '700', }]}>
                                    - Volte pra casa
                                </Text>
                            </View>

                            <View style={{flexDirection:"row", gap:10}}>
                                <Text style={[styles.text,{color:Colors.Preto}]} >
                                    Perdidos, mas não esquecidos.<FontAwesome name="heart" size={10} />
                                </Text>
                                <Text style={[styles.text,{color:Colors.Preto}]}>
                                    Cada rostinho aqui tem alguém esperando. Fique alerta e ajude a reunir famílias!
                                </Text>
                            </View>
                        </View>
                   

                        <View style={styles.cardTable}>
                            {listaAnimais}
                        </View>

                        <View style={styles.cardTableAdotados}>
                            <Text style={{ fontWeight: "700", textAlign: "center", fontSize: 18, marginBottom: 10, width: "100%" }}>
                                Amigos encontraram seu lar
                            </Text>

                            <View style={{ flexWrap: "wrap", flexDirection: "row", gap: 100, justifyContent: "center" }}>
                                {listaAnimaisEncontrados}

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

                    <TouchableOpacity style={styles.botaoFlutuante} onPress={scrollParaTopo}>
                        <FontAwesome name="arrow-up" size={15} color="#fff" />
                    </TouchableOpacity>
                </ScrollView>
            </>
        );



    }



}


