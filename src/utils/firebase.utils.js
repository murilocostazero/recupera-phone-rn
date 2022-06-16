import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export async function createUser(email, password, displayName) {
  let userCreated = null;
  await auth()
    .createUserWithEmailAndPassword(email, password)
    .then(async user => {
      if (user.user) {
        await user.user
          .updateProfile({
            displayName: displayName,
          })
          .then(async userUpdated => {
            console.log('User account created & signed in!');

            await firestore()
              .collection('Users')
              .doc(email)
              .set({
                email: email,
                devices: [],
              })
              .then(() => {
                userCreated = {
                  success: true,
                  message: 'Usuário criado e logado',
                  user: user,
                };
              })
              .catch(error => {
                console.log(error);
                userCreated = {
                  success: false,
                  message: 'Erro ao salvar usuário no banco',
                };
              });
          });
      }
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
        userCreated = {success: false, message: 'Este email já está em uso'};
      } else if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
        userCreated = {
          success: false,
          message: 'Este endereço de email é inválido',
        };
      } else if (error.code === 'auth/operation-not-allowed') {
        console.log('Email/password accounts are not enabled');
        userCreated = {
          success: false,
          message: 'Não é possível criar novas contas neste momento',
        };
      } else if (error.code === 'auth/weak-password') {
        console.log('Password is not strong enough');
        userCreated = {
          success: false,
          message: 'Esta senha não é forte o suficiente',
        };
      }
    });

  return userCreated;
}

export async function createInstitution(institution) {
  let userCreated = null;
  await auth()
    .createUserWithEmailAndPassword(institution.email, institution.password)
    .then(async user => {
      if (user.user) {
        await user.user
          .updateProfile({
            displayName: institution.name,
          })
          .then(async userUpdated => {
            console.log('User account created & signed in!');

            await firestore()
              .collection('Users')
              .doc(institution.email)
              .set({
                email: institution.email,
                address: institution.address,
                phone: institution.phone,
                userType: 'institution'
              })
              .then(() => {
                userCreated = {
                  success: true,
                  message: 'Usuário criado e logado',
                  user: user,
                };
              })
              .catch(error => {
                console.log(error);
                userCreated = {
                  success: false,
                  message: 'Erro ao salvar usuário no banco',
                };
              });
          });
      }
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
        userCreated = {success: false, message: 'Este email já está em uso'};
      } else if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
        userCreated = {
          success: false,
          message: 'Este endereço de email é inválido',
        };
      } else if (error.code === 'auth/operation-not-allowed') {
        console.log('Email/password accounts are not enabled');
        userCreated = {
          success: false,
          message: 'Não é possível criar novas contas neste momento',
        };
      } else if (error.code === 'auth/weak-password') {
        console.log('Password is not strong enough');
        userCreated = {
          success: false,
          message: 'Esta senha não é forte o suficiente',
        };
      }
    });

  return userCreated;
}

export async function loginUser(email, password) {
  let loginResponse = null;
  await auth()
    .signInWithEmailAndPassword(email, password)
    .then(
      loginSuccess => (loginResponse = {success: true, response: loginSuccess}),
    )
    .catch(
      loginError =>
        (loginResponse = {
          success: false,
          message: 'Verifique os dados de login e tente novamente',
        }),
    );

  return loginResponse;
}

export async function logout() {
  let logoutResponse = null;
  await auth()
    .signOut()
    .then(() => (logoutResponse = {success: true}));

  return logoutResponse;
}

export async function changeDisplayName(displayName) {
  let updatedDisplayName = null;
  await auth()
    .currentUser.updateProfile({
      displayName: displayName,
    })
    .then(userUpdated => {
      updatedDisplayName = {
        success: true,
        message: 'Nome alterado',
      };
    })
    .catch(error => {
      updatedDisplayName = {
        success: false,
        message: 'Erro ao alterar o nome',
        error: error,
      };
    });
  return updatedDisplayName;
}

export async function changeProfilePicture(url) {
  let updatedProfilePicture = null;
  await auth()
    .currentUser.updateProfile({
      photoURL: url,
    })
    .then(userUpdated => {
      updatedProfilePicture = {
        success: true,
        message: 'Foto de perfil alterada',
      };
    })
    .catch(error => {
      updatedProfilePicture = {
        success: false,
        message: 'Erro ao alterar a foto de perfil',
        error: error,
      };
    });
  return updatedProfilePicture;
}

export function currentUser() {
  return auth().currentUser;
}

export async function getUserFromCollections(userEmail) {
  const user = await firestore().collection('Users').doc(userEmail).get();
  if (!user._exists) {
    return {success: false};
  } else {
    return {success: true, user: user};
  }
}

export async function addDevice(devices, userEmail) {
  let addDeviceResponse = null;
  await firestore()
    .collection('Users')
    .doc(userEmail)
    .update({
      devices: devices,
    })
    .then(() => {
      addDeviceResponse = {success: true, message: 'Dispositivo adicionado'};
    })
    .catch(error => {
      console.error(error);
      addDeviceResponse = {
        success: false,
        message: 'Erro ao salvar dispositivo',
      };
    });

  return addDeviceResponse;
}

export async function findDevice(imei) {
  let deviceFound = [];
  await firestore()
    .collection('Users')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        const devicesArray = documentSnapshot.data().devices;
        if (!devicesArray) {
          // console.log(documentSnapshot.id + ' não tem dispositivos');
        } else {
          // console.log(documentSnapshot.id + ' tem dispositivos');
          const deviceIndex = devicesArray.findIndex(
            device => device.imei == imei,
          );
          if (deviceIndex == -1) {
            // console.log(imei + ' não correspondente');
          } else {
            // console.log(imei + ' correspondente');
            deviceFound.push(devicesArray[deviceIndex]);
          }
        }
      });
    });

  return deviceFound;
}
