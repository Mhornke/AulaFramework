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
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <ul>
        <li>
          <Link href="/settings">
            <button type="button">Settings</button>
          </Link>
        </li>
        <li>
          <Link href="/settings/admin">
            <button type="button">Settings admin</button>
          </Link>
        </li>
        <li>
          <Link href="/login">
            <button type="button">Login</button>
          </Link>
        </li>
        <li>
          <Link href="/register">
            <button type="button">Cadastro</button>
          </Link>
        </li>
      </ul>
    </View>
  );
}
