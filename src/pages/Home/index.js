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
  Alert
} from 'react-native';
import generalStyles from '../../styles/general.style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import { associateDevice, currentUser, getUserFromCollections } from '../../utils/firebase.utils';
import colors from '../../styles/colors.style';
import { useIsFocused } from '@react-navigation/native';
import brandImageArray from '../../utils/brandImageArray.utils';
import { CircleIconButton, EmptyList, FlatButton } from '../../components';
import securityTips from '../../utils/securityTips';
import accountImageArray from '../../utils/accountTypeImage.utils';
import { getCoords, getSetting, saveDeviceInfo } from '../../utils/asyncStorage.utils';
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
  const [coords, setCoords] = useState(null);
  const [showDeviceList, setShowDeviceList] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPageFocused = useIsFocused();

  useEffect(() => {
    getCurrentUser();
    getRandomInt();
    locationExists();
  }, [isPageFocused]);

  function getRandomInt() {
    const randomIntFound = Math.floor(Math.random() * securityTips.length);
    setRandomInt(randomIntFound);
  }

  async function locationExists() {
    const localCoords = await getCoords();
    console.log('Local coords', localCoords)
    if (localCoords.success) setCoords(localCoords.data);
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

  function thereIsAnyAssociated(userDevices) {
    const associatedIndex = userDevices.findIndex(element => element.isAssociated == true);
    if (associatedIndex !== -1) {
      setAssociatedDevice(userDevices[associatedIndex]);
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
          { backgroundColor: '#FFF', justifyContent: 'center', marginBottom: 8 },
        ]}>
          <Text style={[generalStyles.primaryLabel]} numberOfLines={1}>{item.device.brand} {item.device.model} {item.device.mainColor}</Text>
          <Text style={generalStyles.secondaryLabel}>Agente:</Text>
          <Text style={[generalStyles.secondaryLabel, { maxWidth: 180 }]} numberOfLines={1}>{item.agent}</Text>
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

  const renderDeviceList = ({ item }) => {
    console.log(item);
    return (
      <TouchableHighlight style={{ marginRight: 4 }} underlayColor='transparent' onPress={() => associateLocation(item)}>
        <View style={[styles.deviceItem, generalStyles.shadow]}>
          <Image
            style={{
              maxWidth: 20,
              height: 20,
              resizeMode: 'contain',
              alignSelf: 'center',
              marginVertical: 4,
            }}
            source={brandImageArray(item.brand)}
          />
          <View>
            <Text style={generalStyles.primaryLabel}>Modelo: {item.model}</Text>
            <Text style={generalStyles.secondaryLabel}>IMEI: {item.imei}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  async function associateLocation(item) {
    //PEGA A LOCALIZACAO E ASSOCIA A UM DISPOSITIVO DA LISTA
    //Abre uma lista dos dispositivos para o usuário selecionar 1
    Alert.alert("Deseja associar este dispositivo?", "Ao continuar, as informações de localização deste dispositivo serão associadas ao cadastro do " + item.model, [
      {
        text: "Cancelar",
        onPress: () => { },
        style: 'cancel'
      },
      {
        text: 'Continuar',
        onPress: async () => {
          //Loading
          //Associar no firebase
          //Associar no AS
          //Loading end
          setLoading(true);
          setShowDeviceList(false);
          const localDevice = item;
          localDevice.isAssociated = true;

          const associateDeviceResponse = await associateDevice(localDevice);
          if (!associateDeviceResponse.success) {
            props.handleSnackbar({ type: 'error', message: associateDeviceResponse.message });
          } else {
            const saveDeviceInfoResponse = await saveDeviceInfo(localDevice);
            if (!saveDeviceInfoResponse.success) props.handleSnackbar({ type: 'error', message: 'Não foi possível salvar localmente a sua escolha.' });
          }

          setLoading(false);

        }
      }
    ]);
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

                {
                  !coords ?
                    <Text style={generalStyles.secondaryLabel}>Carregando localização...</Text> :
                    <View style={styles.card}>
                      <View style={[generalStyles.row, { justifyContent: 'space-between' }]}>
                        <Text style={generalStyles.titleDark}>Localização</Text>
                        {
                          loading ?
                            <ActivityIndicator size="large" color={colors.secondary} /> :
                            !showDeviceList ?
                              <FlatButton label='Associar localização' height={28} labelColor='#FFF' buttonColor={colors.secondary} handleFlatButtonPress={() => setShowDeviceList(true)} isLoading={false} style={{ paddingHorizontal: 4 }} /> :
                              <FlatButton label='Cancelar' height={28} labelColor='#FFF' buttonColor={colors.error} handleFlatButtonPress={() => setShowDeviceList(false)} isLoading={false} style={{ paddingHorizontal: 4 }} />
                        }
                        <CircleIconButton buttonSize={28} buttonColor='#FFF' iconName='content-copy' iconSize={20} haveShadow={true} iconColor={colors.primary} handleCircleIconButtonPress={() => copyToClipboard(`Latitude: ${coords.latitude} Longitude: ${coords.longitude}`)} />
                      </View>
                      {
                        showDeviceList ?
                          <FlatList
                            horizontal={true}
                            contentContainerStyle={{ padding: 4 }}
                            data={devices}
                            renderItem={renderDeviceList}
                            keyExtractor={item => item.imei}
                            ListEmptyComponent={<EmptyList />}
                          /> :
                          <View />
                      }
                    </View>
                }

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
            <View style={generalStyles.pageContainer}>
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
                  horizontal={false}
                  contentContainerStyle={{ padding: 4 }}
                  data={userDoc.recoveries}
                  renderItem={renderRecoveries}
                  keyExtractor={item => item.device.imei}
                  ListEmptyComponent={<EmptyList />}
                />
              </View>
            </View>
      }
    </SafeAreaView>
  );
}
