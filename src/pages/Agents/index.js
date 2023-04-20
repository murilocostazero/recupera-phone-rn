import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableHighlight, TextInput, TouchableWithoutFeedback, Alert } from 'react-native';
import { Header, EmptyList, CircleIconButton } from '../../components';
import generalStyles from '../../styles/general.style';
import { currentUser, getUserFromCollections, removeAgentFromInstitution } from '../../utils/firebase.utils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors.style';
import styles from './styles';

export default function Agents(props) {
    const [agents, setAgents] = useState([]);
    const [query, setQuery] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [showDetailsMap, setShowDetailsMap] = useState({});

    useEffect(() => {
        getAgents();
    }, []);

    async function getAgents() {
        const localUser = currentUser();
        const institutionResponse = await getUserFromCollections(localUser.email);
        if (!institutionResponse.success) {
            props.handleSnackbar({ type: 'error', message: 'Erro ao buscar instituição' });
        } else {
            setAgents(institutionResponse.user._data.agents);
        }
    }

    const filteredAgents = query
        ? agents.filter(object =>
            object.toLowerCase().includes(query.toLowerCase()),
        )
        : agents;

    async function removeAgent(agent) {
        const removeAgentResponse = await removeAgentFromInstitution(agent);
        if(!removeAgentResponse.success){
            props.handleSnackbar({type: 'error', message: removeAgentResponse.message});
        } else {
            props.handleSnackbar({type: 'success', message: removeAgentResponse.message});
            getAgents();
        }
    }

    function onRemovingAgent(agent) {
        console.log('Agent', agent);
        Alert.alert('Deseja remover este agente?', 'Ao confirmar, o agente será removido da sua base e voltará a ter os privilégios de um usuário regular.', [
            {
                text: 'Sim',
                onPress: () => removeAgent(agent)
            },
            { text: 'NÃO', onPress: () => console.log('Cancel pressed') },
        ]);
    }

    const renderAgents = ({ item }) => {
        const showDetails = showDetailsMap[item] || false;
        return (
            <TouchableHighlight underlayColor={colors.secondaryOpacity} style={[styles.card, generalStyles.shadow]}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={[generalStyles.primaryLabel, { flex: 1 }]}>{item}</Text>
                    <CircleIconButton buttonSize={26} buttonColor='transparent' iconName='delete' iconSize={22} haveShadow={false} iconColor={colors.primary} handleCircleIconButtonPress={() => onRemovingAgent(item)} />
                </View>
            </TouchableHighlight>
        );
    }

    return (
        <View style={generalStyles.pageContainer}>
            <Header
                handleGoBackButtonPress={() => props.navigation.goBack()}
                pageTitle='Agentes'
                loadingPrimaryButton={false}
                handlePrimaryButtonPress={() => { }}
                primaryButtonLabel='' />

            <View style={[generalStyles.textInputContainer, generalStyles.shadow, { marginTop: 16 }]}>
                <View style={generalStyles.row}>
                    <TextInput
                        value={query}
                        onChangeText={(text) => setQuery(text)}
                        placeholder="Filtre a sua busca"
                        placeholderTextColor={colors.text.darkPlaceholder}
                        style={[generalStyles.textInput]}
                    />
                    {
                        !query ?
                            <MaterialIcons name='search' size={22} color={colors.icon} /> :
                            <CircleIconButton
                                buttonSize={24}
                                buttonColor='transparent'
                                iconName='close'
                                iconSize={22}
                                haveShadow={false}
                                iconColor={colors.secondaryOpacity}
                                handleCircleIconButtonPress={() => setQuery('')} />
                    }
                </View>
            </View>
            <FlatList
                contentContainerStyle={{ padding: 4 }}
                data={filteredAgents}
                renderItem={renderAgents}
                keyExtractor={item => item}
                ListEmptyComponent={<EmptyList />}
            />
        </View>
    )
}