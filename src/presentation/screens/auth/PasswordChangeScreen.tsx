/* eslint-disable react-hooks/exhaustive-deps */
import { StyleSheet, ScrollView, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CustomTextInput } from '../../components/inputs';
import { CustomButton } from '../../components/pressables';
import { FullScreenLoader } from '../../components/feedback';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/ProfileStackNavigator';
import { useNotification } from '../../context/NotificationContext';

export const PasswordChangeScreen = () => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const { params } = useRoute<RouteProp<RootStackParams, 'PasswordChange'>>();
    const alreadySentCode = params?.alreadySentCode ?? false;
    const notifPosition = params?.notifPosition ?? 'top';

    const { showNotification } = useNotification();

    const { changePassword, loading } = useAuth();
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (alreadySentCode) {
            showNotification({
                message: 'Utiliza el código de verificación que solicitaste hace menos de 1 minuto',
                position: notifPosition,
            });
        }
    }, []);

    const handleChangePassword = async () => {

        if (password !== confirmPassword) {
            showNotification({ message: 'Las contraseñas no coinciden', position: notifPosition });
            return;
        }

        try {
            const success = await changePassword(password, code);
            if (success) {
                navigation.goBack();
            }
        } catch (error: any) {
            showNotification({ message: error.message, position: notifPosition });
        }
    };

    if (loading) {
        return <FullScreenLoader />;
    }

    return (
        <View style={styles.container}>

            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <CustomTextInput
                    label="Código de verificación"
                    style={styles.input}
                    placeholder="123456"
                    value={code}
                    onChangeText={text => setCode(text.replace(/\s/g, ''))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    info="Código de 6 dígitos que has recibido por email"
                />

                <CustomTextInput
                    label="Contraseña"
                    style={styles.input}
                    placeholder="abcD5*"
                    value={password}
                    onChangeText={text => setPassword(text.replace(/\s/g, ''))}
                    secureTextEntry={true}
                    info="Mínimo 6 caracteres, incluyendo minúsculas, mayúsculas, números y símbolos"
                />

                <CustomTextInput
                    label="Repetir contraseña"
                    style={styles.input}
                    placeholder="abcD5*"
                    value={confirmPassword}
                    onChangeText={text => setConfirmPassword(text.replace(/\s/g, ''))}
                    secureTextEntry={true}
                />

                <CustomButton
                    title="Cambiar contraseña"
                    onPress={handleChangePassword}
                    disabled={!code || !password || !confirmPassword}
                />

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 24,
        justifyContent: 'center',
    },
    input: {
        marginBottom: 16,
    },
});
