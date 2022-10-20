import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { FlatButton, Header } from '../../components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import generalStyles from '../../styles/general.style';
import colors from '../../styles/colors.style';
import auth from '@react-native-firebase/auth';

export default function RecoverPassword(props) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  async function resetPassword() {
    setSending(true);

    await auth()
      .sendPasswordResetEmail(email)
      .then((success) => {
        setEmail('');
        props.handleSnackbar({
          type: 'success',
          message:
            'Enviamos um email para a recuperação da sua senha. Verifique sua caixa de entrada ou sua caixa de spam.',
        });
      })
      .catch((error) => {
        props.handleSnackbar({
          type: 'error',
          message:
            'Não foi possível enviar um email de recuperação. Verifique se este email está vinculado a uma conta ou se você está conectado à internet.',
        });
      });

    setSending(false);
  }

  return (
    <View style={generalStyles.pageContainer}>
      <Header
        handleGoBackButtonPress={() => props.navigation.goBack()}
        pageTitle=""
        loadingPrimaryButton={false}
        handlePrimaryButtonPress={() => { }}
        primaryButtonLabel=""
      />

      <ScrollView style={{ marginTop: 32 }}>
        <Text style={generalStyles.titleDark}>Esqueci minha senha</Text>
        <Text style={[generalStyles.primaryLabel, { marginVertical: 16 }]}>
          Informe o seu email cadastrado no Alerta Smart e nós te enviaremos um
          email com instruções para recuperar a sua senha.
        </Text>
        <View style={[generalStyles.textInputContainer, generalStyles.shadow]}>
          <Text style={generalStyles.secondaryLabel}>Email</Text>
          <View style={generalStyles.row}>
            <MaterialIcons name="email" color={colors.icon} size={22} />
            <TextInput
              value={email}
              onChangeText={text => setEmail(text)}
              onSubmitEditing={() => resetPassword()}
              keyboardType="email-address"
              placeholder="fulanofulanoso@gmail.com"
              autoCapitalize="none"
              placeholderTextColor={colors.icon}
              style={[
                generalStyles.textInput,
                generalStyles.primaryLabel,
                { marginLeft: 8 },
              ]}
            />
          </View>
        </View>
        <FlatButton
          label="Enviar"
          height={48}
          labelColor="#FFF"
          buttonColor={colors.primary}
          handleFlatButtonPress={() => resetPassword()}
          isLoading={sending}
          style={{}}
        />
      </ScrollView>
    </View>
  );
}
