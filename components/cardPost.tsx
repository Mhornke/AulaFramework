import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TextInput, TouchableOpacity, Animated, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { PostComunidadeI } from '@/utils/types/PostComuniade';
import CarrosselFotos from "./carrosselFotosComunidade";
import Colors from '@/theme/color';
import { showAlert } from './swalAlert';
import AnimacaoLike from './animacaoLike';



export default function PostCard({ data }: any) {

  const [openComentario, setOpenComentario] = useState(false);
  const [respostasAbertas, setRespostasAbertas] = useState<Record<number, boolean>>({});
  const [modelResponderAbertas, setModelResponderAbertas] = useState<Record<number, boolean>>({});
  const [Curtida, setCurtida] = useState(false)

  const [conteudorespostaComentario, setConteudoRespostaComentario] = useState('')
  const [conteudoComentario, setConteudoComentario] = useState('')


  const { width } = useWindowDimensions();
  const isWeb = width > 800;
  const larguraTela = Dimensions.get("window").width;



  function OpenModelComentario() {
    setOpenComentario(prev => !prev);
  }

  function OpenModelRespostaComentario(idComentario: number) {
    setRespostasAbertas(prev => ({
      ...prev,
      [idComentario]: !prev[idComentario]
    }));
  }

  function OpenModelResponderComentario(idComentario: number) {
    setModelResponderAbertas(prev => ({
      ...prev,
      [idComentario]: !prev[idComentario]
    }));
  }
  async function EnviarComentario() {

    if (conteudoComentario.length > 0) {

      showAlert("Comentario enviado", "", 'success')
    }
  }
  async function EnviarRespostaComentario() {

    if (conteudorespostaComentario.length > 0) {

      showAlert("Resposta enviado", "", 'success')
    }

  }

  return (
    <View
      style={[
        styles.card,
        { maxWidth: isWeb ? 1100 : "100%", width: isWeb ? larguraTela : "100%" }
      ]}
    >

      {/* HEADER */}
      <View style={styles.header}>
        <Image source={data.foto} style={styles.avatar} />
        <Text style={styles.userName}>{data.user.nome}</Text>
      </View>

      {/* FOTOS */}
      {data.fotos?.length > 0 && (
        <CarrosselFotos fotos={data.fotos} />
      )}

      {/* AÇÕES */}
      <View style={styles.actionsContainer}>

        <View style={{ flexDirection: "row", alignItems: "center" }}>

          <View style={styles.actionButton}>
            <AnimacaoLike onToggle={() => setCurtida(true)} />
            <Text style={{ marginLeft: -6 }}>{data.curtida}</Text>
          </View>



          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={OpenModelComentario}
          >


            <FontAwesome name={openComentario ? "comment" : "comment-o"} size={22} color="#333" />
            <Text style={{ marginLeft: 5 }}>{data.comentarios.length}</Text>


          </TouchableOpacity>

          <View style={styles.timestampContainer}>
            <FontAwesome name="clock-o" size={15} color="#888" />
            <Text style={styles.timestamp}>{data.createdAt}</Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.postText}>{data.texto}</Text>
        </View>

      </View>



      {/* LISTA DE COMENTÁRIOS */}
      <View
        style={[
          styles.ModelComentario,
          { display: openComentario ? "flex" : "none", padding: 12 }
        ]}

      >
        {/* AREA DE COMENTARIOS */}
        <View style={{ marginBottom: 20 }}>

          {/* BOTÃO DE COMENTÁRIOS */}
          <View style={{ alignItems: "center", borderWidth: 1, borderColor: "#cccc", paddingBottom: 10, borderRadius: 5 }}>
            <TextInput
              placeholder='Deixar comentario..'
              placeholderTextColor="#888"
              multiline
              textAlignVertical="top"
              underlineColorAndroid="transparent"
              value={conteudoComentario}
              onChangeText={setConteudoComentario}

              style={[styles.TextAreaDeixarComentarios]}
            />

            <TouchableOpacity

              style={[
                styles.ButtonComentarios,
                { width: isWeb ? 180 : "40%" }
              ]}

              onPress={EnviarComentario}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Enviar
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ borderWidth: 1, borderColor: "rgba(204, 204, 204, 0.23)", width: "100%", marginVertical: 50 }}></View>
          {data.comentarios.map(c => (

            <View key={c.id} style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: "#cccc", borderRadius: 5 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>

                <Image source={c.foto} style={[styles.avatar, {
                  width: 30,
                  height: 30,
                }]} />


                <Text style={{ fontWeight: "bold" }}>{c.adotante.nome}</Text>
              </View>

              <Text style={{ paddingVertical: 40 }}>{c.texto}</Text>

              <View style={{ flexDirection: "row", gap: 10 }}>

                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginVertical: 10, gap: 5 }}>
                  <FontAwesome name="heart-o" size={15} color="#3d3b3bff" style={{ marginTop: 4 }} />
                  <Text>Curtir</Text>
                  <Text>{c.curtida}</Text>
                </TouchableOpacity>             

                <TouchableOpacity
                  onPress={() => OpenModelResponderComentario(c.id)}
                  style={{ flexDirection: "row", alignItems: "center", marginVertical: 10, marginLeft: 15, gap: 5 }}>
                  <FontAwesome name="comment-o" size={15} color="#3d3b3bff" style={{ marginTop: 4 }} />
                  <Text>Deixar Resposta</Text>
                </TouchableOpacity>

              </View>              

              <View style={{ flexDirection: "row", marginVertical: 20, gap: 20, display: modelResponderAbertas[c.id] ? "flex" : "none", padding: 12 }}>
                <FontAwesome name="level-down" size={20} color="#555"
                  style={{ transform: [{ scaleX: -1 }, { rotate: "90deg" }], marginLeft: 10 }}
                />

                {/* INPUT DE RESPOSTA PARA OS COMENTARIOS */}
                <TextInput
                  placeholder='Deixar uma Resposta para o comentario'
                  placeholderTextColor="#888"
                  underlineColorAndroid="transparent"
                  value={conteudorespostaComentario}
                  onChangeText={setConteudoRespostaComentario}

                  multiline
                  style={styles.InputRespostaComentario}
                />
                <TouchableOpacity style={styles.botaoResposta}
                  onPress={EnviarRespostaComentario}
                >
                  <Text style={{ fontWeight: "500", color: "#ffff" }}>Enviar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 12,
    paddingBottom: 10,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#CCC",
    marginRight: 10,
  },

  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  actionsContainer: {
    padding: 10,
    marginVertical: 25,

  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  ButtonComentarios: {
    padding: 10,
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: Colors.Butao,
  },

  actionText: {
    marginLeft: 4,
    fontSize: 15,
    color: '#333',
  },

  timestampContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  timestamp: {
    fontSize: 13,
    color: '#888',
    marginLeft: 6,
  },

  textContainer: {
    marginTop: 8,
  },

  ModelComentario: {},
  postText: {
    fontSize: 16,
    lineHeight: 22,
  },
  InputRespostaComentario: {
    width: "95%",

    borderWidth: 0,
    borderColor: "transparent",
    borderStyle: "none" as any,
    borderBottomWidth: 0,

    outlineWidth: 0,
    outlineStyle: "none" as any,
    outlineColor: "transparent",

  },
  TextAreaDeixarComentarios: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#fff",
    height: 125,

    borderWidth: 0,
    borderColor: "transparent",
    borderStyle: "none" as any,
    borderBottomWidth: 0,

    outlineWidth: 0,
    outlineStyle: "none" as any,
    outlineColor: "transparent",

    padding: 10,
  },
  botaoResposta: {
    backgroundColor: Colors.Butao,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5
  }

});
