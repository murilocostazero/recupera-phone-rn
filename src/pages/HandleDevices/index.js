import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TextInput, Alert, ScrollView, Switch} from 'react-native';
import generalStyles from '../../styles/general.style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors.style';
import {CircleIconButton, FlatButton, Header} from '../../components';
import {
  addDevice,
  currentUser,
  getUserFromCollections,
} from '../../utils/firebase.utils';
import {newDeviceFieldsVerification} from '../../utils/fieldsVerification.utils';
import Clipboard from '@react-native-clipboard/clipboard';

export default function HandleDevices(props) {
  /* STATES */
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [mainColor, setMainColor] = useState('');
  const [imei, setImei] = useState('');
  const [loggedUser, setLoggedUser] = useState(null);
  const [loadingSaveDevice, setLoadingSaveDevice] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [loadingRemovingDevice, setLoadingRemoveDevice] = useState(false);
  const [hasAlert, setHasAlert] = useState(false);

  /* REFERENCES */
  const brandRef = useRef('brandRef');
  const modelRef = useRef('modelRef');
  const mainColorRef = useRef('mainColorRef');
  const imeiRef = useRef('imeiRef');

  useEffect(() => {
    getCurrentUser();
    props.route.params.device == null
      ? {}
      : populateFields(props.route.params.device);
  }, []);

  function getCurrentUser() {
    const user = currentUser();
    // console.log(user);
    setLoggedUser(user);
  }

  function populateFields(deviceReceived) {
    setIsEditingMode(true);
    setBrand(deviceReceived.brand);
    setModel(deviceReceived.model);
    setMainColor(deviceReceived.mainColor);
    setImei(deviceReceived.imei);
    setHasAlert(deviceReceived.hasAlert);
  }

  function showImeiInfo() {
    Alert.alert(
      'Número de IMEI',
      'O IMEI é um número, composto de 15 a 17 dígitos, também conhecido como a identidade do aparelho. Há duas formas para descobrir este número: Com o aparelho ligado, digite *#06# Se o aparelho estiver desligado, verifique na nota fiscal ou retire a bateria e consulte o número de IMEI ou ESN na etiqueta do equipamento.',
      [{text: 'ENTENDI', onPress: () => {}}],
    );
  }

  async function saveOrUpdateDevice() {
    setLoadingSaveDevice(true);
    const userDoc = await getUserFromCollections(loggedUser.email);
    const fieldsVerificationResponse = newDeviceFieldsVerification(
      brand,
      model,
      mainColor,
      imei,
      hasAlert,
    );
    if (!fieldsVerificationResponse.success) {
      props.handleSnackbar({
        message: fieldsVerificationResponse.message,
        type: 'error',
      });
      setLoadingSaveDevice(false);
    } else {
      const device = {
        brand: brand,
        model: model,
        mainColor: mainColor,
        imei: imei,
        hasAlert: hasAlert,
      };

      //SAVE NEW
      if (!isEditingMode) {
        const actualDevices = userDoc.user._data.devices;
        //Verify if imei already exist
        const deviceIndex = actualDevices.findIndex(obj => obj.imei == imei);
        if (deviceIndex == -1) {
          /* If imei doesnt exist */
          actualDevices.push(device);

          const addDeviceResponse = await addDevice(
            actualDevices,
            loggedUser.email,
          );
          if (!addDeviceResponse.success) {
            props.handleSnackbar({
              message: addDeviceResponse.message,
              type: 'error',
            });
            setLoadingSaveDevice(false);
          } else {
            setLoadingSaveDevice(false);
            props.navigation.goBack();
          }
        } else {
          /* Imei exists */
          props.handleSnackbar({
            type: 'error',
            message: 'O imei informado já está em uso',
          });
          setLoadingSaveDevice(false);
        }
      } /* UPDATE DEVICE */ else {
        const actualDevices = userDoc.user._data.devices;
        const deviceIndex = actualDevices.findIndex(obj => obj.imei == imei);
        if (deviceIndex != -1) {
          actualDevices[deviceIndex] = device;

          const addDeviceResponse = await addDevice(
            actualDevices,
            loggedUser.email,
          );
          if (!addDeviceResponse.success) {
            props.handleSnackbar({
              message: addDeviceResponse.message,
              type: 'error',
            });
            setLoadingSaveDevice(false);
          } else {
            setLoadingSaveDevice(false);
            props.navigation.goBack();
          }
        }
      }
    }
  }

  function onRemovingDevice() {
    Alert.alert(
      'Remover dispositivo?',
      'Ao continuar, esse dispositivo será removido sem a possibilidade de recuperação.',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'CONTINUAR', onPress: () => removeDevice()},
      ],
    );
  }

  async function removeDevice() {
    setLoadingRemoveDevice(true);
    const userDoc = await getUserFromCollections(loggedUser.email);
    const actualDevices = userDoc.user._data.devices;
    const deviceIndex = actualDevices.findIndex(obj => obj.imei == imei);
    actualDevices.splice(deviceIndex, 1);

    const addDeviceResponse = await addDevice(actualDevices, loggedUser.email);
    if (!addDeviceResponse.success) {
      props.handleSnackbar({
        message: addDeviceResponse.message,
        type: 'error',
      });
      setLoadingRemoveDevice(false);
    } else {
      setLoadingRemoveDevice(false);
      props.navigation.goBack();
    }
  }

  function copyToClipboard(stringToSave) {
    Clipboard.setString(stringToSave);
    props.handleSnackbar({
      type: 'success',
      message: 'IMEI copiado para área de transferência',
    });
  }

  return (
    <View style={generalStyles.pageContainer}>
      <Header
        handleGoBackButtonPress={() => {
          loadingSaveDevice ? {} : props.navigation.goBack();
        }}
        pageTitle="Dispositivos"
        loadingPrimaryButton={loadingSaveDevice}
        handlePrimaryButtonPress={() => saveOrUpdateDevice()}
        primaryButtonLabel={!isEditingMode ? 'SALVAR' : 'ATUALIZAR'}
      />

      <ScrollView>
        <View style={{marginTop: 32}}>
          <View
            style={[generalStyles.textInputContainer, generalStyles.shadow]}>
            <Text style={generalStyles.secondaryLabel}>Marca</Text>
            <View style={generalStyles.row}>
              <MaterialIcons name="devices" color={colors.icon} size={22} />
              <TextInput
                value={brand}
                ref={brandRef}
                onChangeText={text => setBrand(text)}
                onSubmitEditing={() => modelRef.current.focus()}
                placeholder="Ex.: Xiaomi, Apple, Redmi, Samsung..."
                placeholderTextColor={colors.icon}
                style={[
                  generalStyles.textInput,
                  generalStyles.primaryLabel,
                  {marginLeft: 8},
                ]}
              />
            </View>
          </View>

          <View
            style={[generalStyles.textInputContainer, generalStyles.shadow]}>
            <Text style={generalStyles.secondaryLabel}>Modelo</Text>
            <View style={generalStyles.row}>
              <MaterialIcons name="smartphone" color={colors.icon} size={22} />
              <TextInput
                value={model}
                ref={modelRef}
                onChangeText={text => setModel(text)}
                onSubmitEditing={() => mainColorRef.current.focus()}
                placeholder="Ex.: Mi 11, Note 7, A30s, iPhone 7..."
                placeholderTextColor={colors.icon}
                style={[
                  generalStyles.textInput,
                  generalStyles.primaryLabel,
                  {marginLeft: 8},
                ]}
              />
            </View>
          </View>

          <View
            style={[generalStyles.textInputContainer, generalStyles.shadow]}>
            <Text style={generalStyles.secondaryLabel}>Cor principal</Text>
            <View style={generalStyles.row}>
              <MaterialIcons name="palette" color={colors.icon} size={22} />
              <TextInput
                value={mainColor}
                ref={mainColorRef}
                onChangeText={text => setMainColor(text)}
                onSubmitEditing={() => imeiRef.current.focus()}
                placeholder="Ex.: Cinza, preto, azul, grafite..."
                placeholderTextColor={colors.icon}
                style={[
                  generalStyles.textInput,
                  generalStyles.primaryLabel,
                  {marginLeft: 8},
                ]}
              />
            </View>
          </View>

          <View
            style={[
              generalStyles.textInputContainer,
              generalStyles.shadow,
              {backgroundColor: isEditingMode ? '#EEE' : '#FFF'},
            ]}>
            <View style={generalStyles.row}>
              <Text style={generalStyles.secondaryLabel}>IMEI</Text>
              <CircleIconButton
                buttonSize={24}
                buttonColor="transparent"
                iconName="info"
                iconSize={24}
                haveShadow={false}
                iconColor={colors.link}
                handleCircleIconButtonPress={() => showImeiInfo()}
              />
            </View>
            <View style={generalStyles.row}>
              <MaterialIcons name="badge" color={colors.icon} size={22} />
              <TextInput
                editable={isEditingMode ? false : true}
                value={imei}
                ref={imeiRef}
                onChangeText={text => setImei(text)}
                onSubmitEditing={() => {}}
                placeholder="Disque *#06# para saber seu imei"
                keyboardType="phone-pad"
                placeholderTextColor={colors.icon}
                style={[
                  generalStyles.textInput,
                  generalStyles.primaryLabel,
                  {marginLeft: 8},
                ]}
              />
              <CircleIconButton
                buttonSize={24}
                buttonColor="transparent"
                iconName="content-copy"
                iconSize={22}
                haveShadow={false}
                iconColor={colors.secondary}
                handleCircleIconButtonPress={() => copyToClipboard(imei)}
              />
            </View>
          </View>

          <View style={[generalStyles.row, {padding: 8, marginVertical: 4, justifyContent: 'space-between'}]}>
            <Text style={generalStyles.secondaryLabel}>
              Sinalizar com alerta de roubo/furto
            </Text>
            <Switch
              trackColor={{false: '#767577', true: colors.secondary}}
              thumbColor={hasAlert ? colors.primary : '#f4f3f4'}
              onValueChange={() => setHasAlert(!hasAlert)}
              value={hasAlert}
            />
          </View>
        </View>
      </ScrollView>
      {isEditingMode ? (
        <FlatButton
          label="EXCLUIR DISPOSITIVO"
          labelColor="#FFF"
          buttonColor={colors.error}
          handleFlatButtonPress={() => onRemovingDevice()}
          isLoading={loadingRemovingDevice}
        />
      ) : (
        <View />
      )}
    </View>
  );
}
