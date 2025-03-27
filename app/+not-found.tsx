import { Text, View } from "react-native";
import { Link } from "expo-router";
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>PAGINA NÃO ENCONTRADA 404 😢</Text>
      <Link href="/">
            <button>Voltar</button>
            </Link>
    </View>
  );
}
