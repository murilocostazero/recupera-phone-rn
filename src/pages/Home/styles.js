import {StyleSheet} from 'react-native';
import colors from '../../styles/colors.style';

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: '#FFF',
    margin: 8,
    padding: 8,
    borderRadius: 16,
  },
  floatingMenuContainer: {
    backgroundColor: '#FFF',
    position: 'absolute',
    right: 20,
    top: 20,
    width: 124,
    borderRadius: 16,
    padding: 8,
    alignItems: 'center'
  },
});

export default styles;
