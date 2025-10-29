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
  // const [data, setdados] = useState<any>();
  const [dados, setDados] = useState<any>()
  const { id } = useLocalSearchParams();
  const { width } = Dimensions.get("window");
  const { user } = useAuth();

  useEffect(() => {
    // const encontrado = dadosAnimais.animaisPerdidos.find(a => a.id == Number(id));
    // setdados(encontrado);


    async function BuscaDados() {
      const response = await fetch(`${URL_Adocao}/animais/${id}`)
      if (response.ok) {
        const dados = await response.json()
        setDados(dados)
      }
    }
    BuscaDados()
  }, [id]);
  console.log(`dados do json ${dados}`);

  if (!dados) return <Text style={styles.loading}>Carregando...</Text>;

  const fotosParaCarrossel = dados.fotos
    ? [{ id: -1, codigoFoto: dados.foto, descricao: "Foto principal" }, ...(dados.fotos ?? [])]
    : dados.fotos ?? [];

  const handleContatoWhatsapp = () => {

    if (!dados.user?.fone) {
      showAlert("Telefone não disponível", "O usuário não informou um número de contato.");
      return;
    }
    const phoneNumber = dados.user.fone.replace(/\D/g, "");
    let message = ''

    if (dados.status == "PROCURA-SE") {
      message = encodeURIComponent(`Ola! vi o anuncio sobre o animal perdido `)

    } else {
      message = encodeURIComponent(`Ola! vi o anuncio sobre o animal encontrado `)
    }
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

    Linking.openURL(whatsappUrl);
  };
  const handleContato = () => {
    if (!dados.user?.fone) {
      showAlert("Telefone não disponível", "O usuário não informou um número de contato.");
      return;
    }
    // Apenas limpa o número e usa o protocolo tel:
    const phoneNumber = dados.user.fone.replace(/\D/g, "");
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = () => {
    if (!dados.user?.email) {
      showAlert("E-mail não disponível", "O usuário não informou um e-mail de contato.");
      return;
    }

    
    let subject = '';
    let body = '';

    if (dados.status == "PROCURA-SE") {
      subject = encodeURIComponent(`Interesse no animal perdido: ${dados.nome}`);
      body = encodeURIComponent(`Olá! Vi o anúncio sobre o animal perdido (${dados.nome}) e gostaria de mais informações.`);
    } else {
      subject = encodeURIComponent(`Interesse no animal encontrado: ${dados.nome}`);
      body = encodeURIComponent(`Olá! Vi o anúncio sobre o animal encontrado (${dados.nome}) e gostaria de mais informações.`);
    }

    // Abre o app de e-mail
    Linking.openURL(`mailto:${dados.user.email}?subject=${subject}&body=${body}`);
  };
  console.log(dados.user.email);




  return (
    <ScrollView>


      <View style={styles.container}>
        <CarrosselFotos data={fotosParaCarrossel} />

        <View style={styles.infoContainer}>
          <Text style={styles.nome}>{dados.nome}</Text>
          <Text style={styles.status}>{dados.status}</Text>
          <Text style={styles.descricao}>{dados.descricao}</Text>

          <View style={styles.detalhes}>
            <Text style={styles.info}>
              <FontAwesome name="paw" size={16} color="white" /> Espécie:{" "}
              <Text style={styles.valor}>{dados.especie.nome}</Text>
            </Text>
            <Text style={styles.info}>
              <FontAwesome name="venus-mars" size={16} color="white" /> Sexo:{" "}
              <Text style={styles.valor}>{dados.sexo}</Text>
            </Text>
            <Text style={styles.info}>
              <Entypo name="resize-full-screen" size={16} color="white" /> Porte:{" "}
              <Text style={styles.valor}>{dados.porte}</Text>
            </Text>
          </View>

          {user ? (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
              <TouchableOpacity style={styles.botao} onPress={handleContato}>
                <FontAwesome name="phone" size={22} color="#fff" />
                <Text style={styles.botaoTexto}>Entrar em contato</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botao} onPress={handleContatoWhatsapp}>
                <FontAwesome name="whatsapp" size={22} color="#fff" />
                <Text style={styles.botaoTexto}>Entrar em contato</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botao} onPress={handleEmail}>
                <FontAwesome name="envelope" size={22} color="#fff" />
                <Text style={styles.botaoTexto}>Entrar em contato</Text>
              </TouchableOpacity>

            </View>

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
