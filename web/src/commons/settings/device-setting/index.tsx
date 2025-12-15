'use client';

import { useEffect } from 'react';
import { useRoutingSetting } from '../routing-setting/hook';

// 요청한 API 모아두기
export const requestAPI = {};

export const DeviceSetting = ({ children }) => {
    const { onRouterPush, onRouterBack } = useRoutingSetting();

    useEffect(() => {
        const messageHandler = (message) => {
            if (!message.data) return;

            let response = message.data;

            // 문자열일 경우 JSON 파싱
            if (typeof response === 'string') {
                try {
                    response = JSON.parse(response);
                } catch {
                    return;
                }
            }

            // JSON 파싱 후 객체인지 다시 체크
            if (!response || typeof response !== 'object') return;

            // const response = message.data;
            // const response = JSON.parse(message.data);

            // 스케줄 알림 클릭 시, 페이지 이동 후 아래 코드 실행 막기
            if (response.redirect) {
                return onRouterPush(response.redirect);
                // return onRouterPush({ currentTarget: { href: response.redirect } }); // 뷰트랜지션 이동
            }

            // 백버튼 클릭 시, 뒤로가기 및 앱 종료 후 아래 코드 실행 막기
            if (response.back) {
                return onRouterBack();
            }

            // 응답 받고 resolve 실행하기
            const query = Object.keys(response)[0];
            const resolver = requestAPI[query];
            if (!resolver) return;
            resolver({ data: response });
            delete requestAPI[query];
        };
        // 안드로이드
        document.addEventListener('message', messageHandler);

        // IOS
        window.addEventListener('message', messageHandler);

        return () => {
            document.removeEventListener('message', messageHandler);
            window.removeEventListener('message', messageHandler);
        };
    }, [onRouterPush, onRouterBack]);

    return <>{children}</>;
};
