import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Dimensions } from "react-native";
import { Link } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
import { AnimalI } from "../../utils/types/animias";
import { useEffect, useState } from "react";
import cor from '../../theme/color'
import Header from "../../components/header";



export default function Detalhes() {
    const [data, setData] = useState<AnimalI>();
    const { id } = useLocalSearchParams();
    const [texto, setTexto] = useState('')
    console.log(`id parametro: ${id}`);
    const { width, height } = Dimensions.get('window')

    useEffect(() => {
        console.log("entrando no useEffect");

        async function buscaDados() {
            try {
                const response = await fetch(`https://api-adocao-git-main-dieizons-projects.vercel.app/animais/${id}`)
                const dados = await response.json()
                setData(dados)
                console.log(`dados vindo da api${dados}`);
                console.log(`resposta api${response}`);

            } catch (error) {
                console.log("erro ao buscar os dados ", error);

            }
        }
        buscaDados()
    }, [id])
    if (!data) return <Text>Carregando...</Text>;
    if (width < 600) {
        return (
            <View style={{}}>
                <Header />
                <View style={styles.conteiner} key={data.id}>
                    <Image
                        source={{ uri: data.foto }}
                        style={{ width: "100%", height: 400 }}
                    />
                    <View style={styles.containerText}>
                        <View style={{ alignItems: "flex-start", marginTop:20, marginBottom:20 }}>
                            <Text style={styles.TextName}>{data.nome}</Text>
                            <Text style={styles.Text}>{data.especie.nome}</Text>
                            <Text style={styles.Text}>{data.idade}</Text>
                            <Text style={styles.Text}>{data.sexo}</Text>
                            <Text style={styles.Text}>{data.porte}</Text>
                            <Text style={styles.Text}>{data.descricao}</Text>
                        </View>

                        <View style={styles.containerTextArea}>
                            <View>
                                <Text style={{ fontSize: 15, fontWeight: "500" }}>Formulário de Adoção</Text>
                                <Text style={styles.TextFormulario}>Em poucas palavras, diga se você já tem animais e porque gostaria de adotar este animal. Em breve entraremos em contato.</Text>
                                <Text style={styles.TextFormulario}>Pedido:</Text>
                            </View>

                            <View style={{ width: "90%", marginHorizontal: 13 }}>
                                <TextInput
                                    multiline
                                    numberOfLines={6}
                                    placeholder="Insira aqui seu pedido de adoção"
                                    value={texto}
                                    onChangeText={setTexto}
                                    style={styles.TextAreaInput}
                                />
                            </View>
                            <Link href="./">
                                <TouchableOpacity style={{ width: 350, marginTop: 10 }}>
                                    <Text style={{ backgroundColor: cor.Butao, color: "#ffff", paddingHorizontal: 10, borderRadius: 3, height: 40, margin: 5, textAlign: "center", alignContent: "center" }}>Adotar</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>

                        {/* Mudar pra envio de formulario*/}
                    </View>
                </View>
            </View>

        )
    }

}

// adicionar midea screen

const styles = StyleSheet.create({

    conteiner: {
        backgroundColor: cor.CardFundo,
        alignItems: "center"

    },

    containerText: {
        margin: 10,
                alignItems: "center"
    },
    Text: {
        marginLeft: 10,
        color: "#ffff",
        fontWeight: "500",


    },
    TextName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#ffff",
    },
    containerTextArea: {
        marginTop: 30,
        backgroundColor: "#ffff",
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
        width: "95%"
    },
    TextFormulario: {
        marginTop: 5,
        marginHorizontal: 20,

    },
    TextAreaInput: {
        backgroundColor: "grey",
        borderRadius: 5,
        padding: 10,
        color: cor.LetraCinza,


    }
})