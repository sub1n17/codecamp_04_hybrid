import { requestAPI } from '.';

type FetchApp = {
    query: string;
    variables?: Record<string, unknown>;
};

declare const window: Window & {
    ReactNativeWebView: {
        postMessage: (message: string) => void;
    };
};

export const useDeviceSetting = () => {
    const fetchApp = async ({ query, variables = {} }: FetchApp) => {
        // 웹에서 postMessage 실행되지 않게 막기 (웹에는 RN이 없고 postMessage도 없으므로 기다릴 이유가 없음)
        if (typeof window === 'undefined' || !window.ReactNativeWebView) {
            // 웹에서는 아무것도 안 함
            return Promise.resolve(null);
        }

        return await new Promise<unknown>((resolve) => {
            requestAPI[query] = resolve;
            window.ReactNativeWebView.postMessage(JSON.stringify({ query, variables }));
        });
    };
    return { fetchApp };
};
