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
} from 'react-native';
import generalStyles from '../../styles/general.style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import {currentUser, getUserFromCollections} from '../../utils/firebase.utils';
import colors from '../../styles/colors.style';
import {useIsFocused} from '@react-navigation/native';
import brandImageArray from '../../utils/brandImageArray.utils';
import {CircleIconButton} from '../../components';

export default function Home(props) {
  const [loggedUser, setLoggedUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [devices, setDevices] = useState([]);
  const [haveNotifications, setHaveNotifications] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(false);

  const isPageFocused = useIsFocused();

  useEffect(() => {
    getCurrentUser();
  }, [isPageFocused]);

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
      if (
        user.user._data.notifications &&
        user.user._data.notifications.length > 0
      ) {
        setHaveNotifications(true);
      }
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
      <View
        style={[
          styles.deviceContainer,
          generalStyles.shadow,
          {backgroundColor: '#FFF'},
        ]}>
        <CircleIconButton
          buttonSize={24}
          buttonColor="#FFF"
          iconName={
            item.hasAlert ? 'notification-important' : 'notifications-off'
          }
          iconSize={22}
          haveShadow={true}
          iconColor={item.hasAlert ? colors.secondary : colors.icon}
          isNotificationsButton={item.hasAlert}
          handleCircleIconButtonPress={() =>
            console.log(
              'Aqui leva pra área de notificações, assinatura de planos...',
            )
          }
          style={{position: 'absolute', top: 8, right: 8}}
        />
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
          style={[
            generalStyles.textButton,
            {alignSelf: 'center', marginTop: 6},
          ]}
          onPress={() =>
            props.navigation.navigate('HandleDevices', {device: item})
          }>
          EDITAR
        </Text>
      </View>
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
            <Text
              style={generalStyles.textButton}
              onPress={() => props.navigation.navigate('SearchPage')}>
              BUSCAR
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
