import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  Platform
} from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Color from "../theme/color";
import { useAuth } from "../context/AuthContext";
import { showAlert } from "./swalAlert";
import DeleteUserButton from "./deleteUser";
import DownBarAnimada from "./giraNoticias";
import Colors from "../theme/color";


const MAX_WIDTH_DESKTOP = 1200;
const MENU_WIDTH_MOBILE = 250;

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openMenuNavega, setOpenMenuNavega] = useState(false);
  const { width } = Dimensions.get("window");
  const { user, logout } = useAuth();
  const isMobile = width <= 768;

  const handleSair = () => {
    setOpenMenu(false);
    showAlert("Usuário deslogado", "Até mais tarde!", "success");
    logout();
    router.replace("/");
  };

  const navigateTo = (path: string) => {
    setOpenMenu(false);
    router.push(path as any);
  };
  const navigateTo2 = (path: string) => {
    setOpenMenuNavega(false);
    router.push(path as any);
  };

  const LogoComponent = () => (
    <View style={styles.logoContainer}>
      <Link href="/">
        <Image
          source={{ uri: "https://github.com/DieizonOliveira/frontAdocao/blob/main/public/logo.png?raw=true" }}
          style={styles.logoImage}
        />
      </Link>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.logoTextMain}>Adote</Text>
        <Text style={[styles.logoTextSub, {
          borderBottomWidth: 1, borderBottomColor: Colors.Butao
        }]}>.Com</Text>
      </View>
    </View>
  );

  const AlertButton = ({ isCompact = false }) => (
    <TouchableOpacity
      onPress={() => navigateTo('/cadastro')}
      activeOpacity={0.8}
      style={[
        styles.alertButton,
        isCompact ? styles.alertButtonCompact : styles.alertButtonFull
      ]}
    >
      <View style={styles.alertIconContainer}>
        <FontAwesome name="bullhorn" size={isCompact ? 16 : 20} color="#333" />
      </View>
      <View>
        <Text style={[styles.alertButtonText, isCompact && { fontSize: 13 }]}>
          ALERTA PET
        </Text>
        {!isCompact && (
          <Text style={styles.alertButtonSubText}>Perdeu ou Encontrou?</Text>
        )}
      </View>
    </TouchableOpacity>
  );



  if (isMobile) {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.mobileHeaderContent}>
          <LogoComponent />

          <TouchableOpacity onPress={() => setOpenMenu(true)}>
            <FontAwesome name="bars" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <Modal visible={openMenu} transparent animationType="fade">
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.overlayClickArea} onPress={() => setOpenMenu(false)} />

            <View style={styles.drawer}>
              <View style={styles.drawerHeader}>
                <Text style={styles.drawerTitle}>Menu</Text>
                <TouchableOpacity onPress={() => setOpenMenu(false)}>
                  <FontAwesome name="times" size={24} color={Color.Butao} />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.drawerContent}>
                {user ? (
                  <>
                    <Text style={styles.welcomeText}>Olá, {user.nome}</Text>
                    <AlertButton />

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/')}>
                      <FontAwesome name="home" size={20} color={Color.Butao} />
                      <Text style={styles.menuItemText}>Início</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/Comunidade')}>
                      <FontAwesome name="users" size={20} color={Color.Butao} />
                      <Text style={styles.menuItemText}>Comunidade</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/(tabs)/pedidos')}>
                      <FontAwesome name="paw" size={20} color={Color.Butao} />
                      <Text style={styles.menuItemText}>Meus Pedidos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/(tabs)/listaPerdidosEncontrados')}>
                      <FontAwesome name="list-ul" size={20} color={Color.Butao} />
                      <Text style={styles.menuItemText}>Lista de Pets</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.menuItem} onPress={handleSair}>
                      <FontAwesome name="sign-out" size={20} color="red" />
                      <Text style={[styles.menuItemText, { color: 'red' }]}>Sair</Text>
                    </TouchableOpacity>

                    <View style={styles.drawerFooter}>
                      <DeleteUserButton />
                    </View>
                  </>
                ) : (
                  <>
                    <AlertButton />
                    <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/')}>
                      <Text style={styles.menuItemText}>Início</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/(auth)/login')}>
                      <Text style={styles.menuItemText}>Entrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/(auth)/register')}>
                      <Text style={styles.menuItemText}>Criar Conta</Text>
                    </TouchableOpacity>
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }


  return (
    <View style={styles.headerContainer}>
    
      <View style={styles.desktopContent}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>

          <TouchableOpacity style={styles.desktopUserBtn} onPress={() => setOpenMenuNavega(true)}>
            <FontAwesome name="bars" size={24} color="white" />
          </TouchableOpacity>
          <Modal visible={openMenuNavega} transparent animationType="fade">

            <TouchableOpacity style={styles.overlayDesktop} onPress={() => setOpenMenuNavega(false)}>
              <View style={styles.dropdownDesktopNavegacao}>


                <TouchableOpacity style={styles.dropdownItemNav} onPress={() => navigateTo2('/(tabs)/')}>
                  <Text style={{ fontWeight: "400", color: "white" }}>Iniciar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dropdownItemNav} onPress={() => navigateTo2('/(tabs)/Comunidade')}>
                  <Text style={{ fontWeight: "400", color: "white" }}>Comunidade</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dropdownItemNav} onPress={() => navigateTo2('/(tabs)/perdidos')}>
                  <Text style={{ fontWeight: "400", color: "white" }}>Volte pra casa</Text>
                </TouchableOpacity>

              </View>
            </TouchableOpacity>
          </Modal>

          <LogoComponent />

        </View>

        <View style={styles.desktopRightSide}>
          <AlertButton />

          {user ? (
            <View style={styles.desktopUserArea}>

              <TouchableOpacity style={styles.desktopUserBtn} onPress={() => setOpenMenu(true)}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{user.nome}</Text>
                <FontAwesome name="ellipsis-v" size={24} color="white" />
              </TouchableOpacity>

              <Modal visible={openMenu} transparent animationType="fade">
                <TouchableOpacity style={styles.overlayDesktop} onPress={() => setOpenMenu(false)}>
                  <View style={styles.dropdownDesktop}>
                    <Text style={styles.dropdownTitle}>Menu do Usuário</Text>

                    <TouchableOpacity style={styles.dropdownItem} onPress={() => navigateTo('/mensagens/chat')}>
                      <Text>Mensagens</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.dropdownItem} onPress={() => navigateTo('/(tabs)/pedidos')}>
                      <Text>Meus Pedidos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.dropdownItem} onPress={() => navigateTo('/(tabs)/listaPerdidosEncontrados')}>
                      <Text>Meus Pets cadastrados</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.dropdownItem} onPress={handleSair}>
                      <Text style={{ color: 'red' }}>Sair</Text>
                    </TouchableOpacity>

                    <View style={{ marginTop: 10 }}>
                      <DeleteUserButton />
                    </View>


                  </View>
                </TouchableOpacity>
              </Modal>
            </View>
          ) : (
            <View style={styles.authLinks}>

              <Link href="/(auth)/login"><Text style={styles.desktopLinkText}>Entrar</Text></Link>
              <Link href="/(auth)/register"><Text style={styles.desktopLinkText}>Criar Conta</Text></Link>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.CorFundo,
    paddingVertical: 10, 
    paddingHorizontal:10,
    zIndex: 100,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoImage: {
    width: 40,
    height: 40,
    marginRight: 5,
  },
  logoTextMain: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
  },
  logoTextSub: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
  },


  mobileHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  overlayClickArea: {
    flex: 1,
  },
  drawer: {
    width: MENU_WIDTH_MOBILE,
    backgroundColor: "#fff",
    height: '100%',
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.CorFundo,
  },
  drawerContent: {
    gap: 15,
  },
  drawerFooter: {
    marginTop: 20,
    alignItems: 'center'
  },


  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.CorFundo,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },


  alertButton: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: Color.Butao,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333'
  },
  alertButtonText: {
    fontWeight: "600",
    color: "white",
    fontSize: 14,
  },
  desktopContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    

  },
  desktopRightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  desktopUserArea: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  desktopUserBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer'
  },
  desktopLinkText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  authLinks: {
    flexDirection: 'row',
    gap: 20,
  },

  overlayDesktop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownDesktop: {
    position: 'absolute',
    top: 70,
    right: 220,
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownDesktopNavegacao: {
    position: 'absolute',
    top: 60,
    left: 0,
    width: "100%",
    backgroundColor: Colors.CorFundo,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row", justifyContent: "space-around"
  },
  dropdownTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  dropdownItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemNav: {
    paddingVertical: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.Butao,
  },

  alertButton: {
    backgroundColor: "#FFD700",
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  alertButtonCompact: {
    
   
  
    borderWidth: 2,
    borderColor: '#F1C40F',
  },


  alertButtonFull: {
    paddingVertical: 12,
    paddingHorizontal: 50,
    gap: 15,    
    justifyContent: 'center',
    marginBottom: 10,
  },

  alertIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 6,
    borderRadius: 20,
  },

  alertButtonText: {
    fontWeight: "900",
    color: "#333",
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },

  alertButtonSubText: {
    fontSize: 12,
    color: "#444",
    fontWeight: "600"
  },
});