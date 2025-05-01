import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
export default function Detalhes(data: any) {

    const { id } = useLocalSearchParams();

    return(
<View style={styles.conteiner} key={data.pet.id}>
        <Image 
        source={data.pet.foto}
       style={{width: 400, height: 400}} 
       />     
       <View style={styles.containerText}>
        <Text style={styles.TextName}>{data.pet.name}</Text>
        <Text style={styles.Text}>Raça: {data.pet.type}</Text>
        <Text style={styles.Text}>Peso: {data.pet.weight}</Text>
        <Text style={styles.Text}>Idade: {data.pet.age}</Text>
        </View>
        <View>
        {/* preencher formulario de adocao */}
            <Link href="/"> 
           <TouchableOpacity >
            <Text style={{backgroundColor:'blue', padding:10, borderRadius:3, width:200, margin:5,}}>Adotar</Text>
           </TouchableOpacity>
           </Link>
        </View>
</View>


    )
}



const styles = StyleSheet.create({

conteiner:{
    flex: 1,  
    backgroundColor: "#fff",
    marginVertical:15,
    
},

containerText:{
    margin: 10,
    
    
},
Text:{
    marginLeft: 5,

},
TextName:{
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
},

})