import React, { useEffect, useState } from "react";
import { showAlert } from "@/components/swalAlert";
import { Link, router } from "expo-router";
import { Dimensions, Platform, Image, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { URL_Adocao } from "@/utils/url";
import { Controller, useForm } from 'react-hook-form';
import Color from "../../theme/color";
import { FontAwesome } from "@expo/vector-icons";
type Input = {
  email: string,
  senha: string,
  manter: boolean
}

export default function Login() {
  // Estado para controlar a visibilidade da senha
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<Input>({
    defaultValues: {
      email: "",
      senha: "",
      manter: false
    }
  });
  // Desestruturação do useAuth para acesso às funções
  const { login, loadSavedCredentials } = useAuth()

  useEffect(() => {
    const loadDadosLogin = async () => {
      // Usa a função do contexto para carregar o email e o estado de persistência.
      const { email, manter } = await loadSavedCredentials();

      setValue('email', email);
      setValue('manter', manter);
    }
    loadDadosLogin()
  }, [setValue, loadSavedCredentials])


  async function onSubmit(data: Input) {
    const response = await fetch(`${URL_Adocao}/adotantes/login`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ email: data.email, senha: data.senha, persist:data.manter })
    });

    if (response.status === 200) {

      const dados = await response.json();
      const tokenRecebido = dados.token

      if (!tokenRecebido) {
        showAlert("Erro de login", "Token de autenticação não recebido na resposta do servidor", "error")
        return
      }

      showAlert("Login Realizado", "Seja bem-vindo(a) de volta.", 'success')

      // Chamada do login (apenas userData e persist)
      await login(
        { id: dados.id, nome: dados.nome, email: data.email, token: tokenRecebido },
        data.manter
      )

      router.push("/");
    } else {
      showAlert("Erro ao Logar",
        "Email ou senha incorretos",
        'error'
      )
    }
  }

  const largura = Dimensions.get('window').width
  const comprimento = Dimensions.get('window').height

  return (
    <View style={{ backgroundColor: Color.CorFundo, height: comprimento }} >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/DieizonOliveira/frontAdocao/refs/heads/main/public/logo2.png",
          }}
          style={{ width: 100, height: 100 }}
        />
        <View style={styles.container}>
          <Text style={{ color: "#ffff", fontWeight: "bold", fontSize: 20 }}>Informe seus Dados de Acesso</Text>

          <View style={[styles.containerInputs,]}>
            <Text style={styles.texto}>Email</Text>
            <Controller
              control={control}
              name="email"

              rules={{ required: 'E-mail obrigatorio' }}
              render={({ field: { onChange, value } }) => (


                <TextInput
                  placeholder="Seu e-mail"
                  value={value}
                  onChangeText={onChange}
                  style={[styles.inputs, { color: value ? '#ffff' : Color.LetraCinza }]}

                />
              )}
            />
            <Text style={styles.texto}>Senha</Text>
            <Controller
              control={control}
              name="senha"

              rules={{ required: 'Senha obrigatorio' }}
              render={({ field: { onChange, value } }) => (
                <View style={{ position: 'relative' }}>
                  <TextInput
                    placeholder="********"
                    value={value}
                    onChangeText={onChange}

                    secureTextEntry={!showPassword}
                    style={[styles.inputs, { color: value ? '#ffff' : Color.LetraCinza }]}
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
              )}
            />
          </View>

          <View style={{ flexDirection: "row", marginTop: 10, alignItems: "center", alignContent: "space-between" }}>

            <View style={{ flexDirection: "row", padding: 5 }}>
              <Controller
                control={control}
                name="manter"
                defaultValue={false}

                render={({ field: { onChange, value } }) => (

                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={value ? "#fff" : "#ccc"}
                  />
                )}
              />
              <Text style={{ color: "#ffff", marginLeft: 5 }}>Manter-me conectado</Text>
            </View>

            <Link href={`/(auth)/recoveryPass`}>
              <Text style={{ color: Color.LetraCinza, marginLeft: 20, fontWeight: "400" }}>Esqueci minha senha</Text>
            </Link>

          </View>
          <View style={[{ alignItems: 'center' }]}>
            <Link href="/(auth)/register">
              <Text style={{ color: Color.Butao, marginLeft: 20, fontWeight: "400" }}>
                Ainda não tenho cadastro
              </Text>
            </Link>
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
    padding: 50,
    height: "60%",
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
    paddingRight: 40,
  },
  botao: {
    backgroundColor: Color.Butao,
    padding: 10,
    borderRadius: 5,
    alignItems: "center"
  },

  toggleButton: {
    position: 'absolute',
    top: 5,
    right: 10,
    padding: 5,
    zIndex: 1,
  },
})
