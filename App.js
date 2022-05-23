import React, {useEffect, useState} from 'react';
import { View } from 'react-native';
import auth from '@react-native-firebase/auth';
import {Login, Home} from './src/pages';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SnackBar} from './src/components';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState();  
  const [snackbar, setSnackbar] = useState(null);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

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
    }, 1800);
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator>
          <Stack.Screen name="Home" options={{headerShown: false}}>
            {props => <Home {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" options={{headerShown: false}}>
          {props => (
            <>
              <Login
                handleSnackbar={snackbar => handleSnackbar(snackbar)}
                onAuthStateChanged={loggedUser =>
                  onAuthStateChanged(loggedUser)
                }
                {...props}
              />
              { isSnackbarVisible ? <SnackBar snackbar={snackbar} /> : <View /> }
            </>
          )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
