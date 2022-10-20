import React from 'react';
import { View, Text } from 'react-native';
import colors from '../../styles/colors.style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import generalStyles from '../../styles/general.style';

export default function SnackBar(props) {
  return (
    <View style={{
      backgroundColor: colors.secondary,
      paddingVertical: 8,
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Text style={[generalStyles.primaryLightLabel, { marginRight: 4, textAlign: 'justify' }]}>{props.snackbar.message}</Text>
      {
        props.snackbar.type == 'error' ?
          <MaterialIcons name='error' color='#FFF' size={28} /> :
          props.snackbar.type == 'warning' ?
            <MaterialIcons name='warning' color='#FFF' size={28} /> :
            <MaterialIcons name='check' color='#FFF' size={28} />
      }
    </View>
  )
}