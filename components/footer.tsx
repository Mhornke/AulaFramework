import React from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity, Image, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../theme/color";
const Footer = () => {
  const { width } = Dimensions.get("window");

  return (
    <View style={styles.footerContainer}>
      {/* Play Store */}     
      <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-around", width:'100%',
        marginBottom:50
      }}>

        <TouchableOpacity onPress={() => Linking.openURL("https://github.com/Mhornke/AulaFramework/releases/tag/v1.0.0")}>
          <Image
            source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" }}
            style={styles.playStore}
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => Linking.openURL("https://adote-com-admin2-0-zo3r.vercel.app/")}
          style={{flexDirection:"row", alignItems:"center"}}
          >
         
          <Text style={{color:"#fff", fontWeight:"600"}}>Seja um parceiro</Text>
          <Image
            source={{ uri: "https://png.pngtree.com/png-clipart/20250110/original/pngtree-hand-painted-cat-paw-and-human-hand-png-free-material-png-image_5454475.png" }}
            style={{width:50, height:50}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      


      {/* Social icons */}
      <View style={styles.socialContainer}>
        {/* GitHub */}
        <TouchableOpacity onPress={() => Linking.openURL("https://github.com/Mhornke/AulaFramework")}>
          <FontAwesome name="github" size={24} color="#fff" style={styles.icon} />
        </TouchableOpacity>

        {/* LinkedIn adicionar apos postagem do projeto no linkdin */}
        <TouchableOpacity onPress={() => Linking.openURL("")}>
          <FontAwesome name="linkedin" size={24} color="#fff" style={styles.icon} />
        </TouchableOpacity>

        {/* Canva */}
        <TouchableOpacity onPress={() => Linking.openURL("https://www.canva.com/design/DAGkLi6yIrA/gZnth-A5IDszhhGky1qRCA/view?utm_content=DAGkLi6yIrA&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha5a61ee042")}>
          <FontAwesome name="paint-brush" size={24} color="#fff" style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Dev links */}
      <View style={styles.devContainer}>
        <TouchableOpacity onPress={() => Linking.openURL("https://www.linkedin.com/in/matheus-duarte-hornke/")}>
          <Text style={styles.devLink}>/in/Matheus</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("https://www.linkedin.com/in/dieizon-oliveira-silveira-81767016a/")}>
          <Text style={styles.devLink}>/in/Dieizon-</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Footer;


const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: Colors.CorFundo,
    justifyContent:"center",
    alignItems: "center",
   padding:60
  },
  playStore: {
    width: 150,
    height: 50,
    
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  icon: {
    marginHorizontal: 10,
  },
  devContainer: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
  },
  devLink: {
    color: "#fff",
    fontSize: 14,
    marginHorizontal: 10,
  },
});
