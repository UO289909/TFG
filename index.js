/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { App } from './src/App';
import { ThemeProvider } from './src/presentation/context/ThemeContext';
import { name as appName } from './app.json';
import { AuthProvider } from './src/presentation/context/AuthContext';
import { NotificationProvider } from './src/presentation/context/NotificationContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';

const Root = () => (
    <SafeAreaProvider>
        <ThemeProvider>
            <NotificationProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </NotificationProvider>
        </ThemeProvider>
    </SafeAreaProvider>
);

AppRegistry.registerComponent(appName, () => Root);
