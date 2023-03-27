import {StyleSheet} from 'react-native';
import colors from './colors.style';

const generalStyles = StyleSheet.create({
/* CONTAINERS */
  column: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: colors.background,
    padding: 8
  },
  headerContainer: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'center',
  },
 /* EFFECTS */
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  /* TEXT */
  titleDark: {
    fontFamily: 'JosefinSans-Bold',
    color: colors.text.dark,
    fontSize: 24,
    textAlign: 'center'
  },
  titleLight: {
    fontFamily: 'JosefinSans-Bold',
    color: colors.text.light,
    fontSize: 24,
    textAlign: 'center'
  },
  primaryLabel: {
    fontFamily: 'JosefinSans-Bold',
    color: colors.text.dark,
    fontSize: 16
  },
  primaryLightLabel: {
    fontFamily: 'JosefinSans-Bold',
    color: colors.text.light,
    fontSize: 16
  },
  secondaryLabel: {
    fontFamily: 'JosefinSans-Bold',
    color: colors.text.darkOpacity,
    fontSize: 14
  },
  secondaryOpacityLabel: {
    fontFamily: 'JosefinSans-Bold',
    color: colors.text.darkOpacity,
    opacity: 0.6,
    fontSize: 14
  },
  /* INPUTS */
  textInputContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderRadius: 20,
    height: 42
  },
  textInput: {
    padding: 0,
    flex: 1,
    fontFamily: 'JosefinSans-Bold',
    color: colors.text.dark,
    fontSize: 14
  },
  textButton: {
    fontFamily: 'JosefinSans-Bold',
    color: colors.secondary,
    fontSize: 12
  }
});

export default generalStyles;
