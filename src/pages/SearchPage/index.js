import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';
import generalStyles from '../../styles/general.style';
import {CircleIconButton, FlatButton, Header} from '../../components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors.style';
import {
  currentUser,
  findDevice,
  getUserFromCollections,
  handleFavoriteDevice,
} from '../../utils/firebase.utils';
import styles from './styles.style';

export default function SearchPage(props) {
  const [loggedUser, setLoggedUser] = useState(null);
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState('');
  const [device, setDevice] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [deviceFound, setDeviceFound] = useState({imei: 0});
  const [deviceLabel, setDeviceLabel] = useState('');

  useEffect(() => {
    // console.log(props.route.params)
    const queryToSearch =
      props.route.params == undefined ? null : props.route.params.queryToSearch;
    getLoggedUser(queryToSearch);
  }, []);

  async function getLoggedUser(searchedQuery) {
    const localUser = await currentUser();
    setLoggedUser(localUser);

    const userFromCollection = await getUserFromCollections(localUser.email);
    if (!userFromCollection.success) {
      props.handleSnackbar({
        type: 'error',
        message: 'Não foi possível buscar usuário',
      });
    } else {
      setUser(userFromCollection.user._data);
      if (searchedQuery) {
        setQuery(searchedQuery);
        searchDevice(searchedQuery, userFromCollection.user._data);
      } else if (device) {
        compareDevices(userFromCollection.user._data, device.deviceInfo);
      }
    }
  }

  function compareDevices(userReceived, deviceInfo) {
    const userToUse = userReceived ? userReceived : user;

    const deviceIndex = userToUse.favoriteDevices.findIndex(object => {
      return object.imei == deviceInfo.imei;
    });

    if (deviceIndex != -1) {
      setDeviceFound(userToUse.favoriteDevices[deviceIndex]);
      setDeviceLabel(userToUse.favoriteDevices[deviceIndex].label);
    } else {
      setDeviceFound({imei: 0});
    }
  }

  async function searchDevice(searchedQuery, userReceived) {
    setLoadingSearch(true);
    const deviceFoundResponse = await findDevice(query ? query : searchedQuery);

    if (deviceFoundResponse.length < 1) {
      setDevice(null);
    } else {
      // await setDevice(deviceFoundResponse[0]);
      setDevice(deviceFoundResponse[0]);
      compareDevices(userReceived, deviceFoundResponse[0].deviceInfo);
    }
    setLoadingSearch(false);
  }

  async function addOrRemoveDeviceFromFavorites(deviceInfo) {
    setLoadingFavorite(true);
    const handleDeviceFavoriteResponse = await handleFavoriteDevice(
      deviceInfo,
      !deviceLabel ? deviceInfo.imei : deviceLabel,
      loggedUser.email,
    );
    if (!handleDeviceFavoriteResponse.success) {
      props.handleSnackbar({
        type: 'error',
        message: handleDeviceFavoriteResponse.message,
      });
    } else {
      props.handleSnackbar({
        type: 'success',
        message: handleDeviceFavoriteResponse.message,
      });
      setDeviceLabel('');
      getLoggedUser();
    }
    setLoadingFavorite(false);
  }

  const DeviceNotFound = () => {
    return (
      <View style={styles.deviceNotFoundContainer}>
        <Text
          style={[
            generalStyles.secondaryLabel,
            {fontSize: 20, marginBottom: 8},
          ]}>
          Dispositivo não encontrado
        </Text>
        <MaterialIcons
          name="sentiment-dissatisfied"
          size={48}
          color={colors.icon}
        />
      </View>
    );
  };

  function userFoundDevice() {
    props.navigation.navigate('UserFoundDevice', {
      whoFound: loggedUser.email,
      device: device,
    });
  }

  return (
    <View style={generalStyles.pageContainer}>
      <Header
        handleGoBackButtonPress={() => props.navigation.goBack()}
        pageTitle="Buscar dispositivo"
        loadingPrimaryButton={false}
        handlePrimaryButtonPress={() => {}}
        primaryButtonLabel=""
      />
      <View style={{marginVertical: 20}}>
        <View
          style={[
            generalStyles.textInputContainer,
            generalStyles.row,
            generalStyles.shadow,
            {height: 48},
          ]}>
          <TextInput
            value={query}
            onChangeText={text => setQuery(text)}
            onSubmitEditing={() => searchDevice()}
            keyboardType="phone-pad"
            placeholder="Digite o número de imei"
            autoCapitalize="none"
            placeholderTextColor={colors.icon}
            style={[generalStyles.textInput, generalStyles.primaryLabel]}
          />

          {query.length > 0 ? (
            <CircleIconButton
              buttonSize={26}
              buttonColor="#FFF"
              iconName="close"
              iconSize={24}
              haveShadow={false}
              iconColor={colors.icon}
              handleCircleIconButtonPress={() => setQuery('')}
            />
          ) : (
            <View />
          )}

          <CircleIconButton
            buttonSize={26}
            buttonColor="#FFF"
            iconName="search"
            iconSize={24}
            haveShadow={false}
            iconColor={colors.secondary}
            handleCircleIconButtonPress={() => searchDevice()}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
        {loadingSearch ? (
          <ActivityIndicator size="large" color={colors.secondary} />
        ) : !device ? (
          <DeviceNotFound />
        ) : (
          <View style={styles.deviceFoundContainer}>
            <View>
              <View
                style={[
                  styles.alertContainer,
                  {
                    backgroundColor: device.deviceInfo.hasAlert
                      ? colors.error
                      : colors.success,
                  },
                ]}>
                <View style={generalStyles.row}>
                  <MaterialIcons name="warning" color="#FFF" size={38} />
                  <Text numberOfLines={2} style={styles.alertMessage}>
                    {device.deviceInfo.hasAlert
                      ? 'Dispositivo sinalizado pelo proprietário com alerta de roubo/furto.'
                      : 'Dispositivo não possui alerta de roubo/furto.'}
                  </Text>
                </View>
                <View style={generalStyles.row}>
                  <MaterialIcons name="smartphone" color="#FFF" size={38} />
                  <Text style={styles.lightLabel}>
                    {device.deviceInfo.brand} {device.deviceInfo.model}{' '}
                    {device.deviceInfo.mainColor}
                  </Text>
                </View>
              </View>

              <View style={styles.deviceInfoContainer}>
                <View
                  style={[
                    generalStyles.row,
                    {justifyContent: 'space-between'},
                  ]}>
                  <Text style={styles.darkLabel}>Marca:</Text>
                  <Text style={generalStyles.secondaryLabel}>
                    {device.deviceInfo.brand}
                  </Text>
                </View>
                <View
                  style={[
                    generalStyles.row,
                    {justifyContent: 'space-between'},
                  ]}>
                  <Text style={styles.darkLabel}>Modelo:</Text>
                  <Text style={generalStyles.secondaryLabel}>
                    {device.deviceInfo.model}
                  </Text>
                </View>
                <View
                  style={[
                    generalStyles.row,
                    {justifyContent: 'space-between'},
                  ]}>
                  <Text style={styles.darkLabel}>Cor:</Text>
                  <Text style={generalStyles.secondaryLabel}>
                    {device.deviceInfo.mainColor}
                  </Text>
                </View>
                <View
                  style={[
                    generalStyles.row,
                    {justifyContent: 'space-between'},
                  ]}>
                  <Text style={styles.darkLabel}>IMEI:</Text>
                  <Text style={generalStyles.secondaryLabel}>
                    {device.deviceInfo.imei}
                  </Text>
                </View>
              </View>
            </View>

            {device.owner !== loggedUser.email &&
            device.deviceInfo.hasAlert === true ? (
              <FlatButton
                label="Encontrei este aparelho"
                height={48}
                labelColor="#FFF"
                buttonColor={colors.primary}
                handleFlatButtonPress={() => userFoundDevice()}
              />
            ) : (
              <View />
            )}
          </View>
        )}
      </ScrollView>
      {!device ? (
        <View />
      ) : (
        <View style={[generalStyles.textInputContainer, generalStyles.shadow]}>
          <Text style={generalStyles.secondaryLabel}>
            Rótulo do dispositivo
          </Text>
          <View style={generalStyles.row}>
            <MaterialIcons name="label" color={colors.icon} size={22} />
            <TextInput
              value={deviceLabel}
              onChangeText={text => setDeviceLabel(text)}
              onSubmitEditing={() => {}}
              keyboardType="default"
              placeholder="Celular do Fulano"
              autoCapitalize="sentences"
              placeholderTextColor={colors.icon}
              style={[
                generalStyles.textInput,
                generalStyles.primaryLabel,
                {marginLeft: 8},
              ]}
            />
            {loadingFavorite ? (
              <ActivityIndicator size="large" color={colors.secondary} />
            ) : (
              <CircleIconButton
                buttonSize={30}
                buttonColor="#FFF"
                iconName={
                  device.deviceInfo.imei == deviceFound.imei
                    ? 'star'
                    : 'star-border'
                }
                iconSize={26}
                haveShadow={true}
                iconColor={colors.secondary}
                handleCircleIconButtonPress={() =>
                  addOrRemoveDeviceFromFavorites(device.deviceInfo)
                }
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
}
