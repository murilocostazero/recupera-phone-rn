import React, {useEffect, useState} from 'react';
import {View, Text, Alert} from 'react-native';
import {CircleIconButton, Header, SelectInstitution} from '../../components';
import colors from '../../styles/colors.style';
import generalStyles from '../../styles/general.style';
import styles from './styles.style';

export default function UserFoundDevice(props) {
  const [whoFound, setWhoFound] = useState(null);
  const [device, setDevice] = useState(null);
  const [selectedInstitution, setSelectedInstitution] = useState('');

  useEffect(() => {
    const received = props.route.params;
    // console.log(props.route.params)
    setWhoFound(received.whoFound);
    setDevice(received.device);
  }, []);

  return (
    <View style={generalStyles.pageContainer}>
      <Header
        handleGoBackButtonPress={() => props.navigation.goBack()}
        pageTitle="Entrega de dispositivo"
        loadingPrimaryButton={false}
        handlePrimaryButtonPress={() => {}}
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

          {whoFound === null || device === null ? (
            <View />
          ) : (
            <>
              <View style={styles.section}>
                <Text style={generalStyles.secondaryLabel}>
                  Quem encontrou:
                </Text>
                <Text style={generalStyles.primaryLabel}>{whoFound.email}</Text>
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
