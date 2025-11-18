// AnimacaoLike.tsx
import React, { useRef, useState } from "react";
import { Animated, TouchableWithoutFeedback, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
  initialLiked?: boolean;
  onToggle?: (liked: boolean) => void;
  iconSize?: number;
};

export default function AnimacaoLike({ initialLiked = false, onToggle, iconSize = 24 }: Props) {
  const [liked, setLiked] = useState(initialLiked);

  // pulso do coração
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

  // função que reinicia valores e executa animação
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
      // patinha esquerda: aparece, cresce e move
      Animated.sequence([
        Animated.parallel([
          Animated.timing(left.opacity, { toValue: 1, duration: 80, useNativeDriver: true }),
          Animated.timing(left.scale, { toValue: 1, duration: 240, useNativeDriver: true }),
          Animated.timing(left.tx, { toValue: -6, duration: 420, useNativeDriver: true }),
          Animated.timing(left.ty, { toValue: -36, duration: 420, useNativeDriver: true }),
        ]),
        Animated.timing(left.opacity, { toValue: 0, duration: 300, delay: 120, useNativeDriver: true }),
      ]),
      // patinha direita: aparece, cresce e move
      Animated.sequence([
        Animated.parallel([
          Animated.timing(right.opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.timing(right.scale, { toValue: 1, duration: 240, useNativeDriver: true }),
          Animated.timing(right.tx, { toValue: 6, duration: 420, useNativeDriver: true }),
          Animated.timing(right.ty, { toValue: -46, duration: 420, useNativeDriver: true }),
        ]),
        Animated.timing(right.opacity, { toValue: 0, duration: 300, delay: 120, useNativeDriver: true }),
      ]),
    ]).start(); // não precisa callback para esconder — valores voltam ao final
  }

  function handlePress() {
    const next = !liked;
    setLiked(next);
    onToggle && onToggle(next);

    if (next) {
      // só anima quando virar liked = true
      runAnimation();
    } else {
      // opcional: se quiser animação para "unlike", adicione aqui
    }
  }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
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
          <FontAwesome name={liked ? "heart" : "heart-o"} size={iconSize} color={liked ? "#e73a4e" : "#333"} />
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}
