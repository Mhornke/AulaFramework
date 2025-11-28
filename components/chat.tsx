// Chat.tsx
import { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from "react-native";
import { ChatMensagem } from "@/utils/types/chatMensagens";
import { dadosMensagem } from "@/dadosMensagem";
import Colors from "@/theme/color";

export default function Chat({ data }: { data: ChatMensagem }) {
    const [mensagens, setMensagens] = useState<ChatMensagem[]>([]);
    const [texto, setTexto] = useState("");
    const scrollRef = useRef<ScrollView>(null);

    // Rola para a última mensagem automaticamente
    useEffect(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
setMensagens(dadosMensagem)
    }, [mensagens]);

    

    return (
        <KeyboardAvoidingView
          
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                ref={scrollRef}
                style={styles.scroll}
                
            >
                {mensagens.map((data, i) => (
                    <View
                        key={i}
                        style={[
                            styles.bolha,                           
                        ]}
                    >
                        <Text style={styles.textoMensagem}>{data.mensagem}</Text>
                        <Text style={styles.dataMensagem}>
                            {new Date(data.createdAt).toLocaleTimeString()}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua mensagem..."
                    value={texto}
                    onChangeText={setTexto}
                    multiline
                />
                <TouchableOpacity style={styles.botaoEnviar} >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        width:"100%",
        backgroundColor:"#ebebebab",
      borderRadius:5
    },
    bolha: {
        padding: 10,
        borderRadius: 12,
        marginVertical: 5,
    
    },
    bolhaDono: {
        backgroundColor: "#d1eaff",
        alignSelf: "flex-end",
    },
    bolhaUsuario: {
        backgroundColor: "#fff",
        alignSelf: "flex-start",
    },
    textoMensagem: {
        
        fontWeight:"500"
    },
    dataMensagem: {
        fontSize: 10,
   
        marginTop: 4,
        textAlign: "right",
    },
    inputContainer: {
        flexDirection: "row",
        padding: 10,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#ccc",
        alignItems: "flex-end",
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 120,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        backgroundColor: "#fff",
    },
    botaoEnviar: {
        backgroundColor: "#007aff",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
    },
});
