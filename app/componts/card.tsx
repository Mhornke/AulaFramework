import { Image } from "react-native"

export default function Card(data: any) {
   
   
    return(

<div className=" mt-14 rounded-md bg-gray-400 w-full">
        <Image 
        source={data.pet.foto}
       style={{width: 400, height: 400}} 
       />

    <ul className="p-4">    
       
        <li>Nome: {data.pet.name}</li>
        <li>Raça: {data.pet.type}</li>
        <li>Peso: {data.pet.weight}</li>
        <li>Idade: {data.pet.age}</li>
    </ul>
</div>



    )
    
}