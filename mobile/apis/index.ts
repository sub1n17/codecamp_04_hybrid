import { useDeviceAuth } from './use-device-auth';
import { useDeviceLayout } from './use-device-layout';
import { useDeviceLocation } from './use-device-location';
import { useDeviceNotifications } from './use-device-notifications';
import { useDeviceRouting } from './use-device-routing';
import { useDeviceSystem } from './use-device-system';

export const useApis = (webviewRef) => {
    // 응답
    const onResponse = (result) => {
        webviewRef.current?.postMessage(JSON.stringify(result));
    };

    const APIS = {
        ...useDeviceSystem(onResponse),
        ...useDeviceLocation(onResponse),
        ...useDeviceNotifications(onResponse),
        ...useDeviceLayout(onResponse),
        ...useDeviceRouting(onResponse),
        ...useDeviceAuth(onResponse),
    };

    // 요청
    const onRequest = (query, variables) => {
        APIS[query](variables);
    };

    return { onResponse, onRequest, layout: APIS.layout };
};
