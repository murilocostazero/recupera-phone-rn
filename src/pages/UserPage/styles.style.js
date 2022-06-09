import {StyleSheet} from 'react-native';
import colors from '../../styles/colors.style';

const styles = StyleSheet.create({
    containerCard: {
    padding: 8,
    marginTop: 16,
    alignItems: 'center'
  },
  profilePictureContainer: {
    width: 112,
    height: 112,
    borderRadius: 112 / 2,
    backgroundColor: colors.icon,
    alignItems: 'center',
    justifyContent: 'center'
  },
  profilePicture: {
    width: 112,
    height: 112,
    borderRadius: 112 / 2,
    resizeMode: 'cover',
  },
});

export default styles;
