import { Text, View, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";

import Color from "../../theme/color"
import { useForm, Controller } from 'react-hook-form'
import { useAuth } from "@/context/AuthContext";
import { URL_Adocao } from "@/utils/url";
import { showAlert } from "@/components/swalAlert";
import { useState } from "react";
import Colors from "../../theme/color";
import { FontAwesome } from "@expo/vector-icons";

type Input = {
  nome: string,
  fone: string,
  endereco: string,
  email: string,
  senha: string,

}

export default function Cadastrado() {
  const [digitosSenha, setDigitoSenha] = useState('')
  const [digTelefone, setdigTelefone] = useState('')
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<Input>({
    defaultValues: {
      email: "",
      senha: "",
      endereco: "",
      nome: "",
      fone: "",

    }
  });
  const { login } = useAuth()





  async function onSubmit(data: Input) {

    console.log("dados do input", data);

    const response = await fetch(`${URL_Adocao}/adotantes`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        nome: data.nome,
        endereco: data.endereco,
        fone: data.fone,
        email: data.email,
        senha: data.senha
      }),
    });

    console.log(response.status);

    if (response.status === 201) {
      const dados = await response.json();
      const tokenRecebido = dados.token
      if (!tokenRecebido) {
        showAlert("Erro no cadastro", "O servidor não retornou um token de autenticação.", "error")
      }
      await login(
        { id: dados.id, nome: dados.nome, token: tokenRecebido, email: data.email },
        false,

      )

      showAlert("cadastro Realizado com sucesso",
        "Seja bem vindo a nossa plataforma",
        'success'
      )
      router.push("/");
    } else {

      showAlert("Erro ao se cadastrar",
        "Não foi possivel criar o cadastro tente novamente ou mais tarde",
        'error'
      )
    }


  }
  const min = digitosSenha.length >= 8;
  const maiu = /[A-Z]/.test(digitosSenha);
  const caracter = /[!@#$%^&()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(digitosSenha)
  const num = /[0-9]/.test(digitosSenha)
  const numTelefone = /^[0-9]*$/.test(digTelefone)

  const largura = Dimensions.get('window').width
  const comprimento = Dimensions.get('window').height
const isDesktop = largura > 600
  return (
    <View style={{ backgroundColor: Color.CorFundo, height: comprimento }} >



      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
       
        <View style={[styles.container]}>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ color: "#ffff", fontWeight: "bold", fontSize: 20 }}>Cadastro</Text>
            <Image
              source={{
                uri: "https://raw.githubusercontent.com/DieizonOliveira/frontAdocao/refs/heads/main/public/pegada.png",
              }}
              style={{ width: 70, height: 70 }}
            />
          </View>

          <View style={styles.containerInputs}>
            <View>
              <Text style={styles.texto}>Nome completo</Text>
              <Controller
                control={control}
                name="nome"

                rules={{ required: 'Nome obrigatorio' }}
                render={({ field: { onChange, value } }) => (


                  <TextInput
                    placeholder="Ensira o nome completo"
                    value={value}
                    onChangeText={onChange}
                    style={[styles.inputs, { color: value ? "#ffff" : Colors.LetraCinza }]}

                  />
                )}
              />
            </View>

            <View>
              <Text style={styles.texto}>Telefone</Text>
              <Controller
                control={control}
                name="fone"

                rules={{ required: '' }}
                render={({ field: { onChange, value } }) => (

                  <TextInput
                    placeholder="(xx) xxxx-xxxx"
                    value={value}
                    keyboardType="number-pad"
                    inputMode="numeric"
                    maxLength={11}
                    onChangeText={(text) => {
                      const somenteNumeros = text.replace(/[^0-9]/g, "");
                      onChange(somenteNumeros)
                      setdigTelefone(somenteNumeros)
                    }}
                    style={[styles.inputs, { color: value ? "#fff" : Colors.LetraCinza }]}

                  />
                )}
              />
            </View>

            <View>
              <Text style={styles.texto}>Endereço</Text>
              <Controller
                control={control}
                name="endereco"

                rules={{ required: 'Rua, Avenida, Bairro...' }}
                render={({ field: { onChange, value } }) => (


                  <TextInput
                    placeholder="Rua, Avenida, Bairro..."
                    value={value}
                    onChangeText={onChange}
                    style={[styles.inputs, { color: value ? "#fff" : Colors.LetraCinza }]}

                  />
                )}
              />
            </View>

            <View>
              <Text style={styles.texto}>E-mail</Text>
              <Controller
                control={control}
                name="email"

                rules={{ required: 'Email obrigatorio ' }}
                render={({ field: { onChange, value } }) => (


                  <TextInput
                    placeholder="insira um E-mail"
                    value={value}
                    onChangeText={onChange}
                    style={[styles.inputs, { color: value ? "#fff" : Colors.LetraCinza }]}

                  />
                )}
              />
            </View>
           

              <View>
                <Text style={styles.texto}>Senha</Text>

                <View style={{justifyContent:'center'}}>                
                <Controller
                  control={control}
                  name="senha"

                  rules={{ required: '' }}
                  render={({ field: { onChange, value } }) => (


                    <TextInput
                      placeholder="***************"
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                        setDigitoSenha(text)
                      }}
                      secureTextEntry={!showPassword}
                      style={[styles.inputs, { color: value ? "#ffff" : Colors.LetraCinza }]}

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
              </View>
              </View>

            <View style={{ marginTop: 10, flexDirection: "column" }}>
              <Text style={[styles.textoSenha, { color: "white", fontWeight: "600" }]}>Campos nescessarios para criar senha:</Text>
              <Text style={[styles.textoSenha, { color: min ? 'green' : 'white' }]}>Minimmo 8 digitos</Text>
              <Text style={[styles.textoSenha, { color: maiu ? 'green' : 'white' }]}>Minimo 1 letra Maiuscula:</Text>
              <Text style={[styles.textoSenha, { color: caracter ? 'green' : 'white' }]}>Minimo 1 caracter especial</Text>
              <Text style={[styles.textoSenha, { color: num ? 'green' : 'white' }]}>Minimo 1 numero</Text>
            </View>
            </View>


          

          <TouchableOpacity style={styles.botao} onPress={handleSubmit(onSubmit)}>
            <Text style={{ color: "#ffff", fontWeight: "400", fontSize: 16 }}>Entrar</Text>

          </TouchableOpacity>
        </View>

      </View>






    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.CardFundo,
    padding: 30,
    width:'90%',
     maxWidth: 500,
  },
  texto: {
    color: "#ffff",
    fontWeight: "500"
  },
  containerInputs: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 20,
    gap: 20

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
  textoSenha: {
    fontWeight: "400"
  },
  toggleButton: {
    position: 'absolute',
    
    right: 10,
    padding: 5,
    zIndex: 1,
  },

})