import { ScrollView, Text, View } from "react-native";
import { Link } from "expo-router";
import Card from "./componts/card";
import dados from "../dados.json";
export default function Index() {

  const listaPet = dados.pets.map(pet => {
    console.log(pet);
    
    return <Card key={pet.id} pet={pet} />
})
  
  return (
    
      <ScrollView>
          
        <section className="max-w-screen-xl mx-auto flex flex-col items-center sm:block">
          <h1 className="mb-5 mt-3 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-gray-900">
            Seu<span className="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">
            .Pet </span>
            <span className="text-lg font-semibold no-underline text-gray-900 dark:text-gray-900">
               - Seu novo amigo está à sua espera</span>
          </h1>
  
          <div className="gap-8">
            Lista de animais com map
            {listaPet}
          </div>
  
        </section>
       
      </ScrollView>
  
    );
}
