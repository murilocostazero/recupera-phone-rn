import React, {useState} from 'react';
import {View, Text, ScrollView, Switch, TextInput} from 'react-native';
import {Header} from '../../components';
import colors from '../../styles/colors.style';
import generalStyles from '../../styles/general.style';
import styles from './styles.style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Settings(props) {
  const [receiveNotificationEmail, setReceiveNotificationEmail] =
    useState(false);
  const [receiveNotificationSMS, setReceiveNotificationSMS] = useState(false);
  const [email, setEmail] = useState('');
  const [smsNumber, setSMSNumber] = useState('');

  async function addOrRemoveNotificationEmail(){
    
  }

  async function addOrRemoveNotificationSMS(){

  }

  return (
    <View style={generalStyles.pageContainer}>
      <Header
        handleGoBackButtonPress={() => props.navigation.goBack()}
        pageTitle="Configurações"
        loadingPrimaryButton={false}
        handlePrimaryButtonPress={() => {}}
        primaryButtonLabel=""
      />

      <ScrollView
        contentContainerStyle={{flexGrow: 1, padding: 8, marginTop: 32}}>
        <View style={[styles.card, generalStyles.shadow]}>
          <View style={[generalStyles.row, {marginBottom: 12}]}>
            <View style={{marginRight: 8, flex: 2}}>
              <Text style={generalStyles.primaryLabel}>
                Receber notificação por email
              </Text>
              <Text style={[generalStyles.secondaryLabel]}>
                Ative se você deseja ser alertado via email secundário quando
                seu dispositivo for encontrado. Atenção: Você já será notificado
                em seu email de cadastro.
              </Text>
            </View>
            <Switch
              style={{flex: 1}}
              trackColor={{false: '#767577', true: colors.secondaryOpacity}}
              thumbColor={
                receiveNotificationEmail ? colors.secondary : '#f4f3f4'
              }
              onValueChange={() => addOrRemoveNotificationEmail()}
              value={receiveNotificationEmail}
            />
          </View>
          <View
            style={[
              generalStyles.textInputContainer,
              generalStyles.shadow,
              {marginBottom: 0},
            ]}>
            <Text style={generalStyles.secondaryLabel}>Email alternativo</Text>
            <View style={generalStyles.row}>
              <MaterialIcons name="email" color={colors.icon} size={22} />
              <TextInput
                value={email}
                onChangeText={text => setEmail(text)}
                onSubmitEditing={() => {}}
                keyboardType="email-address"
                placeholder="fulanofulanoso@gmail.com"
                autoCapitalize="none"
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

        <View style={[styles.card, generalStyles.shadow]}>
          <View style={[generalStyles.row, {marginBottom: 12}]}>
            <View style={{marginRight: 8, flex: 2}}>
              <Text style={generalStyles.primaryLabel}>
                Receber notificação por SMS
              </Text>
              <Text style={[generalStyles.secondaryLabel]}>
                Ative se você deseja receber um alerta via SMS quando seu
                dispositivo for encontrado.
              </Text>
            </View>
            <Switch
              style={{flex: 1}}
              trackColor={{false: '#767577', true: colors.secondaryOpacity}}
              thumbColor={receiveNotificationSMS ? colors.secondary : '#f4f3f4'}
              onValueChange={() => addOrRemoveNotificationSMS()}
              value={receiveNotificationSMS}
            />
          </View>
          <View
            style={[
              generalStyles.textInputContainer,
              generalStyles.shadow,
              {marginBottom: 0},
            ]}>
            <Text style={generalStyles.secondaryLabel}>Número de celular</Text>
            <View style={generalStyles.row}>
              <MaterialIcons name="call" color={colors.icon} size={22} />
              <TextInput
                value={email}
                onChangeText={text => setSMSNumber(text)}
                onSubmitEditing={() => {}}
                keyboardType="phone-pad"
                placeholder="(99)98122-3344"
                autoCapitalize="none"
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
