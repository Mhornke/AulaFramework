import { Text, View, StyleSheet, Dimensions, Image, TextInput, Switch, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import Header from "../../components/header";
import Color from "../../theme/color"
import { useForm, Controller } from 'react-hook-form'
type Input = {
  email:string,
  senha:string,
  manter:boolean
}

export default function Login() {
  const { control, handleSubmit, formState: { errors } } = useForm<Input>({
    defaultValues:{
      email:"",
      senha:"",
      manter:false
    }
  });

  async function onSubmit (data: Input)  {
    //console.log("dados do input", data);
    const response = await fetch(`https://api-adocao-git-main-dieizons-projects.vercel.app/adotantes/login`, {
      headers: {
          "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ email: data.email, senha: data.senha })
  });
     if (response.status === 200){
      const dados = await response.json();
      //logaAdotante(dados) armazenar contexto
      alert("Login realizado")
      router.push("/");
     }else{
      alert("Erro... Email ou Senha incorreto")
     }


  }


  const largura = Dimensions.get('window').width
  const comprimento = Dimensions.get('window').height

  return (
    <View style={{ backgroundColor: Color.CorFundo, width: largura, height: comprimento }} >
      <Header />

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/DieizonOliveira/frontAdocao/refs/heads/main/public/logo2.png",
          }}
          style={{ width: 100, height: 100 }}
        />
        <View style={styles.container}>
          <Text style={{ color: "#ffff", fontWeight: "bold", fontSize:20 }}>Informe seus Dados de Acesso</Text>

          <View style={styles.containerInputs}>
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
                  style={styles.inputs}

                />
              )}
            />
            <Text style={styles.texto}>Senha</Text>
            <Controller
              control={control}
              name="senha"

              rules={{ required: 'Senha obrigatorio' }}
              render={({ field: { onChange, value } }) => (


                <TextInput
                  placeholder="*******"
                  value={value}
                  onChangeText={onChange}
                  style={styles.inputs}

                />
              )}
            />
          </View>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", alignContent:"space-between" }}>

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
              <Text style={{ color: "#ffff", marginLeft: 5 }}>Manter conectado</Text>
            </View>

            <Link href="./">
              <Text style={{ color: Color.LetraCinza, fontWeight: "400" }}>Esqueci minha senha</Text>
            </Link>

          </View>

                  <TouchableOpacity style={styles.botao} onPress={handleSubmit(onSubmit)}>
                    <Text style={{color:"#ffff", fontWeight:"400", fontSize:16}}>Entrar</Text>

                  </TouchableOpacity>
        </View>

      </View>


<View >
  <Text>E-mail dieizonos@gmail.com</Text>
  <Text>Senha: @Atila123</Text>
</View>



    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.CardFundo,
    padding: 50,
    height: 500
  },
  texto: {
    color: "#ffff",
    fontWeight: "500"
  },
  containerInputs: {
    flex: 1,
    flexDirection: "column",
    justifyContent:"space-around",
    padding:10

  },
  inputs: {
    backgroundColor: Color.inputCor,
    color: Color.LetraCinza,
    borderRadius: 5,
    padding: 10,
  },
  botao: {
backgroundColor:Color.Butao,
padding:10,
borderRadius:5,
alignItems:"center"
  }

})


