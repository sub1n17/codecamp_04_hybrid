import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export const useDeviceAuth = (onResponse) => {
    const [accessToken, setAccessToken] = useState(null);

    // accessToken 저장하기
    const updateDeviceAuthForAccessTokenSet = async (variables) => {
        setAccessToken(variables.accessToken);
        onResponse({
            updateDeviceAuthForAccessTokenSet: {
                message: 'accessToken 저장 완료',
            },
        });
        // onResponse({
        //     message: 'accessToken 저장 완료',
        // });
        // ㄴ> resolve 실행 안 돼서 에러남
        //  const query = Object.keys(response)[0]; // API 이름 => fetchDeviceSystemForAppSet ...
        //  const resolves = 요청한API[query]; // resolve01 ...
        //  resolves({ data: response });
        // => 쿼리로 감싸지 않으면 resolve 실행 안 됨
    };

    // refreshToken 저장하기
    const updateDeviceAuthForRefreshTokenSet = async (variables) => {
        await SecureStore.setItemAsync('refreshToken', variables.refreshToken);
        onResponse({
            updateDeviceAuthForRefreshTokenSet: {
                message: 'refreshToken 저장 완료',
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
