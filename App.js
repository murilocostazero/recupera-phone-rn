import React, { useEffect, useState } from 'react';
import { View, StatusBar, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  Login,
  Home,
  HandleDevices,
  UserPage,
  SearchPage,
  InstitutionalSingup,
  MyInfo,
  Notifications,
  UserFoundDevice,
  RecoverPassword,
  Settings,
  Agents
} from './src/pages';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SnackBar } from './src/components';
import colors from './src/styles/colors.style';
import BackgroundService from 'react-native-background-actions';
import Geolocation from '@react-native-community/geolocation';
import { saveLastLocation } from './src/utils/firebase.utils';
import { getSavedDevice } from './src/utils/asyncStorage.utils';
import messaging from '@react-native-firebase/messaging';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState();
  const [snackbar, setSnackbar] = useState(null);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

  //Background task begins
  const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
  const veryIntensiveTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
      for (let i = 0; BackgroundService.isRunning(); i++) {

        //Save last location need Lat, long and device
        await Geolocation.getCurrentPosition(async (success) => {
          const { latitude, longitude, accuracy } = success.coords;

          // const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
          // const latDelta = accuracy / oneDegreeOfLatitudeInMeters;
          // const longDelta = accuracy / (oneDegreeOfLatitudeInMeters * Math.cos(latitude * (Math.PI / 180)));

          const associatedDevice = await getSavedDevice();
          if (!associatedDevice.success) {
            //If get error, is because is the first execution of app or user did not choosed any deveice to be associated
            console.log('Erro ao buscar dispositivo salvo');
          } else {
            saveLocationInFirebase(latitude, longitude, associatedDevice.data);
          }

        }, (error) => {
          console.error(error);
        });

        await sleep(delay);
      }
    });
  };

  const options = {
    taskName: 'Save last location',
    taskTitle: 'Não feche o Alerta Smart',
    taskDesc: 'Ao fechar o app, não será possível salvar sua geolocalização.',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    // color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane',
    parameters: {
      delay: 600000, //10minutos
      // delay: 5000, //5segundos
    },
  };
  //Background task ends

  useEffect(() => {
    setUser(auth().currentUser);
    startBackgroundTask();
  }, []);

  async function saveLocationInFirebase(lat, long, associatedLocalDevice) {
    const saveLocationResponse = await saveLastLocation(lat, long, associatedLocalDevice);
    // console.log('Localização salva em background', saveLocationResponse);
    if (saveLocationResponse.success) {
      const lastDate = new Date();
      const hour = `${lastDate.getHours()}:${lastDate.getMinutes() < 10 ? '0' + lastDate.getMinutes() : lastDate.getMinutes()}:${lastDate.getSeconds()}`;
      await BackgroundService.updateNotification({ taskDesc: `Localização salva às ${hour}`});
    }
  }

  async function startBackgroundTask() {
    requestUserPermissions();

    await BackgroundService.start(veryIntensiveTask, options);
  }

  const requestUserPermissions = async () => {
    const status = await messaging().requestPermission();
    const enable = status === 1 || status === 2;
    if(enable){
      const tokenFCM = messaging().getToken(); //Save this in a global variable
      console.log('User token:', tokenFCM);

      messaging().onTokenRefresh(newToken => {
        console.log('User new token:', newToken);
      });

      const unsubscribe = messaging().onMessage(async remoteMessage => {
        //Notification inside app
        Alert.alert(''+remoteMessage.notification.title, ''+remoteMessage.notification.body);
      });
  
      return unsubscribe;
    }
  }

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
  }

  function handleSnackbar(snackbarInfo) {
    setSnackbar(snackbarInfo);
    setIsSnackbarVisible(true);
    setTimeout(() => {
      setIsSnackbarVisible(false);
      setSnackbar(null);
    }, 3000);
  }

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={colors.primary}
        barStyle="light-content"
      />
      <NavigationContainer>
        {user ? (
          <Stack.Navigator>
            <Stack.Screen name="Home" options={{ headerShown: false }}>
              {props => (
                <>
                  <Home
                    handleSnackbar={receivedSnackBar =>
                      handleSnackbar(receivedSnackBar)
                    }
                    onAuthStateChanged={loggedUser =>
                      onAuthStateChanged(loggedUser)
                    }
                    {...props}
                  />
                  {isSnackbarVisible ? (
                    <SnackBar snackbar={snackbar} />
                  ) : (
                    <View />
                  )}
                </>
              )}
            </Stack.Screen>
            <Stack.Screen name="HandleDevices" options={{ headerShown: false }}>
              {props => (
                <>
                  <HandleDevices
                    handleSnackbar={receivedSnackBar =>
                      handleSnackbar(receivedSnackBar)
                    }
                    onAuthStateChanged={loggedUser =>
                      onAuthStateChanged(loggedUser)
                    }
                    {...props}
                  />
                  {isSnackbarVisible ? (
                    <SnackBar snackbar={snackbar} />
                  ) : (
                    <View />
                  )}
                </>
              )}
            </Stack.Screen>
            <Stack.Screen name="UserPage" options={{ headerShown: false }}>
              {props => (
                <>
                  <UserPage
                    handleSnackbar={receivedSnackBar =>
                      handleSnackbar(receivedSnackBar)
                    }
                    onAuthStateChanged={loggedUser =>
                      onAuthStateChanged(loggedUser)
                    }
                    {...props}
                  />
                  {isSnackbarVisible ? (
                    <SnackBar snackbar={snackbar} />
                  ) : (
                    <View />
                  )}
                </>
              )}
            </Stack.Screen>
            <Stack.Screen name="SearchPage" options={{ headerShown: false }}>
              {props => (
                <>
                  <SearchPage
                    handleSnackbar={receivedSnackBar =>
                      handleSnackbar(receivedSnackBar)
                    }
                    onAuthStateChanged={loggedUser =>
                      onAuthStateChanged(loggedUser)
                    }
                    {...props}
                  />
                  {isSnackbarVisible ? (
                    <SnackBar snackbar={snackbar} />
                  ) : (
                    <View />
                  )}
                </>
              )}
            </Stack.Screen>
            <Stack.Screen name="MyInfo" options={{ headerShown: false }}>
              {props => (
                <>
                  <MyInfo
                    handleSnackbar={receivedSnackBar =>
                      handleSnackbar(receivedSnackBar)
                    }
                    onAuthStateChanged={loggedUser =>
                      onAuthStateChanged(loggedUser)
                    }
                    {...props}
                  />
                  {isSnackbarVisible ? (
                    <SnackBar snackbar={snackbar} />
                  ) : (
                    <View />
                  )}
                </>
              )}
            </Stack.Screen>
            <Stack.Screen name="Notifications" options={{ headerShown: false }}>
              {props => (
                <>
                  <Notifications
                    handleSnackbar={receivedSnackBar =>
                      handleSnackbar(receivedSnackBar)
                    }
                    onAuthStateChanged={loggedUser =>
                      onAuthStateChanged(loggedUser)
                    }
                    {...props}
                  />
                  {isSnackbarVisible ? (
                    <SnackBar snackbar={snackbar} />
                  ) : (
                    <View />
                  )}
                </>
              )}
            </Stack.Screen>
            <Stack.Screen name="UserFoundDevice" options={{ headerShown: false }}>
              {props => (
                <>
                  <UserFoundDevice
                    handleSnackbar={receivedSnackBar =>
                      handleSnackbar(receivedSnackBar)
                    }
                    onAuthStateChanged={loggedUser =>
                      onAuthStateChanged(loggedUser)
                    }
                    {...props}
                  />
                  {isSnackbarVisible ? (
                    <SnackBar snackbar={snackbar} />
                  ) : (
                    <View />
                  )}
                </>
              )}
            </Stack.Screen>
            <Stack.Screen name="Settings" options={{ headerShown: false }}>
              {props => (
                <>
                  <Settings
                    handleSnackbar={receivedSnackBar =>
                      handleSnackbar(receivedSnackBar)
                    }
                    onAuthStateChanged={loggedUser =>
                      onAuthStateChanged(loggedUser)
                    }
                    {...props}
                  />
                  {isSnackbarVisible ? (
                    <SnackBar snackbar={snackbar} />
                  ) : (
                    <View />
                  )}
                </>
              )}
            </Stack.Screen>
            <Stack.Screen name="Agents" options={{ headerShown: false }}>
              {props => (
                <>
                  <Agents
                    handleSnackbar={receivedSnackBar =>
                      handleSnackbar(receivedSnackBar)
                    }
                    onAuthStateChanged={loggedUser =>
                      onAuthStateChanged(loggedUser)
                    }
                    {...props}
                  />
                  {isSnackbarVisible ? (
                    <SnackBar snackbar={snackbar} />
                  ) : (
                    <View />
                  )}
                </>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {props => (
                <>
                  <Login
                    handleSnackbar={receivedSnackBar =>
                      handleSnackbar(receivedSnackBar)
                    }
                    onAuthStateChanged={loggedUser =>
                      onAuthStateChanged(loggedUser)
                    }
                    {...props}
                  />
                  {isSnackbarVisible ? (
                    <SnackBar snackbar={snackbar} />
                  ) : (
                    <View />
                  )}
                </>
              )}
            </Stack.Screen>
            <Stack.Screen
              name="InstitutionalSingup"
              options={{ headerShown: false }}>
              {props => (
                <>
                  <InstitutionalSingup
                    handleSnackbar={receivedSnackBar =>
                      handleSnackbar(receivedSnackBar)
                    }
                    onAuthStateChanged={loggedUser =>
                      onAuthStateChanged(loggedUser)
                    }
                    {...props}
                  />
                  {isSnackbarVisible ? (
                    <SnackBar snackbar={snackbar} />
                  ) : (
                    <View />
                  )}
                </>
              )}
            </Stack.Screen>
            <Stack.Screen name="RecoverPassword" options={{ headerShown: false }}>
              {props => (
                <>
                  <RecoverPassword
                    handleSnackbar={receivedSnackBar =>
                      handleSnackbar(receivedSnackBar)
                    }
                    onAuthStateChanged={loggedUser =>
                      onAuthStateChanged(loggedUser)
                    }
                    {...props}
                  />
                  {isSnackbarVisible ? (
                    <SnackBar snackbar={snackbar} />
                  ) : (
                    <View />
                  )}
                </>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </>
  );
}
