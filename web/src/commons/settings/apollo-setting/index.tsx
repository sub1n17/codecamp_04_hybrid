'use client';

import { ApolloClient, ApolloProvider, fromPromise, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getAccessToken } from '../../libraries/get-access-token';
import { useAccessTokenStore } from '../../stores/token-store';
// import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';

interface IApolloSetting {
    children: React.ReactNode;
}

export default function ApolloSetting(props: IApolloSetting) {
    const { setAccessToken } = useAccessTokenStore();

    const errorLink = onError(({ graphQLErrors, operation, forward }) => {
        // 에러 캐치하기
        if (graphQLErrors) {
            for (const error of graphQLErrors) {
                // 에러 중 토큰 만료 에러가 있는지 체크하기
                if (error.extensions?.code === 'UNAUTHENTICATED') {
                    return fromPromise(
                        // graphql-request로 쿼리 요청 후 재발급 받은 accessToken 저장하기
                        getAccessToken().then((newAccessToken) => {
                            if (newAccessToken && typeof newAccessToken === 'string') {
                                setAccessToken(newAccessToken);
                                // 실패한 쿼리의 정보 수정하기, 새 토큰으로 덮어씌우기
                                operation.setContext({
                                    headers: {
                                        ...operation.getContext().headers,
                                        Authorization: `Bearer ${newAccessToken}`,
                                    },
                                    credentials: 'include',
                                });
                            }
                        })
                    ).flatMap(() => forward(operation)); // 실패한 쿼리를 다시 실행
                }
            }
        }
    });

    const httpLink = new HttpLink({
        uri: 'https://main-hybrid.codebootcamp.co.kr/graphql',
        // credentials: 'include',
        credentials: 'omit',
    });

    const authLink = setContext((_, { headers }) => {
        const { accessToken } = useAccessTokenStore.getState();
        return {
            headers: {
                ...headers,
                Authorization: accessToken ? `Bearer ${accessToken}` : '',
            },
        };
    });

    const client = new ApolloClient({
        link: errorLink.concat(authLink).concat(httpLink),
        cache: new InMemoryCache(),
    });

    return <ApolloProvider client={client}> {props.children} </ApolloProvider>;
}
