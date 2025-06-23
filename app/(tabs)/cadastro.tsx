import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { RadioButton } from 'react-native-paper';


export default function Cadastrado() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [size, setSize] = useState('médio');
  const [gender, setGender] = useState('macho');
  const [image, setImage] = useState(null);

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

  const handleSubmit = () => {
    const animalData = {
      name,
      species,
      size,
      gender,
      image
    };
    console.log('Dados do animal:', animalData);
    // Aqui você pode enviar os dados para sua API ou banco de dados
  };

  return (
    <View contentContainerStyle={styles.container}>
      
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
        <TextInput
          style={styles.input}
          placeholder="Ex: Cachorro, Gato, Pássaro"
          value={species}
          onChangeText={setSpecies}
        />
      </View>

      {/* Seleção de tamanho */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tamanho</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity 
            style={[styles.radioButton, size === 'pequeno' && styles.radioButtonSelected]}
            onPress={() => setSize('pequeno')}
          >
            <Text style={styles.radioText}>Pequeno</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.radioButton, size === 'médio' && styles.radioButtonSelected]}
            onPress={() => setSize('médio')}
          >
            <Text style={styles.radioText}>Médio</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.radioButton, size === 'grande' && styles.radioButtonSelected]}
            onPress={() => setSize('grande')}
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
              status={gender === 'macho' ? 'checked' : 'unchecked'}
              onPress={() => setGender('macho')}
              color="#4CAF50"
            />
            <Text style={styles.radioText}>Macho</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton
              value="fêmea"
              status={gender === 'fêmea' ? 'checked' : 'unchecked'}
              onPress={() => setGender('fêmea')}
              color="#4CAF50"
            />
            <Text style={styles.radioText}>Fêmea</Text>
          </View>
        </View>
      </View>

      {/* Botão de cadastro */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Cadastrar Animal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#e0e0e0',
    borderRadius: 75,
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
    color: '#666',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
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
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
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
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
