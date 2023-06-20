import BackgroundService from 'react-native-background-actions';
import {backgroundGeolocation} from './backgroundGeolocation.utils';
import { storeCoords } from './asyncStorage.utils';

export default async function startBackgroundAction() {
    const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

    // You can do anything in your task such as network requests, timers and so on,
    // as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
    // React Native will go into "paused" mode (unless there are other tasks running,
    // or there is a foreground app).
    const veryIntensiveTask = async (taskDataArguments) => {
        // Example of an infinite loop task
        const { delay } = taskDataArguments;

        await new Promise(async (resolve) => {
            for (let i = 0; BackgroundService.isRunning(); i++) {

                const locationResponse = await backgroundGeolocation();
                if(!locationResponse.success){
                    console.error('Erro ao buscar localização', locationResponse.error);
                } else {
                    // console.log('BG coords', locationResponse.coords); //coords.latitude coords.longitude   
                    
                    //Salvar coords no AS
                    const storeCoordsResponse = await storeCoords(locationResponse.coords);
                    if(!storeCoordsResponse.success) console.error('Erro ao salvar coordenadas', storeCoordsResponse.message);
                }

                const date = new Date();
                const time = date.getHours() + ':' + (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes());
                // console.log(i + '-> ' + time);
                
                if(i>0){
                    await BackgroundService.updateNotification({ taskDesc: 'Última localização: '+time });
                }

                await sleep(delay);
            }
        });
    };

    const options = {
        taskName: 'Background geolocation',
        taskTitle: 'Localização em plano de fundo',
        taskDesc: 'Mantenha sempre o aplicativo aberto',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        color: '#ff00ff',
        linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
        parameters: {
            delay: 180000, //3 minutos
        },
    };

    await BackgroundService.start(veryIntensiveTask, options);
    // await BackgroundService.stop();
}