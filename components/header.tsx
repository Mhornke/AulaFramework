import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import { showAlert } from "./swalAlert";
import { Link, router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import Color from "../theme/color";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [openMenu, SetOpenMenu] = useState(false);
  const { width, height } = Dimensions.get("window");
  const { user, logout } = useAuth();

  const sair = () => {
    showAlert("Usuario deslogado com sucesso",
      "Até mais tarde",
      "success"
    )
    logout();
    router.replace('/');
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: Color.CorFundo,
      justifyContent: 'center',
      alignItems: 'center',
    },

    sair: {
      color: 'red',
      fontWeight: '500',
      fontSize: 16, // padronizado
      marginTop: 20,
      textAlign: 'center',
    },

    Header: {
      flexDirection: "row",
      width: "100%",
      backgroundColor: Color.CorFundo,
      padding: 15,
      alignItems: "center",
      justifyContent: "space-between"

    },

    logo: {
      flexDirection: "row",
      alignItems: "center",
    },

    texto: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 20, // padronizado para o nome da marca
      marginLeft: 4,
    },

    menu: {
      flex: 1,
      width: width,
      justifyContent: "flex-start",
      alignItems: "center",
    },

    textoMenu: {
      color: "#fff",
      fontWeight: "500",
      fontSize: 18, // padronizado para menu mobile
      marginBottom: 16,
      textAlign: "center",
    },

    textMenuDesktop: {
      color: "#fff",
      fontWeight: "500",
      fontSize: 16, // padronizado para desktop/tablet
      marginHorizontal: 10,
    },
  });


  const clickMenu = () => {
    SetOpenMenu(!openMenu);
  };

  if (width < 1100) {
    return (
      <View style={[styles.Header,{}]}>

        <View style={styles.logo}>
          <Link href="/">
            <Image
              source={{
                uri: "https://github.com/DieizonOliveira/frontAdocao/blob/main/public/logo.png?raw=true",
              }}
              style={{ width: 40, height: 40 }}
            />
          </Link>
          <Text style={styles.texto}>Adote</Text>
          <Text style={styles.texto}>.Com </Text>
        </View>

        <View>
          <TouchableOpacity onPress={clickMenu}>
            <FontAwesome
              name={openMenu ? "times" : "bars"}
              size={30}
              color="white"
            />
          </TouchableOpacity>

          <Modal visible={openMenu} transparent animationType="fade">
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => SetOpenMenu(false)}
              style={styles.overlay}
            >
              <View >
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.menu}
                  onPress={() => { }}
                >
                  {user ? (
                    <View>
                      <Text style={styles.textoMenu}>Olá, {user.nome}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          SetOpenMenu(false)
                          router.push('/')
                        }}>
                        <Text style={styles.textoMenu}>Início</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          SetOpenMenu(false)
                          router.push('/cadastro')
                        }}>
                        <Text style={styles.textoMenu}>Cadastrar Animal</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          SetOpenMenu(false)
                          router.push('/(tabs)/pedidos')
                        }}>
                        <Text style={styles.textoMenu}>Meus Pedidos de Adoção</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          SetOpenMenu(false)
                          router.push('/(tabs)/ListaCadastroAnimais')
                        }}>
                        <Text style={styles.textoMenu}>Meus Animais</Text>
                      </TouchableOpacity>


                      <TouchableOpacity onPress={() => {
                        SetOpenMenu(false)
                        sair()

                      }}>

                        <Text style={styles.sair}>Encerrar Sessão</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          SetOpenMenu(false)
                          router.push('/')
                        }}>
                        <Text style={styles.textoMenu}>Início</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          SetOpenMenu(false)
                          router.push('/(auth)/login')
                        }}>
                        <Text style={styles.textoMenu}>Entrar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          SetOpenMenu(false)
                          router.push('/(auth)/register')
                        }}>
                        <Text style={styles.textoMenu}>Criar Conta</Text>
                      </TouchableOpacity>


                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

        </View>
      </View>

    );
  } else {
    return (
      <View style={{ backgroundColor: Color.CorFundo, alignItems: "center", paddingBottom:15, paddingTop:15 }}>

        <View style={{
          width: '100%',
          maxWidth: 1200,
          alignItems: "center",
          justifyContent: 'space-between',

          flexDirection: "row"
        }}>

          <View style={styles.logo}>
            <Link href="/">
              <Image
                source={{
                  uri: "https://github.com/DieizonOliveira/frontAdocao/blob/main/public/logo.png?raw=true",
                }}
                style={{ width: 40, height: 40 }}
              />
            </Link>
            <Text style={styles.texto}>Adote</Text>
            <Text style={styles.texto}>.Com </Text>
          </View>

          {user ? (
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <Text style={styles.textMenuDesktop}>Olá, {user.nome}</Text>
              <Link href="/">
                <Text style={styles.textMenuDesktop}>Início</Text>
              </Link>
              <Link href="/pedidos">
                <Text style={styles.textMenuDesktop}>Meus Pedidos de Adoção</Text>
              </Link>
              <Link href="/(tabs)/ListaCadastroAnimais">
                <Text style={styles.textMenuDesktop}>Meus Animais</Text>
              </Link>

              <Link href="/(tabs)/cadastro">
                <Text style={styles.textMenuDesktop}>Cadastrar Animal

                </Text>
              </Link>
              <TouchableOpacity onPress={sair}>
                <Text
                  style={{
                    color: "red",
                    fontWeight: "500",
                    fontSize: 20,
                    margin: 10,
                  }}
                >
                  Encerrar Sessão
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <Link href="/">
                <Text style={styles.textMenuDesktop}>Início</Text>
              </Link>
              <Link href="/(auth)/login">
                <Text style={styles.textMenuDesktop}>Entrar</Text>
              </Link>
              <Link href="/(auth)/register">
                <Text style={styles.textMenuDesktop}>Criar Conta</Text>
              </Link>
            </View>
          )}
        </View>
      </View>
    );
  }
}
