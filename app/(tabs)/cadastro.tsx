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
// import { MaskedTextInput } from "react-native-mask-text";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { AnimalPerdidoI } from '@/utils/types/animiasPerdidos';

export default function Cadastrado() {
  const [name, setName] = useState('');
  const lenName = name.length
  const [tipoAnuncio, setTipoAnuncio] = useState<'ENCONTREI' | 'PERDI'>('ENCONTREI');
  const [show, setShow] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [especies, setEspecies] = useState<{ id: string; nome: string }[]>([]);
  const [especieId, setEspecieId] = useState<string | null>(null);
  const [localizacao, setLocalizacao] = useState('');
  const lenLocal = localizacao.length

  const [contato, setContato] = useState('');
  const lenContato = contato.length
  const [description, setDescription] = useState('');


  const lenDescription = description.length
  // const [gender, setGender] = useState<'Macho' | 'Femea'>('Macho');
  console.log(show);



  const seletorRef = useRef<SeletorDeImagemRef>(null);


  const [outrasFotosPreview, setOutrasFotosPreview] = useState<string[]>([]);
  const [outrasFotosFiles, setOutrasFotosFiles] = useState<{ uri: string; name: string; type: string }[]>([]);
  const { user, isLoading } = useAuth();
  const { width } = Dimensions.get('window');
  const IsLayoutMl = width > 800

  console.log(outrasFotosPreview);
  console.log(outrasFotosFiles);
  console.log(tipoAnuncio);
  console.log("usuario ide existe:", user?.id);

  useEffect(() => {
    if (isLoading) return;        // só roda depois de carregar
    if (!user) return;            // evita disparo antes de popular

    if (!user?.token) {
      showAlert("Atenção", "Você precisa estar logado...", "question")
        .then(confirmarLogin => {
          if (confirmarLogin) router.push("/(auth)/login");
          else router.push('/');
        });
    }
  }, [isLoading, user]);

  function toDate(value: any): Date | null {
    if (!value) return null;

    if (value instanceof Date) return value;

    // dayjs() tem a propriedade "toDate"
    if (value.toDate) return value.toDate();

    // timestamps (number)
    if (typeof value === "number") return new Date(value);

    // strings de data
    if (typeof value === "string") return new Date(value);

    return null;
  }


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
    // async function BuscaAnimaisPerdidos() {
    //   try {
    //     const response = await fetch(`${URL_Adocao}/animais-perdidos`)
    //     const dados = await response.json()
    //     const dadosPorUsuario = dados.filte((c) => c.user.id == dados.adotanteId)
    //     setDadosAnimalPerdido(dadosPorUsuario)
    //   } catch (error) {
    //     alert("erro ao buscar Animais Perdidos")
    //   }
    // }
    // BuscaAnimaisPerdidos()
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

  // LOG PARA VER RESPOSTA COMPLETA
  async function lerResposta(response: Response) {
    const cloned = response.clone();
    const text = await cloned.text();

    console.log("Status:", response.status);
    console.log("Resposta RAW:", text);

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  async function handleSubmit(): Promise<void> {
    // console.log("data enviada", date);

    // if (!user || !user.token) {
    //   showAlert("Erro", "Sessão expirada ou usuário não logado.", "error");
    //   return;
    // }
    // if (!especieId) {

    //   showAlert("Verificar os campos obrigatorios",
    //     "Foto principal e campo Espécie obrigatorios ",
    //     'warning'
    //   )
    //   return;
    // }

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
      console.log("Link da foto ", urlsAdicionais);




      const adotanteId = user?.id
      const novoAnimal: CriaAnimalPerdidoDTO = {
        nome: name || "Sem nome",
        descricao: description,
        tipoAnuncio: tipoAnuncio,
        localizacao: localizacao,
        dataEncontrado: date ? date.toLocaleDateString('pt-BR') : null,
        contato: contato,
        especieId: Number(especieId),
        adotanteId: adotanteId!
      };
      console.log("📩 BODY ENVIADO AO BACKEND:", novoAnimal);
      console.log(novoAnimal);
      console.log(user?.token);
      console.log("Data enviada pro backend:", novoAnimal.dataEncontrado);

      // Envio para sua API
      const response = await fetch(`${URL_Adocao}/animais-perdidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        },
        body: JSON.stringify(novoAnimal),
      });
      const resposta = await lerResposta(response);
      // const responseData = await response.json();
      // const animalIdSalvo = responseData.id;

      // console.log(`id do animal retornado pra foto ${animalIdSalvo}`);
      if (!response.ok) {
        console.error("❌ BACKEND ERROU:", resposta);
        throw new Error(resposta.message || "Erro no cadastro");
      }


      console.log("✅ BACKEND SUCESSO:", resposta);
      const animalIdSalvo = resposta.id;
      console.log("ID do animal:", animalIdSalvo);

      if (urlsAdicionais.length > 0) {
        console.log("entrou no if de urlAdicionais");

        const responsesFotos = await Promise.all(

          urlsAdicionais.map(fotoUrl =>
            fetch(`${URL_Adocao}/fotos`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user?.token}`
              },
              body: JSON.stringify({
                descricao: `Foto Extra${animalIdSalvo}`,
                codigoFoto: fotoUrl,
                animalPerdidoId: animalIdSalvo,
              }),

            })
          )
        );

        console.log(responsesFotos);

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
        confirmButtonText: "Sim, Desejo ir!!",
        cancelButtonText: "Não, Desejo ficar!!"
      })

      if (!resultAlert.isConfirmed) {
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

        <View style={{
          borderWidth: 1, borderColor: "#ccc", flexDirection: IsLayoutMl ? "row" : "column", width: "100%", maxWidth: 1200,
          justifyContent: "space-between"
        }}>

          {/* Galeria de fotos */}
          <View style={[styles.galeriaContainer,IsLayoutMl && { flex:1},{alignItems:"center", top:10}]}>

            <CarrosselPreview fotosUri={outrasFotosPreview}
              onRemoverFoto={removerFotoindex} />

            <View>
              <TouchableOpacity
                onPress={() => seletorRef.current?.abrirGaleria()}>

                <FontAwesome name="camera" size={20} color="#007BFF" />
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


          <View style={{ flex: 1 }}>
            <View style={{ width: '100%', padding: 15 }} >
              <View style={{ alignItems: "center", marginTop: 20, marginBottom: 5 }}>

                <Text style={{ fontWeight: "600", fontSize: 12, color: "red" }}>É obrigatorio o preenchimento dos campos marcados com ' * '</Text>
              </View>

              <View style={{ flexDirection: "row" }}>

                <Text style={styles.label}>Descrição</Text>
                <Text style={{ color: "red" }}>*</Text>
              </View>
              <TextInput
                style={{
                  fontSize:14,
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

            <View style={{ flex: 2 }}>
              {/* Linha 2 - Dados Básicos */}
              <View style={styles.row}>
                {/* Coluna 1 - Nome e Espécie */}
                <View style={styles.column}>
                  <View style={styles.inputContainer}>
                    <View style={{ flexDirection: "row" }}>

                      <Text style={[styles.label,]}>Nome ou Raça</Text>
                      <Text style={[styles.label, { color: "red" }]}>*</Text>
                    </View>

                    <TextInput
                      style={[styles.input, { color: lenName ? "#fff" : Colors.LetraCinza,fontSize:14 }]}
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
                        {/* ENCONTREI */}
                        <TouchableOpacity
                          style={[
                            styles.radioButton,
                            tipoAnuncio === 'ENCONTREI' && styles.radioButtonSelected
                          ]}
                          onPress={() => setTipoAnuncio('ENCONTREI')}
                        >
                          <Text
                            style={[
                              styles.radioText,
                              { color: tipoAnuncio === 'ENCONTREI' ? '#fff' : 'black' }
                            ]}
                          >
                            Encontrado
                          </Text>
                        </TouchableOpacity>

                        {/* PERDI */}
                        <TouchableOpacity
                          style={[
                            styles.radioButton,
                            tipoAnuncio === 'PERDI' && styles.radioButtonSelected
                          ]}
                          onPress={() => setTipoAnuncio('PERDI')}
                        >
                          <Text
                            style={[
                              styles.radioText,
                              { color: tipoAnuncio === 'PERDI' ? '#fff' : 'black' }
                            ]}
                          >
                            Perdido
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={styles.inputContainer}>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.label}>Espécie</Text>
                      <Text style={{ color: "red", fontWeight: "800" }}>*</Text>
                    </View>
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
                      style={[styles.input, { color: lenContato ? "#fff" : Colors.LetraCinza,fontSize:14 }]}
                      placeholder="Digite Numero telefonico ou email!! "
                      value={contato}
                      onChangeText={setContato}

                    />
                  </View>

                  {/* <View style={styles.inputContainer}>
                  
                  {/* <Text style={styles.label}>Ultima data visto</Text>
                  <MaskedTextInput
                    mask="99/99/9999"
                    style={[styles.input, { color: lenDataVisto ? "#fff" : Colors.LetraCinza }]}
                    placeholder="dd/mm/aaaa"
                    value={dataVisto}
                    onChangeText={(t) => setDataVisto(t)}
                    keyboardType='numeric'

                  />
                </View> */}

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Última data vista</Text>

                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 5
                      }}
                      onPress={() => setShow(true)}
                    >
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: date ? Colors.Preto : Colors.LetraCinza }}>
                          {date ? date.toLocaleDateString('pt-BR') : "dd/mm/aaaa"}
                        </Text>
                        <FontAwesome name='angle-down' size={18} color={"black"} />
                      </View>
                    </TouchableOpacity>

                    {show && (
                      <DateTimePicker
                        mode="single"
                        date={date || new Date()}
                        onChange={(params) => {
                          setDate(toDate(params.date));
                          setShow(false);
                        }}
                      />
                    )}


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


                </View>



              </View>
            </View>
          </View>

        </View>
      </View>
    </ScrollView>
  );

};
const styles = StyleSheet.create({


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
    fontSize: 14,
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
    gap: 10,
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
