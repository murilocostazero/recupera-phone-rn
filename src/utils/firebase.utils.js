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
                userType: 'regular',
                notifications: [],
                secondaryEmail: '',
                smsNumber: '',
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
                name: institution.name,
                email: institution.email,
                address: institution.address,
                phone: institution.phone,
                userType: 'institution',
                notifications: [],
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

export async function requestUserTypeChange(user) {
  let userUpdateResponse = null;
  await firestore()
    .collection('Users')
    .doc(user.email)
    .update(user)
    .then(async () => {
      //Pegando a instituição desejada
      const requestedIntitution = await getSingleInstitution(
        user.agentInfo.institution,
      );
      const localNotifications = requestedIntitution.notifications;
      /*Montando uma notificação com o nome do usuário, a matrícula e o serviço*/
      const notification = {
        message:
          'O usuário ' +
          user.email +
          ', de matrícula ' +
          user.agentInfo.registrationNumber +
          ', está tentando se cadastrar nesta instituição no cargo de ' +
          user.agentInfo.job +
          '.',
        sender: user,
      };
      localNotifications.push(notification);

      await firestore()
        .collection('Users')
        .doc(requestedIntitution.email)
        .update({
          notifications: localNotifications,
        })
        .then(() => {
          userUpdateResponse = {success: true, message: 'Usuário atualizado'};
        })
        .catch(error => {
          console.error('Update nas notificações', error);
          userUpdateResponse = {success: false, message: error};
        });
    })
    .catch(error => {
      console.error('Update no usuário', error);
      userUpdateResponse = {success: false, message: error};
    });

  return userUpdateResponse;
}

export async function addUserNotifications(notification, sender, receiver) {
  let addNotificationResponse = null;

  const receiverFound = await getUserFromCollections(receiver);
  if (!receiverFound.success) {
    addNotificationResponse = {
      success: false,
      message: 'Usuário não encontrado',
    };
  } else {
    const localNotifications = receiverFound.user._data.notifications;

    localNotifications.push({
      message: notification,
      sender: sender,
    });

    await firestore()
      .collection('Users')
      .doc(receiver)
      .update({
        notifications: localNotifications,
      })
      .then(() => {
        addNotificationResponse = {success: true};
      })
      .catch(error => {
        addNotificationResponse = {success: false, message: error};
      });
  }

  return addNotificationResponse;
}

export async function removeUserNotification(userEmail, notificationContent) {
  let removeNotificationResponse = null;
  const currentUser = await getUserFromCollections(userEmail);
  if (!currentUser.success) {
    removeNotificationResponse = {
      success: false,
      message: 'Email informado não corresponde a nenhum usuário',
    };
  } else {
    const currentNotifications = currentUser.user._data.notifications;
    const notificationIndex = currentNotifications.findIndex(object => {
      return object.message == notificationContent.message;
    });

    if (notificationIndex != -1) {
      //Remover notificação
      currentNotifications.splice(notificationIndex, 1);
      //Atualizar
      await firestore()
        .collection('Users')
        .doc(userEmail)
        .update({
          notifications: currentNotifications,
        })
        .then(() => {
          removeNotificationResponse = {success: true};
        })
        .catch(error => {
          removeNotificationResponse = {success: false, message: error};
        });
    } else {
      removeNotificationResponse = {
        success: false,
        message: 'Notificação não encontrada',
      };
    }
  }
  return removeNotificationResponse;
}

export async function changeAgentAuthStatus(user, status) {
  let agentAuthStatus = null;
  const userFromCollection = await getUserFromCollections(user.email);
  if (!userFromCollection.success) {
    agentAuthStatus = {success: false, message: 'Erro ao buscar usuário'};
  } else {
    const localUser = userFromCollection.user._data;
    let newAgentInfo = {
      institution: localUser.agentInfo.institution,
      isAgentAuthStatus: status,
      job: localUser.agentInfo.job,
      registrationNumber: localUser.agentInfo.registrationNumber,
    };

    //Criar a notificação
    const localNotifications = localUser.notifications;
    const notificationMessage =
      localUser.agentInfo.institution +
      (status == 'denied' ? ' negou ' : ' autorizou ') +
      'a sua solicitação de alteração de conta e associação.';
    localNotifications.push({
      message: notificationMessage,
      sender: localUser.agentInfo.institution,
    });

    await firestore()
      .collection('Users')
      .doc(user.email)
      .update({
        agentInfo: newAgentInfo,
        notifications: localNotifications,
      })
      .then(async () => {
        //Remover notificação
        //Buscar instituição
        const institutionToRemoveNotification = await getSingleInstitution(
          localUser.agentInfo.institution,
        );
        if (!institutionToRemoveNotification) {
          agentAuthStatus = {
            success: false,
            message:
              'Não foi possível encontrar instituição para remover notificação',
          };
        } else {
          const institutionNotifications =
            institutionToRemoveNotification.notifications;
          //Achar notificação
          const notificationIndex = institutionNotifications.findIndex(
            object => {
              return object.sender.email == localUser.email;
            },
          );

          if (notificationIndex != -1) {
            //Remover notificação
            institutionNotifications.splice(notificationIndex, 1);
            //Atualizar
            await firestore()
              .collection('Users')
              .doc(institutionToRemoveNotification.email)
              .update({
                notifications: institutionNotifications,
              })
              .then(() => {
                agentAuthStatus = {success: true};
              })
              .catch(error => {
                agentAuthStatus = {success: false, message: error};
              });
          }
        }
      })
      .catch(error => {
        agentAuthStatus = {success: false, message: error};
        console.error(error);
      });
  }

  //Se o status==denied, chamar função que apaga o agentInfo do uauário e muda seu userType para regular
  if (status == 'denied') {
    reverseUserTypeAndRemoveAgentInfo(user.email);
  }
  return agentAuthStatus;
}

