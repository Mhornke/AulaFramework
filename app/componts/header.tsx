import { View, Text, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";
import {Icon} from '@rneui/themed';
export default function Header() {
  const continer = {
    padding: 3,
    display: "flex",
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Image
          source={{
            uri: "https://github.com/DieizonOliveira/frontAdocao/blob/main/public/logo.png?raw=true",
          }}
          style={{ width: 40, height: 40 }}
        />

        <Text>Adote</Text>
        <Text>.Com </Text>
      </View>
      <Link href="/">
        <button>Voltar</button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
container:{
  flexDirection: "row",
  backgroundColor:'blue',
  padding: 5,
  justifyContent: "space-between",
  alignItems: "center",
  
}, 
containerLogo:{
  flexDirection: "row",
  alignItems: "center",

  
}

})