import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native"

export default function Card(data: any) {
   
   
    return(

<View style={styles.conteiner}>
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
           <TouchableOpacity >
            <Text style={{backgroundColor:'blue', padding:10, borderRadius:3, width:200, margin:5,}}>Adotar</Text>
           </TouchableOpacity>
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