import {StyleSheet} from 'react-native';
import colors from '../../styles/colors.style';

const styles = StyleSheet.create({
  logoContainer: {
    // backgroundColor: colors.primary,
    width: 124,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 32
  },
  logo: {
    width: 60,
    height: 60,
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
