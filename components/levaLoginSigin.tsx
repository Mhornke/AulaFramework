import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "@/theme/color"; // Ajuste o caminho conforme seu projeto

export default function LinkLoginSigin() {
  return (
    <View style={styles.loginWarningContainer}>
      <FontAwesome name="lock" size={40} color={Colors.LetraCinza} style={{ marginBottom: 10 }} />
      
      <Text style={styles.warningText}>
        Identificamos que você não está logado.
      </Text>
      
      <Text style={styles.subWarningText}>
        Para poder usar alguns recursos entre em sua conta.
      </Text>
      
      <View style={styles.authButtonsContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.loginButtonText}>Fazer Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.registerButtonText}>Criar Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginWarningContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%'
  },
  warningText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  subWarningText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20
  },
  authButtonsContainer: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
    justifyContent: 'center'
  },
  loginButton: {
    backgroundColor: Colors.Butao,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  registerButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.Butao
  },
  registerButtonText: {
    color: Colors.Butao,
    fontWeight: 'bold'
  },
});