import { showAlert } from "@/components/swalAlert";
import { Link, router } from "expo-router";
import { Dimensions, Image, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useAuth } from "@/context/AuthContext";
import { URL_Adocao } from "@/utils/url";
import { useEffect } from "react";
import { Controller, useForm } from 'react-hook-form';
import * as keychain from 'react-native-keychain';
import Color from "../../theme/color";
import { push } from "expo-router/build/global-state/routing";

type Input = {
  email: string,
  

}
export default function RecoveryPass() {

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<Input>({
    defaultValues: {
      email: "",
      

    }
  });

  async function onSubmit(data: Input) {
    //dados de refazer senha

    const response = await fetch(`${URL_Adocao}/adotantes/senha/solicitar-troca`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ email: data.email})
    });

    if (response.status === 200) {

      const dados = await response.json();     

      showAlert("Pedido para recuperação de senha enviado","Veja seu email", 'success')    
      router.push(
        {
          pathname:'/(auth)/newpass',
          query:{ email: data.email}
        },
        '/(auth)/newpass'
      )
    } else {

      showAlert("Erro ao Recuperar senha",
        "Email",
        'error'
      )
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
          <Text style={{ color: "#ffff", fontWeight: "bold", fontSize: 20 }}>Informe seus Dados de Acesso</Text>

         
           

            <Text style={styles.texto}>Email para recuperação</Text>
            <Controller
              control={control}
              name="email"

              rules={{ required: 'E-mail obrigatorio' }}
              render={({ field: { onChange, value } }) => (


                <TextInput
                  placeholder="Seu e-mail"
                  value={value}
                  onChangeText={onChange}
                  style={styles.inputs}

                />
              )}
            />                          
                  
             <TouchableOpacity style={styles.botao} onPress={handleSubmit(onSubmit)}>
          <Text style={{ color: "#ffff", fontWeight: "400", fontSize: 16 }}>Entrar</Text>

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

