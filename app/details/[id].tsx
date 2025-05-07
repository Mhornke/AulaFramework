import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Link } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
import { AnimalI } from "../../utils/types/animias";
import { useEffect, useState } from "react";
import cor from '../theme/color' 




export default function Detalhes() {
    const [data, setData] = useState<AnimalI>();
    const { id } = useLocalSearchParams();
    const [texto, setTexto] = useState('')
console.log(`id parametro: ${id}`);


    useEffect(() => {
        console.log("entrando no useEffect");
        
        async function buscaDados() {
        try {
                const response = await fetch(`${process.env.URL_API}/animais/${id}`)
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
    return (
        <View>
        <View style={styles.conteiner} key={data.id}>
            <Image
                source={{ uri: data.foto }}
                style={{ width: 400, height: 400 }}
            />
            <View style={styles.containerText}>
                <Text style={styles.TextName}>{data.nome}</Text>
                <Text style={styles.Text}>{data.especie.nome}</Text>
                <Text style={styles.Text}>{data.idade}</Text>
                <Text style={styles.Text}>{data.sexo}</Text>
                <Text style={styles.Text}>{data.porte}</Text>
                <Text style={styles.Text}>{data.descricao}</Text>


                <View>
                    <Text>Formulário de Adoção</Text>
                    <Text>Em poucas palavras, diga se você já tem animais e porque gostaria de adotar este animal. Em breve entraremos em contato.</Text>
                    <Text>Pedido:</Text>
                    <View>
                    <TextInput
                    multiline
                    numberOfLines={6}
                    placeholder="Insira aqui seu pedido de adoção"
                    value={texto}
                    onChangeText={setTexto}
                    
                    />
                    </View>
                </View>
                
                {/* Mudar pra envio de formulario*/}
                <Link href="/">
                    <TouchableOpacity >
                        <Text style={{ backgroundColor:cor.Butao, color:"#ffff", padding: 10, borderRadius: 3, width: 200, margin: 5, }}>Adotar</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
        </View>

    )
}

// adicionar midea screen

const styles = StyleSheet.create({

    conteiner: {
        height:200,
        flex: 1,
        alignItems:"center",
        backgroundColor: cor.CardFundo,
        marginVertical: 15,

    },

    containerText: {
        margin: 10,


    },
    Text: {
        marginLeft: 5,
        color:"#ffff",
        fontWeight:"500"

    },
    TextName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#ffff",
    },

})