import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import colors from '../../styles/colors.style';
import generalStyles from '../../styles/general.style';

//handleGoBackButtonPress={() => {}} pageTitle='' loadingPrimaryButton={false} handlePrimaryButtonPress={() => {}} primaryButtonLabel=''

export default function Header(props) {
  return (
    <View style={[generalStyles.row, {justifyContent: 'space-between'}]}>
      <Text
        style={[generalStyles.textButton, {flex: 1}]}
        onPress={() => props.handleGoBackButtonPress()}>
        VOLTAR
      </Text>
      <Text style={[generalStyles.primaryLabel, {flex: 1, textAlign: 'center'}]}>
        {props.pageTitle}
      </Text>
      <View style={{flex: 1, alignItems: 'flex-end'}}>
        {props.loadingPrimaryButton ? (
          <ActivityIndicator size="large" color={colors.secondary} />
        ) : (
          <Text
            style={generalStyles.textButton}
            onPress={() => props.handlePrimaryButtonPress()}>
            {props.primaryButtonLabel}
          </Text>
        )}
      </View>
    </View>
  );
}
