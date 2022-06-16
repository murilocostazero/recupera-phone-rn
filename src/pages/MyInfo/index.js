import React, {useState, useRef} from 'react';
import {View, Text, ScrollView, Switch, TextInput} from 'react-native';
import {Header, SelectInstitution} from '../../components';
import colors from '../../styles/colors.style';
import generalStyles from '../../styles/general.style';
import styles from './styles.style';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function MyInfo(props) {
  const [isAgentAccount, setIsAgentAccount] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [name, setName] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  const nameRef = useRef('nameRef');

  return (
    <View style={generalStyles.pageContainer}>
      <Header
        handleGoBackButtonPress={() => props.navigation.goBack()}
        pageTitle="Minhas informações"
        loadingPrimaryButton={false}
        handlePrimaryButtonPress={() => {}}
        primaryButtonLabel="PRONTO"
      />

      <ScrollView contentContainerStyle={{padding: 8, flex: 1}}>
        <View style={styles.optionContainer}>
          <Text style={generalStyles.primaryLabel}>Tipo de conta</Text>
          <View style={[generalStyles.row, styles.optionRow]}>
            <Text style={generalStyles.secondaryLabel}>
              {isAgentAccount
                ? 'Sou agente de segurança pública'
                : 'Não sou agente de segurança pública'}
            </Text>
            <Switch
              trackColor={{false: '#767577', true: colors.secondaryOpacity}}
              thumbColor={isAgentAccount ? colors.secondary : '#f4f3f4'}
              onValueChange={() => setIsAgentAccount(!isAgentAccount)}
              value={isAgentAccount}
            />
          </View>
          {!isAgentAccount ? (
            <View />
          ) : (
            <View style={{marginTop: 16}}>
              <View
                style={[
                  generalStyles.textInputContainer,
                  generalStyles.shadow,
                ]}>
                <Text style={generalStyles.secondaryLabel}>Matrícula</Text>
                <View style={generalStyles.row}>
                  <Octicons name="number" color={colors.icon} size={22} />
                  <TextInput
                    value={registrationNumber}
                    onChangeText={text => setRegistrationNumber(text)}
                    onSubmitEditing={() => nameRef.current.focus()}
                    keyboardType="phone-pad"
                    placeholder="Ex.: 865489"
                    placeholderTextColor={colors.icon}
                    style={[
                      generalStyles.textInput,
                      generalStyles.primaryLabel,
                      {marginLeft: 8},
                    ]}
                  />
                </View>
              </View>

              <SelectInstitution selectedInstitution={selectedInstitution} selectInstitution={(item) => setSelectedInstitution(item)} />
            </View>
          )}
        </View>
        <View style={[generalStyles.textInputContainer, generalStyles.shadow]}>
          <Text style={generalStyles.secondaryLabel}>Nome</Text>
          <View style={generalStyles.row}>
            <MaterialIcons name="person" color={colors.icon} size={22} />
            <TextInput
              ref={nameRef}
              value={name}
              onChangeText={text => setName(text)}
              onSubmitEditing={() => {}}
              keyboardType="default"
              placeholder="Ex.: Fulano Fulanoso"
              placeholderTextColor={colors.icon}
              style={[
                generalStyles.textInput,
                generalStyles.primaryLabel,
                {marginLeft: 8},
              ]}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
