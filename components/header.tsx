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
    overlayDesktop: {
      flex: 1,

    },
    sidebar: {
      position: "absolute",
      top: 74,
      height: '100%',
      width: 200,
      backgroundColor: Color.CorFundo,
      padding: 20,
      right: 0,
      gap: 20,
      alignItems: 'center'

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
      fontSize: 20,
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
      fontSize: 18,
      marginBottom: 16,
      textAlign: "center",
    },

    textMenuDesktop: {
      color: "#fff",
      fontWeight: "500",
      fontSize: 16,
      marginHorizontal: 10,
    },
    BotaoCloseModel: {
      position: "absolute",
      right: 0,
      top: -0

    }
  });


  const clickMenu = () => {
    SetOpenMenu(!openMenu);
  };

  if (width <= 600) {
    return (
      <View style={[styles.Header, {}]}>

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

              <TouchableOpacity onPress={clickMenu} style={{ position: 'absolute', right: 15, top: 21 }}>
                <FontAwesome
                  name={openMenu ? "times" : "bars"}
                  size={30}
                  color="white"

                />
              </TouchableOpacity>
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

                        <TouchableOpacity onPress={() => {
                          SetOpenMenu(false)
                          router.push('/Comunidade')
                        }}
                        >
                          <Text style={styles.textoMenu}>Comunidade</Text>
                        </TouchableOpacity>

                        <Text style={styles.textoMenu}>Encontrei um Pet perdido</Text>
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
                        <Text style={styles.textoMenu}>Lista de Pets perdidos</Text>
                      </TouchableOpacity>


                      <TouchableOpacity onPress={() => {
                        SetOpenMenu(false)
                        sair()

                      }}>

                        <Text style={styles.sair}>Sair</Text>
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


    // DESKTOP



    return (
      <View style={{ backgroundColor: Color.CorFundo, alignItems: "center", paddingBottom: 15, paddingTop: 15 }}>

        <View style={{
          width: '100%',
          maxWidth: 1200,
          alignItems: "center",
          justifyContent: 'space-between',
          flexDirection: "row",
          paddingHorizontal: 20
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
            <View style={{ alignItems: "center", flexDirection: "row", gap: 10 }}>

              <Link href="/">
                <Text style={styles.textMenuDesktop}>Início</Text>
              </Link>
              <TouchableOpacity
                onPress={() => {

                  router.push('/cadastro')
                }}
                style={{ backgroundColor: Color.Butao, padding: 5, borderRadius: 5, alignItems: "center", }}>
                <Text style={[styles.textMenuDesktop, { textAlign: 'center' }]}>Encontrei um Pet perdido</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                router.push('/(tabs)/Comunidade')
              }}
              >
                <Text style={styles.textMenuDesktop}>Comunidade</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={clickMenu}>
                <FontAwesome
                  name={openMenu ? "times" : "bars"}
                  size={30}
                  color="white"
                />
              </TouchableOpacity>

              <Modal visible={openMenu} transparent animationType="fade" >

                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => SetOpenMenu(false)}
                  style={styles.overlayDesktop}
                ></TouchableOpacity>

                <View style={styles.sidebar}>
                  <Text style={styles.textMenuDesktop}>Olá, {user.nome}</Text>

                  <TouchableOpacity
                    onPress={() => {
                      SetOpenMenu(false)
                      router.push('/(tabs)/pedidos')
                    }}>
                    <Text style={styles.textMenuDesktop}>Meus Pedidos de Adoção</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      SetOpenMenu(false)
                      router.push('/(tabs)/ListaCadastroAnimais')
                    }}>
                    <Text style={styles.textMenuDesktop}>Lista de Pets perdidos</Text>
                  </TouchableOpacity>




                  <TouchableOpacity onPress={() => {
                    SetOpenMenu(false)
                    sair()

                  }}>

                    <Text style={styles.sair}>Sair</Text>
                  </TouchableOpacity>
                </View>


              </Modal>
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
      </View >
    );
  }
}
