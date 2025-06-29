import React, { useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ou outra biblioteca de ícones
import Card from './cardAnimalDestaque';
import { AnimalI } from '@/utils/types/animias';
import Colors from '@/theme/color';
const { width } = Dimensions.get('window');

type Props = {
  data:AnimalI[]
}
export default function Carrossel( {data}: Props) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  

  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < data.length) {
      flatListRef.current?.scrollToIndex({ animated: true, index });
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    scrollToIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    scrollToIndex(currentIndex - 1);
  };

  return (
    <View style={styles.container}>
      
      {/* Botão esquerdo */}
      <TouchableOpacity 
        style={[styles.arrowButton, styles.leftArrow]} 
        onPress={handlePrev}
        disabled={currentIndex === 0}
      >
        <Ionicons name="chevron-back" size={24} color={currentIndex === 0 ? '#ccc' : '#000'} />
      </TouchableOpacity>

      {/* Carrossel */}
      
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ width:width, alignItems:"center" }}>
            <Card data={item} />
          </View>
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / (width - 40)
          );
          setCurrentIndex(newIndex);
        }}
        getItemLayout={(data, index) => ({
          length: width ,
          offset: (width - 40) * index,
          index,
        })}
      />

      {/* Botão direito */}
      <TouchableOpacity 
        style={[styles.arrowButton, styles.rightArrow]} 
        onPress={handleNext}
        disabled={currentIndex === data.length - 1}
      >
        <Ionicons 
          name="chevron-forward" 
          size={24} 
          color={currentIndex === data.length - 1 ? '#ccc' : '#000'} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:Colors.CorFundo, 
  
   
  },
  arrowButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    position: 'absolute',
    zIndex: 1,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
});