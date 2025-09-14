import { StyleSheet, ScrollView, View } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CustomTextInput } from '../../components/inputs';
import { CustomButton } from '../../components/pressables';
import { CustomNotification, FullScreenLoader } from '../../components/feedback';

export const PasswordChangeScreen = () => {

    const [showNotif, setShowNotif] = useState(false);
    const [notifMessage, setNotifMessage] = useState('');

    const { changePassword, loading } = useAuth();
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async () => {

        if (password !== confirmPassword) {
            setNotifMessage('Las contraseñas no coinciden');
            setShowNotif(true);
            return;
        }

        try {
            await changePassword(password, code);
        } catch (error: any) {
            setNotifMessage(error.message);
            setShowNotif(true);
        }
    };

    if (loading) {
        return <FullScreenLoader />;
    }

    return (
        <View style={styles.container}>

            {showNotif &&
                <CustomNotification
                    message={notifMessage}
                    onClose={() => setShowNotif(false)}
                    position="top"
                />
            }

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
