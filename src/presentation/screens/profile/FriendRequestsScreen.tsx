import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { globalColors, globalStyles } from '../../../config/app-theme';
import { IonIcon } from '../../components/icons';


export const FriendRequestsScreen = () => {

    return (
        <View style={styles.container}>

            <View style={styles.titleHeader}>
                <Text style={styles.title}>Solicitudes recibidas</Text>
                <IonIcon name="archive" size={30} color={globalColors.grey} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text>No tienes solicitudes de amistad</Text>
            </ScrollView>

            <View style={globalStyles.separator} />

            <View style={styles.titleHeader}>
                <Text style={styles.title}>Solicitudes enviadas</Text>
                <IonIcon name="send" size={30} color={globalColors.grey} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text>No has enviado ninguna solicitud de amistad</Text>
            </ScrollView>

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Roboto-Medium',
        marginRight: 14,
    },
    titleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
});
