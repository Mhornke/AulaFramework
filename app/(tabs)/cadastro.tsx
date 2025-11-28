import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TextInput, Dimensions, TouchableOpacity
  , Image, StyleSheet, Alert, ScrollView, Platform
} from 'react-native';
import Swal from "sweetalert2"
import { FontAwesome } from '@expo/vector-icons';

import Colors from '../../theme/color';
import { useAuth } from '../../context/AuthContext';
import { URL_Adocao } from '../../utils/url';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import imageCompression from 'browser-image-compression';
import { uploadParaCloudinary } from '@/utils/uploadParaCloundinary';
import { SeletorDeImagem, SeletorDeImagemRef } from '@/components/seletorDeImagens';
import { showAlert } from '@/components/swalAlert';
import { ImagePickerAsset } from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import { router } from 'expo-router';
import CarrosselPreview from '@/components/carrocelPreview';
import { CriaAnimalPerdidoDTO } from '@/utils/types/animalPerdidoDTO';
import ConverteData from '@/utils/converteData';
import { MaskedTextInput } from "react-native-mask-text";



export default function Cadastrado() {
  const [name, setName] = useState('');
  const lenName = name.length
  const [tipoAnuncio, setTipoAnucio] = useState<'ENCONTREI' | 'PERDI'>('PERDI');

  const [especies, setEspecies] = useState<{ id: string; nome: string }[]>([]);
  const [especieId, setEspecieId] = useState<string | null>(null);

  const [localizacao, setLocalizacao] = useState('');
  const lenLocal = localizacao.length

  const [contato, setContato] = useState('');
  const lenContato = contato.length
  const [description, setDescription] = useState('');
  const [dataVisto, setDataVisto] = useState('');
  const lenDataVisto = dataVisto.length
  const lenDescription = description.length
  // const [gender, setGender] = useState<'Macho' | 'Femea'>('Macho');



  const seletorRef = useRef<SeletorDeImagemRef>(null);


  const [outrasFotosPreview, setOutrasFotosPreview] = useState<string[]>([]);
  const [outrasFotosFiles, setOutrasFotosFiles] = useState<{ uri: string; name: string; type: string }[]>([]);
  const { user } = useAuth();
  const { width } = Dimensions.get('window');
  const IsLayoutMl = width > 800




  // NOVA FUNÇÃO DE PROCESSAMENTO DE IMAGEM
  async function processarImagemSelecionada(asset: ImagePickerAsset) {
    // Para o preview imediato, usamos a URI que recebemos
    const originalUri = asset.uri;
    let processedFile: { uri: string; name: string; type: string; };

    const MAX_SIZE_MB = 10;
    const options = {
      maxSizeMB: MAX_SIZE_MB,
      useWebWorker: true,
    };

    if (Platform.OS === 'web') {
      // LÓGICA PARA WEB
      console.log("Processando imagem na Web...");
      try {
        // A biblioteca browser-image-compression precisa de um objeto File.
        // Convertemos a URI Base64 para um File.
        const res = await fetch(originalUri);
        const blob = await res.blob();
        const webFile = new File([blob], asset.fileName || 'image.jpg', { type: blob.type });

        if (webFile.size > options.maxSizeMB * 1024 * 1024) {
          Alert.alert("Imagem grande", "A imagem será otimizada para o envio.");
        }

        const compressedFile = await imageCompression(webFile, options);

        // Convertemos o arquivo comprimido de volta para uma URI Base64 para o upload
        const compressedBase64 = await imageCompression.getDataUrlFromFile(compressedFile);

        processedFile = {
          uri: compressedBase64,
          name: compressedFile.name,
          type: compressedFile.type,
        };

      } catch (error) {
        console.error("Erro ao comprimir na web:", error);
        showAlert("Erro", "Não foi possível processar a imagem.", "error");
        return null;
      }
    } else {
      // LÓGICA PARA MOBILE
      console.log("Processando imagem no Mobile...");
      try {
        const fileInfo = await FileSystem.getInfoAsync(originalUri);
        let finalAsset = asset;

        if (fileInfo.exists && fileInfo.size > options.maxSizeMB * 1024 * 1024) {
          Alert.alert("Imagem grande", "A imagem será otimizada para o envio.");
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            originalUri,
            [], // Sem redimensionamento explícito, deixamos a compressão atuar
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
          );
          finalAsset = manipulatedImage;
        }

        processedFile = {
          uri: finalAsset.uri,
          name: `image_${Date.now()}.jpg`,
          type: 'image/jpeg',
        };
      } catch (error) {
        console.error("Erro ao processar no mobile:", error);
        showAlert("Erro", "Não foi possível processar a imagem.", "error");
        return null;
      }
    }

    return { originalUri, processedFile };
  }

  useEffect(() => {

    async function getEspecies() {
      try {
        const response = await fetch(`${URL_Adocao}/especies`)
        const dados = await response.json()
        setEspecies(dados)
      } catch (error) {
        alert("erro ao buscar especies")
      }
    }
    getEspecies()
  }, [])

  // Dentro do seu componente Cadastrado()

  function limparFormulario() {
    console.log("Limpando o formulário...");

    // Limpa os campos de texto
    setName('');
    // setAge('');
    setDescription('');

    // Reseta os seletores para o valor padrão
    setEspecieId(null);
    // setSize('Medio'); // Coloque aqui o valor padrão que você definiu
    // setGender('Macho'); // Coloque aqui o valor padrão


    setOutrasFotosPreview([]);
    setOutrasFotosFiles([]);
  }


  async function handleSubmit(): Promise<void> {
    if (!user || !user.token) {
      showAlert("Erro", "Sessão expirada ou usuário não logado.", "error");
      return;
    }
    if (!especieId) {

      showAlert("Verificar os campos obrigatorios",
        "Foto principal e campo Espécie obrigatorios ",
        'warning'
      )
      return;
    }

    try {
      Swal.fire(
        {
          title: 'Aguerde',
          text: 'Enviando os dados..',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          }
        }
      )



      const urlsAdicionais = await Promise.all(
        outrasFotosFiles.map((file) =>
          uploadParaCloudinary(file)
        )
      );
    const dataConvertida = dataVisto ? ConverteData(dataVisto) : null;

      if (dataVisto && !dataConvertida) {
  throw new Error("Data inválida"); 
}

      const adotanteId = user.id
      const novoAnimal: CriaAnimalPerdidoDTO = {
        nome: name,
        descricao: description,
        tipoAnuncio: tipoAnuncio,
        localizacao: localizacao,
        dataEncontrado: dataConvertida ,
        contato: contato,
        especieId: Number(especieId),
        adotanteId: adotanteId
      };

      console.log(novoAnimal);
      console.log(user.token);

      // Envio para sua API
      const response = await fetch(`${URL_Adocao}/animais-perdidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(novoAnimal),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro no cadastro");
      }

      const responseData = await response.json();
      const animalIdSalvo = responseData.id;

      console.log(`id do animal retornado pra foto ${animalIdSalvo}`);

      if (urlsAdicionais.length > 0) {
        const responsesFotos = await Promise.all(
          urlsAdicionais.map(fotoUrl =>
            fetch(`${URL_Adocao}/fotos`, {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
              },
              body: JSON.stringify({
                descricao: `Foto Extra do ${animalIdSalvo.nome}`,
                codigoFoto: fotoUrl,
                animalId: animalIdSalvo,
              }),
            })
          )
        );
        const algumaRequisicaoFalhou = responsesFotos.some(res => !res.ok);
        if (algumaRequisicaoFalhou) {
          // Se pelo menos uma falhou, lançamos um erro para parar o processo
          // e acionar o bloco catch.
          console.error("Uma ou mais requisições para /fotos falharam.", responsesFotos);
          throw new Error('Erro ao salvar as imagens adicionais no banco de dados.');
        }
      }

      Swal.close()

      const resultAlert = await Swal.fire({
        title: 'Cadastrado com sucesso',
        text: "Deseja ir para pagina inicial?",
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "red",
        confirmButtonText: "Nãp, Quero ficar!!",
        cancelButtonText: "Sim, Desejo ir!!"
      })

      if (resultAlert.isConfirmed) {
        limparFormulario()
      } else {
        router.replace('/');
      }



    } catch (error) {
      console.error("Erro completo:", error);

      Swal.close(); // Fecha o alerta de loading
      Swal.fire({
        title: 'Erro!',
        text: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
        icon: 'error'
      });
    }
  }
  const especiesOptions = especies.map((item) => ({
    label: item.nome,
    value: item.id.toString(),
  }));

  function removerFotoindex(index: number) {
    setOutrasFotosPreview(prev => prev.filter((_, i) => i !== index))
    setOutrasFotosFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <ScrollView>
      <View style={{ alignItems: "center", marginBottom: 30 }}>
        <Text style={styles.title}>Cadastro de Animal</Text>

        <View style={{ borderWidth: 1, borderColor: "#ccc", width: 400 }}>

          <View style={styles.galeriaContainer}>


            <CarrosselPreview fotosUri={outrasFotosPreview}
              onRemoverFoto={removerFotoindex} />

            <View>
              <TouchableOpacity
                onPress={() => seletorRef.current?.abrirGaleria()}>

                <FontAwesome name="image" size={20} color="#007BFF" />
              </TouchableOpacity>

              <SeletorDeImagem
                ref={seletorRef}
                onSelecionada={async (asset) => {
                  const previewUri =
                    Platform.OS === "web"
                      ? `data:image/jpeg;base64,${asset.base64}`
                      : asset.uri;
                  setOutrasFotosPreview((prev) => [...prev, previewUri]);
                  const resultado = await processarImagemSelecionada(asset);
                  if (resultado) {
                    setOutrasFotosFiles((prev) => [...prev, resultado.processedFile]);
                  }
                }}
              />




            </View>
          </View>
          <View style={{ alignItems: "center", marginTop: 20, marginBottom: 5 }}>

            <Text style={{ fontWeight: "600", fontSize: 12, color: "red" }}>É obrigatorio o preenchimento dos campos marcados com ' * '</Text>
          </View>

          <View style={{ width: '100%', padding: 15 }} >
            <View style={{ flexDirection: "row" }}>

              <Text style={styles.label}>Descrição</Text>
              <Text style={{ color: "red" }}>*</Text>
            </View>
            <TextInput
              style={{
                height: 100,
                width: "100%",
                backgroundColor: Colors.inputCor,
                color: lenDescription ? "#fff" : Colors.LetraCinza,
                padding: 10,
                borderRadius: 5
              }}
              placeholder="Digite uma descrição do animal"
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          <View >

            {/* Linha 2 - Dados Básicos */}
            <View style={styles.row}>
              {/* Coluna 1 - Nome e Espécie */}
              <View style={styles.column}>
                <View style={styles.inputContainer}>
                  <Text style={[styles.label,]}>Nome ou Raça</Text>

                  <TextInput
                    style={[styles.input, { color: lenName ? "#fff" : Colors.LetraCinza }]}
                    placeholder="Digite o nome do animal"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
                <View>
                  <View style={styles.inputContainer}>

                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.label}>Tipo de Anúncio</Text>
                      <Text style={[styles.label, { color: "red" }]}>*</Text>
                    </View>

                    <View style={styles.radioGroup}>
                      <TouchableOpacity
                        style={[styles.radioButton, tipoAnuncio === 'PERDI' && styles.radioButtonSelected,


                        ]}
                        onPress={() => setTipoAnucio('PERDI')}
                      >
                        <Text style={[styles.radioText,
                        { color: tipoAnuncio === 'PERDI' ? '#ffff' : 'black' }]}>Encontrado</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.radioButton, tipoAnuncio === 'ENCONTREI' && styles.radioButtonSelected]}
                        onPress={() => setTipoAnucio('ENCONTREI')}
                      >
                        <Text style={[styles.radioText,
                        { color: tipoAnuncio === 'ENCONTREI' ? '#fff' : 'black' }]}>Perdido</Text>
                      </TouchableOpacity>

                    </View>
                  </View>
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



                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Contato</Text>
                  <TextInput
                    style={[styles.input, { color: lenContato ? "#fff" : Colors.LetraCinza }]}
                    placeholder="Digite Numero telefonico ou email!! "
                    value={contato}
                    onChangeText={setContato}

                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Ultima data visto</Text>
                  <MaskedTextInput
                    mask="99/99/9999"
                    style={[styles.input, { color: lenDataVisto ? "#fff" : Colors.LetraCinza }]}
                    placeholder="dd/mm/aaaa"
                    value={dataVisto}
                    onChangeText={(t) => setDataVisto(t)}
                    keyboardType='numeric'

                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Ultima localização visto</Text>
                  <TextInput
                    style={[styles.input, { color: lenLocal ? "#fff" : Colors.LetraCinza }]}
                    placeholder="Onde foi visto pela ultima vez? "
                    value={localizacao}
                    onChangeText={setLocalizacao}

                  />
                  <View style={{ top: 25 }} >
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                      <Text style={styles.buttonText}>Cadastrar Animal</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* <View style={styles.inputContainer}>
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
                  </View> */}
              </View>

              {/* Coluna 3 - Sexo */}
              {/* <View style={styles.column}>
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
                </View> */}

            </View>

          </View>


          {/* Botão de cadastro */}

        </View>
      </View>
    </ScrollView>
  );

};
const styles = StyleSheet.create({

  containerLarge: {
    flex: 1,
    alignItems: "center",
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
    borderRadius: 5,
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
  iconButton: {
    backgroundColor: Colors.Butao,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
  },
  iconButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  galeriaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  galeriaImage: {
    width: "100%",
    height: 400,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },

});
