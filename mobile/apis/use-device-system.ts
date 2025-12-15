import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { AppState, Linking, Platform } from 'react-native';

const isAndroid = Platform.OS === 'android';
const isIos = Platform.OS === 'ios';

export const useDeviceSystem = (onResponse) => {
    // 앱 정보 조회하기
    const fetchDeviceSystemForAppSet = () => {
        onResponse({
            fetchDeviceSystemForAppSet: {
                appVersion:
                    (isAndroid && Constants.expoConfig?.android?.versionCode) ||
                    (isIos && Constants.expoConfig?.ios?.buildNumber),
            },
        });
    };

    // 디바이스 운영체제 정보 조회하기
    const fetchDeviceSystemForPlatformSet = () => {
        onResponse({
            fetchDeviceSystemForPlatformSet: {
                os: Platform.OS,
                osVersion: Device.osVersion,
                modelName: Device.modelName,
            },
        });
    };

    // 설정화면으로 이동하기
    const openDeviceSystemForSettingSet = async () => {
        await Linking.openSettings();
        onResponse({
            openDeviceSystemForSettingSet: {
                message: '요청 완료',
            },
        });
    };

    // 앱 상태 조회하기 (포그라운드/백그라운드)
    const fetchDeviceSystemForAppStateSet = () => {
        const isForeground = AppState.currentState === 'active';
        onResponse({
            fetchDeviceSystemForAppStateSet: {
                isForeground,
            },
        });
    };
    return {
        fetchDeviceSystemForAppSet,
        fetchDeviceSystemForPlatformSet,
        openDeviceSystemForSettingSet,
        fetchDeviceSystemForAppStateSet,
    };
};
