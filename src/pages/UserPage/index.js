import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  TouchableHighlight,
} from 'react-native';
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
import { removeSavedDevice, removeSetting } from '../../utils/asyncStorage.utils';

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

  function onLogout() {
    Alert.alert(
      'Deseja sair?',
      'Ao sair, as suas informações de login serão esquecidas e as configurações salvas no dispositivo serão apagadas.',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'SAIR',
          onPress: async () => {

            props.handleSnackbar({type: 'warning', message: 'Removendo suas configurações do dispositivo'});
            const removeSettingResponse = await removeSetting();
            if(!removeSettingResponse.success) console.error(removeSettingResponse.message);

            props.handleSnackbar({type: 'warning', message: 'Removendo dispositivo cadastrado'});
            const removeAssociatedDevice = await removeSavedDevice();
            if(!removeAssociatedDevice.success) console.error(removeAssociatedDevice.message);

            const logoutResponse = await logout();
            if (logoutResponse.success) {
              props.onAuthStateChanged(null);
            }
          },
        },
      ],
    );
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

  const MenuOption = (props) => {
    return(
      <TouchableHighlight style={{width: '100%', marginBottom: 16}} underlayColor='transparent' onPress={() => props.handleMenuOption()}>
        <View style={[generalStyles.row, styles.menuOptionContainer]}>
          <Text style={generalStyles.secondaryLabel}>{props.label}</Text>
          <MaterialIcons name={props.iconName} size={32} color={colors.secondaryOpacity} />
        </View>
      </TouchableHighlight>
    );
  }

  return (
    <View style={generalStyles.pageContainer}>
      <Header
        handleGoBackButtonPress={() => props.navigation.goBack()}
        loadingPrimaryButton={false}
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
              buttonSize={36}
              buttonColor="#FFF"
              iconName="edit"
              iconSize={24}
              haveShadow={true}
              iconColor={colors.secondary}
              handleCircleIconButtonPress={() => selectImage()}
              style={{position: 'absolute', bottom: 0, right: 12}}
            />
          </View>
        </View>

        <View style={styles.containerCard}>
          <MenuOption label="Minhas informações" iconName="edit" handleMenuOption={() => props.navigation.navigate('MyInfo')} />
          <MenuOption label="Configurações" iconName="settings" handleMenuOption={() => props.navigation.navigate('Settings')} />
          <MenuOption label="Sair da conta" iconName="logout" handleMenuOption={() => onLogout()} />
        </View>
      </ScrollView>
    </View>
  );
}
