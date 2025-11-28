import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import Header from "../components/header";
import { useEffect } from "react";

export default function RootLayout() {


  return (
  
    <AuthProvider>
      <Header/>

      <Stack screenOptions={{ headerShown: false }} />
      
    </AuthProvider>





  )
}
