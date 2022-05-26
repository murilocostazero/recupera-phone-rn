import React, {useState, useEffect} from 'react';
import {View, Text, TouchableHightlight} from 'react-native';
import generalStyles from '../../styles/general.style';
import {CircleIconButton, FlatButton} from '../../components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors.style';
import styles from './styles';
import {logout, currentUser} from '../../utils/firebase.utils';

export default function Home(props) {
  const [showMenuOptions, setShowMenuOptions] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  async function getCurrentUser() {
    let user = await currentUser();
    setLoggedUser(user);
  }

  async function onLogout() {
    const logoutResponse = await logout();
    if (logoutResponse.success) {
      props.onAuthStateChanged(null);
    }
  }

  const FloatingMenu = () => {
    return (
      <View
        style={[
          styles.floatingMenuContainer,
          generalStyles.shadow,
          {display: showMenuOptions ? 'flex' : 'none'},
        ]}>
        <Text onPress={() => onLogout()} style={generalStyles.primaryLabel}>
          Logout
        </Text>
      </View>
    );
  };
  return (
    <View style={generalStyles.pageContainer}>
      <View style={styles.profileContainer}>
        <View style={[generalStyles.row, {justifyContent: 'space-between'}]}>
          <CircleIconButton
            buttonSize={30}
            buttonColor="#FFF"
            iconName="drag-handle"
            iconSize={26}
            iconColor={colors.primary}
            handleCircleIconButtonPress={() => {}}
          />
          <CircleIconButton
            buttonSize={30}
            buttonColor="#FFF"
            iconName={showMenuOptions ? 'close' : 'more-vert'}
            iconSize={26}
            iconColor={colors.primary}
            handleCircleIconButtonPress={() =>
              setShowMenuOptions(!showMenuOptions)
            }
          />
          <FloatingMenu />
        </View>

        <View style={{marginTop: 30, alignItems: 'center'}}>
          <View style={[styles.profilePictureContainer, generalStyles.shadow]}>
            <MaterialIcons name="person" size={100} color={colors.background} />
            <View style={{position: 'absolute', right: -24, bottom: 0}}>
              <CircleIconButton
                buttonSize={28}
                buttonColor="transparent"
                iconName="edit"
                iconSize={20}
                iconColor={colors.secondary}
                handleCircleIconButtonPress={() => {}}
              />
            </View>
          </View>
          <View style={generalStyles.row}>
            <Text style={generalStyles.titleDark}>
              {loggedUser == null ? 'Carregando...' : loggedUser.displayName}
            </Text>
            <CircleIconButton
              buttonSize={28}
              buttonColor="transparent"
              iconName="edit"
              iconSize={20}
              iconColor={colors.secondary}
              handleCircleIconButtonPress={() => {}}
            />
          </View>
        </View>

        <View></View>
      </View>
    </View>
  );
}
