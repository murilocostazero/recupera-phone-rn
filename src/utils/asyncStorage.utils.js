import AsyncStorage from '@react-native-async-storage/async-storage';

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
        saveDeviceInfoResponse = {success: jsonValue != null ? true : false, data: jsonValue != null ? JSON.parse(jsonValue) : null};
    } catch (e) {
        saveDeviceInfoResponse = {success: false, message: e};
    }
    return saveDeviceInfoResponse;
}

export async function removeSavedDevice(){
    let removeDeviceResponse = null;
    try {
        const jsonValue = await AsyncStorage.removeItem('deviceSaved');
        removeDeviceResponse = {success: true, data: jsonValue != null ? JSON.parse(jsonValue) : null};
    } catch (e) {
        removeDeviceResponse = {success: false, message: e};
    }
    return removeDeviceResponse;
}

export async function storeCoords(coords) {
    let storeCoordsResponse = null;

    try {
        const jsonValue = JSON.stringify(coords);
        await AsyncStorage.setItem('coords', jsonValue);
        storeCoordsResponse = { success: true };
    } catch (e) {
        storeCoordsResponse = { success: false, message: e };
    }

    return storeCoordsResponse;
}

export async function getCoords() {
    let getCoordsResponse = null;
    try {
        const jsonValue = await AsyncStorage.getItem('coords');
        getCoordsResponse = {success: true, data: jsonValue != null ? JSON.parse(jsonValue) : null};
    } catch (e) {
        getCoordsResponse = {success: false, message: e};
    }
    return getCoordsResponse;
}