import React from 'react';
import {View, Text} from 'react-native';
import generalStyles from '../../styles/general.style';
import {Header} from '../../components';
import {logout} from '../../utils/firebase.utils';

export default function UserPage(props) {
  async function onLogout() {
    const logoutResponse = await logout();
    if (logoutResponse.success) {
      props.onAuthStateChanged(null);
    }
  }
  
  return (
    <View style={generalStyles.pageContainer}>
      <Header
        handleGoBackButtonPress={() => props.navigation.goBack()}
        pageTitle="Minhas informações"
        loadingPrimaryButton={false}
        handlePrimaryButtonPress={() => onLogout()}
        primaryButtonLabel="SAIR"
      />
    </View>
  );
}
