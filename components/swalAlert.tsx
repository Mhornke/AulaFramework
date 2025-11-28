import { Alert, Platform } from 'react-native';
import Swal from 'sweetalert2';

type AlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question';

// Agora a função retorna uma Promessa de booleano (Sim/Não)
export const showAlert = (title: string, message: string, icon: AlertIcon = 'info'): Promise<boolean> => {
  return new Promise((resolve) => {
    if (Platform.OS === 'web') {
      // --- Lógica WEB ---
      Swal.fire({
        title: title,
        text: message,
        icon: icon,
        showCancelButton: icon === 'question', // Só mostra botão cancelar se for pergunta
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
      }).then((result) => {
        resolve(result.isConfirmed); // Retorna true se clicou em Sim
      });
    } else {
      // --- Lógica MOBILE ---
      if (icon === 'question') {
        // Alerta com duas opções
        Alert.alert(
          title,
          message,
          [
            { text: "Não", style: "cancel", onPress: () => resolve(false) },
            { text: "Sim", onPress: () => resolve(true) }
          ],
          { cancelable: false }
        );
      } else {
        // Alerta simples (Apenas OK)
        Alert.alert(
            title, 
            message, 
            [{ text: "OK", onPress: () => resolve(true) }]
        );
      }
    }
  });
};