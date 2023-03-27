import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableHighlight, TextInput } from 'react-native';
import { Header, EmptyList, CircleIconButton } from '../../components';
import generalStyles from '../../styles/general.style';
import { currentUser, getUserFromCollections } from '../../utils/firebase.utils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors.style';
import styles from './styles';

export default function Agents(props) {
    const [agents, setAgents] = useState([]);
    const [query, setQuery] = useState('');

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

    const renderAgents = ({ item }) => {
        return (
            <TouchableHighlight style={[styles.card, generalStyles.shadow]}>
                <Text style={generalStyles.primaryLabel}>{item}</Text>
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