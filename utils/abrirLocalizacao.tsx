import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import Colors from '@/theme/color';

interface AbrirNoMapaProps {
  endereco: string;
}

export default function AbrirNoMapa({ endereco }: AbrirNoMapaProps) {
  const openInMaps = () => {
    if (!endereco) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
    Linking.openURL(url);
  };

  // Se o endereço estiver vazio, não renderiza nada
  if (!endereco) return null;

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
      }}
      onPress={openInMaps}
    >
      <FontAwesome name="map-marker" size={18} color="red" />
      
      <Text style={{ marginLeft: 6, color:"#65676b", fontWeight:"500" }}>
        Visto: {endereco}
      </Text>
    </TouchableOpacity>
  );
}
