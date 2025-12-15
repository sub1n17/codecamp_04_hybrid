import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export const useDeviceAuth = (onResponse) => {
    const [accessToken, setAccessToken] = useState(null);

    // accessToken 저장하기
    const updateDeviceAuthForAccessTokenSet = (variables) => {
        setAccessToken(variables.accessToken);
        onResponse({
            message: '등록 완료',
        });
    };

    // refreshToken 저장하기
    const updateDeviceAuthForRefreshTokenSet = async (variables) => {
        await SecureStore.setItemAsync('refreshToken', variables.refreshToken);
        onResponse({
            updateDeviceAuthForRefreshTokenSet: {
                message: ' 저장 완료',
            },
        });
    };

    // accessToken 삭제하기
    const deleteDeviceAuthForAccessTokenSet = () => {
        setAccessToken(null);
        onResponse({
            deleteDeviceAuthForAccessTokenSet: {
                message: '삭제 완료',
            },
        });
    };

    // refreshToken 삭제하기
    const deleteDeviceAuthForRefreshTokenSet = async () => {
        await SecureStore.deleteItemAsync('refreshToken');
        onResponse({
            deleteDeviceAuthForRefreshTokenSet: {
                message: '삭제 완료',
            },
        });
    };

    // accessToken 조회하기
    const fetchDeviceAuthForAccessTokenSet = () => {
        onResponse({
            fetchDeviceAuthForAccessTokenSet: {
                accessToken: accessToken,
            },
        });
    };

    // refreshToken 조회하기
    const fetchDeviceAuthForRefreshTokenSet = async () => {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        onResponse({
            fetchDeviceAuthForRefreshTokenSet: {
                refreshToken: refreshToken,
            },
        });
    };

    return {
        updateDeviceAuthForAccessTokenSet,
        updateDeviceAuthForRefreshTokenSet,
        deleteDeviceAuthForAccessTokenSet,
        deleteDeviceAuthForRefreshTokenSet,
        fetchDeviceAuthForRefreshTokenSet,
        fetchDeviceAuthForAccessTokenSet,
    };
};
