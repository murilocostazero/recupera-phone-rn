import React, { useEffect, useState } from 'react';
import { View, StatusBar } from 'react-native';
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
import startBackgroundAction from './src/utils/backgroundActions.utils';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState();
  const [snackbar, setSnackbar] = useState(null);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

  useEffect(() => {
    setUser(auth().currentUser);
    startBackgroundAction();
  }, []);

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
