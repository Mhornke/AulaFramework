import { Text, View, StyleSheet, Dimensions, Image, TextInput, Switch, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import Header from "../../components/header";
import Color from "../../theme/color"
import { useForm, Controller } from 'react-hook-form'
type Input = {
  nome:string,
  fone:string,
  endereco:string,
  email:string,
  senha:string,

}

export default function Cadastrado() {
  const { control, handleSubmit, formState: { errors } } = useForm<Input>({
    defaultValues:{
      email:"",
      senha:"",
      endereco:"",
      nome:"",
      fone:""
    }
  });

 console.log(control);
 


  async function onSubmit (data: Input)  {
    console.log("dados do input", data);
    const response = await fetch(`https://api-adocao-git-main-dieizons-projects.vercel.app/adotantes`, {
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
  
     if (response.status === 201){
      const dados = await response.json();
      //logaAdotante(dados) armazenar contexto
      alert("Cadastrado com sucesso")
      router.push("/");
     }else{
      alert("Erro... Não foi possivel cadastrar")
     }


  }


  const largura = Dimensions.get('window').width
  const comprimento = Dimensions.get('window').height

  return (
    <View style={{ backgroundColor: Color.CorFundo, height: comprimento }} >
      
      <Header />
      
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={styles.container}>

          <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
          <Text style={{ color: "#ffff", fontWeight: "bold", fontSize:20 }}>Cadastro</Text>
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/DieizonOliveira/frontAdocao/refs/heads/main/public/pegada.png",
          }}
          style={{ width: 70, height: 70 }}
        />
          </View>
          <View style={styles.containerInputs}>
            <Text style={styles.texto}>Nome</Text>
            <Controller
              control={control}
              name="nome"

              rules={{ required: 'Nome obrigatorio' }}
              render={({ field: { onChange, value } }) => (


                <TextInput
                  placeholder="Ensira o nome completo"
                  value={value}
                  onChangeText={onChange}
                  style={styles.inputs}

                />
              )}
            />
            <Text style={styles.texto}>Telefone</Text>
            <Controller
              control={control}
              name="fone"

              rules={{ required: '' }}
              render={({ field: { onChange, value } }) => (


                <TextInput
                  placeholder="(xx) xxxx-xxxx"
                  value={value}
                  onChangeText={onChange}
                  style={styles.inputs}

                />
              )}
            />
            <Text style={styles.texto}>Endereco</Text>
            <Controller
              control={control}
              name="endereco"

              rules={{ required: '' }}
              render={({ field: { onChange, value } }) => (


                <TextInput
                  placeholder=""
                  value={value}
                  onChangeText={onChange}
                  style={styles.inputs}

                />
              )}
            />
            <Text style={styles.texto}>Email</Text>
            <Controller
              control={control}
              name="email"

              rules={{ required: 'Email obrigatorio ' }}
              render={({ field: { onChange, value } }) => (


                <TextInput
                  placeholder="insira um E-mail"
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

              rules={{ required: '' }}
              render={({ field: { onChange, value } }) => (


                <TextInput
                  placeholder="***************"
                  value={value}
                  onChangeText={onChange}
                  style={styles.inputs}

                />
              )}
            />
          </View>        

                  <TouchableOpacity style={styles.botao} onPress={handleSubmit(onSubmit)}>
                    <Text style={{color:"#ffff", fontWeight:"400", fontSize:16}}>Entrar</Text>

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
    width:400,
    height: 600
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