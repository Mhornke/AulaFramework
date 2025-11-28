import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    Animated,
    Dimensions,
    ScrollView,
} from "react-native";

import { URL_Adocao } from "@/utils/url";

type Animal = {
    id: number;
    nome: string;
    fotos: { uri: string }[];
    status: "adotado" | "encontrado";
};

export default function DownBarAnimada() {
    const [animais, setAnimais] = useState<Animal[]>([]);
    const scrollX = useRef(new Animated.Value(0)).current;
    const { width } = Dimensions.get("window");

   useEffect(() => {
    fetch(`${URL_Adocao}/animais/status`)
        .then(res => res.json())
        .then(data => {
            const list: Animal[] = [];

            (data.encontrados || []).forEach((a: any) => {
                list.push({
                    id: a.id,
                    nome: a.nome || "Sem nome",
                    fotos: (a.fotos || []).map((f: any) => ({ uri: f.url })),
                    status: "encontrado",
                });
            });

            (data.adotados || []).forEach((a: any) => {
                list.push({
                    id: a.id,
                    nome: a.nome || "Sem nome",
                    fotos: (a.fotos || []).map((f: any) => ({ uri: f.url })),
                    status: "adotado",
                });
            });

            setAnimais(list);
        })
        .catch(err => {
            console.log("Erro ao buscar animais:", err);
        });
}, []);


    useEffect(() => {
        Animated.loop(
            Animated.timing(scrollX, {
                toValue: -width * animais.length,
                duration: 30000,
                useNativeDriver: true,
            })
        ).start();
    }, [animais]);

    return (
        <View style={styles.container}>
            {animais.length === 0 ? (
                <Text style={{ color: "#fff", textAlign: "center" }}>Nenhum animal encontrado ou adotado ainda.</Text>
            ) : (
                <Animated.View style={[styles.row, { transform: [{ translateX: scrollX }] }]}>
                    {animais.map(animal => (
                        <View style={styles.card} key={animal.id}>
                            <Image
                                source={{ uri: animal.fotos[0]?.uri || "" }}
                                style={styles.foto}
                            />
                            <Text style={styles.nome}>{animal.nome}</Text>
                            <Text
                                style={[
                                    styles.status,
                                    { color: animal.status === "adotado" ? "green" : "orange" },
                                ]}
                            >
                                {animal.status.toUpperCase()}
                            </Text>
                        </View>
                    ))}
                </Animated.View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 50,
        backgroundColor: "#222",
        overflow: "hidden",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    card: {
        width: 100,
        marginRight: 20,
        alignItems: "center",
    },
    foto: {
        width: 80,
        height: 60,
        borderRadius: 5,
    },
    nome: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 5,
    },
    status: {
        fontSize: 10,
        fontWeight: "600",
    },
});
