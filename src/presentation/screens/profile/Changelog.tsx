import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';
import changelog from '../../../../assets/changelog.json';
import { ChangelogEntry } from '../../../core/types/ChangelogEntry';

export const Changelog = () => {

    const { colors } = useTheme() as CustomTheme;

    const renderUpdate = ({ item, index }: { item: ChangelogEntry, index: number }) => (
        <View style={[
            styles.updateContainer,
            { backgroundColor: colors.card, shadowColor: colors.shadow },
        ]}>


            <View style={styles.header}>
                <Text style={[styles.version, { color: colors.text }]}>v{item.version}</Text>
                {index === 0 && (
                    <View style={[styles.current, { backgroundColor: colors.primary }]}>
                        <Text style={styles.currentText}>Última actualización</Text>
                    </View>
                )}
                <Text style={[styles.date, { color: colors.primary }]}>{item.date}</Text>
            </View>

            {item.summary && (
                <Text style={[styles.summary, { color: colors.text }]}>{item.summary}</Text>
            )}

            {item.changes.map((change, index) => (
                <View key={index} style={styles.changeRow}>
                    <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
                    <Text style={[styles.changeText, { color: colors.text }]}>{change}</Text>
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={changelog as ChangelogEntry[]}
                renderItem={renderUpdate}
                keyExtractor={(item) => item.version}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );

};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 10,
        paddingBottom: 0,
    },
    updateContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        alignSelf: 'center',
        marginBottom: 10,
        padding: 14,
    },
    current: {
        alignSelf: 'center',
        padding: 8,
        borderRadius: 16,
    },
    currentText: {
        fontSize: 12,
        fontFamily: 'Roboto-Medium',
        color: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 6,
    },
    version: {
        fontSize: 22,
        fontFamily: 'Roboto-Bold',
    },
    date: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
    },
    summary: {
        fontSize: 14,
        fontFamily: 'Roboto-Medium',
        marginBottom: 10,
    },
    changeRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    bullet: {
        fontSize: 16,
        marginRight: 6,
        lineHeight: 20,
    },
    changeText: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Roboto-Italic',
        lineHeight: 20,
    },
});