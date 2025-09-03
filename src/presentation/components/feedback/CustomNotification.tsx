import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CustomTheme } from '../../../config/app-theme';
import { useTheme } from '@react-navigation/native';

interface Props {
    message: string;
    duration?: number;
    onClose?: () => void;
    onAccept?: () => void;
    position?: 'top' | 'bottom';
}

export const CustomNotification = ({
    message,
    duration = 3000,
    onClose,
    onAccept,
    position = 'top',
}: Props) => {
    const slideAnim = useRef(new Animated.Value(position === 'top' ? -80 : 80)).current;

    const { colors } = useTheme() as CustomTheme;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();

        if (duration > 0 && !onAccept) {
            const timer = setTimeout(() => {
                Animated.timing(slideAnim, {
                    toValue: position === 'top' ? -80 : 80,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    onClose && onClose();
                });
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose, onAccept, slideAnim, position]);

    return (
        <Animated.View
            style={[
                styles.container,
                position === 'top' ? styles.top : styles.bottom,
                {
                    transform: [{ translateY: slideAnim }],
                    backgroundColor: colors.primary,
                },
            ]}
        >
            <Text style={styles.text}>{message}</Text>

            {onAccept && (
                <TouchableOpacity onPress={onAccept} style={styles.acceptButton}>
                    <Text style={styles.buttonText}>✓</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.buttonText}>✕</Text>
            </TouchableOpacity>

        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        left: 5,
        right: 5,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1000,
        elevation: 10,
        position: 'absolute',
        borderRadius: 10,
    },
    top: {
        top: 5,
    },
    bottom: {
        bottom: 5,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
        fontFamily: 'Roboto-Medium',
    },
    closeButton: {
        marginLeft: 20,
        padding: 4,
    },
    acceptButton: {
        marginLeft: 8,
        padding: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Roboto-Light',
    },
});
