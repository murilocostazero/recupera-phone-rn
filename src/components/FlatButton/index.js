import React from 'react';
import {TouchableHighlight, Text, ActivityIndicator} from 'react-native';
import colors from '../../styles/colors.style';
import generalStyles from '../../styles/general.style';

//label='' height={} labelColor={} buttonColor={} handleFlatButtonPress={() => } isLoading={} style={{}}

export default function FlatButton(props) {
  return (
    <TouchableHighlight
      underlayColor={colors.secondaryOpacity}
      onPress={() => (props.isLoading ? {} : props.handleFlatButtonPress())}
      style={[
        {
          backgroundColor: props.buttonColor
            ? props.buttonColor
            : colors.primary,
          height: !props.height ? 56 : props.height,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        },
        props.style,
      ]}>
      {props.isLoading ? (
        <ActivityIndicator
          color={props.labelColor ? props.labelColor : '#FFF'}
          size="large"
        />
      ) : (
        <Text
          style={[
            generalStyles.primaryLabel,
            {color: props.labelColor ? props.labelColor : '#FFF'},
          ]}>
          {props.label}
        </Text>
      )}
    </TouchableHighlight>
  );
}
