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

export async function removeSetting(){
    let removeSettingResponse = null;
    try {
        const jsonValue = await AsyncStorage.removeItem('settingData');
        removeSettingResponse = {success: true, data: jsonValue != null ? JSON.parse(jsonValue) : null};
    } catch (e) {
        removeSettingResponse = {success: false, message: e};
    }
    return removeSettingResponse;
}

export async function saveDeviceInfo(deviceData) {
    let saveDeviceInfoResponse = null;

    try {
        const jsonValue = JSON.stringify(deviceData);
        await AsyncStorage.setItem('deviceSaved', jsonValue);
        saveDeviceInfoResponse = { success: true };
    } catch (e) {
        saveDeviceInfoResponse = { success: false, message: e };
    }

    return saveDeviceInfoResponse;
}

export async function getSavedDevice() {
    let saveDeviceInfoResponse = null;
    try {
        const jsonValue = await AsyncStorage.getItem('deviceSaved');
        saveDeviceInfoResponse = {success: true, data: jsonValue != null ? JSON.parse(jsonValue) : null};
    } catch (e) {
        saveDeviceInfoResponse = {success: false, message: e};
    }
    return saveDeviceInfoResponse;
}

export async function removeDevice(){
    let removeDeviceResponse = null;
    try {
        const jsonValue = await AsyncStorage.removeItem('deviceSaved');
        removeDeviceResponse = {success: true, data: jsonValue != null ? JSON.parse(jsonValue) : null};
    } catch (e) {
        removeDeviceResponse = {success: false, message: e};
    }
    return removeDeviceResponse;
}