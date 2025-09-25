import { showAlert } from "@/components/swalAlert";
import { Link, router } from "expo-router";
import { Dimensions, Image, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useAuth } from "@/context/AuthContext";
import { URL_Adocao } from "@/utils/url";
import { useEffect, useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import * as keychain from 'react-native-keychain';
import Color from "../../theme/color";
import { push } from "expo-router/build/global-state/routing";

type Input = {
  email: string,
  codigo: string,
  novaSenha: string,
  ValidaSenha: string
  

}
export default function RecoveryPass() {

const [senhaInput, setSenhaInput] = useState("")
const [repetirSenha, setRepetirSenha] = useState("")


  const { control, handleSubmit, formState: { errors }, setValue } = useForm<Input>({
    defaultValues: {
      email: "",
      codigo:"",
      novaSenha:"",
      ValidaSenha:""
    }
  });

  async function onSubmit(data: Input) {
    //dados de refazer senha
console.log(`emais do usuario ${data.email}`);

    const response = await fetch(`${URL_Adocao}/adotantes/senha/trocar`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ email: data.email, codigo:data.codigo, novaSenha:data.novaSenha})
    });

if (senhaInput == repetirSenha) {

  if (response.status === 200) {

    const dados = await response.json();     

    showAlert("Recuperação de senha solicitado", 'success')    
    push("/")
  } else {

    showAlert("Erro ao Recuperar senha",
      
      'error'
    )
  }
}


  }

  const largura = Dimensions.get('window').width
  const comprimento = Dimensions.get('window').height

  return (



    
    <View style={{
      backgroundColor: Color.CorFundo, height: comprimento
    , justifyContent:"center"
    }} >
      <View style={{  alignItems: "center", justifyContent: "center" }}>
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/DieizonOliveira/frontAdocao/refs/heads/main/public/logo2.png",
          }}
          style={{ width: 100, height: 100 }}
        />
        <View style={styles.container}>
          <Text style={{ color: "#ffff", fontWeight: "bold", fontSize: 20 }}>Informe seus Dados de Recuperação</Text>

         
           

            
            <Controller
              control={control}
              name="codigo"

              rules={{ required: 'E-mail obrigatorio' }}
              render={({ field: { onChange, value } }) => (


                <TextInput
                  placeholder="Codigo de acesso"
                  value={value}
                  onChangeText={onChange}
                  style={styles.inputs}

                />
              )}
            />                          
            <Controller
              control={control}
              name="novaSenha"

              rules={{ required: 'E-mail obrigatorio' }}
              render={({ field: { onChange, value } }) => (


                <TextInput
                  placeholder="Nova senha"
                  value={value}
                  onChangeText={(text) =>{
                    onChange(text)
                    setSenhaInput(text)
                  }}
                  style={styles.inputs}

                />
              )}
            />                          
            <Controller
              control={control}
              name="ValidaSenha"

              rules={{ required: 'E-mail obrigatorio' }}
              render={({ field: { onChange, value } }) => (


                <TextInput
                  placeholder="Repita nova senha"
                  value={value}
                  onChangeText={(text) =>{
                    onChange(text)
                    setRepetirSenha(text)
                  }}
                  style={styles.inputs}

                />
              )}
            />                          
                  

             <TouchableOpacity style={styles.botao} onPress={handleSubmit(onSubmit)}>
          <Text style={{ color: "#ffff", fontWeight: "400", fontSize: 16 }}>Alterar senha</Text>

        </TouchableOpacity>
        </View>
      </View>


    </View >






  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.CardFundo,
    padding: 50,
    justifyContent:"center",
    gap: 20
  },
  texto: {
    color: "#ffff",
    fontWeight: "500"
  },
  containerInputs: {
    gap: 15,
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 10

  },
  inputs: {
    backgroundColor: Color.inputCor,
    color: Color.LetraCinza,
    borderRadius: 5,
    padding: 10,
  },
  botao: {
    backgroundColor: Color.Butao,
    padding: 10,
    borderRadius: 5,
    alignItems: "center"
  }

})

