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
import DeleteUserButton from "./deleteUser";
import { Colors } from "react-native/Libraries/NewAppScreen";
import DownBarAnimada from "./giraNoticias";
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
      color: Color.Butao,
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

        <View >
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
                      <TouchableOpacity onPress={() => {
                        SetOpenMenu(false)
                        router.push('/Comunidade')
                      }}
                      >
                        <Text style={styles.textoMenu}>Comunidade</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          SetOpenMenu(false)
                          router.push('/cadastro')
                        }}>

                        <View style={{ flexDirection: "row", gap: 10, borderWidth: 1, borderColor: Color.Preto, backgroundColor: Color.Butao, padding: 5, borderRadius: 5, alignItems: "center", marginBottom: 15, justifyContent: "center" }}>
                          <FontAwesome name="exclamation-triangle" size={20} color="#e5fc62ff" style={{

                          }} />
                          <Text style={{ fontWeight: "500", color: "white", fontSize: 20 }}>Perdeu ou Encontrou</Text>
                        </View>

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
                          router.push('/(tabs)/listaPerdidosEncontrados')
                        }}>
                        <Text style={styles.textoMenu}>Lista de Pets que Perdeu ou encontrou </Text>
                      </TouchableOpacity>


                      <TouchableOpacity onPress={() => {
                        SetOpenMenu(false)
                        sair()

                      }}>

                        <Text style={styles.sair}>Sair</Text>
                      </TouchableOpacity>
                      <View style={{ position: "absolute", bottom: -300, left: 96 }}>

                        <DeleteUserButton />
                      </View>
                    </View>
                  ) : (
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          SetOpenMenu(false)
                          router.push('/cadastro')
                        }}>

                        <View style={{ flexDirection: "row", gap: 10, borderWidth: 1, borderColor: Color.Preto, backgroundColor: Color.Butao, padding: 5, borderRadius: 5, alignItems: "center", marginBottom: 30 }}>
                          <FontAwesome name="exclamation-triangle" size={20} color="#e5fc62ff" style={{

                          }} />
                          <Text style={{ fontWeight: "500", color: "white", fontSize: 20 }}>Perdeu ou Encontrou</Text>
                        </View>

                      </TouchableOpacity>
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
      <View style={{
        backgroundColor: Color.CorFundo
        , borderBottomWidth: 0.5,
        borderBottomColor: "#ccccc",
        paddingBottom: 15,
        alignItems: "center",
        paddingTop: 15,
        width: "100%"
      }}>

        <View style={{
          width: "100%",
          maxWidth: 1200,
          alignItems: "center",
          flexDirection: "row",
        }}>
          <View style={[styles.logo, { marginLeft: 10 }]}>
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

          <View style={{ flexDirection: "row", marginLeft: "auto", marginRight: 50 }}>

            <TouchableOpacity
              onPress={() => {

                router.push('/cadastro')
              }}
              style={{ backgroundColor: Color.Butao, padding: 5, borderRadius: 5, alignItems: "center", }}>
              <Text style={[styles.textMenuDesktop, { textAlign: 'center' }]}>Perdeu ou Encontrou</Text>
            </TouchableOpacity>
          </View>

          {user ? (
            <View style={{ marginRight: 10, flexDirection: "row", gap: 30, alignItems: "center" }}>

              <View style={{}}>
                <Link href="/">
                  <FontAwesome name="home" size={30} color="white" />
                </Link>
              </View>

              <TouchableOpacity onPress={() => {
                router.push('/(tabs)/Comunidade')
              }}
              >
                <View style={{ flexDirection: "row" }}>
                  <FontAwesome name="users" size={24} color="white" />

                </View>
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
                      router.push('/(tabs)/listaPerdidosEncontrados')
                    }}>
                    <Text style={styles.textMenuDesktop}>Lista de Pets perdidos</Text>
                  </TouchableOpacity>




                  <TouchableOpacity onPress={() => {
                    SetOpenMenu(false)
                    sair()

                  }}>

                    <Text style={styles.sair}>Sair</Text>
                  </TouchableOpacity>
                  <View style={{position:"absolute", bottom:150}}>
                  <DeleteUserButton />
                  </View>
               
                </View>
                <View style={{}}>
                  <DownBarAnimada/>
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
