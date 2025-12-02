import { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView, ActivityIndicator,TouchableOpacity, Image} from "react-native";
import Colors from "../../theme/color";
import { useAuth } from "../../context/AuthContext";
import { Link, useRouter } from "expo-router";
import { URL_Adocao, URL_GestaoPet } from "@/utils/url";
import { Pedido } from "@/utils/types/pedidos";


export default function PedidosPage() {
  const { width, height } = Dimensions.get("window");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // 1. Proteção de Rota
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading]);

  // 2. Busca de Dados
  useEffect(() => {
    async function buscaDados() {
      if (!user?.id) return; 

      try {
        
        const response = await fetch(`${URL_Adocao}/pedidos?adotanteId=${user.id}`);
        
        if (!response.ok) {
            throw new Error("Erro na resposta da API");
        }

        const dados = await response.json();
        setPedidos(dados);
      } catch (error) {
        console.log("erro ao buscar dados", error);
      } finally {
        setLoading(false);
      }
    }

    buscaDados();
  }, [user]); 
  

  if (isLoading || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.Butao} />
        <Text style={{ marginTop: 10 }}>Carregando pedidos...</Text>
      </View>
    );
  }


  if (!isAuthenticated) return null;

 return (
    <View 
    style={{  backgroundColor: "#f5f5f5" }}>
      <ScrollView contentContainerStyle={{ alignItems: "center", padding: 16 }}>
        <Text style={{ fontSize: 25, fontWeight: "700", marginBottom: 20 }}>Meus Pedidos</Text>

        {pedidos.length > 0 ? (
          pedidos.map((pedido) => {
            
            // 2. LÓGICA PARA PEGAR A FOTO CORRETA
            // Verifica se o array existe e tem itens, pega o primeiro item e acessa .codigoFoto
            const fotoUrl = pedido.animal.fotos && pedido.animal.fotos.length > 0 
              ? pedido.animal.fotos[0].codigoFoto 
              : "https://placehold.co/400x400/png?text=Sem+Foto"; // Fallback se não tiver foto

            return (
              <View style={{ width: "100%" }} 
              key={pedido.id}>

              
                <TouchableOpacity activeOpacity={0.9} >
                  <View
                    style={{
                      marginVertical: 8,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: "#ddd",
                      borderRadius: 8,
                      backgroundColor: "#fff", 
                      width: "100%",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 1.41,
                      elevation: 2,
                      flexDirection: "row", 
                      gap: 15
                    }}
                  >
                      <Link
                        key={pedido.id}
                        href={`/datails/${pedido.animal.id}`}
                        asChild
                        style={{ width: "100%" }}
                      >
                    
                    <Image 
                      source={{ uri: fotoUrl }}
                      style={{
                        width: 100, 
                        height: 100, 
                        borderRadius: 8,
                        backgroundColor: "#eee"
                      }} 
                      resizeMode="cover"
                    />
                        </Link>

                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <Text style={{fontSize: 12, color: Colors.LetraCinza}}>Pedido #{pedido.id}</Text>
                            <Text style={{fontSize: 12, color: Colors.LetraCinza}}>{new Date(pedido.createdAt).toLocaleDateString()}</Text>
                        </View>

                        <Text style={{fontSize: 18, fontWeight: 'bold', color: Colors.Butao, marginVertical: 5}}>
                            {pedido.animal?.nome}
                        </Text>

                        <Text numberOfLines={2} ellipsizeMode="tail" style={{marginBottom: 5, fontSize: 14, color: "#555"}}>
                            <Text style={{ fontWeight: "bold" }}>Pedido:</Text> {pedido.descricao}
                        </Text>
                        
                        
                        <View style={{
                            marginTop: 5, 
                            paddingVertical: 4,
                            paddingHorizontal: 8, 
                            alignSelf: 'flex-start',
                            backgroundColor: pedido.resposta ? (pedido.resposta.toLowerCase().includes("aprovado") || pedido.resposta.toLowerCase().includes("aceito") ? "#f88787ff": "#1fda4aff" ) : "#d1d18cff",
                            borderRadius: 4
                          }}>
                            <Text style={{ fontWeight: "bold", color: "#333", fontSize: 12 }}>
                                {pedido.resposta || "Aguardando análise"}
                            </Text>
                        </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <View style={{alignItems: 'center', marginTop: 50}}>
              <Text style={{ marginTop: 20, fontWeight: "500", color: Colors.LetraCinza, fontSize: 16 }}>
                Você ainda não fez nenhum pedido de adoção.
              </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}