import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';
import { useReleaseNotes } from '../../hooks/useReleaseNotes';

export const ReleaseNotesModal = () => {

    const { colors } = useTheme() as CustomTheme;
    const { visible, releaseNotes, dismiss } = useReleaseNotes();

    if (!releaseNotes) { return null; }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={dismiss}
        >
            <View style={styles.backdrop}>
                <View style={[styles.card, { backgroundColor: colors.card }]}>

                    <Text style={[styles.title, { color: colors.primary }]}>
                        ¡Nueva actualización!
                    </Text>

                    <View style={styles.versionRow}>
                        <Text style={[styles.version, { color: colors.text }]}>
                            v{releaseNotes.version}
                        </Text>
                        <Text style={[styles.date, { color: colors.primary }]}>
                            {releaseNotes.date}
                        </Text>
                    </View>

                    {releaseNotes.summary ? (
                        <Text style={[styles.summary, { color: colors.text }]}>
                            {releaseNotes.summary}
                        </Text>
                    ) : null}

                    {releaseNotes.changes.length > 0 && (
                        <ScrollView style={styles.changesList}>
                            {releaseNotes.changes.map((change, index) => (
                                <View key={index} style={styles.changeRow}>
                                    <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
                                    <Text style={[styles.changeText, { color: colors.text }]}>
                                        {change}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    )}

                    <Pressable
                        onPress={dismiss}
                        style={[styles.button, { backgroundColor: colors.primary }]}
                    >
                        <Text style={[styles.buttonText, { color: colors.text }]}>Entendido</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        borderRadius: 20,
        padding: 22,
        maxHeight: '75%',
    },
    title: {
        fontSize: 22,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    versionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    version: {
        fontSize: 20,
        fontFamily: 'Roboto-Medium',
    },
    date: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
    },
    summary: {
        fontSize: 14,
        fontFamily: 'Roboto-Medium',
        marginBottom: 12,
    },
    changesList: {
        maxHeight: 200,
        marginBottom: 16,
    },
    changeRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    bullet: {
        fontSize: 16,
        marginRight: 6,
        lineHeight: 20,
    },
    changeText: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        lineHeight: 20,
    },
    button: {
        borderRadius: 14,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 4,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
    },
});
