import React from 'react';
import {TouchableHighlight} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import generalStyles from '../../styles/general.style';

//buttonSize={} buttonColor={} iconName='' iconSize={} haveShadow={false} iconColor={} handleCircleIconButtonPress={() => {}}

export default function CircleIconButton(props) {
  return (
    <TouchableHighlight
      underlayColor="transparent"
      onPress={() => props.handleCircleIconButtonPress()}
      style={[{
        backgroundColor: props.buttonColor,
        width: props.buttonSize,
        height: props.buttonSize,
        borderRadius: props.buttonSize / 2,
        alignItems: 'center',
        justifyContent: 'center',
      }, props.haveShadow ? generalStyles.shadow : {}]}>
      <MaterialIcon
        name={props.iconName}
        size={props.iconSize}
        color={props.iconColor}
      />
    </TouchableHighlight>
  );
}
