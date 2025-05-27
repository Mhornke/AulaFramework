import { Link } from "expo-router";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native"
import Color from "../theme/color";
import { AnimalI } from "../utils/types/animias";


export default function Card( {data}:{data:AnimalI}   ) {
   
   
   
   
    return(

<View style={styles.conteiner} key={data.id}>
        <Image 
        source={{uri:data.foto}}
       style={{width: 400, height: 400}} 
       />     
       <View style={styles.containerText}>
        <Text style={styles.TextName}>{data.nome}</Text>
        <Text style={styles.Text}>{data.especie.nome}</Text>
        <Text style={styles.Text}>{data.idade}</Text>
        <Text style={styles.Text}>{data.sexo}</Text>
        <Text style={styles.Text}>{data.porte}</Text>
        <Text style={styles.Text}>{data.descricao}</Text>
        </View>
        <View style={styles.butao}>
        <Link
          href={`./app/(tabs)/${data.id}`} key={data.id}>   {/* erro ao transitar entre pastas */}
            
            
           <TouchableOpacity >
            <Text style={{backgroundColor:Color.Butao, color:"#ffffff" ,padding:10, borderRadius:3, width:200, margin:5,}}>Adotar</Text>
           </TouchableOpacity>
           </Link>
        </View>
</View> 



    )
    
}

const styles = StyleSheet.create({

conteiner:{
    backgroundColor: Color.CorFundo,
    marginVertical:15,
    borderRadius:5,
   

},
butao:{
    margin:10,
    color:'white',
},

containerText:{
    margin: 10,
    
    
},
Text:{
    marginLeft: 5,
    color:Color.LetraCinza,

},
TextName:{
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
},

})

// layout com integração # TESTAR #
{/* <View style={styles.conteiner} key={data.pet.id}>
        <Image 
        source={data.foto}
       style={{width: 400, height: 400}} 
       />     
       <View style={styles.containerText}>
        <Text style={styles.TextName}>{data..nome}</Text>
        <Text style={styles.Text}>{data.especie.nome}</Text>
        <Text style={styles.Text}>{data.idade}</Text>
        <Text style={styles.Text}>{data.sexo}</Text>
        <Text style={styles.Text}>{data.porte}</Text>
        <Text style={styles.Text}>{data.descricao}</Text>
        </View>
        <View style={styles.butao}>
            <Link  href={{
          pathname: `datails/${data.id}`,
          params: { id: data.pet.id },
        }}>
            
           <TouchableOpacity >
            <Text style={{backgroundColor:Color.Butao, color:"#ffffff" ,padding:10, borderRadius:3, width:200, margin:5,}}>Adotar</Text>
           </TouchableOpacity>
           </Link>
        </View>
</View> */}
