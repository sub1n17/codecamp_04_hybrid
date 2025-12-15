'use client';
import { useDeviceSetting } from '@/src/commons/settings/device-setting/hook';
import { Toggle } from '../../commons/toggle';
import { useState } from 'react';

export default function MyPage() {
    const { fetchApp } = useDeviceSetting();

    const [permissions, setPermissions] = useState({
        location: false,
        notification: false,
    });

    // 위치 권한 토글
    const onClickLocation = async () => {
        await fetchApp({ query: 'openDeviceSystemForSettingSet' });

        const interval = setInterval(async () => {
            // 앱 상태 감지 요청
            const appStatus = await fetchApp({ query: 'fetchDeviceSystemForAppStateSet' });

            // 앱 상태가 포그라운드일 때 실행
            const isForeground = appStatus.data.fetchDeviceSystemForAppStateSet.isForeground;
            if (!isForeground) return;

            // 위치 권한 조회
            const permission = await fetchApp({ query: 'fetchDeviceLocationForPermissionSet' });
            const permissionStatus = permission.data.fetchDeviceLocationForPermissionSet.status;

            if (permissionStatus === 'granted') {
                // 위치 권한 허용일 때 실행
                setPermissions((prev) => ({
                    ...prev,
                    location: true,
                }));
            } else {
                // 위치 권한 거부일 때 실행
                setPermissions((prev) => ({
                    ...prev,
                    location: false,
                }));
            }
            clearInterval(interval);
        }, 1000);
    };

    // 알림 권한 토글
    const onClickNotification = async () => {
        await fetchApp({ query: 'openDeviceSystemForSettingSet' });

        const interval = setInterval(async () => {
            // 앱 상태 감지 요청
            const appStatus = await fetchApp({ query: 'fetchDeviceSystemForAppStateSet' });

            // 앱 상태가 포그라운드일 때 실행
            const isForeground = appStatus.data.fetchDeviceSystemForAppStateSet.isForeground;
            if (!isForeground) return;

            // 알림 권한 조회
            const permission = await fetchApp({ query: 'fetchDeviceNotificationForPermissionSet' });
            const permissionStatus = permission.data.fetchDeviceNotificationForPermissionSet.status;

            if (permissionStatus === 'granted') {
                // 알림 권한 허용일 때 실행
                setPermissions((prev) => ({
                    ...prev,
                    notification: true,
                }));
            } else {
                // 알림 권한 거부일 때 실행
                setPermissions((prev) => ({
                    ...prev,
                    notification: false,
                }));
            }
            clearInterval(interval);
        }, 1000);
    };

    return (
        <>
            <Toggle
                title={'위치 권한'}
                onClick={onClickLocation}
                permissions={permissions.location}
                id="location-toggle"
            ></Toggle>
            <Toggle
                title={'알림 권한'}
                onClick={onClickNotification}
                permissions={permissions.notification}
                id="notification-toggle"
            ></Toggle>
        </>
    );
}
