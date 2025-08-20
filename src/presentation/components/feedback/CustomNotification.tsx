import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { globalColors } from '../../../config/app-theme';

interface CustomNotificationProps {
    message: string;
    duration?: number;
    onClose?: () => void;
    position?: 'top' | 'bottom';
}

export const CustomNotification = ({
    message,
    duration = 3000,
    onClose,
    position = 'top',
}: CustomNotificationProps) => {
    const slideAnim = useRef(new Animated.Value(position === 'top' ? -80 : 80)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();

        if (duration > 0) {
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
    }, [duration, onClose, slideAnim, position]);

    return (
        <Animated.View
            style={[
                styles.container,
                position === 'top' ? styles.top : styles.bottom,
                { transform: [{ translateY: slideAnim }] },
            ]}
        >
            <Text style={styles.text}>{message}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        left: 0,
        right: 0,
        backgroundColor: globalColors.primary,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1000,
        elevation: 10,
        position: 'absolute',
    },
    top: {
        top: 0,
    },
    bottom: {
        bottom: 0,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
        fontFamily: 'Roboto-Medium',
    },
    closeButton: {
        marginLeft: 16,
        padding: 4,
    },
    closeText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Roboto-Light',
    },
});
