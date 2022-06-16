import { StyleSheet } from 'react-native';
import colors from '../../styles/colors.style';

const styles = StyleSheet.create({
    menuOptionContainer: {
        backgroundColor: '#FFF',
        padding: 8,
        borderRadius: 16
    },
    emptyListContainer: {
        backgroundColor: '#FFF',
        padding: 8,
        borderRadius: 16,
        alignItems: 'center'
    },
    institutionItem: {
        backgroundColor: '#FFF',
        marginRight: 8,
        padding: 4,
        borderRadius: 16
    },
    searchInstitutionContainer: {
        borderBottomColor: colors.secondaryOpacity,
        borderBottomWidth: 0.6,
        marginBottom: 8
    },
    searchInput: {
        flex: 1
    }
});

export default styles;