import React, {useState, useRef} from 'react';
import {View, Image, TextInput, Text, TouchableHighlight} from 'react-native';
import generalStyles from '../../styles/general.style';
import styles from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors.style';
import {CircleIconButton, FlatButton} from '../../components';
import {createUser, loginUser} from '../../utils/firebase.utils';

export default function Login(props) {
  /* STATES */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);
  const [haveAccount, setHaveAccount] = useState(false);
  const [loadingLoginForm, setLoadingLoginForm] = useState(false);

  /* REFS */
  const emailRef = useRef('emailRef');
  const passwordRef = useRef('passwordRef');

  async function onCreatingUser() {
    setLoadingLoginForm(true);
    let userCreated = await createUser(email, password, displayName);
    if (userCreated.success == false) {
      props.handleSnackbar({message: userCreated.message, type: 'warning'});
      setLoadingLoginForm(false);
    } else {
      setLoadingLoginForm(false);
      props.onAuthStateChanged(userCreated.user.user);
    }
  }

  async function onLoggin(){
    setLoadingLoginForm(true);
    let userLogin = await loginUser(email, password);
    if(userLogin.success == false){
      setLoadingLoginForm(false);
      props.handleSnackbar({message: userLogin.message, type: 'warning'});
    } else {
      setLoadingLoginForm(false);
      props.onAuthStateChanged(userLogin.response.user);
    }
  }

  return !haveAccount ? (
    <View style={[generalStyles.pageContainer, {justifyContent: 'center'}]}>
      <View
        style={{
          alignItems: 'stretch',
          justifyContent: 'center',
          padding: 8,
        }}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
          />
        </View>
        <View style={[generalStyles.textInputContainer, generalStyles.shadow]}>
          <Text style={generalStyles.secondaryLabel}>Email</Text>
          <View style={generalStyles.row}>
            <MaterialIcons name="email" color={colors.icon} size={22} />
            <TextInput
              value={email}
              onChangeText={text => setEmail(text)}
              onSubmitEditing={() => passwordRef.current.focus()}
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
        <View style={[generalStyles.textInputContainer, generalStyles.shadow]}>
          <Text style={generalStyles.secondaryLabel}>Senha</Text>
          <View style={generalStyles.row}>
            <MaterialIcons name="lock-open" color={colors.icon} size={22} />
            <TextInput
              ref={passwordRef}
              value={password}
              onChangeText={text => setPassword(text)}
              secureTextEntry={isSecureTextEntry}
              placeholder="senhasupersegura"
              placeholderTextColor={colors.icon}
              style={[
                generalStyles.textInput,
                generalStyles.primaryLabel,
                {marginLeft: 8},
              ]}
            />
            <CircleIconButton
              buttonSize={30}
              buttonColor="#FFF"
              iconName={isSecureTextEntry ? 'visibility' : 'visibility-off'}
              iconSize={26}
              iconColor={colors.icon}
              handleCircleIconButtonPress={() =>
                setIsSecureTextEntry(!isSecureTextEntry)
              }
            />
          </View>
        </View>

        <FlatButton label="Login" handleFlatButtonPress={() => onLoggin()} isLoading={loadingLoginForm} />

        <View
          style={[
            generalStyles.row,
            {marginTop: 32, justifyContent: 'center'},
          ]}>
          <Text style={generalStyles.primaryLabel}>Não tem conta?</Text>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => setHaveAccount(!haveAccount)}
            style={{marginLeft: 8}}>
            <Text style={[generalStyles.primaryLabel, {color: colors.link}]}>
              Cadastre-se
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  ) : (
    <View style={[generalStyles.pageContainer, {justifyContent: 'center'}]}>
      <View
        style={{
          alignItems: 'stretch',
          justifyContent: 'center',
          padding: 8,
        }}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
          />
        </View>
        <View style={[generalStyles.textInputContainer, generalStyles.shadow]}>
          <Text style={generalStyles.secondaryLabel}>Nome</Text>
          <View style={generalStyles.row}>
            <MaterialIcons name="person" color={colors.icon} size={22} />
            <TextInput
              value={displayName}
              onChangeText={text => setDisplayName(text)}
              onSubmitEditing={() => emailRef.current.focus()}
              keyboardType="default"
              placeholder="Fulano Fulanoso"
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
            <MaterialIcons name="email" color={colors.icon} size={22} />
            <TextInput
              value={email}
              ref={emailRef}
              onChangeText={text => setEmail(text)}
              onSubmitEditing={() => passwordRef.current.focus()}
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
        <View style={[generalStyles.textInputContainer, generalStyles.shadow]}>
          <Text style={generalStyles.secondaryLabel}>Senha</Text>
          <View style={generalStyles.row}>
            <MaterialIcons name="lock-open" color={colors.icon} size={22} />
            <TextInput
              ref={passwordRef}
              value={password}
              onChangeText={text => setPassword(text)}
              secureTextEntry={isSecureTextEntry}
              placeholder="senhasupersegura"
              placeholderTextColor={colors.icon}
              style={[
                generalStyles.textInput,
                generalStyles.primaryLabel,
                {marginLeft: 8},
              ]}
            />
            <CircleIconButton
              buttonSize={30}
              buttonColor="#FFF"
              iconName={isSecureTextEntry ? 'visibility' : 'visibility-off'}
              iconSize={26}
              iconColor={colors.icon}
              handleCircleIconButtonPress={() =>
                setIsSecureTextEntry(!isSecureTextEntry)
              }
            />
          </View>
        </View>

        <FlatButton
          label="Cadastrar"
          handleFlatButtonPress={() => onCreatingUser()}
          isLoading={loadingLoginForm}
        />

        <View
          style={[
            generalStyles.row,
            {marginTop: 32, justifyContent: 'center'},
          ]}>
          <Text style={generalStyles.primaryLabel}>Já tem conta?</Text>
          <Text
            onPress={() => setHaveAccount(!haveAccount)}
            style={[generalStyles.primaryLabel, {color: colors.link, marginLeft: 8}]}>
            Fazer login
          </Text>
        </View>
      </View>
    </View>
  );
}
