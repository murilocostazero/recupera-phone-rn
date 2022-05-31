import React, {useState, useRef} from 'react';
import {View, Text, TextInput, Alert, ScrollView} from 'react-native';
import generalStyles from '../../styles/general.style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors.style';
import {CircleIconButton} from '../../components';
import {newDeviceFieldsVerification} from '../../utils/fieldsVerification.utils';

export default function HandleDevices(props) {
  /* STATES */
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [mainColor, setMainColor] = useState('');
  const [imei, setImei] = useState('');

  /* REFERENCES */
  const brandRef = useRef('brandRef');
  const modelRef = useRef('modelRef');
  const mainColorRef = useRef('mainColorRef');
  const imeiRef = useRef('imeiRef');

  function showImeiInfo() {
    Alert.alert(
      'Número de IMEI',
      'O IMEI é um número, composto de 15 a 17 dígitos, também conhecido como a identidade do aparelho. Há duas formas para descobrir este número: Com o aparelho ligado, digite *#06# Se o aparelho estiver desligado, verifique na nota fiscal ou retire a bateria e consulte o número de IMEI ou ESN na etiqueta do equipamento.',
      [{text: 'ENTENDI', onPress: () => {}}],
    );
  }

  function saveNewDevice(){
    const fieldsVerificationResponse = newDeviceFieldsVerification(brand, model, mainColor, imei);
    if(!fieldsVerificationResponse.success){
        props.handleSnackbar({message: fieldsVerificationResponse.message, type: 'error'});
    } else {

    }
  }

  const Header = () => {
    return (
      <View style={[generalStyles.row, {justifyContent: 'space-between'}]}>
        <Text style={generalStyles.textButton} onPress={() => props.navigation.goBack()}>VOLTAR</Text>
        <Text style={generalStyles.primaryLabel}>Dispositivo</Text>
        <Text style={generalStyles.textButton} onPress={() => saveNewDevice()}>PRONTO</Text>
      </View>
    );
  };
  return (
    <View style={generalStyles.pageContainer}>
      <Header />

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
            style={[generalStyles.textInputContainer, generalStyles.shadow]}>
            <View style={generalStyles.row}>
              <Text style={generalStyles.secondaryLabel}>IMEI</Text>
              <CircleIconButton
                buttonSize={24}
                buttonColor="#FFF"
                iconName="info"
                iconSize={20}
                haveShadow={false}
                iconColor={colors.icon}
                handleCircleIconButtonPress={() => showImeiInfo()}
              />
            </View>
            <View style={generalStyles.row}>
              <MaterialIcons name="badge" color={colors.icon} size={22} />
              <TextInput
                value={imei}
                ref={imeiRef}
                onChangeText={text => setImei(text)}
                onSubmitEditing={() => {}}
                placeholder="Disque *#06# para saber seu imei"
                keyboardType='phone-pad'
                placeholderTextColor={colors.icon}
                style={[
                  generalStyles.textInput,
                  generalStyles.primaryLabel,
                  {marginLeft: 8},
                ]}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
