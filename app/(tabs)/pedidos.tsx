import { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView, ActivityIndicator } from "react-native";
import Colors from "../../theme/color";
import { useAuth } from "../../context/AuthContext";
import { Link, useRouter } from "expo-router";
import { URL_Adocao, URL_GestaoPet } from "@/utils/url";

interface Responsavel {
  nome: string;
  fone: string;
}

interface Animal {
  id: number;
  nome: string;
  user?: Responsavel;
  status: boolean;
  destaque?: boolean;
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
  const { width, height } = Dimensions.get("window");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    const buscaPedidos = async () => {
      if (!user?.id || !user?.token) return;

      try {
        const urls = [
          `${URL_GestaoPet}/interessados/pedidos?userId=${user.id}`,
          `${URL_Adocao}/pedidos?userId=${user.id}`,
        ];

        
        const [resInteressados, resPedidos] = await Promise.all([
          fetch(urls[0], {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          fetch(urls[1], {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        if (!resInteressados.ok || !resPedidos.ok) {
          console.error(
            "Erro nas requisições:",
            resInteressados.status,
            resPedidos.status
          );
          return;
        }

        const dadosInteressados = await resInteressados.json();
        const dadosPedidos = await resPedidos.json();

        const todosPedidos = [...dadosInteressados, ...dadosPedidos].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPedidos(todosPedidos);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    buscaPedidos();
  }, [user]);

  if (isLoading || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.CorFundo} />
        <Text style={{ marginTop: 10 }}>Carregando pedidos...</Text>
      </View>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <View style={{ height }}>
      <ScrollView contentContainerStyle={{ alignItems: "center", padding: 16 }}>
        <Text style={{ fontSize: 25, fontWeight: "700" }}>Meus Pedidos</Text>

        {pedidos.length > 0 ? (
          pedidos.map((pedido) => (
            <Link
              key={pedido.id}
              href={`/datails/${pedido.animal.id}${
                pedido.animal.destaque ? "?destaque=true" : ""
              }`}
              asChild
              style={{ width: "100%" }}
            >
              <View
                style={{
                  marginVertical: 8,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  backgroundColor: "#eee",
                  width: "100%",
                }}
              >
                <Text>Pedido nº: {pedido.id}</Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Animal:</Text>{" "}
                  {pedido.animal?.nome}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Formulário:</Text>{" "}
                  {pedido.descricao}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Status:</Text>{" "}
                  {pedido.resposta || "Aguardando resposta"}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Data:</Text>{" "}
                  {new Date(pedido.createdAt).toLocaleDateString()}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Responsável:</Text>{" "}
                  {pedido.animal?.user?.nome ?? "Abrigo"}
                </Text>
              </View>
            </Link>
          ))
        ) : (
          <Text
            style={{
              marginTop: 20,
              fontWeight: "500",
              color: Colors.LetraCinza,
            }}
          >
            Você não tem pedidos registrados.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
