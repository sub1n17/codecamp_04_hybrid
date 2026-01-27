import { gql, GraphQLClient } from 'graphql-request';

const RESTORE_ACCESS_TOKEN = gql`
    mutation restoreAccessToken {
        restoreAccessToken {
            accessToken
        }
    }
`;

// export const getAccessToken = async (appRefreshToken?: string) => {
//     try {
//         const graphqlClient = new GraphQLClient('https://main-hybrid.codebootcamp.co.kr/graphql', {
//             credentials: 'include',
//             // 앱이면 Bearer 헤더에 리프레시 토큰을 직접 실어 보내기
//             // 🔴 앱(Expo)에서 가져온 리프레시 토큰이 있다면 Authorization 헤더에 담아서 보냄
//             headers: appRefreshToken ? { Authorization: `Bearer ${appRefreshToken}` } : {},
//         });

//         const result = await graphqlClient.request(RESTORE_ACCESS_TOKEN);
//         const newAccessToken = result.restoreAccessToken.accessToken;

//         return newAccessToken;
//         // return result.restoreAccessToken.accessToken;
//     } catch (error) {
//         alert(`getAccessToken 오류 : ${error}`);
//         // console.log((error as Error).message);
//         return undefined;
//     }
// };

export const getAccessToken = async (appRefreshToken?: string) => {
    try {
        // 🔴 GraphQLClient 대신 표준 fetch를 사용하여 네트워크 호환성을 높입니다.
        const response = await fetch('https://main-hybrid.codebootcamp.co.kr/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 앱 리프레시 토큰이 있으면 Authorization 헤더에 실어 보냄
                ...(appRefreshToken ? { Authorization: `Bearer ${appRefreshToken}` } : {}),
            },
            body: JSON.stringify({
                query: `
                    mutation restoreAccessToken {
                        restoreAccessToken {
                            accessToken
                        }
                    }
                `,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // 데이터 구조 확인 (서버 응답에 따라 result.data.restoreAccessToken...)
        const newAccessToken = result?.data?.restoreAccessToken?.accessToken;

        return newAccessToken;
    } catch (error) {
        // 🔴 에러 메시지를 더 자세히 확인하기 위해 상세 출력
        console.error('getAccessToken 상세 에러:', error);
        return undefined;
    }
};
