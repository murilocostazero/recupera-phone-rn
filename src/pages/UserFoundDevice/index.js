import React, {useEffect, useState} from 'react';
import {View, Text, Alert} from 'react-native';
import {CircleIconButton, Header, SelectInstitution} from '../../components';
import colors from '../../styles/colors.style';
import generalStyles from '../../styles/general.style';
import {
  addUserNotifications,
  getUserFromCollections,
  whereToFindDevice,
} from '../../utils/firebase.utils';
import styles from './styles.style';

export default function UserFoundDevice(props) {
  const [whoFound, setWhoFound] = useState('');
  const [device, setDevice] = useState(null);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [loadingFinishDelivery, setLoadingFinishDelivery] = useState(false);

  useEffect(() => {
    // console.log(props.route.params);
    populateReceivedInfo(
      props.route.params.whoFound,
      props.route.params.device,
    );
  }, []);

  function populateReceivedInfo(sender, deviceInfo) {
    setWhoFound(sender);
    setDevice(deviceInfo);
  }

  async function sendEmailNotification(to, notificationMessage) {
    //Sending email notification
    await fetch(
      // 'http://localhost:5000/recuperaphone-7e99c/us-central1/mailer',
      'https://us-central1-recuperaphone-7e99c.cloudfunctions.net/mailer',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: to,
          subject: 'Comemore! Seu dispositivo está em boas mãos.',
          message: notificationMessage,
        }),
      },
    )
      .then(success => {
        console.log(success);
      })
      .catch(error => {
        console.error(error)
        props.handleSnackbar({
          type: 'error',
          message: 'Houve um problema ao enviar a notificação por email.',
        });
      });
  }

  async function onSendDeviceInfo() {
    if (selectedInstitution === null) {
      props.handleSnackbar({
        type: 'warning',
        message: 'Escolha a instituição onde o dispositivo está.',
      });
    } else {
      //Enviar notificação
      const notificationMessage =
        'Seu dispositivo ' +
        device.deviceInfo.brand +
        ' ' +
        device.deviceInfo.model +
        ' ' +
        device.deviceInfo.mainColor +
        ', de IMEI ' +
        device.deviceInfo.imei +
        ', foi encontrado! Você pode dirigir-se até a instituição abaixo para ter mais informações.' +
        '\n\nInstituição: ' +
        selectedInstitution.name +
        '\nEndereço: ' +
        selectedInstitution.address +
        '\nEmail: ' +
        selectedInstitution.email;

      setLoadingFinishDelivery(true);
      const notificationSent = await addUserNotifications(
        notificationMessage,
        whoFound,
        device.owner,
      );

      if (!notificationSent.success) {
        props.handleSnackbar({
          type: 'error',
          message: 'Erro ao concluir entrega de dispositivo',
        });
        console.log(
          'Erro ao concluir entrega de dispositivo',
          notificationSent.message,
        );
      } else {
        const whereToFindResponse = await whereToFindDevice(
          device,
          selectedInstitution,
        );
        if (!whereToFindResponse.success) {
          props.handleSnackbar({
            type: 'error',
            message: whereToFindResponse.message,
          });
        } else {
          await sendEmailNotification(device.owner, notificationMessage);
          const fullUser = await getUserFromCollections(device.owner);
          if (!fullUser.success) {
            props.handleSnackbar({
              type: 'error',
              message: 'Não foi possível buscar o usuário.',
            });
          } else {
            !fullUser.user._data.secondaryLabel
              ? setTimeout(() => {
                  sendEmailNotification(
                    fullUser.user._data.secondaryEmail,
                    notificationMessage,
                  );
                }, 1500)
              : {};
          }
        }

        props.handleSnackbar({type: 'success', message: 'Obrigado! Você ajudou alguém a recuperar um bem.'});

        setLoadingFinishDelivery(false);
        setTimeout(() => {
          props.navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
        }, 2000);
      }
    }
  }

  return (
    <View style={generalStyles.pageContainer}>
      <Header
        handleGoBackButtonPress={() => props.navigation.goBack()}
        pageTitle="Entrega de dispositivo"
        loadingPrimaryButton={loadingFinishDelivery}
        handlePrimaryButtonPress={() => onSendDeviceInfo()}
        primaryButtonLabel="CONCLUIR"
      />
      <View style={generalStyles.pageContainer}>
        <Text style={generalStyles.secondaryLabel}>
          1- Informe o local onde o proprietário pode encontrar seu dispositivo.
        </Text>
        <Text style={generalStyles.secondaryLabel}>
          2- Clique em CONCLUIR após verificar os campos.
        </Text>

        <View style={{marginTop: 32}}>
          <View
            style={[
              generalStyles.row,
              {justifyContent: 'space-between', marginBottom: 4},
            ]}>
            <Text style={generalStyles.secondaryLabel}>
              Onde o dispositivo está?
            </Text>
            <CircleIconButton
              buttonSize={24}
              buttonColor={colors.background}
              iconName="info"
              iconSize={24}
              haveShadow={false}
              iconColor={colors.secondaryOpacity}
              handleCircleIconButtonPress={() =>
                Alert.alert(
                  'Sobre a localização',
                  'Por uma questão de segurança e para que não hajam situações de golpes, não é permitido que você informe manualmente um endereço para que o proprietário possa ir buscar o dispositivo.',
                )
              }
            />
          </View>
          <SelectInstitution
            selectedInstitution={selectedInstitution}
            selectInstitution={item => setSelectedInstitution(item)}
          />

          {whoFound.length === 0 || device === null ? (
            <View />
          ) : (
            <>
              <View style={styles.section}>
                <Text style={generalStyles.secondaryLabel}>
                  Quem encontrou:
                </Text>
                <Text style={generalStyles.primaryLabel}>{whoFound}</Text>
              </View>

              <View style={styles.section}>
                <Text style={generalStyles.secondaryLabel}>Proprietário:</Text>
                <Text style={generalStyles.primaryLabel}>{device.owner}</Text>
              </View>

              <View style={styles.section}>
                <Text style={generalStyles.secondaryLabel}>
                  Dispositivo encontrado:
                </Text>
                <Text style={generalStyles.primaryLabel}>
                  {device.deviceInfo.brand} {device.deviceInfo.model}{' '}
                  {device.deviceInfo.mainColor}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
