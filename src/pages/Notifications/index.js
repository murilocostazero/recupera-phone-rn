import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableHighlight, Image} from 'react-native';
import generalStyles from '../../styles/general.style';
import {FlatButton, Header} from '../../components';
import styles from './styles.style';
import colors from '../../styles/colors.style';
import {
  changeAgentAuthStatus,
  getSingleInstitution,
  removeUserNotification,
} from '../../utils/firebase.utils';

export default function Notifications(props) {
  const [user, setUser] = useState(null);
  const [loadingAuthStatusChange, setLoadingAuthStatusChange] = useState(false);

  useEffect(() => {
    // console.log(props.route.params.user);
    getUser(props.route.params.user.email);
  }, []);

  async function getUser(email) {
    const userResponse = await getSingleInstitution(email);
    if (!userResponse) {
      props.handleSnackbar({
        type: 'error',
        message: 'Não foi possível buscar instituição',
      });
    } else {
      setUser(userResponse);
    }
  }

  async function authorizeRequest(userToAuth, status) {
    setLoadingAuthStatusChange(true);
    const changeAgentAuthStatusResponse = await changeAgentAuthStatus(
      userToAuth,
      status,
    );

    if (!changeAgentAuthStatusResponse.success) {
      setLoadingAuthStatusChange(false);
      props.handleSnackbar({
        type: 'error',
        message: changeAgentAuthStatusResponse.message,
      });
    } else {
      setLoadingAuthStatusChange(false);
      getUser(user.email);
    }
  }

  async function onDismissUserNotification(notificationContent) {
    setLoadingAuthStatusChange(true);
    const removeNotificationResponse = await removeUserNotification(user.email, notificationContent);
    if(!removeNotificationResponse.success){
      setLoadingAuthStatusChange(false);
      props.handleSnackbar({type: 'error', message: removeNotificationResponse.message});
    } else {
      setLoadingAuthStatusChange(false);
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
        loadingPrimaryButton={loadingAuthStatusChange}
        handlePrimaryButtonPress={() => {}}
        primaryButtonLabel=""
      />

      <FlatList
        data={!user ? [] : user.notifications}
        renderItem={renderNotifications}
        ListEmptyComponent={EmptyNotifications}
        keyExtractor={item => item.message}
        extraData={user}
        style={{margin: 8, marginTop: 32}}
        contentContainerStyle={{padding: 8}}
      />
    </View>
  );
}
