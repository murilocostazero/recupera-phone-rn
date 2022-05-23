import React, {useState} from 'react';
import {View, Text, TouchableHightlight} from 'react-native';
import generalStyles from '../../styles/general.style';
import {CircleIconButton, FlatButton} from '../../components';
import colors from '../../styles/colors.style';
import styles from './styles';
import {logout} from '../../utils/firebase.utils';

export default function Home(props) {
  const [showMenuOptions, setShowMenuOptions] = useState(false);

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
        <Text
          onPress={() => onLogout()}
          style={generalStyles.primaryLabel}>
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

        <View></View>
      </View>
    </View>
  );
}
