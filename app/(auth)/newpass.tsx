import { showAlert } from "@/components/swalAlert";
import { Link, router } from "expo-router";
import { Dimensions, Image, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
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
 
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const { control, handleSubmit, formState: { errors }, getValues } = useForm<Input>({
    defaultValues: {
      email: "",
      codigo: "",
      novaSenha: "",
      ValidaSenha: ""
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
        body: JSON.stringify({ email: data.email, codigo: data.codigo, novaSenha: data.novaSenha })
      });
  
      
  
        if (response.status === 200) {
  
          const dados = await response.json();
  
          showAlert("Recuperação de senha solicitado", 'success')
          push("/")
        } else {
  
          showAlert("Erro ao Recuperar senha", 'verifique o token novamente ou ensira uma senha valida', 'error'
  
            
          )
        }
    
       


  }

  const largura = Dimensions.get('window').width
  const comprimento = Dimensions.get('window').height

  return (

<ScrollView
     contentContainerStyle={{ flexGrow: 1 }}
    > 


    <View style={{
      backgroundColor: Color.CorFundo, height: comprimento
      , justifyContent: "center"
    }} >
      <View style={{ alignItems: "center", justifyContent: "center" }}>
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
                style={[styles.inputs, { color: value ? '#ffff' : Color.LetraCinza }]}

              />
            )}
          />
          <Text style={[styles.texto,{marginVertical:10}]}>Nova senha</Text>
          <Controller
            control={control}
            name="novaSenha"

            rules={{ required: 'E-mail obrigatorio' }}
            render={({ field: { onChange, value } }) => (


              <TextInput
                placeholder="***********"
                value={value}
                secureTextEntry={!showPassword}
                onChangeText={(text) => {
                  onChange(text)
                  
                }}
                style={[styles.inputs,{ color: value ? '#ffff' : Color.LetraCinza } ]}

              />

            )}

          />
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <FontAwesome
              name={showPassword ? 'eye' : 'eye-slash'}
              size={20}
              color={Color.LetraCinza}
            />
          </TouchableOpacity>
          <Text style={styles.texto}>Repetir senha</Text>
          <Controller
            control={control}
            name="ValidaSenha"

            rules={{ required: 'É obrigatorio repetir a senha',
              validate: (value) =>
                value === getValues("novaSenha") || "Senhas não correspondem"
             }}
             render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="***********"
                value={value}
                secureTextEntry={!showPassword2}
                onChangeText={onChange} // Não precisa mais do setRepetirSenha
                style={[styles.inputs, { color: value ? '#ffff' : Color.LetraCinza }]}
              />
            )}

           

          />
          <TouchableOpacity
            style={styles.toggleButton2}
            onPress={() => setShowPassword2(!showPassword2)}
          >
            <FontAwesome
              name={showPassword2 ? 'eye' : 'eye-slash'}
              size={20}
              color={Color.LetraCinza}
            />
          </TouchableOpacity>
         


      {errors.ValidaSenha && (
  <Text style={styles.errorText}>{errors.ValidaSenha.message}</Text>

)}
          <TouchableOpacity style={styles.botao} onPress={handleSubmit(onSubmit)}>
            <Text style={{ color: "#ffff", fontWeight: "400", fontSize: 16 }}>Alterar senha</Text>

          </TouchableOpacity>
        </View>
      </View>
    </View >





</ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.CardFundo,
    padding: 50,
    justifyContent: "center",
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
  },
  toggleButton: {
    position: 'absolute',
    right: 60,
    top:220,
    padding: 5,
    zIndex: 1,
  },
  toggleButton2: {
    position: 'absolute',
    right: 60,
    top:320,
    padding: 5,
    zIndex: 1,
  },
  errorText: {

    color: '#FF5A5F', 
    fontSize: 14,
    marginTop: 5,
    alignSelf: 'center', 
  }
})

