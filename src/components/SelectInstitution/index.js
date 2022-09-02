import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  FlatList,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import styles from './styles.style';
import generalStyles from '../../styles/general.style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors.style';
import {getAllInstitutions} from '../../utils/firebase.utils';
import FlatButton from '../FlatButton';

export default function SelectInstitution(props) {
  const [showInstitutions, setShowInstitutions] = useState(false);
  const [institutionList, setInstitutionList] = useState([]);
  const [loadingInstitutionList, setLoadingInstitutionList] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getInstitutions();
  }, []);

  async function getInstitutions() {
    setLoadingInstitutionList(true);
    const institutionResponse = await getAllInstitutions();
    if (institutionResponse.length > 0) {
      setInstitutionList(institutionResponse);
    }
    setLoadingInstitutionList(false);
  }

  const EmptyInstitutionList = () => {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={generalStyles.secondaryLabel}>
          Lista de instituições vazia
        </Text>
        <MaterialIcons
          name="sentiment-dissatisfied"
          color={colors.icon}
          size={32}
        />
      </View>
    );
  };

  function selectInstitution(item) {
    setShowInstitutions(false);
    setQuery('');

    props.selectInstitution(item);
    setShowInstitutions(false);
  }

  const renderInstitutions = ({item}) => {
    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={() => selectInstitution(item)}
        style={styles.institutionItem}>
        <Text
          numberOfLines={1}
          style={[generalStyles.primaryLabel, {maxWidth: '90%'}]}>
          {item.name}
        </Text>
      </TouchableHighlight>
    );
  };

  const filteredInstitutions = query
    ? institutionList.filter(object =>
        object.name.toLowerCase().includes(query.toLowerCase()),
      )
    : institutionList;

  return (
    <View>
      {loadingInstitutionList ? (
        <ActivityIndicator size="large" color={colors.secondary} />
      ) : (
        <>
          <TouchableHighlight
            underlayColor={colors.secondaryOpacity}
            onPress={() => setShowInstitutions(!showInstitutions)}
            style={[generalStyles.shadow, styles.menuOptionContainer]}>
            <View
              style={[generalStyles.row, {justifyContent: 'space-between'}]}>
              <Text style={generalStyles.secondaryLabel}>
                {!props.selectedInstitution
                  ? 'Selecionar instituição'
                  : props.selectedInstitution.name}
              </Text>
              <MaterialIcons
                name={!showInstitutions ? 'arrow-drop-down' : 'arrow-drop-up'}
                size={28}
                color={colors.icon}
              />
            </View>
          </TouchableHighlight>
          <Modal
            animationType="slide"
            transparent={true}
            visible={showInstitutions}>
            <View style={generalStyles.pageContainer}>
              <View
                style={[generalStyles.row, styles.searchInstitutionContainer]}>
                <TextInput
                  placeholder="Filtre o nome do batalhão ou dp"
                  placeholderTextColor={colors.text.darkPlaceholder}
                  style={[styles.searchInput, generalStyles.secondaryLabel]}
                  onChangeText={text => setQuery(text)}
                  onSubmitEditing={() =>
                    selectInstitution(filteredInstitutions[0])
                  }
                />
                <MaterialIcons
                  name="filter-list"
                  color={colors.secondary}
                  size={28}
                />
              </View>
              <FlatList
                style={{
                  marginTop: 8,
                  display: showInstitutions ? 'flex' : 'none',
                }}
                data={filteredInstitutions}
                renderItem={renderInstitutions}
                keyExtractor={item => item.email}
                ListEmptyComponent={<EmptyInstitutionList />}
              />
              <FlatButton
                label="Cancelar"
                height={48}
                labelColor="#FFF"
                buttonColor={colors.error}
                handleFlatButtonPress={() => setShowInstitutions(false)}
                isLoading={false}
                style={{}}
              />
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

