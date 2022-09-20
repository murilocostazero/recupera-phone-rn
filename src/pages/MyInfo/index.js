import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {FlatButton, Header, SelectInstitution} from '../../components';
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
  agentToRegular,
} from '../../utils/firebase.utils';

export default function MyInfo(props) {
  const [user, setUser] = useState(null);
  const [isAgentAccount, setIsAgentAccount] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [name, setName] = useState('');
  const [previousName, setPreviousName] = useState('');
  const [job, setJob] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [loadingSaveInfo, setLoadingSaveInfo] = useState(false);
  const [loadingSaveName, setLoadingSaveName] = useState(false);

  const nameRef = useRef('nameRef');
  const jobRef = useRef('jobRef');

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const userResponse = await currentUser();
    setName(userResponse.displayName);
    setPreviousName(userResponse.displayName);
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

  async function saveInfo() {
    //Verificar se usuário já é agente
    if (isAgentAccount) {
      //Torná-lo agente
      if (isNaN(registrationNumber) || registrationNumber.length < 4) {
        props.handleSnackbar({
          type: 'warning',
          message: 'Matrícula precisa ser um número maior que 4',
        });
      } else if (job.length < 3) {
        props.handleSnackbar({
          type: 'warning',
          message: 'Função não pode ser menor que 3 caracteres',
        });
      } else if (!selectedInstitution) {
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
          //Pegar o usuário, montar ele todo e alterar
          //Precisa montar todo para poder montar a notificação - ALTERAR ISSO DEPOIS
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
    } else {
      //Torná-lo regular
      setLoadingSaveInfo(true);
      const agentToRegularResponse = await agentToRegular(user.email);
      setLoadingSaveInfo(false);
      if (!agentToRegularResponse) {
        props.handleSnackbar({
          type: 'error',
          message: 'Houve um problema ao mudar o tipo de conta.',
        });
      } else {
        getUser();
      }
    }
  }

  async function onChangingDisplayName() {
    setLoadingSaveName(true);
    const changeNameResponse = await changeDisplayName(name);
    setLoadingSaveName(false);
    if (!changeNameResponse.success) {
      props.handleSnackbar({
        type: 'error',
        message: changeNameResponse.message,
      });
    } else {
      props.handleSnackbar({
        type: 'success',
        message: changeNameResponse.message,
      });
      getUser();
    }
  }

  return (
    <View style={generalStyles.pageContainer}>
      <Header
        handleGoBackButtonPress={() => props.navigation.goBack()}
        pageTitle="Minhas informações"
        loadingPrimaryButton={loadingSaveInfo}
        handlePrimaryButtonPress={() => saveInfo()}
        primaryButtonLabel="PRONTO"
      />

      <ScrollView contentContainerStyle={{padding: 8, flex: 1}}>
        <View>
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
                editable={true}
                ref={nameRef}
                value={name}
                onChangeText={text => setName(text)}
                onSubmitEditing={() => onChangingDisplayName()}
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

          {loadingSaveName ? (
            <ActivityIndicator size="large" color={colors.secondary} />
          ) : name !== previousName ? (
            <FlatButton
              label="Salvar novo nome"
              height={48}
              labelColor="#FFF"
              buttonColor={colors.secondary}
              handleFlatButtonPress={() => onChangingDisplayName()}
              isLoading={false}
              style={{}}
            />
          ) : (
            <View />
          )}
        </View>
        {!user ? (
          <ActivityIndicator size="large" color={colors.secondary} />
        ) : user.userType != 'institution' ? (
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
        ) : (
          <View />
        )}
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
