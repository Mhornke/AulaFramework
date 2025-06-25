import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Dimensions, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { RadioButton } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import Colors from '@/theme/color';
import { convertToBase64 } from '@/utils/converteFoto';



type Inputs = {
  nome: string
  idade: number
  sexo: string
  foto: string
  descricao: string
  porte: string
  especieId: number
}
export default function Cadastrado() {
  const [name, setName] = useState('');

  const [especies, setEspecies] = useState<{ id: string; nome: string }[]>([]);
  const [especieId, setEspecieId] = useState<string | null>(null);

  const [size, setSize] = useState<'Pequeno' | 'Medio' | 'Grande'>('Medio');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState<'Macho' | 'Femea'>('Macho');
  const [image, setImage] = useState(null);
  const URL = "http://localhost:3004/animais";
  const { width } = Dimensions.get('window');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  useEffect(() => {
    async function getEspecies() {
      try {
        const response = await fetch(`https://api-adocao-git-main-dieizons-projects.vercel.app/especies`)
        const dados = await response.json()
        setEspecies(dados)
      } catch (error) {
        alert("erro ao buscar especies"
        )
      }
    }
    getEspecies()
  }, [])
  async function handleSubmit(): Promise<void> {

    const fotoBase64 = image? await convertToBase64(image) : ''

    const novoAnimal: Inputs = {
      nome: name,
      idade: Number(age),
      sexo: gender,
      foto: fotoBase64,
      descricao: description,
      porte: size,
      especieId: Number(especieId),
    }
    console.log("dados recebido dos inputs:", JSON.stringify(novoAnimal, null, 2));


    try {
      const response = await fetch(`${URL}`, {
        method: "POST",
        body: JSON.stringify(novoAnimal),
      })


      // Captura e log da resposta da API
      const responseData = await response.json();
      console.log("Response Data:", responseData);



      if (response.ok) {
        alert("Ok! Animal cadastrado com sucesso.")

      } else {
        console.error("Erro no cadastro:", responseData);
        alert("Erro no cadastro do animal.")
      }
    } catch (error) {
      console.error("Erro no fetch:", error);
      alert("Erro na comunicação com o servidor.")
    }
  }
  const especiesOptions = especies.map((item) => ({
    label: item.nome,
    value: item.id.toString(),
  }));


  if (width > 600) {
  return (
    <View style={styles.containerLarge}>
      <Text style={styles.title}>Cadastro de Animal</Text>

      <View >
        {/* Linha 1 - Foto e Descrição */}
        <View style={styles.row}>
          {/* Coluna da Foto */}
          <View style={styles.column}>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <Text style={styles.imagePlaceholder}>+ Adicionar Foto</Text>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Coluna da Descrição */}
          <View style={[styles.column, styles.descriptionColumn]}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input]}
                placeholder="Digite uma descrição do animal"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>
          </View>
        </View>

        {/* Linha 2 - Dados Básicos */}
        <View style={styles.row}>
          {/* Coluna 1 - Nome e Espécie */}
          <View style={styles.column}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome do Animal</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o nome do animal"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Espécie</Text>
              <RNPickerSelect
                onValueChange={(value) => setEspecieId(value)}
                items={especiesOptions}
                placeholder={{ label: 'Selecione uma espécie...', value: null }}
                style={{
                  inputWeb: styles.input,
                  inputAndroid: styles.input,
                  inputIOS: styles.input,
                }}
                value={especieId}
              />
            </View>
          </View>

          {/* Coluna 2 - Idade e Tamanho */}
          <View style={styles.column}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Idade</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite a idade do animal"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tamanho</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[styles.radioButton, size === 'Pequeno' && styles.radioButtonSelected]}
                  onPress={() => setSize('Pequeno')}
                >
                  <Text style={styles.radioText}>Pequeno</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.radioButton, size === 'Medio' && styles.radioButtonSelected]}
                  onPress={() => setSize('Medio')}
                >
                  <Text style={styles.radioText}>Médio</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.radioButton, size === 'Grande' && styles.radioButtonSelected]}
                  onPress={() => setSize('Grande')}
                >
                  <Text style={styles.radioText}>Grande</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Coluna 3 - Sexo */}
          <View style={styles.column}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sexo</Text>
              <View style={styles.radioGroup}>
                <View style={styles.radioOption}>
                  <RadioButton
                    value="Macho"
                    status={gender === 'Macho' ? 'checked' : 'unchecked'}
                    onPress={() => setGender('Macho')}
                    color="#4CAF50"
                  />
                  <Text style={styles.radioText}>Macho</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton
                    value="Femea"
                    status={gender === 'Femea' ? 'checked' : 'unchecked'}
                    onPress={() => setGender('Femea')}
                    color="#4CAF50"
                  />
                  <Text style={styles.radioText}>Fêmea</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Botão de cadastro */}
      <View >
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Cadastrar Animal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} else {

    return (
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>Cadastro de Animal</Text>

        {/* Campo para foto */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholder}>+ Adicionar Foto</Text>
          )}
        </TouchableOpacity>

        {/* Campo para nome */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome do Animal</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do animal"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Campo para espécie */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Espécie</Text>
          <RNPickerSelect
            onValueChange={(value) => setEspecieId(value)}
            items={especiesOptions}
            placeholder={{ label: 'Selecione uma espécie...', value: null }}
            style={{
              inputWeb: styles.input,
              inputAndroid: styles.input,
              inputIOS: styles.input,
            }}
            value={especieId}
          />
        </View>


        <View style={styles.inputContainer}>
          <Text style={styles.label}>Idade</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a idade do animal"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View>

        {/* Seleção de tamanho */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tamanho</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radioButton, size === 'Pequeno' && styles.radioButtonSelected]}
              onPress={() => setSize('Pequeno')}
            >
              <Text style={styles.radioText}>Pequeno</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, size === 'Medio' && styles.radioButtonSelected]}
              onPress={() => setSize('Medio')}
            >
              <Text style={styles.radioText}>Médio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, size === 'Grande' && styles.radioButtonSelected]}
              onPress={() => setSize('Grande')}
            >
              <Text style={styles.radioText}>Grande</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seleção de sexo */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sexo</Text>
          <View style={styles.radioGroup}>
            <View style={styles.radioOption}>
              <RadioButton
                value="macho"
                status={gender === 'Macho' ? 'checked' : 'unchecked'}
                onPress={() => setGender('Macho')}
                color="#4CAF50"
              />
              <Text style={styles.radioText}>Macho</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton
                value="fêmea"
                status={gender === 'Femea' ? 'checked' : 'unchecked'}
                onPress={() => setGender('Femea')}
                color="#4CAF50"
              />
              <Text style={styles.radioText}>Fêmea</Text>
            </View>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Digite uma descrição do animal"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>
        {/* Botão de cadastro */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Cadastrar Animal</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
};
const styles = StyleSheet.create({

 containerLarge: {
    flex: 1,
    padding: 20,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
 row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  column: {
    flex: 1,
    minWidth: 300,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  descriptionColumn: {
    flex: 2,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  imagePicker: {
    width: 150,
    height: 150,
    backgroundColor: Colors.inputCor,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    color: Colors.LetraCinza,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#fffff',
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.inputCor,
    color: Colors.LetraCinza,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  radioButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderRadius: 1,
    backgroundColor: Colors.Butao,

  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioText: {
    marginLeft: 8,
    fontSize: 16,
    
  },
  button: {
    backgroundColor: Colors.Butao,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
