import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
  liked: boolean; // Agora é obrigatório receber o estado atual
  iconSize?: number;
  // Removemos onToggle pois o Pai já controla o clique no TouchableOpacity
};

export default function AnimacaoLike({ liked, iconSize = 24 }: Props) {
  
  // REMOVIDO: const [liked, setLiked] = useState(...) -> O pai manda a verdade
  
  const pulse = useRef(new Animated.Value(1)).current;

  // patinhas (esquerda/direita)
  const left = {
    tx: useRef(new Animated.Value(-40)).current,
    ty: useRef(new Animated.Value(0)).current,
    scale: useRef(new Animated.Value(0)).current,
    opacity: useRef(new Animated.Value(0)).current,
  };
  const right = {
    tx: useRef(new Animated.Value(40)).current,
    ty: useRef(new Animated.Value(0)).current,
    scale: useRef(new Animated.Value(0)).current,
    opacity: useRef(new Animated.Value(0)).current,
  };

  // O Segredo: Monitorar a prop 'liked'. Se virar TRUE, dispara a animação.
  useEffect(() => {
    if (liked) {
      runAnimation();
    } else {
      // Opcional: Se quiser resetar valores instantaneamente quando descurtir
      pulse.setValue(1); 
    }
  }, [liked]); // Só roda quando a prop mudar

  function runAnimation() {
    // reset
    pulse.setValue(1);

    left.tx.setValue(-40);
    left.ty.setValue(0);
    left.scale.setValue(0);
    left.opacity.setValue(0);

    right.tx.setValue(40);
    right.ty.setValue(0);
    right.scale.setValue(0);
    right.opacity.setValue(0);

    Animated.parallel([
      // pulso rápido do coração
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.5, duration: 140, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 160, useNativeDriver: true }),
      ]),
      // patinha esquerda
      Animated.sequence([
        Animated.parallel([
          Animated.timing(left.opacity, { toValue: 1, duration: 80, useNativeDriver: true }),
          Animated.timing(left.scale, { toValue: 1, duration: 240, useNativeDriver: true }),
          Animated.timing(left.tx, { toValue: -6, duration: 420, useNativeDriver: true }),
          Animated.timing(left.ty, { toValue: -36, duration: 420, useNativeDriver: true }),
        ]),
        Animated.timing(left.opacity, { toValue: 0, duration: 300, delay: 120, useNativeDriver: true }),
      ]),
      // patinha direita
      Animated.sequence([
        Animated.parallel([
          Animated.timing(right.opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.timing(right.scale, { toValue: 1, duration: 240, useNativeDriver: true }),
          Animated.timing(right.tx, { toValue: 6, duration: 420, useNativeDriver: true }),
          Animated.timing(right.ty, { toValue: -46, duration: 420, useNativeDriver: true }),
        ]),
        Animated.timing(right.opacity, { toValue: 0, duration: 300, delay: 120, useNativeDriver: true }),
      ]),
    ]).start();
  }

  // Removemos o TouchableWithoutFeedback porque o pai já é um botão
  return (
    <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center" }}>
      {/* patinha esquerda */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          opacity: left.opacity,
          transform: [
            { translateX: left.tx },
            { translateY: left.ty },
            { scale: left.scale },
          ],
        }}
      >
        <FontAwesome name="paw" size={Math.round(iconSize * 0.7)} color="#ff6b81" />
      </Animated.View>

      {/* patinha direita */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          opacity: right.opacity,
          transform: [
            { translateX: right.tx },
            { translateY: right.ty },
            { scale: right.scale },
          ],
        }}
      >
        <FontAwesome name="paw" size={Math.round(iconSize * 0.9)} color="#ff5470" />
      </Animated.View>

      {/* coração (pulsa) */}
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <FontAwesome 
            name={liked ? "heart" : "heart-o"} 
            size={iconSize} 
            color={liked ? "#e73a4e" : "#65676B"} // Usei cinza padrão do feed quando vazio
        />
      </Animated.View>
    </View>
  );
}