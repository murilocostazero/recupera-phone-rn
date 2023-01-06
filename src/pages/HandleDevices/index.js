import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  Switch,
  Image,
  Platform,
  Linking,
} from 'react-native';
import generalStyles from '../../styles/general.style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors.style';
import { CircleIconButton, FlatButton, Header } from '../../components';
import {
  addDevice,
  associateDevice,
  currentUser,
  getUserFromCollections,
} from '../../utils/firebase.utils';
import { newDeviceFieldsVerification } from '../../utils/fieldsVerification.utils';
import Clipboard from '@react-native-clipboard/clipboard';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

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
  const [isAssociated, setIsAssociated] = useState(false);
  const [fiscalDocumentPicture, setFiscalDocumentPicture] = useState('');
  const [uploadingFiscalDocument, setUploadingFiscalDocument] = useState(false);
  const [whereToFind, setWhereToFind] = useState(null);
  const [lastLocation, setLastLocation] = useState(null);

  /* REFERENCES */
  const brandRef = useRef('brandRef');
  const modelRef = useRef('modelRef');
  const mainColorRef = useRef('mainColorRef');
  const imeiRef = useRef('imeiRef');

  useEffect(() => {
    getCurrentUser(
      !props.route.params.device ? null : props.route.params.device,
    );
  }, []);

  function getCurrentUser(deviceReceived) {
    const user = currentUser();
    // console.log(user);
    setLoggedUser(user);

    if (deviceReceived !== null) {
      populateFields(deviceReceived, user.email);
    }
  }

  async function populateFields(deviceReceived, userEmail) {
    setIsEditingMode(true);
    setBrand(deviceReceived.brand);
    setModel(deviceReceived.model);
    setMainColor(deviceReceived.mainColor);
    setImei(deviceReceived.imei);
    setHasAlert(deviceReceived.hasAlert);
    setIsAssociated(deviceReceived.isAssociated);
    setLastLocation(deviceReceived.lastLocation);

    const url = await storage()
      .ref(`FiscalDocuments/${userEmail}/${deviceReceived.imei}.jpg`)
      .getDownloadURL()
      .catch(e => {
        // console.error('Erro ao buscar imagem', e);
        return null;
      });

    setFiscalDocumentPicture(
      url === null
        ? ''
        : {
          uri: url,
          fileName: `${deviceReceived.imei}.jpg`,
        },
    );

    if (deviceReceived.whereToFind) {
      setWhereToFind(deviceReceived.whereToFind);
    }
  }

  function showImeiInfo() {
    Alert.alert(
      'Número de IMEI',
      'O IMEI é um número, composto de 15 a 17 dígitos, também conhecido como a identidade do aparelho. Há duas formas para descobrir este número: Com o aparelho ligado, digite *#06# Se o aparelho estiver desligado, verifique na nota fiscal ou retire a bateria e consulte o número de IMEI ou ESN na etiqueta do equipamento.',
      [{ text: 'ENTENDI', onPress: () => { } }],
    );
  }

  const openLocationOnMap = (labelMap, lat, lng) => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${lat},${lng}`;
    const label = labelMap;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url);
  };

  async function saveOrUpdateDevice() {
    setLoadingSaveDevice(true);
    const userDoc = await getUserFromCollections(loggedUser.email);
    const fieldsVerificationResponse = newDeviceFieldsVerification(
      brand,
      model,
      mainColor,
      imei,
      hasAlert
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
        isAssociated: isAssociated,
        whereToFind: whereToFind && hasAlert ? whereToFind : null
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

          if (fiscalDocumentPicture) {
            props.handleSnackbar({
              type: 'success',
              message: 'Fazendo upload do documento fiscal',
            });
            await uploadImage();
          }

          if (!addDeviceResponse.success) {
            props.handleSnackbar({
              message: addDeviceResponse.message,
              type: 'error',
            });
            setLoadingSaveDevice(false);
          } else {
            const associateDeviceResponse = await associateDevice(device);
            if (!associateDeviceResponse.success) {
              props.handleSnackbar({ type: 'error', message: associateDeviceResponse.message });
            } else {

            }

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

          if (fiscalDocumentPicture) {
            props.handleSnackbar({
              type: 'success',
              message: 'Fazendo upload do documento fiscal',
            });
            await uploadImage();
          }

          if (!addDeviceResponse.success) {
            props.handleSnackbar({
              message: addDeviceResponse.message,
              type: 'error',
            });
            setLoadingSaveDevice(false);
          } else {
            const associateDeviceResponse = await associateDevice(device);
            if (!associateDeviceResponse.success) {
              props.handleSnackbar({ type: 'error', message: associateDeviceResponse.message });
            }
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
          onPress: () => { },
          style: 'cancel',
        },
        { text: 'CONTINUAR', onPress: () => removeDevice() },
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
      //Removendo nota fiscal

      // Create a reference to the file to delete
      const fiscalDocumentRef = storage().ref(
        `FiscalDocuments/${loggedUser.email}/${imei}.jpg`,
      );

      // Delete the file
      fiscalDocumentRef
        .delete()
        .then(() => {
          // File deleted successfully
          setLoadingRemoveDevice(false);
          props.navigation.goBack();
        })
        .catch(error => {
          // Uh-oh, an error occurred!
          setLoadingRemoveDevice(false);
          props.handleSnackbar({
            type: 'error',
            message: 'Não havia documento fiscal neste dispositivo',
          });
          props.navigation.goBack();
          // console.error(error);
        });
    }
  }

  function copyToClipboard(stringToSave) {
    Clipboard.setString(stringToSave);
    props.handleSnackbar({
      type: 'success',
      message: 'IMEI copiado para área de transferência',
    });
  }

  function selectImage() {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {
          uri: response.assets[0].uri,
          fileName: response.assets[0].fileName,
        };
        // console.log(response.assets[0]);
        setFiscalDocumentPicture(source);
      }
    });
  }

  async function uploadImage() {
    const { uri } = fiscalDocumentPicture;
    const reference = storage().ref(
      'FiscalDocuments/' + loggedUser.email + '/' + imei + '.jpg',
    );
    setUploadingFiscalDocument(true);
    await reference.putFile(uri);
    setUploadingFiscalDocument(false);
  }

  return (
    <View style={generalStyles.pageContainer}>
      <Header
        handleGoBackButtonPress={() => {
          loadingSaveDevice ? {} : props.navigation.goBack();
        }}
        pageTitle="Dispositivo"
        loadingPrimaryButton={loadingSaveDevice}
        handlePrimaryButtonPress={() => saveOrUpdateDevice()}
        primaryButtonLabel={!isEditingMode ? 'SALVAR' : 'ATUALIZAR'}
      />

      <ScrollView>
        {!whereToFind ? (
          <View />
        ) : (
          <View style={{ marginTop: 32, alignItems: 'center' }}>
            <Text style={generalStyles.titleDark}>
              Seu dispositivo foi encontrado!
            </Text>
            <Image
              source={require('../../assets/images/celeb.gif')}
              style={{ width: 200, height: 140 }}
            />
            <View>
              <Text style={generalStyles.primaryLabel}>
                Seu dispositivo está na instituição abaixo:
              </Text>
              <Text style={generalStyles.secondaryLabel}>
                Local: {whereToFind.name}
              </Text>
              <Text style={generalStyles.secondaryLabel}>
                Endereço: {whereToFind.address}
              </Text>
              <Text style={generalStyles.secondaryLabel}>
                Email: {whereToFind.email}
              </Text>
            </View>
          </View>
        )}
        <View style={{ marginTop: 32 }}>
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
                  { marginLeft: 8 },
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
                  { marginLeft: 8 },
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
                  { marginLeft: 8 },
                ]}
              />
            </View>
          </View>

          <View
            style={[
              generalStyles.textInputContainer,
              generalStyles.shadow,
              { backgroundColor: isEditingMode ? '#EEE' : '#FFF' },
            ]}>
            <View style={generalStyles.row}>
              <Text style={generalStyles.secondaryLabel}>IMEI</Text>
              <CircleIconButton
                buttonSize={24}
                buttonColor="transparent"
                iconName="info"
                iconSize={24}
                haveShadow={false}
                iconColor={colors.secondaryOpacity}
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
                onSubmitEditing={() => { }}
                placeholder="Disque *#06# para saber seu imei"
                keyboardType="phone-pad"
                placeholderTextColor={colors.icon}
                style={[
                  generalStyles.textInput,
                  generalStyles.primaryLabel,
                  { marginLeft: 8 },
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

          <View style={{ marginVertical: 16 }}>
            <View style={generalStyles.row}>
              <Text style={generalStyles.secondaryLabel}>Documento fiscal</Text>
              <CircleIconButton
                buttonSize={24}
                buttonColor="transparent"
                iconName="info"
                iconSize={22}
                haveShadow={false}
                iconColor={colors.secondaryOpacity}
                handleCircleIconButtonPress={() =>
                  Alert.alert(
                    'Nota fiscal do aparelho',
                    'É importante que você deixe salvo uma foto da nota fiscal do seu aparelho.',
                  )
                }
              />
            </View>
            <View style={{ alignItems: 'stretch', marginVertical: 16 }}>
              {!fiscalDocumentPicture ? (
                <View style={{ alignItems: 'center' }}>
                  <Image
                    source={require('../../assets/images/no-pictures.png')}
                    style={{ width: 120, height: 100 }}
                  />
                  <Text style={generalStyles.primaryLabel}>
                    (Nenhuma imagem selecionada)
                  </Text>
                </View>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Image
                    source={{ uri: fiscalDocumentPicture.uri }}
                    style={{ width: 180, height: 180 }}
                  />
                  <Text style={generalStyles.primaryLabel}>
                    {fiscalDocumentPicture.fileName}
                  </Text>
                </View>
              )}
              <FlatButton
                label={
                  !fiscalDocumentPicture
                    ? 'Selecionar imagem'
                    : 'Escolher outra'
                }
                height={48}
                labelColor="#FFF"
                buttonColor={colors.primary}
                handleFlatButtonPress={() => selectImage()}
                isLoading={false}
                style={{ marginTop: 16 }}
              />
            </View>
          </View>

          <View
            style={[
              generalStyles.row,
              { padding: 8, marginVertical: 4, justifyContent: 'space-between' },
            ]}>
            <Text style={generalStyles.primaryLabel}>
              Sinalizar com alerta de roubo/furto
            </Text>
            <Switch
              trackColor={{ false: '#767577', true: colors.secondary }}
              thumbColor={hasAlert ? colors.primary : '#f4f3f4'}
              onValueChange={() => setHasAlert(!hasAlert)}
              value={hasAlert}
            />
          </View>

          <View
            style={[
              generalStyles.row,
              { padding: 8, marginVertical: 4, justifyContent: 'space-between' },
            ]}>
            <View style={{ flex: 2 }}>
              <Text style={generalStyles.primaryLabel}>
                Associar este cadastro a esse dispositivo
              </Text>
              <Text style={generalStyles.secondaryLabel}>
                Ao marcar, a localização desse dispositivo será associada a este cadastro. Assim você terá acesso a localização deste dispositivo quando ele não estiver em sua posse.
              </Text>
            </View>
            <Switch
              style={{ flex: 1 }}
              trackColor={{ false: '#767577', true: colors.secondary }}
              thumbColor={isAssociated ? colors.primary : '#f4f3f4'}
              onValueChange={() => hasAlert ? props.handleSnackbar({ type: 'warning', message: 'Não é possível pegar a localização de um dispositivo que não está em sua posse.' }) : setIsAssociated(!isAssociated)}
              value={isAssociated}
            />
          </View>

          {
            lastLocation !== null && loggedUser ?
              <View style={generalStyles.row}>
                <Text style={[generalStyles.primaryLabel, { marginVertical: 8, flex: 1 }]}>Última localização: lat {lastLocation.latitude}, long {lastLocation.longitude}</Text>
                <CircleIconButton buttonSize={30} buttonColor='#FFF' iconName='location-on' iconSize={20} haveShadow={true} iconColor={colors.secondary} handleCircleIconButtonPress={() => openLocationOnMap(`Dispositivo: ${imei}`, lastLocation.latitude, lastLocation.longitude)} />
              </View> :
              <Text style={[generalStyles.secondaryLabel, { marginVertical: 8, flex: 1 }]}>Este dispositivo não possui localização salva</Text>
          }

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
