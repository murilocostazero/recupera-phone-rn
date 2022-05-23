import React, {useState, useRef} from 'react';
import { View, Image, TextInput, Text, TouchableHighlight } from 'react-native';
import generalStyles from '../../styles/general.style';
import styles from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors.style';
import {CircleIconButton, FlatButton} from '../../components';

export default function Login() {
  /* STATES */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [haveAccount, setHaveAccount] = useState(false);

  /* REFS */
  const emailRef = useRef('emailRef');
  const passwordRef = useRef('passwordRef');

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
              secureTextEntry={isPasswordVisible}
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
              iconName={isPasswordVisible ? 'visibility' : 'visibility-off'}
              iconSize={26}
              iconColor={colors.icon}
              handleCircleIconButtonPress={() =>
                setIsPasswordVisible(!isPasswordVisible)
              }
            />
          </View>
        </View>

        <FlatButton label="Login" />

        <View style={[generalStyles.row, {marginTop: 32, justifyContent: 'center'}]}>
              <Text style={generalStyles.primaryLabel}>Não tem conta?</Text>
              <TouchableHighlight underlayColor='transparent' onPress={() => setHaveAccount(!haveAccount)} style={{marginLeft: 8}}>
                <Text style={[generalStyles.primaryLabel, {color: colors.link}]}>Cadastre-se</Text>
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
          <Text style={generalStyles.secondaryLabel}>Email</Text>
          <View style={generalStyles.row}>
            <MaterialIcons name="email" color={colors.icon} size={22} />
            <TextInput
              value={email}
              onChangeText={text => setEmail(text)}
              onSubmitEditing={() => passwordRef.current.focus()}
              keyboardType="email-address"
              placeholder="fulanofulanoso@gmail.com"
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
              secureTextEntry={isPasswordVisible}
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
              iconName={isPasswordVisible ? 'visibility' : 'visibility-off'}
              iconSize={26}
              iconColor={colors.icon}
              handleCircleIconButtonPress={() =>
                setIsPasswordVisible(!isPasswordVisible)
              }
            />
          </View>
        </View>

        <FlatButton label="Cadastrar" />

        <View style={[generalStyles.row, {marginTop: 32, justifyContent: 'center'}]}>
              <Text style={generalStyles.primaryLabel}>Já tem conta?</Text>
              <TouchableHighlight underlayColor='transparent' onPress={() => setHaveAccount(!haveAccount)} style={{marginLeft: 8}}>
                <Text style={[generalStyles.primaryLabel, {color: colors.link}]}>Fazer login</Text>
              </TouchableHighlight>
        </View>
      </View>
    </View>
  )
}
