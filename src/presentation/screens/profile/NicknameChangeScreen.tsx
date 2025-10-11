import { StyleSheet, ScrollView, View } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CustomTextInput } from '../../components/inputs';
import { CustomButton } from '../../components/pressables';
import { CustomNotification, FullScreenLoader } from '../../components/feedback';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/ProfileStackNavigator';

export const NicknameChangeScreen = () => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const [showNotif, setShowNotif] = useState(false);
    const [notifMessage, setNotifMessage] = useState('');

    const { changeUserNickname, loading } = useAuth();
    const [nickname, setNickname] = useState('');


    const handleChangeNickname = async () => {

        try {
            const success = await changeUserNickname(nickname);
            if (success) {
                navigation.reset({
                    index: 0,
                    routes: [
                        { name: 'ProfileMenu', params: { doRefetch: true } },
                    ],
                });
            }
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
                    position={'top'}
                />
            }

            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <CustomTextInput
                    label="Nickname"
                    style={styles.input}
                    placeholder="Nuevo nickname"
                    value={nickname}
                    onChangeText={text => setNickname(text.replace(/\s/g, ''))}
                />

                <CustomButton
                    title="Cambiar nickname"
                    onPress={handleChangeNickname}
                    disabled={!nickname}
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

