'use client';

import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import { useRef } from 'react';
import { useApis } from '@/apis';

export default function Index() {
    const webviewRef = useRef<WebView>(null);
    const { onRequest, layout } = useApis(webviewRef);

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: layout.notchBackgroundColor }}
            edges={layout.safeAreaViewEdge}
        >
            <StatusBar style={layout.statusBarStyle}></StatusBar>
            <WebView
                javaScriptEnabled
                domStorageEnabled
                geolocationEnabled
                originWhitelist={['*']}
                source={{ uri: 'http://192.168.55.42:3000/' }}
                ref={webviewRef}
                onMessage={(event) => {
                    if (!event.nativeEvent.data) return;
                    const request = JSON.parse(event.nativeEvent.data);

                    // 웹에게 API 응답 보내기
                    onRequest(request.query, request.variables);
                }}
            ></WebView>
        </SafeAreaView>
    );
}
