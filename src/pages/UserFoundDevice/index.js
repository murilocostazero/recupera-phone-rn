import React, {useEffect, useState} from 'react';
import {View, Text, Alert} from 'react-native';
import {CircleIconButton, Header, SelectInstitution} from '../../components';
import colors from '../../styles/colors.style';
import generalStyles from '../../styles/general.style';
import {addUserNotifications, whereToFindDevice} from '../../utils/firebase.utils';
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
        setLoadingFinishDelivery(false);
        props.handleSnackbar({
          type: 'error',
          message: 'Erro ao concluir entrega de dispositivo',
        });
        console.log(
          'Erro ao concluir entrega de dispositivo',
          notificationSent.message,
        );
      } else {
        const whereToFindResponse = await whereToFindDevice(device, selectedInstitution);
        if(!whereToFindResponse.success){
          setLoadingFinishDelivery(false);
          props.handleSnackbar({
            type: 'error',
            message: whereToFindResponse.message,
          });
        } else {
          setLoadingFinishDelivery(false);
          props.handleSnackbar({
            type: 'success',
            message: 'Obrigado! Você ajudou alguém a recuperar um bem.',
          });
        }

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
