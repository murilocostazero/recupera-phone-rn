import React, {useState, useEffect} from 'react';
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
import {currentUser, getUserFromCollections} from '../../utils/firebase.utils';
import colors from '../../styles/colors.style';
import {useIsFocused} from '@react-navigation/native';
import brandImageArray from '../../utils/brandImageArray.utils';
import {CircleIconButton, FlatButton} from '../../components';
import securityTips from '../../utils/securityTips';

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

  const isPageFocused = useIsFocused();

  useEffect(() => {
    getCurrentUser();
    getRandomInt();
  }, [isPageFocused]);

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
      props.handleSnackbar({type: 'error', message: 'Usuário não encontrado'});
    } else {
      setUserDoc(user.user._data);
      setDevices(user.user._data.devices);
      setFavoriteDevices(
        !user.user._data.favoriteDevices ? [] : user.user._data.favoriteDevices,
      );
      setHaveNotifications(
        user.user._data.notifications.length > 0 ? true : false,
      );
      setLoadingUserData(false);
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
      <TouchableHighlight
        onPress={() =>
          props.navigation.navigate('HandleDevices', {device: item})
        }
        underlayColor="tranparent">
        <View
          style={[
            styles.deviceContainer,
            generalStyles.shadow,
            {backgroundColor: '#FFF'},
          ]}>
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

          <View style={{alignItems: 'center'}}>
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

  const renderFavoriteDevices = ({item}) => {
    return (
      <TouchableHighlight
        onPress={() =>
          props.navigation.navigate('SearchPage', {queryToSearch: item.imei})
        }
        underlayColor="tranparent">
        <View
          style={[
            styles.deviceContainer,
            generalStyles.shadow,
            {backgroundColor: '#FFF'},
          ]}>
          <View style={{alignItems: 'stretch'}}>
          <Text style={generalStyles.primaryLabel}>{item.label}</Text>
            <View style={generalStyles.row}>
              <Text style={generalStyles.primaryLabel}>Imei:</Text>
              <Text
                style={[
                  generalStyles.secondaryLabel,
                  {maxWidth: 150, marginLeft: 8},
                ]}
                numberOfLines={1}>
                {item.imei}
              </Text>
              <MaterialIcons
                name="arrow-right"
                size={28}
                color={colors.icon}
                style={{alignSelf: 'center'}}
              />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  return loadingUserData ? (
    <View style={[generalStyles.pageContainer, {justifyContent: 'center'}]}>
      <ActivityIndicator size="large" color={colors.secondary} />
    </View>
  ) : (
    <SafeAreaView style={generalStyles.pageContainer}>
      <View style={[generalStyles.row, {justifyContent: 'space-between'}]}>
        <CircleIconButton
          buttonSize={32}
          buttonColor="#FFF"
          iconName="notifications"
          iconSize={28}
          haveShadow={true}
          iconColor={colors.primary}
          handleCircleIconButtonPress={() =>
            props.navigation.navigate('Notifications', {user: userDoc})
          }
          isNotificationsButton={haveNotifications}
        />
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => props.navigation.navigate('UserPage')}>
          <View style={generalStyles.row}>
            <Text
              numberOfLines={1}
              style={[
                generalStyles.primaryLabel,
                {marginRight: 8, maxWidth: 224},
              ]}>
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

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loadingUserData}
            onRefresh={() => getCurrentUser()}
          />
        }>
        <View style={styles.card}>
          <View style={[generalStyles.row, {justifyContent: 'space-between'}]}>
            <Text style={generalStyles.titleDark}>Meus dispositivos</Text>
            <CircleIconButton
              buttonSize={28}
              buttonColor="#FFF"
              iconName="add"
              iconSize={26}
              haveShadow={true}
              iconColor={colors.primary}
              handleCircleIconButtonPress={() =>
                props.navigation.navigate('HandleDevices', {device: null})
              }
            />
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
            contentContainerStyle={{paddingVertical: 8}}
            data={favoriteDevices}
            renderItem={renderFavoriteDevices}
            keyExtractor={item => item.imei}
            ListEmptyComponent={<DevicesListEmpty />}
          />
        </View>

        <View style={styles.card}>
          <View style={[generalStyles.row, {justifyContent: 'space-between'}]}>
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
    </SafeAreaView>
  );
}
