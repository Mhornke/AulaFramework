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
import { Link, router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import Color from "../theme/color";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
export default function Header() {
  const [openMenu, SetOpenMenu] = useState(false);
  const { width, height } = Dimensions.get("window");
  const { user, logout } = useAuth();

  const sair = () => {
    console.log("logout sendo disparado");
    alert("Deslogado com sucesso!!");
    logout();
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: Color.CorFundo,
      justifyContent: 'center',
      alignItems: 'center',
    },

    sair: {
      color: '#0000CD',
      fontWeight: '500',
      fontSize: 20,
      marginTop: 20,
      textAlign: 'center',
    },

    Header: {
      flexDirection: "row",
      backgroundColor: Color.CorFundo,
      padding: 15,
      justifyContent: "space-between",
      alignItems: "center",
    },
    logo: {
      flexDirection: "row",
      alignItems: "center",
    },
    menu: {
      flex: 1,
      width: width,
      justifyContent: "flex-start",
      alignItems: "center",

    },
    textoMenu: {
      color: "#ffff",
      fontWeight: "500",
      fontSize: 20,
      marginBottom: 16,
      textAlign: "center",
    },

    textMenuTablet: {
      color: "#ffff",
      fontWeight: "medium",
      fontSize: 16,
      margin: 10,
    },
    texto: {
      color: "#ffff",
      fontWeight: "700",
    },
  });

  const clickMenu = () => {
    SetOpenMenu(!openMenu);
  };

  if (width < 600) {
    return (
      <View style={styles.Header}>
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
                        <Text style={styles.textoMenu}>Home</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          SetOpenMenu(false)
                          router.push('/cadastro')
                        }}>
                        <Text style={styles.textoMenu}>Cadastro de animais</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          SetOpenMenu(false)
                          router.push('/(tabs)/pedidos')
                        }}>
                        <Text style={styles.textoMenu}>Pedidos</Text>
                      </TouchableOpacity>                    
                    

                      <TouchableOpacity onPress={sair}>
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
                        <Text style={styles.textoMenu}>Home</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          SetOpenMenu(false)
                          router.push('/(auth)/login')
                        }}>
                        <Text style={styles.textoMenu}>Login</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          SetOpenMenu(false)
                          router.push('/(auth)/register')
                        }}>
                        <Text style={styles.textoMenu}>Cadastro</Text>
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
  } else if (width >= 600) {
    return (
      <View style={styles.Header}>
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
            <Text style={styles.textMenuTablet}>Olá, {user.nome}</Text>
            <Link href="/">
              <Text style={styles.textMenuTablet}>Home</Text>
            </Link>
            <Link href="/pedidos">
              <Text style={styles.textMenuTablet}>Pedidos</Text>
            </Link>
            <Link href="/(tabs)/cadastro">
              <Text style={styles.textMenuTablet}>Cadastro de animais</Text>
            </Link>
            <TouchableOpacity onPress={sair}>
              <Text
                style={{
                  color: "#0000CD",
                  fontWeight: "500",
                  fontSize: 20,
                  margin: 10,
                }}
              >
                Sair
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ alignItems: "center", flexDirection: "row" }}>
            <Link href="/">
              <Text style={styles.textMenuTablet}>Home</Text>
            </Link>
            <Link href="/(auth)/login">
              <Text style={styles.textMenuTablet}>Login</Text>
            </Link>
            <Link href="/(auth)/register">
              <Text style={styles.textMenuTablet}>Cadastro</Text>
            </Link>
          </View>
        )}
      </View>
    );
  }
}
