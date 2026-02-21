import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import changelog from '../../../assets/changelog.json';
import { ChangelogEntry } from '../../core/types/ChangelogEntry';

const STORAGE_KEY = '@lastSeenVersion';

export const useReleaseNotes = () => {
    const [visible, setVisible] = useState(false);
    const [releaseNotes, setReleaseNotes] = useState<ChangelogEntry | null>(null);

    useEffect(() => {
        const checkVersion = async () => {
            try {
                const latestEntry = (changelog as ChangelogEntry[])[0];
                if (!latestEntry) { return; }

                const lastSeen = await AsyncStorage.getItem(STORAGE_KEY);

                if (lastSeen !== latestEntry.version) {
                    setReleaseNotes(latestEntry);
                    setVisible(true);
                }
            } catch (error) {
                console.warn('useReleaseNotes: error checking version', error);
            }
        };

        checkVersion();
    }, []);

    const dismiss = async () => {
        setVisible(false);
        if (releaseNotes) {
            await AsyncStorage.setItem(STORAGE_KEY, releaseNotes.version);
        }
    };

    return { visible, releaseNotes, dismiss };
};
