import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import colors from '../../styles/colors.style';
import generalStyles from '../../styles/general.style';
import CircleIconButton from '../CircleIconButton';

//handleGoBackButtonPress={() => {}} pageTitle='' loadingPrimaryButton={false} handlePrimaryButtonPress={() => {}} primaryButtonLabel=''

export default function Header(props) {
  return (
    <View
      style={[
        generalStyles.row,
        {justifyContent: 'space-between'},
      ]}>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
        {!props.loadingPrimaryButton ? (
          <CircleIconButton
            buttonSize={30}
            buttonColor={colors.background}
            iconName="arrow-back"
            iconSize={24}
            haveShadow={false}
            iconColor={colors.secondary}
            handleCircleIconButtonPress={() => props.handleGoBackButtonPress()}
            style={{}}
          />
        ) : (
          <Text style={[generalStyles.textButton, {flex: 1}]}>AGUARDE</Text>
        )}
      </View>
      <Text
        style={[generalStyles.primaryLabel, {flex: 1, textAlign: 'center'}]}>
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
