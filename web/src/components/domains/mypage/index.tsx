'use client';

export const dynamic = 'force-dynamic';

import style from './styles.module.css';
import { useDeviceSetting } from '@/src/commons/settings/device-setting/hook';
import { Toggle } from '../../commons/toggle';
import { useEffect, useState } from 'react';
import Footer from '@/src/commons/layout/footer/footer';
import { message } from 'antd';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useAccessTokenStore } from '@/src/commons/stores/token-store';
import { useRouter } from 'next/navigation';

interface DeviceResponse<T> {
    data: T;
}
interface AppStateResponse {
    fetchDeviceSystemForAppStateSet: {
        isForeground: boolean;
    };
}
interface PermissionResponse {
    status: 'granted' | 'denied' | 'prompt';
}

interface LocationPermissionResponse {
    fetchDeviceLocationForPermissionSet: PermissionResponse;
}

interface NotificationPermissionResponse {
    fetchDeviceNotificationForPermissionSet: PermissionResponse;
}

declare const window: Window & {
    ReactNativeWebView: {
        postMessage: (message: string) => void;
    };
};

type PermissionState = {
    location: boolean;
    notification: boolean;
};

export default function MyPage() {
    const { fetchApp } = useDeviceSetting();

    // 권한은 아직 값이 없을 수도 있고 (null), 나중에 { location: boolean, notification: boolean } 형태의 객체가 될 것
    // 처음부터 false로 두면 권한 허락된 상태일 때 항상 false->true로 토글이 움직임
    // 웹이든 앱이든 처음엔 무조건 null
    const [permissions, setPermissions] = useState<PermissionState | null>(null);

    // 웹인지 앱인지 구분하기
    const isApp = typeof window !== 'undefined' && !!window.ReactNativeWebView;

    // 값이 있으면 권한 값 사용하고 없으면 권한은 모두 false
    const displayPermissions = permissions ?? { location: false, notification: false };

    // ================ 앱(WebView)일 때, 초기 권한 상태 조회하기 ================
    useEffect(() => {
        if (!isApp) return; // 웹이면 아무 것도 하지 않음
        const fetchInitialPermissions = async () => {
            // 위치 권한 조회
            const locationPermission = (await fetchApp({
                query: 'fetchDeviceLocationForPermissionSet',
            })) as DeviceResponse<LocationPermissionResponse>;

            const locationStatus =
                locationPermission.data.fetchDeviceLocationForPermissionSet.status;

            // 알람 권한 조회
            const notificationPermission = (await fetchApp({
                query: 'fetchDeviceNotificationForPermissionSet',
            })) as DeviceResponse<NotificationPermissionResponse>;

            const notificationStatus =
                notificationPermission.data.fetchDeviceNotificationForPermissionSet.status;

            // 권한 허용일 때, 토글 변경
            setPermissions({
                location: locationStatus === 'granted' ? true : false,
                notification: notificationStatus === 'granted' ? true : false,
            });
        };
        fetchInitialPermissions();
    }, []);

    //  ================  웹일 때, 초기 권한 상태 조회하기 ================
    // 위치, 알림 권한 조회 -> 위치, 알림 권한 요청하고 나서 요청에 대한 결과를 조회해야 해서 조회 함수를 따로 만듦
    const refreshWebPermissions = async () => {
        let locationAllowed = false;

        if (navigator.permissions?.query) {
            try {
                const status = await navigator.permissions.query({ name: 'geolocation' });
                locationAllowed = status.state === 'granted';
            } catch {}
        }

        const notificationAllowed =
            'Notification' in window && Notification.permission === 'granted';

        setPermissions({
            location: locationAllowed,
            notification: notificationAllowed,
        });
    };

    useEffect(() => {
        // 앱일 때
        if (isApp) return;

        // refreshWebPermissions 안에 setState가 있어서 경고 -> 콜백 형태로 만들어주기
        const init = async () => {
            await refreshWebPermissions();
        };
        init();
    }, []);

    // ========================= 웹 권한 요청 =========================
    const requestWebLocation = async () => {
        // 위치 권한 상태 미리 확인
        if (navigator.permissions && navigator.permissions.query) {
            const status = await navigator.permissions.query({ name: 'geolocation' });
            if (status.state === 'denied') {
                message.warning('위치 권한이 차단되어 있습니다. 브라우저 설정에서 허용해주세요.');
                return;
            }
        }

        // 위치 권한 요청
        navigator.geolocation.getCurrentPosition(
            () => refreshWebPermissions(),
            () => refreshWebPermissions(),
        );
    };

    const requestWebNotification = async () => {
        if (!('Notification' in window)) return;

        // 현재 권한 상태 확인
        if (Notification.permission === 'denied') {
            message.warning(
                '알림 권한이 차단되어 있습니다. 브라우저 설정에서 알림을 허용해주세요.',
            );
            return;
        }

        // 알림 권한 요청
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            refreshWebPermissions();
        }
    };

    // 위치 권한 토글
    const onClickLocation = async () => {
        // 웹일 때 위치 권한 요청
        if (!isApp) {
            requestWebLocation();
            return;
        }

        // 앱일 때 API 요청
        await fetchApp({ query: 'openDeviceSystemForSettingSet' });

        const interval = setInterval(async () => {
            // 앱 상태 감지 요청
            const appStatus = (await fetchApp({
                query: 'fetchDeviceSystemForAppStateSet',
            })) as DeviceResponse<AppStateResponse>;

            // 앱 상태가 포그라운드일 때 실행
            const isForeground = appStatus.data.fetchDeviceSystemForAppStateSet.isForeground;
            if (!isForeground) return;

            // 위치 권한 조회
            const permission = (await fetchApp({
                query: 'fetchDeviceLocationForPermissionSet',
            })) as DeviceResponse<LocationPermissionResponse>;
            const permissionStatus = permission.data.fetchDeviceLocationForPermissionSet.status;

            if (permissionStatus === 'granted') {
                // 위치 권한 허용일 때 실행
                setPermissions((prev) => {
                    if (!prev) return prev;
                    // 이전 값이 null이면 그대로 두기

                    return {
                        ...prev, // null이 아닌 location, notification을 가진 객체라면 스프레드
                        location: true,
                    };
                });
            } else {
                // 위치 권한 거부일 때 실행
                setPermissions((prev) => {
                    if (!prev) return prev;

                    return {
                        ...prev,
                        location: false,
                    };
                });
            }
            clearInterval(interval);
        }, 1000);
    };

    // 알림 권한 토글
    const onClickNotification = async () => {
        // 웹일 때 알림 권한 요청
        if (!isApp) {
            requestWebNotification();
            return;
        }

        // 앱일 때 API 요청
        await fetchApp({ query: 'openDeviceSystemForSettingSet' });

        const interval = setInterval(async () => {
            // 앱 상태 감지 요청
            const appStatus = (await fetchApp({
                query: 'fetchDeviceSystemForAppStateSet',
            })) as DeviceResponse<AppStateResponse>;

            // 앱 상태가 포그라운드일 때 실행
            const isForeground = appStatus.data.fetchDeviceSystemForAppStateSet.isForeground;
            if (!isForeground) return;

            // 알림 권한 조회
            const permission = (await fetchApp({
                query: 'fetchDeviceNotificationForPermissionSet',
            })) as DeviceResponse<NotificationPermissionResponse>;
            const permissionStatus = permission.data.fetchDeviceNotificationForPermissionSet.status;

            if (permissionStatus === 'granted') {
                // 알림 권한 허용일 때 실행
                setPermissions((prev) => {
                    if (!prev) return prev;

                    return {
                        ...prev,
                        notification: true,
                    };
                });
            } else {
                // 알림 권한 거부일 때 실행
                setPermissions((prev) => {
                    if (!prev) return prev;

                    return {
                        ...prev,
                        notification: false,
                    };
                });
            }
            clearInterval(interval);
        }, 1000);
    };

    const router = useRouter();
    const { setAccessToken } = useAccessTokenStore();

    const onClickLogout = async () => {
        // zustand에서 지우기
        setAccessToken('');
        // 웹의 localStorage에서 지우기 (상세페이지 작성자만 수정하기 위해 로컬스토리지에 토큰 저장함)
        localStorage.removeItem('accessToken');

        // 앱에서 accessToken, refreshToken 지우기
        await fetchApp({
            query: 'deleteDeviceAuthForAccessTokenSet',
        });
        await fetchApp({
            query: 'deleteDeviceAuthForRefreshTokenSet',
        });
        router.replace('/login');
    };
    return (
        <div className={style.mypage}>
            <div className={style.mypage_inner}>
                <Toggle
                    title={'위치 권한'}
                    onClick={onClickLocation}
                    // permissions={permissions.location}
                    permissions={displayPermissions.location}
                    isLoading={permissions === null} // permissions가 null이면 회색박스로 보여주면서 로딩중임을 나타내기
                    id="location-toggle"
                ></Toggle>
                <Toggle
                    title={'알림 권한'}
                    onClick={onClickNotification}
                    // permissions={permissions.notification}
                    permissions={displayPermissions.notification}
                    isLoading={permissions === null}
                    id="notification-toggle"
                ></Toggle>
                <div className={style.logout} onClick={onClickLogout}>
                    <div>로그아웃</div>
                    <LogoutOutlinedIcon fontSize="small"></LogoutOutlinedIcon>
                </div>
            </div>
            <Footer navActive={'isMypage'}></Footer>
        </div>
    );
}