async function reverseUserTypeAndRemoveAgentInfo(userEmail) {
  const userDoc = await getUserFromCollections(userEmail);
  if (!userDoc.success) {
    console.error('Erro ao buscar usuário para reverter o agentInfo');
  } else {
    await firestore()
      .collection('Users')
      .doc(userEmail)
      .update({
        userType: 'regular',
        agentInfo: firestore.FieldValue.delete(),
      })
      .then(() =>
        console.log('Sucesso ao reverter agentInfo e userType do usuário'),
      )
      .catch(error => console.error(error));
  }
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
        const deviceOwner = documentSnapshot.data().email;
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
            deviceFound.push({
              owner: deviceOwner,
              deviceInfo: devicesArray[deviceIndex],
            });
          }
        }
      });
    });

  return deviceFound;
}

export async function getAllInstitutions() {
  let institutions = [];
  await firestore()
    .collection('Users')
    // Filter results
    .where('userType', '==', 'institution')
    .get()
    .then(async querySnapshot => {
      if (querySnapshot._docs.length == 0) {
        institutions = [];
      } else {
        await querySnapshot.forEach(documentSnapshot => {
          institutions.push(documentSnapshot.data());
        });
      }
    })
    .catch(error => {
      console.error(error);
    });

  return institutions;
}

export async function getSingleInstitution(email) {
  let institution = null;
  await firestore()
    .collection('Users')
    .doc(email)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        institution = documentSnapshot.data();
      }
    });

  return institution;
}

export async function foundUserByRegistrationNumberAndInstitution(
  registrationNumber,
  institution,
) {
  let foundExistingUser = null;
  await firestore()
    .collection('Users')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        const singleUser = documentSnapshot.data();
        if (!singleUser.agentInfo) return;
        if (
          singleUser.agentInfo.institution == institution &&
          singleUser.agentInfo.registrationNumber == registrationNumber
        ) {
          //Retorna true se encontrar
          foundExistingUser = {success: true};
        } else {
          foundExistingUser = {success: false};
        }
      });
    });
  return foundExistingUser;
}

export async function whereToFindDevice(device, location) {
  let whereToFindResponse = null;

  const userCollection = await getUserFromCollections(device.owner);
  const devices = userCollection.user._data.devices;
  const deviceFoundIndex = devices
    .map(element => element.imei)
    .indexOf(device.deviceInfo.imei);

  if (deviceFoundIndex != -1) {
    const deviceUpdated = {
      brand: device.deviceInfo.brand,
      model: device.deviceInfo.model,
      hasAlert: device.deviceInfo.hasAlert,
      imei: device.deviceInfo.imei,
      mainColor: device.deviceInfo.mainColor,
      whereToFind: location,
    };
    devices[deviceFoundIndex] = deviceUpdated;

    await firestore()
      .collection('Users')
      .doc(device.owner)
      .update({
        devices: devices,
      })
      .then(() => {
        whereToFindResponse = {
          success: true,
          message: 'Adicionado onde encontrar o dispositivo',
        };
      })
      .catch(error => {
        console.error(error);
        whereToFindResponse = {
          success: false,
          message: 'Erro ao salvar notificação de dispositivo',
        };
      });
  } else {
    whereToFindResponse = {
      success: false,
      message: 'Não foi possível encontrar o dispositivo',
    };
  }
  return whereToFindResponse;
}

export async function handleFavoriteDevice(device, deviceLabel, userEmail) {
  let handleFavoriteDeviceResponse = null;
  const localUser = await getUserFromCollections(userEmail);
  const data = localUser.user._data;

  const favoriteDevices = !data.favoriteDevices ? [] : data.favoriteDevices;

  //Verificar se device existe no array
  const deviceIndex = favoriteDevices.findIndex(object => {
    return object.imei == device.imei;
  });

  let deviceResponse = null;
  if (deviceIndex != -1) {
    //se sim, remover
    favoriteDevices.splice(deviceIndex, 1);
    deviceResponse = {success: true, message: 'Dispositivo removido'};
  } else {
    //se não, inserir
    favoriteDevices.push({imei: device.imei, label: deviceLabel});
    deviceResponse = {success: true, message: 'Dispositivo adicionado'};
  }

  await firestore()
    .collection('Users')
    .doc(userEmail)
    .update({
      favoriteDevices: favoriteDevices,
    })
    .then(() => {
      handleFavoriteDeviceResponse = deviceResponse;
    })
    .catch(error => {
      console.error(error);
      handleFavoriteDeviceResponse = {
        success: false,
        message: 'Erro ao salvar notificação de dispositivo',
      };
    });

  return handleFavoriteDeviceResponse;
}

export async function addOrRemoveSecondaryEmail(userEmail, secondaryEmail) {
  let secondaryEmailResponse = null;
  await firestore()
    .collection('Users')
    .doc(userEmail)
    .update({
      secondaryEmail: secondaryEmail,
    })
    .then(() => {
      secondaryEmailResponse = {success: true};
    })
    .catch(error => {
      secondaryEmailResponse = {success: false, message: 'Não foi possível alterar email secundário.'};
    });

  return secondaryEmailResponse;
}

export async function addOrRemoveSmsNumber(userEmail, smsNumber) {
  let smsNumberResponse = null;
  await firestore()
    .collection('Users')
    .doc(userEmail)
    .update({
      smsNumber: smsNumber,
    })
    .then(() => {
      smsNumberResponse = {success: true};
    })
    .catch(error => {
      smsNumberResponse = {success: false, message: 'Não foi possível alterar o número de sms.'};
    });

  return smsNumberResponse;
}
