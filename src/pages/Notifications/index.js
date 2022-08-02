import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableHighlight, Image} from 'react-native';
import generalStyles from '../../styles/general.style';
import {FlatButton, Header} from '../../components';
import styles from './styles.style';
import colors from '../../styles/colors.style';
import {
  changeAgentAuthStatus,
  currentUser,
  getUserFromCollections,
  removeUserNotification,
} from '../../utils/firebase.utils';

export default function Notifications(props) {
  const [user, setUser] = useState(null);
  const [loadingDismissNotification, setLoadingDismissNotification] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const loggedUserReceived = await currentUser();

    const userResponse = await getUserFromCollections(loggedUserReceived.email);
    if (!userResponse.success) {
      props.handleSnackbar({
        type: 'error',
        message: 'Não foi possível buscar instituição',
      });
    } else {
      setUser(userResponse.user._data);
    }
  }

  async function authorizeRequest(userToAuth, status) {
    setLoadingDismissNotification(true);
    const changeAgentAuthStatusResponse = await changeAgentAuthStatus(
      userToAuth,
      status,
    );

    if (!changeAgentAuthStatusResponse.success) {
      setLoadingDismissNotification(false);
      props.handleSnackbar({
        type: 'error',
        message: changeAgentAuthStatusResponse.message,
      });
    } else {
      setLoadingDismissNotification(false);
      getUser(user.email);
    }
  }

  async function onDismissUserNotification(notificationContent) {
    setLoadingDismissNotification(true);
    const removeNotificationResponse = await removeUserNotification(user.email, notificationContent);
    if(!removeNotificationResponse.success){
      setLoadingDismissNotification(false);
      props.handleSnackbar({type: 'error', message: removeNotificationResponse.message});
    } else {
      setLoadingDismissNotification(false);
      getUser(user.email)
    }
  }

  const EmptyNotifications = () => {
    return (
      <View style={styles.emptyNotificationsContainer}>
        <Image
          source={require('../../assets/images/noNotifications.png')}
          style={{width: 112, height: 112}}
        />
        <Text style={generalStyles.primaryLabel}>Tudo limpo por aqui</Text>
      </View>
    );
  };

  const renderNotifications = ({item}) => {
    return (
      <View style={[styles.notificationContainer, generalStyles.shadow]}>
        <Text style={[generalStyles.secondaryLabel, styles.notificationText]}>
          {item.message}
        </Text>
        {user.userType == 'institution' ? (
          <View
            style={[
              generalStyles.row,
              {justifyContent: 'space-between', marginVertical: 8},
            ]}>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => authorizeRequest(item.sender, 'denied')}
              style={[
                styles.notificationButton,
                {backgroundColor: colors.secondaryOpacity},
              ]}>
              <View style={generalStyles.row}>
                <Text style={styles.notificationButtonText}>NÃO AUTORIZAR</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => authorizeRequest(item.sender, 'authorized')}
              style={[
                styles.notificationButton,
                {backgroundColor: colors.primary},
              ]}>
              <View style={generalStyles.row}>
                <Text style={styles.notificationButtonText}>AUTORIZAR</Text>
              </View>
            </TouchableHighlight>
          </View>
        ) : (
          <FlatButton
            label="Ok"
            labelColor="#FFF"
            buttonColor={colors.secondary}
            height={30}
            handleFlatButtonPress={() => onDismissUserNotification(item)}
            isLoading={false}
            style={{marginTop: 16, width: 112, alignSelf: 'center'}}
          />
        )}
      </View>
    );
  };

  return (
    <View style={generalStyles.pageContainer}>
      <Header
        handleGoBackButtonPress={() => props.navigation.goBack()}
        pageTitle="Notificações"
        loadingPrimaryButton={loadingDismissNotification}
        handlePrimaryButtonPress={() => {}}
        primaryButtonLabel=""
      />

      <FlatList
        data={!user ? [] : user.notifications}
        renderItem={renderNotifications}
        ListEmptyComponent={EmptyNotifications}
        keyExtractor={item => item.message}
        extraData={user}
        style={{marginTop: 32}}
        contentContainerStyle={{padding: 8, flex: 1}}
        refreshing={loadingDismissNotification}
        onRefresh={() => getUser()}
      />
    </View>
  );
}
