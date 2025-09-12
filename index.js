/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { App } from './src/App';
import { ThemeProvider } from './src/presentation/context/ThemeContext';
import { name as appName } from './app.json';
import { AuthProvider } from './src/presentation/context/AuthContext';
import 'react-native-url-polyfill/auto';

const Root = () => (
    <ThemeProvider>
        <AuthProvider>
            <App />
        </AuthProvider>
    </ThemeProvider>
);

AppRegistry.registerComponent(appName, () => Root);
