import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState } from "react";
export default function Header() {
  const [openMenu, SetOpenMenu] = useState(false);

  const clickMenu = () => {
    SetOpenMenu(!openMenu);
  };

  const continer = {
    padding: 3,
    display: "flex",
  };

  return (
    <View style={styles.Header}>
      <View style={styles.logo}>
        <Image
          source={{
            uri: "https://github.com/DieizonOliveira/frontAdocao/blob/main/public/logo.png?raw=true",
          }}
          style={{ width: 40, height: 40 }}
        />

        <Text>Adote</Text>
        <Text>.Com </Text>
      </View>
      <View>
        <TouchableOpacity onPress={clickMenu}>
          <Icon name={openMenu ? 'times': 'bars'  } size={30} color="black" />
        </TouchableOpacity>
      
      <View>
        {openMenu && (
          <View style={styles.menu}> 
            <Link href="/">
              <Text>Home</Text>
            </Link>
            <Link href="/">
              <Text>Login</Text>
            </Link>
            <Link href="/">
              <Text>Cadastro</Text>
            </Link>
          </View>
        )}
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Header: {
    
    flexDirection: "row",
    backgroundColor: "blue",
    padding: 15,
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
  },
  menu: {
    
    position: 'relative',
    zIndex: 1,    
    top: 50,
    right: 0,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    width: 500,
  } });
