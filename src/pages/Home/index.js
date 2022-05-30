import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, ActivityIndicator, Image } from 'react-native';
import generalStyles from '../../styles/general.style';
import {CircleIconButton} from '../../components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors.style';
import styles from './styles';
import {
  logout,
  currentUser,
  changeDisplayName,
  changeProfilePicture,
} from '../../utils/firebase.utils';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

export default function Home(props) {
  const [showMenuOptions, setShowMenuOptions] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [loadingDisplayNameUpdate, setLoadingDisplayNameUpdate] =
    useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadingProfilePicture, setUploadingProfilePicture] = useState(false);

  useEffect(() => {
    getCurrentUser();
  }, []);

  async function getCurrentUser() {
    let user = await currentUser();
    setLoggedUser(user);
    setDisplayName(user.displayName == null ? '' : user.displayName);
    setProfilePicture(user.photoURL);

    console.log(user);
  }

  async function onLogout() {
    const logoutResponse = await logout();
    if (logoutResponse.success) {
      props.onAuthStateChanged(null);
    }
  }

  async function updateDisplayName() {
    if (displayName.length < 3) {
      props.handleSnackbar({
        message: 'Nome não pode conter menos de 3 caracteres',
        type: 'warning',
      });
    } else {
      setLoadingDisplayNameUpdate(true);
      const updatedDisplayName = await changeDisplayName(displayName);
      setLoadingDisplayNameUpdate(false);
    }
    getCurrentUser();
    setEditingDisplayName(false);
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
    if(!changedProfilePicture.success){
      props.handleSnackbar({message: 'Erro ao mudar foto de perfil', type: 'error'});
    } else {
      getCurrentUser();
    }
  }

  const FloatingMenu = () => {
    return (
      <View
        style={[
          styles.floatingMenuContainer,
          generalStyles.shadow,
          {display: showMenuOptions ? 'flex' : 'none'},
        ]}>
        <Text onPress={() => onLogout()} style={generalStyles.primaryLabel}>
          Logout
        </Text>
      </View>
    );
  };

  return (
    <View style={generalStyles.pageContainer}>
      <View style={styles.profileContainer}>
        <View style={[generalStyles.row, {justifyContent: 'space-between'}]}>
          <CircleIconButton
            buttonSize={30}
            buttonColor="#FFF"
            iconName="drag-handle"
            iconSize={26}
            iconColor={colors.primary}
            handleCircleIconButtonPress={() => {}}
          />
          <CircleIconButton
            buttonSize={30}
            buttonColor="#FFF"
            iconName={showMenuOptions ? 'close' : 'more-vert'}
            iconSize={26}
            iconColor={colors.primary}
            handleCircleIconButtonPress={() =>
              setShowMenuOptions(!showMenuOptions)
            }
          />
          <FloatingMenu />
        </View>

        <View style={{marginTop: 30, alignItems: 'center'}}>
          <View style={[styles.profilePictureContainer, generalStyles.shadow]}>
            {uploadingProfilePicture ? (
              <ActivityIndicator size="large" color={colors.secondary} />
            ) : profilePicture ? (
              <Image
                source={{
                  uri: profilePicture,
                }}
                style={{width: 120, height: 120, borderRadius: 120 / 2}}
              />
            ) : (
              <MaterialIcons
                name="person"
                size={100}
                color={colors.background}
              />
            )}
            <View style={{position: 'absolute', right: -20, bottom: 0}}>
              <CircleIconButton
                buttonSize={28}
                buttonColor="transparent"
                iconName="edit"
                iconSize={20}
                iconColor={colors.secondary}
                handleCircleIconButtonPress={() => selectImage()}
              />
            </View>
          </View>
          <View style={generalStyles.row}>
            {editingDisplayName ? (
              <TextInput
                value={displayName}
                onChangeText={text => setDisplayName(text)}
                onSubmitEditing={() => updateDisplayName()}
                placeholder="Ex.: Pedro Lopes"
                placeholderTextColor={colors.text.darkPlaceholder}
                style={[
                  {
                    backgroundColor: '#FFF',
                    width: 200,
                    height: 40,
                    borderRadius: 16,
                  },
                  generalStyles.shadow,
                  generalStyles.primaryLabel,
                ]}
              />
            ) : (
              <Text style={generalStyles.titleDark}>
                {loggedUser == null
                  ? 'Carregando...'
                  : !loggedUser.displayName
                  ? 'Seu nome'
                  : loggedUser.displayName}
              </Text>
            )}
            {loadingDisplayNameUpdate ? (
              <ActivityIndicator size="large" color={colors.secondary} />
            ) : (
              <CircleIconButton
                buttonSize={28}
                buttonColor="transparent"
                iconName={editingDisplayName ? 'check' : 'edit'}
                iconSize={20}
                iconColor={colors.secondary}
                handleCircleIconButtonPress={() =>
                  !editingDisplayName
                    ? setEditingDisplayName(true)
                    : updateDisplayName()
                }
              />
            )}
          </View>
        </View>

        <View></View>
      </View>
    </View>
  );
}
