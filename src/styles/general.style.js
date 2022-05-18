import {StyleSheet} from 'react-native';
import colors from './colors.style';

const generalStyles = StyleSheet.create({
  column: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 8,
  },
  row: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: colors.background,
  },
  headerContainer: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default generalStyles;
