import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  useWindowDimensions, Platform, Alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { PostComunidadeI } from '@/utils/types/PostComuniade';// Ajuste o caminho
import CarrosselFotos from "./carrosselFotosComunidade"; // Seu componente de carrossel
import Colors from '@/theme/color';
import { showAlert } from '../swalAlert';
import AnimacaoLike from '../animacaoLike';
import { URL_Adocao } from '@/utils/url';
import { useAuth } from '@/context/AuthContext';
import { deletar } from './delete';
import { Comentario } from '@/utils/types/comentario';
import { Fotos } from '@/utils/types/fotos';
interface PostCardProps {
  data: PostComunidadeI;
  onDelete: (id: number) => void;
}

export default function PostCard({ data, onDelete }: PostCardProps,) {
  const { user } = useAuth()
  const [openComentario, setOpenComentario] = useState(false);
  const [modelResponderAbertas, setModelResponderAbertas] = useState<Record<number, boolean>>({});
  const [curtida, setCurtida] = useState(false);
  const [listaComentarios, setComentarios] = useState<Comentario[]>(data.comentarios || []);
  const [conteudoComentario, setConteudoComentario] = useState('');
  const { width } = useWindowDimensions();
  const isWeb = width > 800;
  const larguraTela = Dimensions.get("window").width;
  const [numeroCurtidas, setNumeroCurtidas] = useState(data.curtida);

  useEffect(() => {
    if (data.comentarios) {
      setComentarios(data.comentarios);
    }
  }, [data.comentarios]);
  function OpenModelComentario() {
    setOpenComentario(prev => !prev);
  }

  function OpenModelResponderComentario(idComentario: number) {
    setModelResponderAbertas(prev => ({
      ...prev,
      [idComentario]: !prev[idComentario]
    }));
  }

  async function EnviarComentario(id: number) {

    const body = {
      texto: conteudoComentario,
      adotanteId: user?.id,
      postComunidadeId: id
    }

    const response = await fetch(`${URL_Adocao}/comentarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user?.token}`
      },
      body: JSON.stringify(body)
    })
    if (response.ok) {
      const dados = await response.json()
      showAlert("Comentário enviado", "", 'success');
      setConteudoComentario("");
      setComentarios((listaAtual) => [...listaAtual, dados]);
    } else {
      throw console.error("os que esta sendo enviado", body);

    }
  }


  async function handleCurtir() {
    const proximoStatus = !curtida;
    const proximoNumero = proximoStatus ? numeroCurtidas + 1 : numeroCurtidas - 1;

    setCurtida(proximoStatus);
    setNumeroCurtidas(proximoNumero);

    try {
      // 2. Requisição ao Backend
      const response = await fetch(`${URL_Adocao}/posts-comunidade/${data.id}/curtir`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          tipo: proximoStatus ? "add" : "remove"
        })
      });
      if (response.ok) {
        const dados = await response.json();
        setNumeroCurtidas(dados.curtida);

      } else {
        throw new Error('Falha na API');
      }
    } catch (error) {
      // 3. Reverte se der erro (Rollback visual)
      setCurtida(!proximoStatus);
      setNumeroCurtidas(numeroCurtidas); // volta ao numero original
      console.log("Erro no catch:", error);
      showAlert("Não foi possível curtir", "Tente novamente", "error");
    }
  }



  async function handleExcluirComentario(idComentario: number) {

    const queroExcluir = await showAlert("Você realmente deseja excluir?", "", "question")

    if (queroExcluir) {
      try {
        const response = await fetch(`${URL_Adocao}/comentarios/${idComentario}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${user?.token}`
          }
        });

        if (response.ok) {
          showAlert("Comentário apagado", "", 'success');
          setComentarios((listaAtual) => listaAtual.filter(c => c.id !== idComentario));
        } else {
          showAlert("Erro ao apagar", "Você não tem permissão ou houve um erro", 'error');
        }
      } catch (error) {
        console.log(error);
        showAlert("Erro de conexão", "Tente mais tarde", 'error');
      }

    }



  }

  async function handleExcluirPost(idPoste: number) {

    const queroExcluir = await showAlert("Você realmente deseja excluir?", "", "question")

    if (queroExcluir) {
      try {
        const response = await fetch(`${URL_Adocao}/posts-comunidade/${idPoste}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${user?.token}`
          }
        });

        if (response.ok) {
          showAlert("Poste apagado", "", 'success');
          if (onDelete) {
            onDelete(idPoste)
          }
        } else {
          showAlert("Erro ao apagar", "Você não tem permissão ou houve um erro", 'error');
        }
      } catch (error) {
        console.log(error);
        showAlert("Erro de conexão", "Tente mais tarde", 'error');
      }

    }



  }


  // Formata a data para ficar bonitinha (ex: 29/11/2025)
  const dataFormatada = new Date(data.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // Verifica se tem comentários para evitar erro de .length em undefined
  const qtdComentarios = data.comentarios ? data.comentarios.length : 0;

  const nomeUsuario = data.adotante.nome || "Usuário";
  const avatarURL = `https://ui-avatars.com/api/?name=${nomeUsuario}&background=random&color=fff`;
  console.log(data.fotos);

  return (
    <View style={[
      styles.card,
      { maxWidth: isWeb ? 700 : "100%", width: isWeb ? 700 : "100%" } // Ajustei maxWidth para ficar estilo Feed
    ]}
    >


      <View style={[styles.header, { justifyContent: "space-between" }]}>


        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={{ uri: avatarURL }} style={styles.avatar} />
          <View>

            <Text style={styles.userName}>{nomeUsuario || "Usuário"}</Text>
            <Text style={styles.timestamp}>{dataFormatada}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleExcluirPost(data.id)}>
          <Text style={{ color: "red" }}>Excluir</Text>
        </TouchableOpacity>

      </View>


      <View style={styles.textContainer}>
        <Text style={styles.postText}>{data.texto}</Text>
      </View>


      {data.fotos && data.fotos.length > 0 && (
        <View style={{}}>

          <CarrosselFotos fotos={data.fotos} />
        </View>
      )}


      <View style={styles.actionsContainer}>

        {/* Botão Curtir */}
        <TouchableOpacity style={styles.actionButton}
          onPress={handleCurtir}>
          <AnimacaoLike liked={curtida} />
          <Text style={styles.actionText}>{numeroCurtidas} Curtidas</Text>
        </TouchableOpacity>

        {/* Botão Comentar */}
        <TouchableOpacity style={styles.actionButton} onPress={OpenModelComentario}>
          <FontAwesome name="comment-o" size={20} color="#65676B" />
          <Text style={styles.actionText}>{qtdComentarios} Comentários</Text>
        </TouchableOpacity>

      </View>

      {/* ÁREA DE COMENTÁRIOS (Expansível) */}
      {openComentario && (
        <View style={styles.commentSection}>

          {/* Input Novo Comentário */}
          <View style={styles.inputCommentRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="Escreva um comentário..."
              placeholderTextColor="#888"
              multiline
              value={conteudoComentario}
              onChangeText={setConteudoComentario}
            />

            <TouchableOpacity onPress={() => EnviarComentario(data.id)} style={styles.sendIcon}>
              <FontAwesome name="send" size={18} color={Colors.Butao} />
            </TouchableOpacity>
          </View>

          {/* Lista de Comentários */}
          {listaComentarios.map(c => (
            <View key={c.id} style={styles.singleCommentContainer}>

              {/* Avatar do Comentário */}
              <View style={styles.commentAvatar}>
                <FontAwesome name="user-circle" size={30} color="#ccc" />
              </View>


              {/* Balão do Comentário */}
              <View style={{ flex: 1 }}>
                <View style={styles.commentBubble}>
                  <Text style={styles.commentUser}>{c.adotante.nome}</Text>
                  <Text style={styles.commentText}>{c.texto}</Text>
                </View>

                {/* Ações do Comentário (Curtir/Responder) */}
                <View style={styles.commentActions}>

                  {user?.id === c.adotante.id && (
                    <TouchableOpacity onPress={() => handleExcluirComentario(c.id)}>
                      <Text style={styles.commentActionText}>Excluir</Text>
                    </TouchableOpacity>
                  )}

                  <Text style={styles.commentDate}>
                    {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>

            </View>
          ))}
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginVertical: 10,
    // Sombra estilo card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
    alignSelf: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#050505',
  },
  timestamp: {
    fontSize: 12,
    color: '#65676B',
  },
  textContainer: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  postText: {
    fontSize: 15,
    color: '#050505',
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    paddingVertical: 8,
    marginHorizontal: 12,
    justifyContent: 'space-around' // Botões centralizados
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    flex: 1,
    justifyContent: 'center',
    gap: 8
  },
  actionText: {
    color: '#65676B',
    fontWeight: '600',
    fontSize: 14
  },

  // Estilos de Comentário
  commentSection: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    backgroundColor: '#FAFAFA'
  },
  inputCommentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 10
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    maxHeight: 80,
    color: '#333',
    // Remove outline web
    ...Platform.select({ web: { outlineStyle: 'none' } as any })
  },
  sendIcon: {
    marginLeft: 10
  },

  singleCommentContainer: {
    flexDirection: 'row',
    marginBottom: 10,

  },
  commentAvatar: {
    marginRight: 8,
    marginTop: 2
  },
  commentBubble: {
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
    padding: 10,
    alignSelf: 'flex-start'
  },
  commentUser: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 2
  },
  commentText: {
    fontSize: 14,
    color: '#050505'
  },
  commentActions: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 2,
    gap: 15
  },
  commentActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#65676B'
  },
  commentDate: {
    fontSize: 12,
    color: '#65676B'
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 10
  },
  replyInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flex: 1,
    paddingVertical: 2,
    fontSize: 13
  }
});