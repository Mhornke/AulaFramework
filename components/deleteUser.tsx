import { Button, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import { URL_Adocao } from "@/utils/url";
import { router } from "expo-router";
import { useState } from "react";

export default function DeleteUserButton({ style }: { style?: any }) {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!user?.id) return;

    Alert.alert(
      "Atenção",
      "Tem certeza que deseja deletar sua conta? Essa ação não pode ser desfeita!",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const res = await fetch(`${URL_Adocao}/adotantes/${user.id}`, {
                method: "DELETE",
              });

              if (!res.ok) {
                const err = await res.json();
                Alert.alert("Erro", err.message || "Não foi possível deletar a conta.");
                return;
              }

              Alert.alert("Sucesso", "Conta deletada!");
              logout();
              router.replace("/"); // redireciona
            } catch (error: any) {
              Alert.alert("Erro", error.message || "Ocorreu um erro.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  }

  return (
    <Button
      title={loading ? "Deletando..." : "Deletar Conta"}
      color="red" // botão vermelho
      onPress={handleDelete}
      disabled={loading}
      {...style}
    />
  );
}
