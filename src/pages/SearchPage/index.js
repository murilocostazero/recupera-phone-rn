import React, {useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import generalStyles from '../../styles/general.style';
import {CircleIconButton, Header} from '../../components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors.style';
import {findDevice} from '../../utils/firebase.utils';

export default function SearchPage(props) {
  const [query, setQuery] = useState('');
  const [device, setDevice] = useState([]);

  async function searchDevice() {
      const deviceFound = await findDevice(query);
      console.log(deviceFound)
      if(deviceFound.length < 1){
          setDevice(null);
      } else {
          setDevice(deviceFound[0]);
      }
  }

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

    </View>
  );
}
