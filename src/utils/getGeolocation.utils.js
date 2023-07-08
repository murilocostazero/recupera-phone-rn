import { storeCoords } from "./asyncStorage.utils";
import { backgroundGeolocation } from "./backgroundGeolocation.utils";
import { saveLastLocation, currentUser } from "./firebase.utils";

export default async function getGeolocation() {
    const locationResponse = await backgroundGeolocation();
    if (!locationResponse.success) {
        console.error('Erro ao buscar localização', locationResponse.error);
    } else {
        // console.log('BG coords', locationResponse.coords); //coords.latitude coords.longitude   

        const date = new Date();
        const time = date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        // console.log(i + '-> ' + time);

        // console.log('------>', time)
        // console.log('Nova localização', locationResponse.coords)

        //Salvar coords no AS
        locationResponse.coords.time = time;
        const storeCoordsResponse = await storeCoords(locationResponse.coords);
        if (!storeCoordsResponse.success) console.error('Erro ao salvar coordenadas', storeCoordsResponse.message);

        const user = await currentUser();
        if (user) {
            //Send to firebase
            const saveLastLocationResponse = await saveLastLocation(locationResponse.coords);
            if(!saveLastLocationResponse.success) console.error('Erro ao salvar coordenadas no firebase');
        }

    }


}