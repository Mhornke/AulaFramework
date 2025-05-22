//import Header from './componts/header';
import { Stack } from 'expo-router';
import '../global.css';

export default function Layout() {
  return ( 
  <Stack screenOptions={{headerShown:false}


}>
<Stack.Screen name='(auth)'  options={{ headerShown: false }} />
</Stack >  
)
}