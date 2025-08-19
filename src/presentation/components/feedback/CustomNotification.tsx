import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface TopNotificationProps {
    message: string;
    duration?: number; // en milisegundos, por defecto 3000
    onClose?: () => void;
    position?: 'top' | 'bottom'; // NUEVO
}

export const TopNotification: React.FC<TopNotificationProps> = ({
    message,
    duration = 3000,
    onClose,
    position = 'top', // por defecto arriba
}) => {
    const slideAnim = useRef(new Animated.Value(position === 'top' ? -80 : 80)).current;

    useEffect(() => {
        // Animar la entrada
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Ocultar tras duración si se indica
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
        backgroundColor: '#7037eb',
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
        fontWeight: 'bold',
    },
});
