import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import generalStyles from '../../styles/general.style';
import {CircleIconButton, Header} from '../../components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors.style';
import {findDevice} from '../../utils/firebase.utils';
import styles from './styles.style';

export default function SearchPage(props) {
  const [query, setQuery] = useState('');
  const [device, setDevice] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);

  async function searchDevice() {
    setLoadingSearch(true);
    const deviceFound = await findDevice(query);
    // console.log(deviceFound)
    if (deviceFound.length < 1) {
      setDevice(null);
    } else {
      setDevice(deviceFound[0]);
    }
    setLoadingSearch(false);
    setQuery('');
  }

  const DeviceFound = () => {
    return (
      <View style={styles.deviceFoundContainer}>
        <View>
          <View
            style={[
              styles.alertContainer,
              {
                backgroundColor: device.hasAlert
                  ? colors.error
                  : colors.success,
              },
            ]}>
            <View style={generalStyles.row}>
              <MaterialIcons name="warning" color="#FFF" size={38} />
              <Text numberOfLines={2} style={styles.alertMessage}>
                {device.hasAlert
                  ? 'Dispositivo sinalizado pelo proprietário com alerta de roubo/furto.'
                  : 'Dispositivo não possui alerta de roubo/furto.'}
              </Text>
            </View>
            <View style={generalStyles.row}>
              <MaterialIcons name="smartphone" color="#FFF" size={38} />
              <Text style={styles.lightLabel}>
                {device.brand} {device.model} {device.mainColor}
              </Text>
            </View>
          </View>

          <View style={styles.deviceInfoContainer}>
            <View
              style={[generalStyles.row, {justifyContent: 'space-between'}]}>
              <Text style={styles.darkLabel}>Marca:</Text>
              <Text style={generalStyles.secondaryLabel}>{device.brand}</Text>
            </View>
            <View
              style={[generalStyles.row, {justifyContent: 'space-between'}]}>
              <Text style={styles.darkLabel}>Modelo:</Text>
              <Text style={generalStyles.secondaryLabel}>{device.model}</Text>
            </View>
            <View
              style={[generalStyles.row, {justifyContent: 'space-between'}]}>
              <Text style={styles.darkLabel}>Cor:</Text>
              <Text style={generalStyles.secondaryLabel}>
                {device.mainColor}
              </Text>
            </View>
            <View
              style={[generalStyles.row, {justifyContent: 'space-between'}]}>
              <Text style={styles.darkLabel}>IMEI:</Text>
              <Text style={generalStyles.secondaryLabel}>{device.imei}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const DeviceNotFound = () => {
    return (
      <View style={styles.deviceNotFoundContainer}>
        <Text
          style={[
            generalStyles.secondaryLabel,
            {fontSize: 20, marginBottom: 8},
          ]}>
          Dispositivo não encontrado
        </Text>
        <MaterialIcons
          name="sentiment-dissatisfied"
          size={48}
          color={colors.icon}
        />
      </View>
    );
  };

  return (
    <View style={generalStyles.pageContainer}>
      <Header
        handleGoBackButtonPress={() => props.navigation.goBack()}
        pageTitle="Buscar dispositivo"
        loadingPrimaryButton={false}
        handlePrimaryButtonPress={() => {}}
        primaryButtonLabel=""
      />

      <View style={{marginVertical: 20}}>
        <View
          style={[
            generalStyles.textInputContainer,
            generalStyles.row,
            generalStyles.shadow,
            {height: 48},
          ]}>
          <TextInput
            value={query}
            onChangeText={text => setQuery(text)}
            onSubmitEditing={() => searchDevice()}
            keyboardType="phone-pad"
            placeholder="Digite o número de imei"
            autoCapitalize="none"
            placeholderTextColor={colors.icon}
            style={[generalStyles.textInput, generalStyles.primaryLabel]}
          />

          <CircleIconButton
            buttonSize={26}
            buttonColor="#FFF"
            iconName="search"
            iconSize={24}
            haveShadow={false}
            iconColor={colors.secondary}
            handleCircleIconButtonPress={() => searchDevice()}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        {loadingSearch ? (
          <ActivityIndicator size="large" color={colors.secondary} />
        ) : !device ? (
          <DeviceNotFound />
        ) : (
          <DeviceFound />
        )}
      </ScrollView>
    </View>
  );
}
