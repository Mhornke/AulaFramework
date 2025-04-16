import { View, Text, Image } from "react-native";
import { Link } from "expo-router";
import tw from "twrnc";
export default function Header() {
const continer= {
    padding:3,
    display: "flex",
}


  return (
    <View style={tw`bg-gray-400 h-20 `}>
      <div style={continer} >
              <div className="flex">
          <Image
            source={{
              uri: "https://github.com/DieizonOliveira/frontAdocao/blob/main/public/logo.png?raw=true",
            }}
            style={{ width: 40, height: 40 }}
          />
         <h1 className="mb-5 mt-3 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-gray-900">
            Adote<span className="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">
            .Com </span>
            </h1>
        </div>

        <Link href="/">
          <button >Voltar</button>
        </Link>
      </div>
    </View>
  );
}
