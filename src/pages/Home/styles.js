import {StyleSheet} from 'react-native';
import colors from '../../styles/colors.style';

const styles = StyleSheet.create({
  profilePictureContainer: {
    backgroundColor: colors.icon,
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    borderRadius: 16,
    padding: 8,
    marginTop: 32
  },
  deviceContainer: {
    width: 130,
    height: 200,
    backgroundColor: colors.background,
    borderRadius: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10,
    padding: 8
  }
});

export default styles;
