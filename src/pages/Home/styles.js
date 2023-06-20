import { StyleSheet } from 'react-native';
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
    // width: 150,
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 16,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginRight: 10
  },
  deviceItem: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 4,
    alignItems: 'center'
  },
  container: {
    // ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default styles;
