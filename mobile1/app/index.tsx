import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';

export default function Index() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top', 'bottom']}>
            <StatusBar style="light"></StatusBar>
            <WebView source={{ uri: 'http://192.168.55.42:3000/solplace-logs/new' }}></WebView>
        </SafeAreaView>
    );
}
