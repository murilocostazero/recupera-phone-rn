import React, {useState, useRef} from 'react';
import {View, Text, ScrollView, TextInput, Switch} from 'react-native';
import {Header} from '../../components';
import colors from '../../styles/colors.style';
import generalStyles from '../../styles/general.style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {institutionalSingupFieldsVerification} from '../../utils/fieldsVerification.utils';
import { createInstitution } from '../../utils/firebase.utils';

export default function InstitutionalSingup(props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isWhatsapp, setIsWhatsapp] = useState(false);
  const [onLoadingSingup, setOnLoadingSingup] = useState(false);

  const nameRef = useRef('nameRef');
  const emailRef = useRef('emailRef');
  const passwordRef = useRef('passwordRef');
  const addressRef = useRef('addressRef');
  const phoneRef = useRef('phoneRef');

  async function onSingup() {
    setOnLoadingSingup(true);
    const fieldsResponse = institutionalSingupFieldsVerification(
      name,
      email,
      password,
      address,
      phone,
    );
    if (!fieldsResponse.success) {
      props.handleSnackbar({type: 'warning', message: fieldsResponse.message});
      setOnLoadingSingup(false);
    } else {
      const intitutionSingupResponse = await createInstitution({name: name, email: email, password: password, address: address, phone: {number: phone, isWhatsapp: isWhatsapp}})
      if(!intitutionSingupResponse.success){
        props.handleSnackbar({type: 'error', message: intitutionSingupResponse.message});
        setOnLoadingSingup(false);
      } else {
        setOnLoadingSingup(false);
        props.onAuthStateChanged(intitutionSingupResponse.user.user);
      }
    }
  }

  return (
    <View style={generalStyles.pageContainer}>
      <Header
        handleGoBackButtonPress={() => props.navigation.goBack()}
        pageTitle="Cadastro institucional"
        loadingPrimaryButton={onLoadingSingup}
        handlePrimaryButtonPress={() => onSingup()}
        primaryButtonLabel="CADASTRAR"
      />
      <ScrollView contentContainerStyle={{padding: 8}}>
        <View
          style={[
            generalStyles.textInputContainer,
            generalStyles.shadow,
            {marginTop: 8},
          ]}>
          <Text style={generalStyles.secondaryLabel}>Instituição</Text>
          <View style={generalStyles.row}>
            <MaterialIcons name="apartment" color={colors.icon} size={22} />
            <TextInput
              value={name}
              onChangeText={text => setName(text)}
              onSubmitEditing={() => emailRef.current.focus()}
              keyboardType="default"
              placeholder="Ex.: 33º Batalhão, 21ª DP..."
              autoCapitalize="words"
              placeholderTextColor={colors.icon}
              style={[
                generalStyles.textInput,
                generalStyles.primaryLabel,
                {marginLeft: 8},
              ]}
            />
          </View>
        </View>
        <View style={[generalStyles.textInputContainer, generalStyles.shadow]}>
          <Text style={generalStyles.secondaryLabel}>Email</Text>
          <View style={generalStyles.row}>
            <MaterialIcons name="mail" color={colors.icon} size={22} />
            <TextInput
              value={email}
              ref={emailRef}
              onChangeText={text => setEmail(text)}
              onSubmitEditing={() => passwordRef.current.focus()}
              keyboardType="email-address"
              placeholder="Ex.: batalhao33@gmail.com"
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
        <View style={[generalStyles.textInputContainer, generalStyles.shadow]}>
          <Text style={generalStyles.secondaryLabel}>Senha</Text>
          <View style={generalStyles.row}>
            <MaterialIcons name="lock" color={colors.icon} size={22} />
            <TextInput
              value={password}
              ref={passwordRef}
              onChangeText={text => setPassword(text)}
              onSubmitEditing={() => addressRef.current.focus()}
              secureTextEntry={isSecureTextEntry}
              placeholder="Ex.: senhasupersegura"
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
        <View style={[generalStyles.textInputContainer, generalStyles.shadow]}>
          <Text style={generalStyles.secondaryLabel}>Endereço</Text>
          <View style={generalStyles.row}>
            <MaterialIcons name="pin-drop" color={colors.icon} size={22} />
            <TextInput
              value={address}
              ref={addressRef}
              onChangeText={text => setAddress(text)}
              onSubmitEditing={() => phoneRef.current.focus()}
              placeholder="Ex.: Rua 2, número 118, Centro, Colinas-Ma"
              autoCapitalize="words"
              placeholderTextColor={colors.icon}
              style={[
                generalStyles.textInput,
                generalStyles.primaryLabel,
                {marginLeft: 8},
              ]}
            />
          </View>
        </View>
        <View style={[generalStyles.textInputContainer, generalStyles.shadow]}>
          <View style={[generalStyles.row, {justifyContent: 'space-between'}]}>
            <Text style={generalStyles.secondaryLabel}>Telefone</Text>
            <View style={generalStyles.row}>
              <Text style={generalStyles.secondaryLabel}>É Whatsapp</Text>
              <Switch
                trackColor={{false: '#767577', true: colors.secondaryOpacity}}
                thumbColor={isWhatsapp ? colors.secondary : '#f4f3f4'}
                onValueChange={() => setIsWhatsapp(!isWhatsapp)}
                value={isWhatsapp}
              />
            </View>
          </View>
          <View style={generalStyles.row}>
            <MaterialIcons name="call" color={colors.icon} size={22} />
            <TextInput
              value={phone}
              ref={phoneRef}
              onChangeText={text => setPhone(text)}
              onSubmitEditing={() => onSingup()}
              placeholder="Ex.: (99)90000-0000"
              keyboardType="phone-pad"
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
