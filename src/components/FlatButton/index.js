import React from 'react';
import {TouchableHighlight, Text} from 'react-native';
import colors from '../../styles/colors.style';
import generalStyles from '../../styles/general.style';

//label='' labelColor={} buttonColor={} handleFlatButtonPress={() => }

export default function FlatButton(props) {
  return (
    <TouchableHighlight
      underlayColor="transparent"
      onPress={() => props.handleFlatButtonPress()}
      style={{
        backgroundColor: props.buttonColor ? props.buttonColor : colors.primary,
        height: 56,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Text
        style={[
          generalStyles.primaryLabel,
          {color: props.labelColor ? props.labelColor : '#FFF'},
        ]}>
        { props.label }
      </Text>
    </TouchableHighlight>
  );
}
