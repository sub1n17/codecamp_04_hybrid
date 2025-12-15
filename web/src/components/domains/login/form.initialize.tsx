import { webviewLog } from '@/src/commons/libraries/webview-log';
import { useDeviceSetting } from '@/src/commons/settings/device-setting/hook';
import { useRouter } from 'next/navigation';
import { LogInSchemaType } from './schema';
import { ApolloError, gql, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { getAccessToken } from '@/src/commons/libraries/get-access-token';
import { useAccessTokenStore } from '@/src/commons/stores/token-store';

const RESTORE_ACCESS_TOKEN = gql`
    mutation restoreAccessToken {
        restoreAccessToken {
            accessToken
        }
    }
`;

const LOG_IN = gql`
    mutation login($loginInput: LoginInput!) {
        login(loginInput: $loginInput) {
            accessToken
            refreshToken
        }
    }
`;

export const useInitializeLogIn = () => {
    const { fetchApp } = useDeviceSetting();
    const router = useRouter();

    const [restore_accessToken] = useMutation(RESTORE_ACCESS_TOKEN);

    // 스플래시 화면 유무
    // const [tokenChecking, setTokenChecking] = useState(true);
    const { setAccessToken } = useAccessTokenStore();

    useEffect(() => {
        const checkToken = async () => {
            // 리프레시토큰 조회
            const result = await fetchApp({ query: 'fetchDeviceAuthForRefreshTokenSet' });
            const refreshToken = result.data.fetchDeviceAuthForRefreshTokenSet.refreshToken;

            // 리프레시 토큰이 유효하면 액세스토큰을 재발급 받고 솔플레이스로 이동하기
            if (refreshToken) {
                // 백엔드에 액세스토큰 재발급 요청하기
                const result = await restore_accessToken();
                const accessToken = result.data.restoreAccessToken.accessToken;

                // zustand에 accessToken 저장
                if (accessToken) {
                    setAccessToken(accessToken);
                    // return router.push('/solplace-logs'); // 자동 로그인
                }
            }
            // 리프레시토큰 없을 때 로그인화면 보여주기
            // setTokenChecking(false);
        };
        checkToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 로그인 버튼
    const [log_in] = useMutation(LOG_IN);
    const onClickSubmit = async (data: LogInSchemaType) => {
        try {
            // 이메일/비밀번호로 로그인
            const loginResult = await log_in({
                variables: {
                    loginInput: {
                        email: data.email,
                        password: data.password,
                    },
                },
            });

            const accessToken = loginResult.data.login.accessToken;
            const refreshToken = loginResult.data.login.refreshToken;

            // RN에 accessToken, refreshToken 저장 API 요청하기
            // (결과가 반드시 필요한 비동기만 await, await 없어도 요청 보내고 다음 코드를 실행했다가 응답이 오면 그때 RN에서는 그때 토큰을 저장함, 토큰 저장될 때까지 안 기다려야 페이지 이동됨)
            fetchApp({
                query: 'updateDeviceAuthForAccessTokenSet',
                variables: { accessToken: accessToken },
            });
            fetchApp({
                query: 'updateDeviceAuthForRefreshTokenSet',
                variables: { refreshToken: refreshToken },
            });

            // 솔플레이스로그 페이지로 이동
            router.push('/solplace-logs');
        } catch (error) {
            if (error instanceof ApolloError) {
                Modal.error({
                    centered: true,
                    title: '로그인 실패',
                    content:
                        error.graphQLErrors[0]?.message ??
                        error.message ??
                        '로그인에 실패했습니다.',
                    width: '20rem',
                });
                return;
            }
            Modal.error({
                centered: true,
                title: '오류',
                content: '네트워크 오류가 발생했습니다.',
                width: '20rem',
            });
        }
    };

    return {
        onClickSubmit,
        // tokenChecking,
    };
};
