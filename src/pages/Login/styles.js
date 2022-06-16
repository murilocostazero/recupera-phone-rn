import {StyleSheet} from 'react-native';
import colors from '../../styles/colors.style';

const styles = StyleSheet.create({
  logoContainer: {
    // backgroundColor: colors.primary,
    width: 124,
    height: 124,
    borderRadius: 124 / 2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32
  },
  logo: {
    width: 100,
    height: 100,
  },
  orContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  orLine: {
    height: 2,
    flex: 1,
    backgroundColor: colors.text.darkPlaceholder
  },
  institutionalLabel: {
    textAlign: 'center',
  }
});

export default styles;
