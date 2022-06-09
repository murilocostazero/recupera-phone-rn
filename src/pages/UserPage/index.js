import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, ActivityIndicator, Image} from 'react-native';
import generalStyles from '../../styles/general.style';
import {CircleIconButton, Header} from '../../components';
import {
  changeProfilePicture,
  currentUser,
  getUserFromCollections,
  logout,
} from '../../utils/firebase.utils';
import styles from './styles.style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors.style';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

export default function UserPage(props) {
  const [loggedUser, setLoggedUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [userDoc, setUserDoc] = useState(null);
  const [uploadingProfilePicture, setUploadingProfilePicture] = useState(false);

  useEffect(() => {
    getCurrentUser();
  }, []);

  async function getCurrentUser() {
    let user = await currentUser();
    setLoggedUser(user);
    setDisplayName(user.displayName == null ? '' : user.displayName);
    setProfilePicture(user.photoURL);
    // console.log(user);

    getUserDoc(user.email);
  }

  async function getUserDoc(userEmail) {
    const user = await getUserFromCollections(userEmail);
    if (!user.success) {
      props.handleSnackbar({type: 'error', message: 'Usuário não encontrado'});
    } else {
      setUserDoc(user.user._data);
    }
  }

  async function onLogout() {
    const logoutResponse = await logout();
    if (logoutResponse.success) {
      props.onAuthStateChanged(null);
    }
  }
  function selectImage() {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.assets[0].uri};
        // console.log(source);
        uploadImage(source);
      }
    });
  }

  async function uploadImage(image) {
    const {uri} = image;
    const reference = storage().ref(
      'ProfilePictures/' + loggedUser.email + '.jpg',
    );
    setUploadingProfilePicture(true);
    await reference.putFile(uri);
    setUploadingProfilePicture(false);

    getProfilePicture();
  }

  async function getProfilePicture() {
    const url = await storage()
      .ref('ProfilePictures/' + loggedUser.email + '.jpg')
      .getDownloadURL();

    let changedProfilePicture = await changeProfilePicture(url);
    if (!changedProfilePicture.success) {
      props.handleSnackbar({
        message: 'Erro ao mudar foto de perfil',
        type: 'error',
      });
    } else {
      getCurrentUser();
    }
  }

  return (
    <View style={generalStyles.pageContainer}>
      <Header
        handleGoBackButtonPress={() => props.navigation.goBack()}
        pageTitle="Minhas informações"
        loadingPrimaryButton={false}
        handlePrimaryButtonPress={() => onLogout()}
        primaryButtonLabel="SAIR"
      />

      <ScrollView>
        <View style={styles.containerCard}>
          <View style={[styles.profilePictureContainer, generalStyles.shadow]}>
            {uploadingProfilePicture ? (
              <ActivityIndicator size="large" color={colors.secondary} />
            ) : !profilePicture ? (
              <MaterialIcons name="person" color="#FFF" size={112} />
            ) : (
              <Image
                source={{uri: profilePicture}}
                style={styles.profilePicture}
              />
            )}
            <CircleIconButton
              buttonSize={28}
              buttonColor="#FFF"
              iconName="edit"
              iconSize={24}
              haveShadow={true}
              iconColor={colors.secondary}
              handleCircleIconButtonPress={() => selectImage()}
              style={{position: 'absolute', bottom: 0, right: 0}}
            />
          </View>
        </View>

        <View style={styles.containerCard}>
        
        </View>
      </ScrollView>
    </View>
  );
}
