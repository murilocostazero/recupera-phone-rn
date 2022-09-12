import {StyleSheet} from 'react-native';
import colors from '../../styles/colors.style';

const styles = StyleSheet.create({
  deviceNotFoundContainer: {
    alignItems: 'center',
  },
  deviceFoundContainer: {
    flex: 1
  },
  deviceInfoContainer: {
    padding: 8,
    marginTop: 16,
  },
  alertContainer: {
    padding: 8,
    borderRadius: 16,
  },
  alertMessage: {
    maxWidth: '86%',
    fontFamily: 'JosefinSans-Medium',
    color: '#FFF',
    fontSize: 16,
    marginLeft: 8,
  },
  lightLabel: {
    color: '#FFF',
    fontFamily: 'JosefinSans-Bold',
    fontSize: 16,
    marginLeft: 8,
  },
  darkLabel: {
    color: colors.text.dark,
    fontFamily: 'JosefinSans-Bold',
    fontSize: 14,
  },
  favoriteButton: {
    marginTop: 16,
    paddingVertical: 2,
    paddingHorizontal: 12,
    alignSelf: 'center',
    borderRadius: 16
  }
});

export default styles;
