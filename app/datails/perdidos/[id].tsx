import { useLocalSearchParams, Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { useAuth } from "../../../context/AuthContext";
import Color from "../../../theme/color";
import dadosAnimais from "@/dadosAnimaisPerdidos.json";
import CarrosselFotos from "../../../components/carrosselFotos";
import * as Linking from "expo-linking";
import { URL_Adocao } from "@/utils/url";
import { showAlert } from "@/components/swalAlert";

export default function DetalhesPerdido() {
  const [data, setData] = useState<any>();
  const [dados, setDados] = useState<any>()
  const { id } = useLocalSearchParams();
  const { width } = Dimensions.get("window");
  const { user } = useAuth();

  useEffect(() => {
    const encontrado = dadosAnimais.animaisPerdidos.find(a => a.id == Number(id));
    setData(encontrado);


    async function BuscaDados() {
      const response = await fetch(`${URL_Adocao}/animais/${id}`)
      if (response.ok) {
        const dados = await response.json()
        setDados(dados)
      }
    }
    BuscaDados()
  }, [id]);
  console.log(`dados do json ${data}`);

  if (!data) return <Text style={styles.loading}>Carregando...</Text>;

  const fotosParaCarrossel = data.fotos
    ? [{ id: -1, codigoFoto: data.foto, descricao: "Foto principal" }, ...(data.fotos ?? [])]
    : data.fotos ?? [];

  const handleContato = () => {

    if (!dados.user?.fone) {
      showAlert("Telefone não disponível", "O usuário não informou um número de contato.");
      return;
    }
    const phoneNumber = dados.user.fone.replace(/\D/g, "");
    let message =''

    if (data.status == "PROCURA-SE") {
      const message = encodeURIComponent(`Ola! vi o anuncio sobre o animal perdido `)

    } else {
      const message = encodeURIComponent(`Ola! vi o anuncio sobre o animal encontrado `)
    }
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    
    Linking.openURL(`tel:${whatsappUrl}`);
  };
console.log(dados.user);

 

  
  return (
    <ScrollView>


      <View style={styles.container}>
        <CarrosselFotos data={fotosParaCarrossel} />

        <View style={styles.infoContainer}>
          <Text style={styles.nome}>{data.nome}</Text>
          <Text style={styles.status}>{data.status}</Text>
          <Text style={styles.descricao}>{data.descricao}</Text>

          <View style={styles.detalhes}>
            <Text style={styles.info}>
              <FontAwesome name="paw" size={16} color="white" /> Espécie:{" "}
              <Text style={styles.valor}>{data.especie}</Text>
            </Text>
            <Text style={styles.info}>
              <FontAwesome name="venus-mars" size={16} color="white" /> Sexo:{" "}
              <Text style={styles.valor}>{data.sexo}</Text>
            </Text>
            <Text style={styles.info}>
              <Entypo name="resize-full-screen" size={16} color="white" /> Porte:{" "}
              <Text style={styles.valor}>{data.porte}</Text>
            </Text>
          </View>

          {user ? (
            <TouchableOpacity style={styles.botao} onPress={handleContato}>
              <FontAwesome name="phone" size={22} color="#fff" />
              <Text style={styles.botaoTexto}>Entrar em contato</Text>
            </TouchableOpacity>
          ) : (
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity style={styles.botaoLogin}>
                <Text style={styles.botaoTexto}>Faça login para entrar em contato</Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    color: Color.LetraCinza,
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: Color.CorFundo,
    alignItems: "center",
    padding: 16,
  },
  infoContainer: {
    width: "90%",
    marginTop: 16,
    backgroundColor: Color.CardFundo,
    borderRadius: 10,
    padding: 16,
  },
  nome: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 8,
  },
  status: {
    fontSize: 18,
    color: "orange",
    fontWeight: "600",
    marginBottom: 10,
  },
  descricao: {
    color: "#ddd",
    fontSize: 16,
    marginBottom: 12,
  },
  detalhes: {
    marginVertical: 10,
    gap: 4,
  },
  info: {
    color: "#bbb",
    fontSize: 16,
  },
  valor: {
    color: "#fff",
    fontWeight: "600",
  },
  botao: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  botaoLogin: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
});
