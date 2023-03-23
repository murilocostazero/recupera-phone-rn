import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Switch, TextInput, Alert } from 'react-native';
import { FlatButton, Header } from '../../components';
import colors from '../../styles/colors.style';
import generalStyles from '../../styles/general.style';
import styles from './styles.style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  addOrRemoveSecondaryEmail,
  addOrRemoveSmsNumber,
  currentUser,
  deleteCollection,
  deleteUser,
  getUserFromCollections,
} from '../../utils/firebase.utils';
import { getSetting, storeSetting } from '../../utils/asyncStorage.utils';

export default function Settings(props) {
  const [receiveNotificationEmail, setReceiveNotificationEmail] =
    useState(false);
  const [receiveNotificationSMS, setReceiveNotificationSMS] = useState(false);
  const [saveLocation, setSaveLocation] = useState(false);
  const [email, setEmail] = useState('');
  const [smsNumber, setSMSNumber] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingHeader, setLoadingHeader] = useState(false);
  const [settingData, setSettingData] = useState(null);

  useEffect(() => {
    getLoggedUser();
    getSettingData();
  }, []);

  async function getSettingData() {
    const settingResponse = await getSetting();
    if (!settingResponse.success) {
      props.handleSnackbar({ type: 'error', message: 'Erro ao buscar configurações.Tente reiniciar o app.' });
    } else {
      if (settingResponse.data) setSaveLocation(settingResponse.data.saveLastLocation);
      setSettingData(settingResponse.data);
    }
  }

  async function getLoggedUser() {
    const userResponse = await currentUser();
    const userDocResponse = await getUserFromCollections(userResponse.email);

    setUser(userDocResponse.user._data);
  }

  async function addOrRemoveEmail() {
    receiveNotificationEmail ? removeSecondaryEmail() : addSecondaryEmail();
  }

  async function addSecondaryEmail() {
    if (email.length < 5 || !email.includes('@')) {
      props.handleSnackbar({
        type: 'error',
        message: 'Informe um email válido.',
      });
    } else if (user.email === email) {
      props.handleSnackbar({
        type: 'error',
        message: 'Email secundário não pode ser igual ao email de cadastro.',
      });
    } else {
      setLoading(true);
      const addSecondaryEmailResponse = await addOrRemoveSecondaryEmail(
        user.email,
        email,
      );
      if (!addSecondaryEmailResponse.success) {
        props.handleSnackbar({
          type: 'error',
          message: addSecondaryEmailResponse.message,
        });
      } else {
        setReceiveNotificationEmail(true);
        props.handleSnackbar({
          type: 'success',
          message: 'Email secundário adicionado com sucesso.',
        });
      }
      setLoading(false);
    }
  }

  async function removeSecondaryEmail() {
    setLoading(true);
    const removeSecondaryEmailResponse = await addOrRemoveSecondaryEmail(
      user.email,
      '',
    );
    if (!removeSecondaryEmailResponse.success) {
      props.handleSnackbar({
        type: 'error',
        message: removeSecondaryEmailResponse.message,
      });
    } else {
      setReceiveNotificationEmail(false);
      setEmail('');
      props.handleSnackbar({
        type: 'success',
        message: 'Email secundário removido com sucesso.',
      });
    }
    setLoading(false);
  }

  async function addOrRemoveSMS() {
    receiveNotificationSMS ? removeSMSNumber() : addSMSNumber();
  }

  async function addSMSNumber() {
    if (smsNumber.length < 11 || isNaN(smsNumber)) {
      props.handleSnackbar({
        type: 'error',
        message: 'Informe um número de celular válido (Apenas números).',
      });
    } else {
      setLoading(true);
      const addSmsResponse = await addOrRemoveSmsNumber(user.email, smsNumber);
      if (!addSmsResponse.success) {
        props.handleSnackbar({
          type: 'error',
          message: addSmsResponse.message,
        });
      } else {
        setReceiveNotificationSMS(true);
        props.handleSnackbar({
          type: 'success',
          message: 'Número de sms adicionado com sucesso.',
        });
      }
      setLoading(false);
    }
  }

  async function removeSMSNumber() {
    setLoading(true);
    const removeSmsResponse = await addOrRemoveSmsNumber(user.email, '');
    if (!removeSmsResponse.success) {
      props.handleSnackbar({
        type: 'error',
        message: removeSmsResponse.message,
      });
    } else {
      setReceiveNotificationSMS(false);
      setSMSNumber('');
      props.handleSnackbar({
        type: 'success',
        message: 'Número de sms removido com sucesso.',
      });
    }
    setLoading(false);
  }

  async function deleteAccount() {
    setLoading(true);
    //Primeiro excluir no cloud firestore
    const deleteCollectionResponse = await deleteCollection(user.email);
    if (!deleteCollectionResponse) {
      props.handleSnackbar({
        type: 'error',
        message: 'Ocorreu um erro ao tentar remover os dados do usuário.',
      });
    } else {
      //Depois excluir a conta
      const deleteUserResponse = await deleteUser();
      if (!deleteUserResponse) {
        props.handleSnackbar({
          type: 'error',
          message:
            'Houve um erro ao tentar excluir as suas credenciais de acesso.',
        });
      } else {
        await props.onAuthStateChanged(null);
      }
    }

    setLoading(false);
  }

  function onDeletingAccount() {
    Alert.alert(
      'Está ciente disso?',
      'Ao pressionar para CONTINUAR, todos os seus dados serão apagados da nossa base e não será possível recuperá-los',
      [
        {
          text: 'CANCELAR',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'CONTINUAR', onPress: () => deleteAccount() },
      ],
    );
  }

  async function saveLastLocation() {
    setLoadingHeader(true);
    const settingData = { saveLastLocation: !saveLocation };
    const storeSettingResponse = await storeSetting(settingData);
    if (!storeSettingResponse.success) {
      props.handleSnackbar({ type: 'error', message: 'Erro ao salvar configuração' });
    } else {
      props.handleSnackbar({ type: 'success', message: 'Configuração salva com sucesso.' });
      setSaveLocation(!saveLocation);
    }
    setLoadingHeader(false);
  }

  return (
    <View style={generalStyles.pageContainer}>
      <Header
        handleGoBackButtonPress={() => props.navigation.goBack()}
        pageTitle="Configurações"
        loadingPrimaryButton={loadingHeader}
        handlePrimaryButtonPress={() => { }}
        primaryButtonLabel=""
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 8, marginTop: 32 }}>
        {
          !user ?
            <Text style={generalStyles.secondaryLabel}>Carregando informações do usuário</Text> :
            user.userType !== 'institution' ?
              <View>
                <View style={[styles.card, generalStyles.shadow]}>
                  <View style={[generalStyles.row, { marginBottom: 12 }]}>
                    <View style={{ marginRight: 8, flex: 2 }}>
                      <Text style={generalStyles.primaryLabel}>
                        Receber notificação por email
                      </Text>
                      <Text style={[generalStyles.secondaryLabel]}>
                        Ative se você deseja ser alertado via email secundário quando
                        seu dispositivo for encontrado. Atenção: Você já será notificado
                        na sua conta e em seu email de cadastro.
                      </Text>
                    </View>
                    <Switch
                      style={{ flex: 1 }}
                      trackColor={{ false: '#767577', true: colors.secondaryOpacity }}
                      thumbColor={
                        receiveNotificationEmail ? colors.secondary : '#f4f3f4'
                      }
                      onValueChange={() => addOrRemoveEmail()}
                      value={receiveNotificationEmail}
                    />
                  </View>
                  <View
                    style={[
                      generalStyles.textInputContainer,
                      generalStyles.shadow,
                      { marginBottom: 0 },
                    ]}>
                    <Text style={generalStyles.secondaryLabel}>Email alternativo</Text>
                    <View style={generalStyles.row}>
                      <MaterialIcons name="email" color={colors.icon} size={22} />
                      <TextInput
                        value={email}
                        onChangeText={text => setEmail(text)}
                        onSubmitEditing={() => { }}
                        keyboardType="email-address"
                        placeholder="fulanofulanoso@gmail.com"
                        autoCapitalize="none"
                        placeholderTextColor={colors.icon}
                        style={[
                          generalStyles.textInput,
                          generalStyles.primaryLabel,
                          { marginLeft: 8 },
                        ]}
                      />
                    </View>
                  </View>
                </View>

                <View style={[styles.card, generalStyles.shadow]}>
                  <View style={[generalStyles.row, { marginBottom: 12 }]}>
                    <View style={{ marginRight: 8, flex: 2 }}>
                      <Text style={generalStyles.primaryLabel}>
                        Salvar última localização
                      </Text>
                      <Text style={[generalStyles.secondaryLabel]}>
                        Ative se você deseja que a localização deste dispositivo seja guardada de tempos em tempos.
                      </Text>
                    </View>
                    <Switch
                      style={{ flex: 1 }}
                      trackColor={{ false: '#767577', true: colors.secondaryOpacity }}
                      thumbColor={
                        saveLocation ? colors.secondary : '#f4f3f4'
                      }
                      onValueChange={() => saveLastLocation()}
                      value={saveLocation}
                    />
                  </View>
                </View>
              </View>
              :
              <View />
        }

        <View style={[styles.card, generalStyles.shadow]}>
          <Text style={generalStyles.primaryLabel}>Excluir conta</Text>
          <Text style={[generalStyles.secondaryLabel]}>
            Ao excluir sua conta, todos os seus dados serão apagados da nossa
            base de dados, não sendo possível recuperá-los uma vez que a
            exclusão tenha sido concluida.
          </Text>
          <FlatButton
            label="EXCLUIR MINHA CONTA"
            height={48}
            labelColor="#FFF"
            buttonColor={colors.error}
            handleFlatButtonPress={() => onDeletingAccount()}
            isLoading={loading}
            style={{ marginTop: 16 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
