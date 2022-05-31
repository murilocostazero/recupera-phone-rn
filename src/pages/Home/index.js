import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableHighlight} from 'react-native';
import generalStyles from '../../styles/general.style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import {
  currentUser,
  changeDisplayName,
  changeProfilePicture,
} from '../../utils/firebase.utils';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import colors from '../../styles/colors.style';

export default function Home(props) {
  const [loggedUser, setLoggedUser] = useState(null);
  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [loadingDisplayNameUpdate, setLoadingDisplayNameUpdate] =
    useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadingProfilePicture, setUploadingProfilePicture] = useState(false);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    getCurrentUser();
  }, []);

  async function getCurrentUser() {
    let user = await currentUser();
    setLoggedUser(user);
    setDisplayName(user.displayName == null ? '' : user.displayName);
    setProfilePicture(user.photoURL);
    // console.log(user);
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
    if (!changedProfilePicture.success) {
      props.handleSnackbar({
        message: 'Erro ao mudar foto de perfil',
        type: 'error',
      });
    } else {
      getCurrentUser();
    }
  }

  const DevicesListEmpty = () => {
    return (
      <View style={[generalStyles.row, {paddingVertical: 8}]}>
        <View
          style={[
            styles.deviceContainer,
            {
              borderWidth: 1,
              borderColor: colors.secondary,
              borderStyle: 'dashed',
              alignItems: 'center',
            },
          ]}>
          <Text style={[generalStyles.secondaryLabel, {textAlign: 'center'}]}>
            Lista de dispositivos vazia
          </Text>
          <MaterialIcons
            name="sentiment-dissatisfied"
            color={colors.icon}
            size={32}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={generalStyles.pageContainer}>
      <View style={[generalStyles.row, {justifyContent: 'flex-end'}]}>
        <TouchableHighlight underlayColor='transparent' onPress={() => props.navigation.navigate('UserPage')}>
          <View style={generalStyles.row}>
            <Text style={[generalStyles.primaryLabel, {marginRight: 8}]}>
              Olá, {displayName}
            </Text>
            <View style={styles.profilePictureContainer}>
              {!profilePicture ? (
                <MaterialIcons name="person" size={30} color="#FFF" />
              ) : (
                <Image
                  source={{uri: profilePicture}}
                  style={{width: 40, height: 40, borderRadius: 40 / 2}}
                />
              )}
            </View>
          </View>
        </TouchableHighlight>
      </View>

      <View style={styles.card}>
        <View style={[generalStyles.row, {justifyContent: 'space-between'}]}>
          <Text style={generalStyles.titleDark}>Meus dispositivos</Text>
          <Text
            style={generalStyles.textButton}
            onPress={() => props.navigation.navigate('HandleDevices')}>
            ADICIONAR
          </Text>
        </View>
        {devices.length < 1 ? <DevicesListEmpty /> : <View />}
      </View>
    </View>
  );
}
