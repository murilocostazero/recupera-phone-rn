import React, {useState, useRef, useEffect} from 'react';
import {View, Text, ScrollView, Switch, TextInput, Alert} from 'react-native';
import {Header, SelectInstitution} from '../../components';
import colors from '../../styles/colors.style';
import generalStyles from '../../styles/general.style';
import styles from './styles.style';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  changeDisplayName,
  currentUser,
  getSingleInstitution,
  getUserFromCollections,
  requestUserTypeChange,
  foundUserByRegistrationNumberAndInstitution,
} from '../../utils/firebase.utils';

export default function MyInfo(props) {
  const [user, setUser] = useState(null);
  const [isAgentAccount, setIsAgentAccount] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [loadingSaveInfo, setLoadingSaveInfo] = useState(false);

  const nameRef = useRef('nameRef');
  const jobRef = useRef('jobRef');

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const userResponse = await currentUser();
    setName(userResponse.displayName);

    const userCollectionResponse = await getUserFromCollections(
      userResponse.email,
    );
    if (!userCollectionResponse.success) {
      props.handleSnackbar({
        type: 'error',
        message: 'Erro ao buscar usuário logado',
      });
    } else {
      setUser(userCollectionResponse.user._data);
      if (userCollectionResponse.user._data.agentInfo) {
        setIsAgentAccount(true);
        setJob(userCollectionResponse.user._data.agentInfo.job);
        setRegistrationNumber(
          userCollectionResponse.user._data.agentInfo.registrationNumber,
        );

        const institutionGot = await getSingleInstitution(
          userCollectionResponse.user._data.agentInfo.institution,
        );
        if (!institutionGot) {
          props.handleSnackbar({
            type: 'error',
            message: 'Instituição não encontrada',
          });
        } else {
          setSelectedInstitution(institutionGot);
        }
      }
    }
  }

  async function changeName() {
    Alert.alert('Ainda não!');
  }

  async function saveInfo() {
    if (name.length < 3) {
      props.handleSnackbar({
        type: 'warning',
        message: 'Nome não pode ter menos de 3 caracteres',
      });
    } else if (
      isAgentAccount &&
      (isNaN(registrationNumber) || registrationNumber.length < 4)
    ) {
      props.handleSnackbar({
        type: 'warning',
        message: 'Matrícula precisa ser um número maior que 4',
      });
    } else if (isAgentAccount && job.length < 3) {
      props.handleSnackbar({
        type: 'warning',
        message: 'Função não pode ser menor que 3 caracteres',
      });
    } else if (isAgentAccount && !selectedInstitution) {
      props.handleSnackbar({
        type: 'warning',
        message: 'Selecione uma instituição',
      });
    } else {
      setLoadingSaveInfo(true);
      //Verifica se já existe um usuário utilizando uma combinação de instituição e matricula
      const foundExistingUser =
        await foundUserByRegistrationNumberAndInstitution(
          registrationNumber,
          selectedInstitution.email,
        );
      if (foundExistingUser.success) {
        setLoadingSaveInfo(false);
        props.handleSnackbar({
          type: 'warning',
          message:
            'Já existe um usuário nessa instituição com a matrícula informada',
        });
      } else {
        //Primeiro alterar o nome
        const displayNameUpdateResponse = await changeDisplayName(name);
        if (!displayNameUpdateResponse.success) {
          props.handleSnackbar({
            type: 'error',
            message: 'Erro ao alterar o nome',
          });
          setLoadingSaveInfo(false);
        } else {
          //Pegar o usuário, montar ele todo e alterar
          const userToUpdate = {
            email: user.email,
            devices: user.devices,
            userType: 'agent',
            agentInfo: {
              isAgentAuthStatus: 'pending',
              registrationNumber: registrationNumber,
              job: job,
              institution: selectedInstitution.email,
            },
          };

          const userUpdateResponse = await requestUserTypeChange(userToUpdate);
          if (!userUpdateResponse.success) {
            props.handleSnackbar({
              type: 'error',
              message: 'Erro ao atualizar usuário',
            });
            setLoadingSaveInfo(false);
          } else {
            setLoadingSaveInfo(false);
            props.navigation.goBack();
          }
        }
      }
    }
  }

  return (
    <View style={generalStyles.pageContainer}>
      <Header
        handleGoBackButtonPress={() => props.navigation.goBack()}
        pageTitle="Minhas informações"
        loadingPrimaryButton={loadingSaveInfo}
        handlePrimaryButtonPress={() =>
          isAgentAccount ? saveInfo() : changeName()
        }
        primaryButtonLabel="PRONTO"
      />

      <ScrollView contentContainerStyle={{padding: 8, flex: 1}}>
        <View
          style={[
            generalStyles.textInputContainer,
            generalStyles.shadow,
            {marginTop: 32},
          ]}>
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
        <View style={[styles.optionContainer, {marginTop: 0}]}>
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
                    onSubmitEditing={() => jobRef.current.focus()}
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
              <View
                style={[
                  generalStyles.textInputContainer,
                  generalStyles.shadow,
                ]}>
                <Text style={generalStyles.secondaryLabel}>Função</Text>
                <View style={generalStyles.row}>
                  <MaterialIcons name="work" color={colors.icon} size={22} />
                  <TextInput
                    ref={jobRef}
                    value={job}
                    onChangeText={text => setJob(text)}
                    onSubmitEditing={() => {}}
                    placeholder="Ex.: P3, Escrivão, Auxiliar de P4..."
                    placeholderTextColor={colors.icon}
                    style={[
                      generalStyles.textInput,
                      generalStyles.primaryLabel,
                      {marginLeft: 8},
                    ]}
                  />
                </View>
              </View>

              <SelectInstitution
                selectedInstitution={selectedInstitution}
                selectInstitution={item => setSelectedInstitution(item)}
              />
            </View>
          )}
        </View>
        {!user || !user.agentInfo ? (
          <View />
        ) : (
          <Text
            style={[
              generalStyles.primaryLabel,
              {
                backgroundColor:
                  user.agentInfo.isAgentAuthStatus == 'pending'
                    ? colors.warning
                    : user.agentInfo.isAgentAuthStatus == 'denied'
                    ? colors.error
                    : colors.success,
                padding: 8,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              },
            ]}>
            Status da autorização:{' '}
            {user.agentInfo.isAgentAuthStatus == 'pending'
              ? 'Pendente'
              : user.agentInfo.isAgentAuthStatus == 'denied'
              ? 'Negado'
              : 'Ativo'}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
