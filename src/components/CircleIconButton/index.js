import React from 'react';
import {TouchableHighlight} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

//buttonSize={} buttonColor={} iconName='' iconSize={} iconColor={} handleCircleIconButtonPress={() => }

export default function CircleIconButton(props) {
  return (
    <TouchableHighlight
      underlayColor="transparent"
      onPress={() => props.handleCircleIconButtonPress()}
      style={{
        backgroundColor: props.buttonColor,
        width: props.buttonSize,
        height: props.buttonSize,
        borderRadius: props.buttonSize / 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <MaterialIcon
        name={props.iconName}
        size={props.iconSize}
        color={props.iconColor}
      />
    </TouchableHighlight>
  );
}
