import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, ActivityIndicator} from 'react-native';
import generalStyles from '../../styles/general.style';
import {CircleIconButton, FlatButton} from '../../components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors.style';
import styles from './styles';
import {
  logout,
  currentUser,
  changeDisplayName,
} from '../../utils/firebase.utils';

export default function Home(props) {
  const [showMenuOptions, setShowMenuOptions] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [loadingDisplayNameUpdate, setLoadingDisplayNameUpdate] =
    useState(false);

  useEffect(() => {
    getCurrentUser();
  }, []);

  async function getCurrentUser() {
    let user = await currentUser();
    setLoggedUser(user);
    setDisplayName(user.displayName == null ? '' : user.displayName);
  }

  async function onLogout() {
    const logoutResponse = await logout();
    if (logoutResponse.success) {
      props.onAuthStateChanged(null);
    }
  }

  async function updateDisplayName() {
    if (displayName.length < 3) {
      props.handleSnackbar({
        message: 'Nome não pode conter menos de 3 caracteres',
        type: 'warning',
      });
    } else {
      setLoadingDisplayNameUpdate(true);
      const updatedDisplayName = await changeDisplayName(displayName);
      console.log(updatedDisplayName);
      setLoadingDisplayNameUpdate(false);
    }
    getCurrentUser();
    setEditingDisplayName(false);
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
            <View style={{position: 'absolute', right: -20, bottom: 0}}>
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
            {editingDisplayName ? (
              <TextInput
                value={displayName}
                onChangeText={text => setDisplayName(text)}
                onSubmitEditing={() => updateDisplayName()}
                placeholder="Ex.: Pedro Lopes"
                placeholderTextColor={colors.text.darkPlaceholder}
                style={[
                  {
                    backgroundColor: '#FFF',
                    width: 200,
                    height: 40,
                    borderRadius: 16,
                  },
                  generalStyles.shadow,
                  generalStyles.primaryLabel,
                ]}
              />
            ) : (
              <Text style={generalStyles.titleDark}>
                {loggedUser == null
                  ? 'Carregando...'
                  : !loggedUser.displayName
                  ? 'Seu nome'
                  : loggedUser.displayName}
              </Text>
            )}
            {loadingDisplayNameUpdate ? (
              <ActivityIndicator size="large" color={colors.secondary} />
            ) : (
              <CircleIconButton
                buttonSize={28}
                buttonColor="transparent"
                iconName={editingDisplayName ? 'check' : 'edit'}
                iconSize={20}
                iconColor={colors.secondary}
                handleCircleIconButtonPress={() =>
                  !editingDisplayName
                    ? setEditingDisplayName(true)
                    : updateDisplayName()
                }
              />
            )}
          </View>
        </View>

        <View></View>
      </View>
    </View>
  );
}
