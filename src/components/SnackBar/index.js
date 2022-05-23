import React from 'react';
import { View, Text } from 'react-native';
import colors from '../../styles/colors.style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import generalStyles from '../../styles/general.style';

export default function SnackBar(props) {
  return (
    <View style={{
        backgroundColor: colors.secondary,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
      <Text style={[generalStyles.primaryLightLabel, {marginRight: 8}]}>{props.snackbar.message}</Text>
      {
          props.snackbar.type == 'error' ?
          <MaterialIcons name='error' color='#FFF' size={32} /> :
          props.snackbar.type == 'warning' ?
          <MaterialIcons name='warning' color='#FFF' size={32} /> :
          <MaterialIcons name='success' color='#FFF' size={32} />
      }
    </View>
  )
}