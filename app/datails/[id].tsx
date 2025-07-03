import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Dimensions } from "react-native";
import { Link } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
import { AnimalI } from "../../utils/types/animias";
import { useEffect, useState } from "react";
import cor from '../../theme/color'
import { useAuth } from "@/context/AuthContext";



export default function Detalhes() {
    const [data, setData] = useState<AnimalI>();
    const { id } = useLocalSearchParams();
    const [texto, setTexto] = useState('');
    const { width } = Dimensions.get('window');
    const { user } = useAuth()

    useEffect(() => {
        async function buscaDados() {
            try {
                const response = await fetch(`https://api-adocao-git-main-dieizons-projects.vercel.app/animais/${id}`);
                const dados = await response.json();
                setData(dados);
            } catch (error) {
                console.log("erro ao buscar os dados ", error);
            }
        }
        buscaDados();
    }, [id]);

    async function enviaForm() {
        try {
            const novoPedido = {
                userId: user,
                animalId: Number(id),
                descricao: texto
            }
            console.log(novoPedido);

            const response = await fetch(`http://localhost:3004/pedidos`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(novoPedido)
                }
            )
            if (response.ok) {
                alert("Pedido enviado com sucesso!");
            } else {
                alert("Erro ao enviar pedido.");
            }
        } catch (error) {
            console.error("Erro ao enviar pedido:", error);
            alert("Erro na comunicação com o servidor.");
        }
    }

    if (!data) return <Text>Carregando...</Text>;

    return (
        <View style={[styles.containerGeral]}>
            <View style={[styles.conteudo, width >= 700 && styles.conteudoLargura]}>
                <Image source={{ uri: data.foto }} style={styles.image} />
                <View style={styles.containerText}>
                    <Text style={styles.TextName}>{data.nome}</Text>
                    <Text style={styles.Text}>{data.especie.nome}</Text>
                    <Text style={styles.Text}>{data.idade}</Text>
                    <Text style={styles.Text}>{data.sexo}</Text>
                    <Text style={styles.Text}>{data.porte}</Text>
                    <Text style={styles.Text}>{data.descricao}</Text>
                </View>
                {user ? (<View style={[styles.containerTextArea, width >= 700 && styles.containerTextAreaLarg]}>
                    <Text style={styles.tituloFormulario}>Formulário de Adoção</Text>
                    <Text style={styles.TextFormulario}>
                        Em poucas palavras, diga se você já tem animais e porque gostaria de adotar este animal.
                        Em breve entraremos em contato.
                    </Text>
                    <Text style={styles.TextFormulario}>Pedido:</Text>

                    <TextInput
                        multiline
                        numberOfLines={6}
                        placeholder="Insira aqui seu pedido de adoção"
                        value={texto}
                        onChangeText={setTexto}
                        style={styles.TextAreaInput}
                    />

                    <View style={{ alignItems: 'center', marginTop: 15, }}>

                        <TouchableOpacity style={styles.botao} onPress={enviaForm}>
                            <Text style={styles.botaoTexto}>Enviar</Text>
                        </TouchableOpacity>

                    </View>

                </View>) : (
                    <Link href="/(auth)/login">
                        <TouchableOpacity>

                            <Text style={{ color: "#ffff", }}>Tenho interesse</Text>
                        </TouchableOpacity></Link>
                )}

            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    containerGeral: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    conteudo: {
        backgroundColor: cor.CorFundo,
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        width: '100%',
        maxWidth: 600,
    },
    conteudoLargura: {
        maxWidth: 800,
        flexDirection: 'column',
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 10,
    },
    containerText: {
        marginTop: 16,
        alignItems: "flex-start",
        width: "100%",

    },
    Text: {
        color: "#ffff",
        fontWeight: "500",
        marginTop: 4,
    },
    TextName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#ffff",
        marginBottom: 8,
    },
    containerTextArea: {
        marginTop: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 16,
        width: "100%",
    },
    containerTextAreaLarg: {
        maxWidth: 800,
    },
    tituloFormulario: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
    },
    TextFormulario: {
        marginVertical: 4,
    },
    TextAreaInput: {
        backgroundColor: "#eee",
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        textAlignVertical: 'top', // garante alinhamento no topo
    },
    botao: {
        backgroundColor: cor.Butao,
        paddingVertical: 10,
        paddingHorizontal: "40%",

        borderRadius: 5,
        marginTop: 15,
    },
    botaoTexto: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
    }
});
