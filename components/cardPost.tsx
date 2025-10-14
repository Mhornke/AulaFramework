
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';


type PostCardProps = {
  userName: string;
  userAvatar: string;
  postImage: string;
  postText: string;
  likes: number;
  comments: number;
  timestamp: string;
};

export default function PostCard({
  userName,
  userAvatar,
  postImage,
  postText,
  likes,
  comments,
  timestamp,
}: PostCardProps) {
  return (
    <View style={styles.card}>
      
      <View style={styles.header}>
        <Image source={{ uri: userAvatar }} style={styles.avatar} />
        <Text style={styles.userName}>{userName}</Text>
      </View>

    
      <Image source={{ uri: postImage }} style={styles.postImage} />

    
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="heart-o" size={24} color="#333" />
          <Text style={styles.actionText}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="comment-o" size={24} color="#333" />
          <Text style={styles.actionText}>{comments}</Text>
        </TouchableOpacity>
        <View style={styles.timestampContainer}>
           <FontAwesome name="clock-o" size={16} color="#888" />
           <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
      </View>
      
      
      <View style={styles.textContainer}>
        <Text style={styles.postText}>
            <Text style={{ fontWeight: 'bold' }}>{userName} </Text> 
            {postText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  },
  postImage: {
    width: '100%',
    height: 300, 
    resizeMode: 'cover',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#333'
  },
  timestampContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  timestamp: {
    fontSize: 14,
    color: '#888',
    marginLeft: 5,
  },
  textContainer: {
    padding: 12,
  },
  postText: {
    fontSize: 15,
    lineHeight: 22,
  },
});