import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Modal } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import { useState } from "react";
import Color from "../theme/color"


export default function Header() {
  const [openMenu, SetOpenMenu] = useState(false);
  const {width, height} = Dimensions.get('window')

  const styles = StyleSheet.create({
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
      backgroundColor: 'rgba(0, 0, 0, 0.83)',
      justifyContent: 'flex-start',
      alignItems: 'center',      
      paddingTop: 100,
      
      

    },
    textoMenu: {
      color: "#ffff",
      fontWeight: "500",
      fontSize:20,
      margin:10
      
      
    },
    textMenuTablet:{
      color: "#ffff",
      fontWeight: "medium",
      fontSize:16,
      margin:10
    },
    texto: {
      color: "#ffff",
      fontWeight: "700"
    },




  });


  const clickMenu = () => {
    SetOpenMenu(!openMenu);
  };

if (width < 600) {
  return (
    <View style={styles.Header}>
      
      <View   style={styles.logo}>
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
          <FontAwesome name={openMenu ? 'times' : 'bars'} size={30} color="white" />
        </TouchableOpacity>

        <Modal  visible={openMenu} transparent animationType="fade">
          <TouchableOpacity activeOpacity={1}
            style={styles.menu}
            onPress={() => SetOpenMenu(false)}>

            <View  >
              <Link href="/">
                <Text style={styles.textoMenu}>Home</Text>
              </Link>
              <Link href="/(auth)/login">
                <Text style={styles.textoMenu}>Login</Text>
              </Link>
              <Link href="/(auth)/register">
                <Text style={styles.textoMenu}>Cadastro</Text>
              </Link>
              <Link href="/pedidos">
                <Text style={styles.textoMenu}>Pedidos</Text>
              </Link>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
}else if (width >= 600){

  return (
    <View style={styles.Header}>
      
      <View   style={styles.logo}>
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

            <View  style={{alignItems:"center", flexDirection:"row"}}>
              
              <Link href="/(auth)/login">
                <Text style={styles.textMenuTablet}>Login</Text>
              </Link>
              <Link href="/(auth)/register">
                <Text style={styles.textMenuTablet}>Cadastro</Text>
              </Link>
              <Link href="/pedidos">
                <Text style={styles.textMenuTablet}>Pedidos</Text>
              </Link>
            </View>
         
        
      
    </View>
  );
}
  
}

