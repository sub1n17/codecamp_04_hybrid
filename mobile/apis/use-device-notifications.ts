import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

// 1. 알람 수신 대기(IOS 필수)
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true, // 팝업 표시
        shouldPlaySound: true, // 알림 소리
        shouldSetBadge: true, // 앱 배지 업데이트
        shouldShowBanner: true, // 화면 상단 배너 표시 여부
        shouldShowList: true, // 알림 센터 내 리스트 표시 여부
    }),
});

export const useDeviceNotifications = (onResponse) => {
    async function requestNotificationPermission() {
        const { status } = await Notifications.requestPermissionsAsync();
        console.log('Notification permission:', status);

        if (status !== 'granted') {
            console.warn('알림 권한이 거부되었습니다.');
            return;
        }

        // Android 채널 필수
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: '기본 알림',
                importance: Notifications.AndroidImportance.MAX, // 🔥 최대
                vibrationPattern: [0, 250, 250, 250],
                lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
                sound: 'default',
            });
        }
    }
    // App 진입 시 한 번 실행
    useEffect(() => {
        requestNotificationPermission();
    }, []);

    // 알림 권한 요청
    const requestDeviceNotificationsForPermissionSolplaceLogNewSet = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        console.log('notification permission status:', status);
        onResponse({
            requestDeviceNotificationsForPermissionSolplaceLogNewSet: {
                message: '요청 완료',
            },
        });
    };

    // 스케줄 알림 생성
    const createDeviceNotificationsForSolplaceLogNewSet = async (variables) => {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
            console.warn('권한이 없어 알림을 보낼 수 없음');
            return;
        }

        console.log('알림 예약 content', {
            page: `/solplace-logs/${variables.solplaceLogId}`,
        });

        await Notifications.scheduleNotificationAsync({
            content: {
                title: '솔플레이스 등록 완료',
                body: '신규 솔플레이스로그가 등록되었습니다.',
                sound: 'default',
                data: {
                    page: `/solplace-logs/${variables.solplaceLogId}`,
                },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 5,
            },
        });
        onResponse({
            createDeviceNotificationsForSolplaceLogNewSet: {
                message: '등록 완료',
            },
        });
    };

    // 알람 클릭 시 리디렉트, 알람 클릭 대기
    useEffect(() => {
        Notifications.addNotificationResponseReceivedListener((reponse) => {
            const notificationData = reponse.notification.request.content.data;
            onResponse({
                redirect: notificationData.page,
            });
        });
    }, [onResponse]);

    // 알림 권한 조회
    const fetchDeviceNotificationForPermissionSet = async () => {
        const permission = await Notifications.getPermissionsAsync();
        onResponse({
            fetchDeviceNotificationForPermissionSet: {
                status: permission.status,
            },
        });
    };

    return {
        requestDeviceNotificationsForPermissionSolplaceLogNewSet,
        createDeviceNotificationsForSolplaceLogNewSet,
        fetchDeviceNotificationForPermissionSet,
    };
};
