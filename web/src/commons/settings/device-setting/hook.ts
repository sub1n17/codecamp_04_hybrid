import { requestAPI } from '.';

declare const window: Window & {
    ReactNativeWebView: {
        postMessage: (message: string) => void;
    };
};

export const useDeviceSetting = () => {
    const fetchApp = async ({ query, variables = {} }) => {
        return await new Promise((resolve) => {
            requestAPI[query] = resolve;
            window.ReactNativeWebView.postMessage(JSON.stringify({ query, variables }));
        });
    };
    return { fetchApp };
};
