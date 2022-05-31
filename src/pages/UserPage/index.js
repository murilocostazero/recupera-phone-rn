import React from 'react';
import {View, Text} from 'react-native';
import generalStyles from '../../styles/general.style';
import {logout} from '../../utils/firebase.utils';

export default function UserPage(props) {
  async function onLogout() {
    const logoutResponse = await logout();
    if (logoutResponse.success) {
      props.onAuthStateChanged(null);
    }
  }
  const Header = () => {
    return (
      <View style={[generalStyles.row, {justifyContent: 'space-between'}]}>
        <Text
          style={generalStyles.textButton}
          onPress={() => props.navigation.goBack()}>
          VOLTAR
        </Text>
        <Text style={generalStyles.primaryLabel}>Minhas informações</Text>
        <Text style={generalStyles.textButton} onPress={() => onLogout()}>
          SAIR
        </Text>
      </View>
    );
  };
  return (
    <View style={generalStyles.pageContainer}>
      <Header />
    </View>
  );
}
