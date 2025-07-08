import { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import Colors from "../../theme/color";
import dados from "../../dadosPedidos.json"
import { useAuth } from "../../context/AuthContext";
import { Link } from "expo-router";
import { URL_Adocao, URL_GestaoPet } from "@/utils/url";



// Definições de interfaces
interface Responsavel {
  nome: string;
  fone: string;
}

interface Animal {
  id:number
  nome: string;
  user?: Responsavel;
  status: Boolean
  destaque?:Boolean
}

interface Adotante {
  id: string;
  nome: string;
  email: string;
}

interface Pedido {
  id: string;
  animal: Animal;
  descricao: string;
  resposta?: string;
  createdAt: string;
  adotante: Adotante;
}


export default function PedidosPage() {
  console.log(`dados do json ${dados.pedidos}`);

  const { width, height } = Dimensions.get('window');
  const [pedidos, setPedidos] = useState<Pedido[]>([]);



  const { user } = useAuth();
  console.log("Adotante logado:", user);


useEffect(() => {
  const buscaPedidos = async () => {
    if (!user?.id) {
      console.warn("Adotante não está logado ou não possui ID.");
      return;
    }

    try {
      const urls = [
        `${URL_GestaoPet}/interessados/pedidos?userId=${user.id}`,
        `${URL_Adocao}/pedidos?userId=${user.id}`
      ];

      const [resInteressados, resPedidos] = await Promise.all([
        fetch(urls[0]),
        fetch(urls[1])
      ]);

      if (!resInteressados.ok || !resPedidos.ok) {
        console.error("Erro em uma das requisições:", resInteressados.status, resPedidos.status);
        return;
      }

      const dadosInteressados = await resInteressados.json();
      const dadosPedidos = await resPedidos.json();

      const todosPedidos = [...dadosInteressados, ...dadosPedidos];

      // Ordena por data do mais recente para o mais antigo, se quiser
      todosPedidos.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      console.log("Todos os pedidos:", todosPedidos);
      setPedidos(todosPedidos);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  buscaPedidos();
}, [user]);


  console.log("Pedidos armazenados:", pedidos);
  if (width < 600) {

    return (
      <View style={{ height: height }}>


        <ScrollView contentContainerStyle={{ alignItems: "center", padding: 16 }}>

          <Text style={{ fontSize: 25, fontWeight: "700" }}>Meus Pedidos</Text>

          {pedidos.length > 0 ? (
            pedidos.map((pedido) => (
              <Link style={{width:"100%"}}  href={`/datails/${pedido.animal.id}?destaque=${pedido.animal.destaque}`} asChild key={pedido.id}>
                <View key={pedido.id} style={{ marginVertical: 8, padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, backgroundColor: "#eee", width: "100%" }}>
                  <Text>Pedido nº: {pedido.id}</Text>
                  <Text><Text style={{ fontWeight: "bold" }}>Animal:</Text> {pedido.animal?.nome}</Text>
                  <Text><Text style={{ fontWeight: "bold" }}>Formulário Enviado:</Text> {pedido.descricao}</Text>
                  <Text><Text style={{ fontWeight: "bold" }}>Status:</Text> {pedido.resposta || "Aguardando resposta"}</Text>
                  <Text><Text style={{ fontWeight: "bold" }}>Data do Pedido:</Text> {new Date(pedido.createdAt).toLocaleDateString()}</Text>
                  <Text><Text style={{ fontWeight: "bold" }}>Responsavel:</Text> {pedido.animal?.user?.nome ?? "Abrigo"}</Text>

                </View>
              </Link>
            ))
          ) : (
            <Text style={{ marginTop: 20, fontWeight: "500", color: Colors.LetraCinza }}>
              Você não tem pedidos registrados.
            </Text>
          )}
        </ScrollView>
      </View>
    );
  } else if (width >= 600) {
    return (
      <View style={{ height: height }}>

        <ScrollView contentContainerStyle={{ alignItems: "center", padding: 16 }}>
          <Text style={{ fontSize: 30, fontWeight: "700", marginBottom: 20 }}>Meus Pedidos</Text>

          {pedidos.length > 0 ? (
            pedidos.map((pedido) => (
              
              <Link style={{width:"100%"}}  href={`/datails/${pedido.animal.id}${pedido.animal.destaque ? "?destaque=true" : ""}`} asChild key={pedido.id}>
              <View key={pedido.id} style={{ marginVertical: 10, padding: 16, borderWidth: 1, borderColor: "#aaa", borderRadius: 10, backgroundColor: "#f0f0f0", width: "100%" }}>
                <Text style={{ fontSize: 16 }}>Pedido nº: {pedido.id}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Animal:</Text> {pedido.animal?.nome}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Formulario Enviado:</Text> {pedido.descricao}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Resposta:</Text> {pedido.resposta || "Aguardando resposta"}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Estatus:</Text >
                  <Text style={{ color: pedido.animal.status ? "green" : "red", fontWeight: "500", marginLeft: 5 }}>{pedido.animal.status ? "Disponivel" : "Adotado"}</Text></Text>
                <Text><Text style={{ fontWeight: "bold" }}>Data:</Text> {new Date(pedido.createdAt).toLocaleDateString()}</Text>
               <Text><Text style={{ fontWeight: "bold" }}>Responsavel:</Text> {pedido.animal?.user?.nome ?? "Abrigo"}</Text>

              </View>
              </Link>
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