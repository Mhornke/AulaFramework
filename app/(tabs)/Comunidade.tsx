// screens/ComunidadeScreen.js
import React from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import PostCard from '@/components/cardPost';
import { FontAwesome } from '@expo/vector-icons';

// Dados de exemplo (virão da sua API no futuro)
const DADOS_POSTS = [
  {
    id: '1',
    userName: 'Maria Silva',
    userAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    postImage: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg',
    postText: 'Apresento a vocês a Maionese, que adotei semana passada! Já tomou conta da casa toda. ❤️',
    likes: 42,
    comments: 8,
    timestamp: '2h atrás',
  },
  {
    id: '2',
    userName: 'João Souza',
    userAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    postImage: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    postText: 'Rex e Thor aproveitando o sol da tarde no quintal. A energia desses dois é contagiante!',
    likes: 78,
    comments: 15,
    timestamp: '5h atrás',
  },
  
];

export default function ComunidadeScreen() {
  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.createPostButton}>
        <Text style={styles.createPostText}>Crie uma nova publicação...</Text>
        <FontAwesome name="plus-square-o" size={28} color="#007BFF" />
      </TouchableOpacity>

      
      <FlatList
        data={DADOS_POSTS}
        renderItem={({ item }) => <PostCard {...item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5', 
  },
  createPostButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  createPostText: {
    fontSize: 16,
    color: '#888',
  },
});