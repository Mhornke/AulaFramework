import { FontAwesome } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Link } from "expo-router";
import { push } from "expo-router/build/global-state/routing";
import React, { useState } from "react";
import Colors from "../theme/color";

export default function Pesquisa() {
  const [termo, setTermo] = useState("");

  const enviaPesquisa = (text: any) => {
    setTermo(text);
  };
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
          onChangeText={enviaPesquisa}
        />

        {termo.length > 0 && (
          <TouchableOpacity onPress={LimpaPesquisa} style={styles.clearButton}>
            <FontAwesome name="close" size={20} color="gray" />
          </TouchableOpacity>
        )}

        <Link
          style={styles.searchButton}
          href={{ pathname: "/pesquisa/[termo]", params: { termo } }}
        >
          <FontAwesome name="search" size={20} color="white" />
        </Link>
        <TouchableOpacity onPress={LimpaPesquisa} style={styles.ClearButton}>
        <Text style={{color:"#ffff"}}>limpar</Text>
      </TouchableOpacity>
      </View>
      
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
    marginTop:10
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
    backgroundColor:Colors.CorFundo,
    color:Colors.LetraCinza,
    paddingLeft:10,
    borderRadius:10
  },
  clearButton: {
    padding: 5,
  },
  searchButton: {
    backgroundColor: Colors.Butao,
    borderRadius: 20,
    padding: 8,
    marginLeft: 5,
  },
  ClearButton: {
    backgroundColor: Colors.Butao,
    borderRadius: 10,
    width: 100,
    fontWeight: "500",
    padding: 8,
    marginLeft: 5,
    color: "white",
    alignItems: "center",
  },
});
