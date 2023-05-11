import React from 'react';
import colors from "../../styles/colors.style";
import generalStyles from "../../styles/general.style";
import {View, Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function EmptyList(){
    return (
        <View style={[generalStyles.row, { paddingVertical: 8 }]}>
            <View
                style={[
                    {
                        borderWidth: 1,
                        borderColor: colors.secondary,
                        borderStyle: 'dashed',
                        alignItems: 'center',
                        padding: 8,
                        backgroundColor: colors.background,
                        borderRadius: 16,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginRight: 10
                    },
                ]}>
                <Text style={[generalStyles.secondaryLabel, { textAlign: 'center' }]}>
                    Lista vazia
                </Text>
                <MaterialIcons
                    name="sentiment-dissatisfied"
                    color={colors.icon}
                    size={32}
                />
            </View>
        </View>
    );
};