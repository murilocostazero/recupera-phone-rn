import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableHighlight,
  FlatList,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import generalStyles from '../../styles/general.style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import { currentUser, getUserFromCollections, saveLastLocation } from '../../utils/firebase.utils';
import colors from '../../styles/colors.style';
import { useIsFocused } from '@react-navigation/native';
import brandImageArray from '../../utils/brandImageArray.utils';
import { CircleIconButton, EmptyList, FlatButton } from '../../components';
import securityTips from '../../utils/securityTips';
import accountImageArray from '../../utils/accountTypeImage.utils';
import { getSetting } from '../../utils/asyncStorage.utils';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Clipboard from '@react-native-clipboard/clipboard';
import { calculateDifferenceHour } from '../../utils/mathOrDate.utils';

export default function Home(props) {
  const [loggedUser, setLoggedUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [devices, setDevices] = useState([]);
  const [favoriteDevices, setFavoriteDevices] = useState([]);
  const [haveNotifications, setHaveNotifications] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [randomInt, setRandomInt] = useState(0);
  const [associatedDevice, setAssociatedDevice] = useState(null);
  const [settingData, setSettingData] = useState(null);
  const [coords, setCoords] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });

  const isPageFocused = useIsFocused();

  useEffect(() => {
    getCurrentUser();
    getRandomInt();
    getSettingData();
  }, [isPageFocused]);

  async function getGeoLocation(associatedLocalDevice) {
    const lastDate = new Date();
    const hour = `${lastDate.getHours()}:${lastDate.getMinutes() < 10 ? '0' + lastDate.getMinutes() : lastDate.getMinutes()}:${lastDate.getSeconds()}`;

    const differenceTime = calculateDifferenceHour(associatedLocalDevice.lastLocation.lastTime, hour);
    if (differenceTime > '00:10:00') {
      await Geolocation.getCurrentPosition((success) => {
        const { latitude, longitude, accuracy } = success.coords;

        const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
        const latDelta = accuracy / oneDegreeOfLatitudeInMeters;
        const longDelta = accuracy / (oneDegreeOfLatitudeInMeters * Math.cos(latitude * (Math.PI / 180)));

        saveLocationInFirebase(latitude, longitude, associatedLocalDevice);

        setCoords({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: latDelta,
          longitudeDelta: longDelta,
          // accuracy: accuracy,
        }
        );
      }, (error) => {
        props.handleSnackbar({ type: 'error', message: 'Habilite o GPS do seu dispositivo.' })
      });
    }
  }

  async function saveLocationInFirebase(lat, long, associatedLocalDevice) {
    const saveLocationResponse = await saveLastLocation(lat, long, associatedLocalDevice);
    console.log('Location response', saveLocationResponse);
  }

  function getRandomInt() {
    const randomIntFound = Math.floor(Math.random() * securityTips.length);
    setRandomInt(randomIntFound);
  }

  async function getCurrentUser() {
    const user = await currentUser();
    setLoggedUser(user);
    setDisplayName(user.displayName == null ? '' : user.displayName);
    setProfilePicture(user.photoURL);
    // console.log(user);

    getUserDoc(user.email);
  }

  async function getUserDoc(userEmail) {
    setLoadingUserData(true);
    const user = await getUserFromCollections(userEmail);
    if (!user.success) {
      setLoadingUserData(false);
      props.handleSnackbar({ type: 'error', message: 'Usuário não encontrado' });
    } else {
      setUserDoc(user.user._data);
      if (user.user._data.userType !== 'institution') {
        setDevices(user.user._data.devices);
        thereIsAnyAssociated(user.user._data.devices);

        setFavoriteDevices(
          !user.user._data.favoriteDevices ? [] : user.user._data.favoriteDevices,
        );
      }
      setHaveNotifications(
        user.user._data.notifications.length > 0 ? true : false,
      );
      setLoadingUserData(false);
    }
  }

  async function getSettingData() {
    const settingResponse = await getSetting();
    if (!settingResponse.success) {
      props.handleSnackbar({ type: 'error', message: 'Erro ao buscar configurações.Tente reiniciar o app.' });
    } else {
      setSettingData(settingResponse.data);
    }
  }

  function thereIsAnyAssociated(userDevices) {
    const associatedIndex = userDevices.findIndex(element => element.isAssociated == true);
    if (associatedIndex !== -1) {
      setAssociatedDevice(userDevices[associatedIndex]);
      getGeoLocation(userDevices[associatedIndex]);
    }
  }

  const renderDevices = ({ item }) => {
    return (
      <TouchableHighlight
        onPress={() =>
          props.navigation.navigate('HandleDevices', { device: item })
        }
        underlayColor="tranparent">
        <View
          style={[
            styles.deviceContainer,
            generalStyles.shadow,
            { backgroundColor: '#FFF' },
          ]}>
          {
            item.isAssociated ? <MaterialIcons name='mobile-friendly' color={colors.secondary} size={20} style={{ position: 'absolute', right: 4, top: 4 }} /> : <View />
          }
          <Image
            style={{
              maxWidth: 60,
              height: 60,
              resizeMode: 'contain',
              alignSelf: 'center',
              marginVertical: 4,
            }}
            source={brandImageArray(item.brand)}
          />

          <View style={{ alignItems: 'center' }}>
            <View style={generalStyles.row}>
              <Text
                style={[generalStyles.primaryLabel, { maxWidth: 140 }]}
                numberOfLines={1}>
                {item.brand} {item.model}
              </Text>
            </View>

            <View style={generalStyles.row}>
              <Text style={[generalStyles.primaryLabel, { marginRight: 8 }]}>
                Cor:
              </Text>
              <Text style={generalStyles.secondaryLabel}>{item.mainColor}</Text>
            </View>

            <View style={generalStyles.row}>
              <Text style={generalStyles.primaryLabel}>Imei:</Text>
              <Text
                style={[
                  generalStyles.secondaryLabel,
                  { maxWidth: 80, marginLeft: 8 },
                ]}
                numberOfLines={1}>
                {item.imei}
              </Text>
            </View>
          </View>

          <View
            style={[
              {
                borderColor: item.hasAlert ? colors.error : colors.success,
                borderTopWidth: 0.6,
                marginVertical: 16,
                alignItems: 'center',
                justifyContent: 'center',
              },
              generalStyles.row,
            ]}>
            <View
              style={{
                marginTop: 3,
                marginRight: 8,
                width: 10,
                height: 10,
                borderRadius: 10 / 2,
                backgroundColor: item.hasAlert ? colors.error : colors.success,
              }}
            />
            <Text
              style={{
                color: colors.text.dark,
                fontFamily: 'JosefinSans-Bold',
                textAlign: 'center',
              }}>
              {item.hasAlert ? 'Alerta!' : 'Tudo certo!'}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  const renderFavoriteDevices = ({ item }) => {
    return (
      <TouchableHighlight
        onPress={() =>
          props.navigation.navigate('SearchPage', { queryToSearch: item.imei })
        }
        underlayColor="tranparent">
        <View
          style={[
            styles.deviceContainer,
            generalStyles.shadow,
            { backgroundColor: '#FFF' },
          ]}>
          <View style={{ alignItems: 'stretch' }}>
            <Text style={generalStyles.primaryLabel}>{item.label}</Text>
            <View style={generalStyles.row}>
              <Text style={generalStyles.primaryLabel}>Imei:</Text>
              <Text
                style={[
                  generalStyles.secondaryLabel,
                  { maxWidth: 150, marginLeft: 8 },
                ]}
                numberOfLines={1}>
                {item.imei}
              </Text>
              <MaterialIcons
                name="arrow-right"
                size={28}
                color={colors.icon}
                style={{ alignSelf: 'center' }}
              />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  const renderAgents = ({ item }) => {
    return (
      <TouchableHighlight>
        <View style={[
          styles.deviceContainer,
          generalStyles.shadow,
          { backgroundColor: '#FFF' },
        ]}>
          <Text style={[generalStyles.secondaryLabel, { maxWidth: 140 }]} numberOfLines={1}>{item}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  const renderRecoveries = ({ item }) => {
    return (
      <TouchableHighlight>
        <View style={[
          styles.deviceContainer,
          generalStyles.shadow,
          { backgroundColor: '#FFF', justifyContent: 'center' },
        ]}>
          <Text style={[generalStyles.primaryLabel]} numberOfLines={1}>{item.device.brand} {item.device.model} {item.device.mainColor}</Text>
          <Text style={[generalStyles.secondaryLabel, { maxWidth: 140 }]} numberOfLines={1}>{item.agent}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  function copyToClipboard(stringToSave) {
    Clipboard.setString(stringToSave);
    props.handleSnackbar({
      type: 'success',
      message: 'Localização copiada para a área de transferência',
    });
  }

  return loadingUserData ? (
    <View style={[generalStyles.pageContainer, { justifyContent: 'center' }]}>
      <ActivityIndicator size="large" color={colors.secondary} />
    </View>
  ) : (
    <SafeAreaView style={generalStyles.pageContainer}>
      <View style={[generalStyles.row, { justifyContent: 'space-between' }]}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
          }}>
          <CircleIconButton
            buttonSize={32}
            buttonColor="#FFF"
            iconName="notifications"
            iconSize={28}
            haveShadow={true}
            iconColor={colors.primary}
            handleCircleIconButtonPress={() =>
              props.navigation.navigate('Notifications', { user: userDoc })
            }
            isNotificationsButton={haveNotifications}
          />
        </View>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => props.navigation.navigate('UserPage')}>
          <View style={generalStyles.row}>
            <View>
              <Text
                numberOfLines={1}
                style={[
                  generalStyles.primaryLabel,
                  { marginRight: 8, maxWidth: 224 },
                ]}>
                Olá, {displayName}
              </Text>
              {!userDoc ? (
                <Text style={generalStyles.secondaryLabel}>Carregando...</Text>
              ) : userDoc.userType === 'regular' ? (
                <View />
              ) : (
                <Text style={generalStyles.secondaryLabel}>
                  {userDoc.userType === 'agent' ? 'Agente' : 'Instituição'}
                </Text>
              )}
            </View>
            <View style={styles.profilePictureContainer}>
              {!profilePicture ? (
                <MaterialIcons name="person" size={30} color="#FFF" />
              ) : (
                <Image
                  source={{ uri: profilePicture }}
                  style={{ width: 40, height: 40, borderRadius: 40 / 2 }}
                />
              )}
            </View>
          </View>
        </TouchableHighlight>
      </View>
      {
        !userDoc ?
          <Text style={generalStyles.secondaryLabel}>Carregando informações</Text> :
          userDoc.userType !== 'institution' ?
            /* Home do usuário */
            <>
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={loadingUserData}
                    onRefresh={() => getCurrentUser()}
                  />
                }>
                <View style={styles.card}>
                  <View style={[generalStyles.row, { justifyContent: 'space-between' }]}>
                    <Text style={generalStyles.titleDark}>Meus dispositivos</Text>
                    <CircleIconButton
                      buttonSize={28}
                      buttonColor="#FFF"
                      iconName="add"
                      iconSize={26}
                      haveShadow={true}
                      iconColor={colors.primary}
                      handleCircleIconButtonPress={() =>
                        props.navigation.navigate('HandleDevices', { device: null })
                      }
                    />
                  </View>
                  <FlatList
                    horizontal={true}
                    contentContainerStyle={{ padding: 4 }}
                    data={devices}
                    renderItem={renderDevices}
                    keyExtractor={item => item.imei}
                    ListEmptyComponent={<EmptyList />}
                  />
                  <View style={styles.card}>
                    <View style={[generalStyles.row, { justifyContent: 'space-between' }]}>
                      <Text style={generalStyles.titleDark}>Favoritos</Text>
                      <CircleIconButton
                        buttonSize={28}
                        buttonColor="#FFF"
                        iconName="lightbulb"
                        iconSize={24}
                        haveShadow={true}
                        iconColor={colors.primary}
                        handleCircleIconButtonPress={() =>
                          Alert.alert(
                            'Sobre os favoritos',
                            'Adicione dispositivos a sua lista de favoritos para que você consiga buscá-los com mais praticidade.',
                          )
                        }
                      />
                    </View>
                    <FlatList
                      horizontal={true}
                      contentContainerStyle={{ padding: 4 }}
                      data={favoriteDevices}
                      renderItem={renderFavoriteDevices}
                      keyExtractor={item => item.imei}
                      ListEmptyComponent={<EmptyList />}
                    />
                  </View>
                </View>
                <View style={styles.card}>
                  <View style={[generalStyles.row, { justifyContent: 'space-between' }]}>
                    <Text style={generalStyles.titleDark}>Localização</Text>
                  </View>
                  {
                    settingData == null || !settingData.saveLastLocation ?
                      <View>
                        <Text style={generalStyles.secondaryLabel}>Para uma maior segurança, permita com que o app salve a sua localização.</Text>
                        <FlatButton label='Ir para configurações' height={42} labelColor='#FFF' buttonColor={colors.secondary} handleFlatButtonPress={() => props.navigation.navigate('Settings')} isLoading={false} style={{ marginTop: 8 }} />
                      </View> :
                      !associatedDevice ?
                        <View>
                          <Text style={generalStyles.secondaryLabel}>Associe o cadastro de um de seus dispositivos ao aparelho físico.</Text>
                          <Text style={generalStyles.secondaryOpacityLabel}>Em Meus Dispositivos, selecione um aparelho e marque a opção Associar Dispositivo.</Text>
                        </View> :
                        <View>
                          <View style={generalStyles.row}>
                            <Text style={[generalStyles.secondaryLabel, { marginVertical: 8, flex: 1, fontSize: 12 }]}>Última localização: lat {coords.latitude}, long {coords.longitude}</Text>
                            <CircleIconButton buttonSize={30} buttonColor='#FFF' iconName='content-copy' iconSize={20} haveShadow={true} iconColor={colors.primary} handleCircleIconButtonPress={() => copyToClipboard(`Latitude ${coords.latitude}, Longitude: ${coords.longitude}`)} />
                          </View>
                          <MapView
                            initialRegion={coords}
                            style={{ height: 200 }}>
                            <Marker
                              key={0}
                              coordinate={{ latitude: coords.latitude, longitude: coords.longitude }}
                              title={'Localização atual'}
                              description={'Você está aqui'}
                              pinColor={colors.secondary}
                            />
                          </MapView>
                        </View>
                  }
                </View>

                <View style={styles.card}>
                  <View style={[generalStyles.row, { justifyContent: 'space-between' }]}>
                    <Text style={generalStyles.titleDark}>Dicas de segurança</Text>
                    <CircleIconButton
                      buttonSize={28}
                      buttonColor="#FFF"
                      iconName="autorenew"
                      iconSize={26}
                      haveShadow={true}
                      iconColor={colors.primary}
                      handleCircleIconButtonPress={() => getRandomInt()}
                    />
                  </View>

                  <View
                    style={{
                      marginVertical: 16,
                      backgroundColor: colors.secondaryOpacity,
                      borderRadius: 16,
                      padding: 8,
                    }}>
                    <Text
                      style={{
                        color: colors.primary,
                        fontFamily: 'JosefinSans-Medium',
                        fontSize: 16,
                        textAlign: 'justify',
                      }}>
                      {securityTips[randomInt].tip}
                    </Text>
                  </View>
                </View>
              </ScrollView>
              <FlatButton
                label="Buscar dispositivo"
                height={48}
                labelColor={colors.text.light}
                buttonColor={colors.primary}
                handleFlatButtonPress={() => props.navigation.navigate('SearchPage')}
                isLoading={false}
                style={{}}
              />
            </>
            :
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={loadingUserData}
                  onRefresh={() => getCurrentUser()}
                />
              }>

              <View style={styles.card}>
                <View style={[generalStyles.row, { justifyContent: 'space-between' }]}>
                  <Text style={generalStyles.titleDark}>Agentes</Text>
                  <CircleIconButton
                    buttonSize={28}
                    buttonColor="#FFF"
                    iconName="group"
                    iconSize={26}
                    haveShadow={true}
                    iconColor={colors.primary}
                    handleCircleIconButtonPress={() => props.navigation.navigate('Agents')}
                  />
                </View>
                <FlatList
                  horizontal={true}
                  contentContainerStyle={{ padding: 4 }}
                  data={userDoc.agents}
                  renderItem={renderAgents}
                  keyExtractor={item => item}
                  ListEmptyComponent={<EmptyList />}
                />
              </View>

              <View style={styles.card}>
                <View style={[generalStyles.row, { justifyContent: 'space-between' }]}>
                  <Text style={generalStyles.titleDark}>Recuperações</Text>
                  <Text style={generalStyles.secondaryLabel}>{userDoc.recoveries.length}</Text>
                </View>
                <FlatList
                  horizontal={true}
                  contentContainerStyle={{ padding: 4 }}
                  data={userDoc.recoveries}
                  renderItem={renderRecoveries}
                  keyExtractor={item => item.device.imei}
                  ListEmptyComponent={<EmptyList />}
                />
                <FlatButton
                  label='VER TODAS'
                  height={48}
                  labelColor={colors.primary}
                  buttonColor='transparent'
                  handleFlatButtonPress={() => { }}
                  isLoading={false}
                  style={{}} />
              </View>

            </ScrollView>
      }
    </SafeAreaView>
  );
}
