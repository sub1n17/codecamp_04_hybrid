import { useEffect, useState } from 'react';
import { BackHandler, ToastAndroid } from 'react-native';

export const useDeviceRouting = (onResponse) => {
    const [backCount, setBackCount] = useState(0);

    // 백버튼 감지하기
    useEffect(() => {
        // const backHandler = () => {
        //     if (backCount === 0) {
        //         onResponse({
        //             back: true,
        //         });
        //     } else {
        //         BackHandler.exitApp();
        //     }
        //     return true;
        // };

        const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
            if (backCount === 0) {
                onResponse({
                    back: true,
                });
            } else {
                BackHandler.exitApp();
            }
            return true;
        });

        // 등록한 이벤트를 제거
        return () => {
            subscription.remove();
        };
    }, [backCount, onResponse]);

    // 앱 종료 API
    const exitDeviceRoutingForBackSet = () => {
        // 토스트 메시지 띄우기
        ToastAndroid.show('한 번 더 누르면 종료됩니다.', ToastAndroid.SHORT);

        // 한 번 클릭했다고 저장하기
        setBackCount(1);

        // 2초 내 백버튼 누르지 않으면 초기화하기
        setTimeout(() => {
            setBackCount(0);
        }, 2000);
    };

    return { exitDeviceRoutingForBackSet };
};
