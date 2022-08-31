import {StyleSheet} from 'react-native';
import colors from '../../styles/colors.style';

const styles = StyleSheet.create({
  containerCard: {
    padding: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  profilePictureContainer: {
    width: 224,
    height: 224,
    borderRadius: 224 / 2,
    backgroundColor: colors.icon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicture: {
    width: 224,
    height: 224,
    borderRadius: 224 / 2,
    resizeMode: 'cover',
  },
  menuOptionContainer: {
    backgroundColor: '#FAFAFA',
    padding: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default styles;
