import { FontAwesome } from "@expo/vector-icons";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router"; // Importação correta
import React, { useState } from "react";
import Colors from "../theme/color";

export default function Pesquisa() {
  const [termo, setTermo] = useState("");
  const router = useRouter(); // Hook para navegação

  const enviaPesquisa = (text: string) => {
    setTermo(text);
  };

  // Função para realizar a busca (pelo ícone ou enter do teclado)
  function handleSearch() {
    if (termo.trim() === "") return;
    
    router.push({
      pathname: "/pesquisa/[termo]",
      params: { termo }
    });
  }

  function limparPesquisa() {
    setTermo("");
    // Opcional: Se quiser voltar para home ao limpar, descomente a linha abaixo
    // router.push("/"); 
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        
        {/* Input de Texto */}
        <TextInput
          style={styles.input}
          placeholder="Pesquisar..."
          placeholderTextColor="#999"
          value={termo}
          onChangeText={enviaPesquisa}
          onSubmitEditing={handleSearch} // Permite pesquisar dando "Enter" no teclado
          returnKeyType="search"
        />

        {/* Botão X (Limpar) - Só aparece se tiver texto */}
        {termo.length > 0 && (
          <TouchableOpacity onPress={limparPesquisa} style={styles.iconButton}>
            <FontAwesome name="close" size={16} color="#888" />
          </TouchableOpacity>
        )}

        {/* Botão Lupa (Pesquisar) */}
        <TouchableOpacity 
          onPress={handleSearch} 
          style={styles.searchButton}
        >
          <FontAwesome name="search" size={18} color="white" />
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    height:100,
  
    marginBottom:100
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff", 
    borderRadius: 30, 
    paddingVertical: 5,
    paddingLeft: 15,
    paddingRight: 5, 
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  input: {
    flex: 1, 
    height: 40,
    fontSize: 16,
    color: "#333",
    outlineStyle: 'none' as any
  },
  iconButton: {
    padding: 8,
    marginRight: 5,
  },
  searchButton: {
    backgroundColor: Colors.Butao || "#007BFF", 
    width: 40,
    height: 40,
    borderRadius: 20, 
    alignItems: "center",
    justifyContent: "center",
  },
});