import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeSetting(settingData) {
    let storeSettingResponse = null;

    try {
        const jsonValue = JSON.stringify(settingData);
        await AsyncStorage.setItem('settingData', jsonValue);
        storeSettingResponse = { success: true };
    } catch (e) {
        storeSettingResponse = { success: false, message: e };
    }

    return storeSettingResponse;
}

export async function getSetting() {
    let storeSettingResponse = null;
    try {
        const jsonValue = await AsyncStorage.getItem('settingData');
        storeSettingResponse = {success: true, data: jsonValue != null ? JSON.parse(jsonValue) : null};
    } catch (e) {
        storeSettingResponse = {success: false, message: e};
    }
    return storeSettingResponse;
}