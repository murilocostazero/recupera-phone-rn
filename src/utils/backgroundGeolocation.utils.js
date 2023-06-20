import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export async function backgroundGeolocation() {
    const permissionGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'Permissão para acessar sua localização',
        message: 'Precisamos de acesso à sua localização em plano de fundo para podermos garantir o rastreio do seu aparelho.',
        buttonNeutral: 'Pergunte-me depois',
        buttonNegative: 'Cancelar',
        buttonPositive: 'PERMITIR',
    });

    return new Promise((resolve, reject) => {
        if (permissionGranted === PermissionsAndroid.RESULTS.GRANTED) {
            Geolocation.getCurrentPosition(
                (position) => {
                    resolve({ success: true, coords: position.coords });
                },
                (error) => {
                    reject({ success: false, error: error.message });
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }
    });
}