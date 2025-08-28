import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { globalColors, globalStyles } from '../../../config/app-theme';
import { IonIcon } from '../../components/icons';
import { RequestCard } from '../../components/profile/RequestCard';


export const FriendRequestsScreen = () => {

    return (
        <View style={styles.container}>

            <View style={styles.titleHeader}>
                <Text style={styles.title}>Solicitudes recibidas</Text>
                <IonIcon name="archive" size={30} color={globalColors.grey} />
            </View>

            <View style={globalStyles.separator} />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <RequestCard
                    type="received"
                    nickname="rosirodriguez08"
                    name="Rosa Delia Rodríguez Lozano"
                    onAccept={() => { }}
                    onDecline={() => { }}
                />
                <RequestCard
                    type="received"
                    nickname="rosirodriguez08"
                    name="Rosa Delia Rodríguez Lozano"
                    onAccept={() => { }}
                    onDecline={() => { }}
                />
                <RequestCard
                    type="received"
                    nickname="rosirodriguez08"
                    name="Rosa Delia Rodríguez Lozano"
                    onAccept={() => { }}
                    onDecline={() => { }}
                />
                <RequestCard
                    type="received"
                    nickname="rosirodriguez08"
                    name="Rosa Delia Rodríguez Lozano"
                    onAccept={() => { }}
                    onDecline={() => { }}
                />
                <RequestCard
                    type="received"
                    nickname="rosirodriguez08"
                    name="Rosa Delia Rodríguez Lozano"
                    onAccept={() => { }}
                    onDecline={() => { }}
                />
                <RequestCard
                    type="received"
                    nickname="rosirodriguez08"
                    name="Rosa Delia Rodríguez Lozano"
                    onAccept={() => { }}
                    onDecline={() => { }}
                />
            </ScrollView>

            <View style={[globalStyles.separator, styles.bigSeparator]} />

            <View style={styles.titleHeader}>
                <Text style={styles.title}>Solicitudes enviadas</Text>
                <IonIcon name="send" size={30} color={globalColors.grey} />
            </View>

            <View style={globalStyles.separator} />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <RequestCard
                    type="sent"
                    nickname="daniirguez"
                    name="Daniel Rodríguez"
                    onAccept={() => { }}
                    onDecline={() => { }}
                />
                <RequestCard
                    type="sent"
                    nickname="daniirguez"
                    name="Daniel Rodríguez"
                    onAccept={() => { }}
                    onDecline={() => { }}
                />
                <RequestCard
                    type="sent"
                    nickname="daniirguez"
                    name="Daniel Rodríguez"
                    onAccept={() => { }}
                    onDecline={() => { }}
                />
                <RequestCard
                    type="sent"
                    nickname="daniirguez"
                    name="Daniel Rodríguez"
                    onAccept={() => { }}
                    onDecline={() => { }}
                />
                <RequestCard
                    type="sent"
                    nickname="daniirguez"
                    name="Daniel Rodríguez"
                    onAccept={() => { }}
                    onDecline={() => { }}
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
        padding: 10,
    },
    bigSeparator: {
        backgroundColor: globalColors.grey,
        height: 4,
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
