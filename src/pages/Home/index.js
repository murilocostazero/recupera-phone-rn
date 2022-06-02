import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  FlatList,
  ScrollView,
} from 'react-native';
import generalStyles from '../../styles/general.style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import {
  currentUser,
  changeDisplayName,
  changeProfilePicture,
  getUserFromCollections,
} from '../../utils/firebase.utils';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import colors from '../../styles/colors.style';
import {useIsFocused} from '@react-navigation/native';
import brandImageArray from '../../utils/brandImageArray.utils';
import {CircleIconButton} from '../../components';

export default function Home(props) {
  const [loggedUser, setLoggedUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [loadingDisplayNameUpdate, setLoadingDisplayNameUpdate] =
    useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadingProfilePicture, setUploadingProfilePicture] = useState(false);
  const [devices, setDevices] = useState([]);

  const isPageFocused = useIsFocused();

  useEffect(() => {
    getCurrentUser();
  }, [isPageFocused]);

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
      setDevices(user.user._data.devices);
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

  const renderDevices = ({item}) => {
    return (
      <View
        style={[
          styles.deviceContainer,
          generalStyles.shadow,
          {backgroundColor: colors.background},
        ]}>
        <Image
          style={{
            maxWidth: 60,
            height: 60,
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
          source={brandImageArray(item.brand)}
        />

        <View>
          <View style={generalStyles.row}>
            <Text
              style={[generalStyles.primaryLabel, {maxWidth: 140}]}
              numberOfLines={1}>
              {item.brand} {item.model}
            </Text>
          </View>

          <View style={generalStyles.row}>
            <Text style={[generalStyles.primaryLabel, {marginRight: 8}]}>
              Cor:
            </Text>
            <Text style={generalStyles.secondaryLabel}>{item.mainColor}</Text>
          </View>

          <View style={generalStyles.row}>
            <Text style={generalStyles.primaryLabel}>Imei:</Text>
            <Text
              style={[
                generalStyles.secondaryLabel,
                {maxWidth: 80, marginLeft: 8},
              ]}
              numberOfLines={1}>
              {item.imei}
            </Text>
          </View>
        </View>

        <Text
          style={[generalStyles.textButton, {alignSelf: 'center'}]}
          onPress={() =>
            props.navigation.navigate('HandleDevices', {device: item})
          }>
          EDITAR
        </Text>
      </View>
    );
  };

  return (
    <View style={generalStyles.pageContainer}>
      <View style={[generalStyles.row, {justifyContent: 'flex-end'}]}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => props.navigation.navigate('UserPage')}>
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

      <ScrollView>
        <View style={styles.card}>
          <View style={[generalStyles.row, {justifyContent: 'space-between'}]}>
            <Text style={generalStyles.titleDark}>Meus dispositivos</Text>
            <Text
              style={generalStyles.textButton}
              onPress={() =>
                props.navigation.navigate('HandleDevices', {device: null})
              }>
              ADICIONAR
            </Text>
          </View>
          <FlatList
            horizontal={true}
            contentContainerStyle={{paddingVertical: 8}}
            data={devices}
            renderItem={renderDevices}
            keyExtractor={item => item.imei}
            ListEmptyComponent={<DevicesListEmpty />}
          />
        </View>

        <View style={styles.card}>
          <View style={[generalStyles.row, {justifyContent: 'space-between'}]}>
            <Text style={generalStyles.titleDark}>Buscar dispositivos</Text>
            <Text style={generalStyles.textButton} onPress={() => props.navigation.navigate('SearchPage')}>
              BUSCAR
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
