import React from 'react';
import {TouchableHighlight, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors.style';
import generalStyles from '../../styles/general.style';

//buttonSize={0} buttonColor={0} iconName='' iconSize={0} haveShadow={false} iconColor={0} handleCircleIconButtonPress={() => {}}

export default function CircleIconButton(props) {
  return (
    <TouchableHighlight
      underlayColor="transparent"
      onPress={() => props.handleCircleIconButtonPress()}
      style={[
        {
          backgroundColor: props.buttonColor,
          width: props.buttonSize,
          height: props.buttonSize,
          borderRadius: props.buttonSize / 2,
          alignItems: 'center',
          justifyContent: 'center',
        },
        props.haveShadow ? generalStyles.shadow : {},
        props.style,
      ]}>
      <View>
        <MaterialIcon
          name={props.iconName}
          size={props.iconSize}
          color={props.iconColor}
        />
        {props.isNotificationsButton ? (
          <View
            style={{
              backgroundColor: colors.secondary,
              width: 10,
              height: 10,
              borderRadius: 10,
              position: 'absolute',
              right: -4,
              top: -2,
            }}
          />
        ) : (
          <View />
        )}
      </View>
    </TouchableHighlight>
  );
}
