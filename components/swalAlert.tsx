import { Alert, Platform } from 'react-native';
import Swal from 'sweetalert2';

type AlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question';

export const showAlert = (title: string, message: string, icon: AlertIcon = 'info') => {
  if (Platform.OS === 'web') {
    // Na web, usamos o SweetAlert2
    Swal.fire({
      title: title,
      text: message,
      icon: icon,
      confirmButtonColor: '#3085d6', // Você pode customizar a cor
    });
  } else {
    // No mobile, usamos o Alert.alert nativo
    // O Alert nativo não tem ícones, então só mostramos título e mensagem
    Alert.alert(title, message);
  }
};