import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

// import Toast from "react-native-toast-message";
import React, { useState } from "react";
import { Link } from "expo-router";
import { push } from "expo-router/build/global-state/routing";

export default function Pesquisa() {
  const [termo, setTermo] = useState("");


  
  const enviaPesquisa = (text: any) =>{
setTermo(text)

  }
  function LimpaPesquisa() {
    setTermo("");
    push("/");
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Pesquisar..."
          value={termo}
          onChangeText={enviaPesquisa }
          
        />

        {termo.length > 0 && (
          <TouchableOpacity onPress={LimpaPesquisa} style={styles.clearButton}>
            <FontAwesome name="close" size={20} color="gray" />
          </TouchableOpacity>
        )}

        <Link style={styles.searchButton}
          href={{ pathname: "/pesquisa/[termo]", params: { termo } }}
        ></Link>
      </View>
      <TouchableOpacity onPress={LimpaPesquisa} style={styles.ClearButton}>
        <Text>limpar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  container: {
    marginBottom: 50,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  searchButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 8,
    marginLeft: 5,
  },
  ClearButton: {
    backgroundColor: "green",
    borderRadius: 10,
    width: 100,
    fontWeight: "500",
    padding: 8,
    marginLeft: 5,
    color: "white",
    alignItems: "center",
  },
});
