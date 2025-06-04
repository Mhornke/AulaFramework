import { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import Header from "../../components/header";
//import { useAdotanteStore } from "@/context/adotante"; // Contexto do adotante
import Colors from "../../theme/color";
import dados from "../../dadosPedidos.json"


// Definições de interfaces
interface Adotante {
  id: string;
  nome: string;
  email: string;
}

interface Animal {
  nome: string;
}

interface Pedido {
  id: string;
  animal: Animal;
  descricao: string;
  resposta?: string; // Esse campo pode ser opcional
  createdAt: string; // ou Date, dependendo do que você está recebendo
  adotante: Adotante;
}

export default function PedidosPage() {
console.log(`dados do json ${dados.pedidos}`);
  
 const { width, height } = Dimensions.get('window');
  const [pedidos, setPedidos] = useState<Pedido[]>([]); // Estado para armazenar os pedidos
  //const { adotante } = useAdotanteStore(); // Obtém o adotante logado
  //console.log("Adotante logado:", adotante); // Log do adotante

  // useEffect(() => {
  //   const fetchPedidos = async () => {
  //     if (adotante && adotante.id) { // Verifica se adotante e adotante.id estão disponíveis
  //       console.log("ID do adotante:", adotante.id); // Log do ID do adotante
  //       try {
  //         const response = await fetch(`https://api-adocao-git-main-dieizons-projects.vercel.app/pedidos?adotanteId=${adotante.id}`);
  //         if (response.ok) {
  //           const dados = await response.json();
  //           console.log("Dados recebidos:", dados); // Log dos dados recebidos
  //           setPedidos(dados); // Armazena os dados no estado
  //         } else {
  //           console.error("Erro ao buscar pedidos:", response.statusText);
  //         }
  //       } catch (error) {
  //         console.error("Erro ao buscar pedidos:", error);
  //       }
  //     } else {
  //       console.warn("Adotante não está logado ou não possui ID."); // Log de aviso
  //     }
  //   };

  //   fetchPedidos(); // Chama a função para buscar pedidos
  // }, [adotante]); // Dependência para recarregar quando o adotante mudar
  
  //console.log("Pedidos armazenados:", pedidos); // Log dos pedidos armazenados
 if (width < 600) {
    // Telas pequenas (celulares)
    return (
      <View style={{ height: height }}>
        <Header />
        
        <ScrollView contentContainerStyle={{ alignItems: "center", padding: 16 }}>
          <Text style={{ fontSize: 25, fontWeight: "700" }}>Meus Pedidos (MOBILE)</Text>

          {dados.pedidos.length > 0 ? (
            dados.pedidos.map((pedido) => (
              <View key={pedido.id} style={{ marginVertical: 8, padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, backgroundColor: "#eee", width: "100%" }}>
                <Text>Pedido nº: {pedido.id}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Animal:</Text> {pedido.animal.nome}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Descrição:</Text> {pedido.descricao}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Status:</Text> {pedido.resposta || "Aguardando resposta"}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Data do Pedido:</Text> {new Date(pedido.createdAt).toLocaleDateString()}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Adotante:</Text> {pedido.adotante.nome}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Email:</Text> {pedido.adotante.email}</Text>
              </View>
            ))
          ) : (
            <Text style={{ marginTop: 20, fontWeight: "500", color: Colors.LetraCinza }}>
              Você não tem pedidos registrados.
            </Text>
          )}
        </ScrollView>
      </View>
    );
  }else if(width >= 600){
 return (
      <View style={{ height: height}}>
        <Header />
        <ScrollView contentContainerStyle={{ alignItems: "center", padding: 16 }}>
          <Text style={{ fontSize: 30, fontWeight: "700", marginBottom: 20 }}>Meus Pedidos (Tablet)</Text>

          {dados.pedidos.length > 0 ? (
            dados.pedidos.map((pedido) => (
              <View key={pedido.id} style={{ marginVertical: 10, padding: 16, borderWidth: 1, borderColor: "#aaa", borderRadius: 10, backgroundColor: "#f0f0f0", width: "100%" }}>
                <Text style={{ fontSize: 16 }}>Pedido nº: {pedido.id}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Animal:</Text> {pedido.animal.nome}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Descrição:</Text> {pedido.descricao}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Status:</Text> {pedido.resposta || "Aguardando resposta"}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Data:</Text> {new Date(pedido.createdAt).toLocaleDateString()}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Adotante:</Text> {pedido.adotante.nome}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Email:</Text> {pedido.adotante.email}</Text>
              </View>
            ))
          ) : (
            <Text style={{ fontWeight: "500", color: Colors.LetraCinza }}>
              Você não tem pedidos registrados.
            </Text>
          )}
        </ScrollView>
      </View>
 )
  
}
}