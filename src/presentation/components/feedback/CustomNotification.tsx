import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CustomTheme } from '../../../config/app-theme';
import { useTheme } from '@react-navigation/native';
import { useNotification } from '../../context/NotificationContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BOTTOM_TAB_BAR_HEIGHT = 56;

export const CustomNotification = () => {

    const { state, hideNotification } = useNotification();
    const { visible, message, position = 'top', duration = 3000, onAccept } = state;

    const insets = useSafeAreaInsets();

    const slideAnim = useRef(new Animated.Value(position === 'top' ? -80 : 80)).current;

    const { colors } = useTheme() as CustomTheme;

    useEffect(() => {
        if (!visible) {
            slideAnim.setValue(position === 'top' ? -80 : 80);
            return;
        }

        slideAnim.setValue(position === 'top' ? -80 : 80);

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
                    hideNotification();
                });
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [visible, duration, onAccept, slideAnim, position, hideNotification]);

    if (!visible) { return null; }

    const positionStyle = position === 'top'
        ? { top: insets.top + 5 }
        : { bottom: insets.bottom + BOTTOM_TAB_BAR_HEIGHT + 5 };

    return (
        <>
            {onAccept && (
                <Pressable
                    style={styles.overlay}
                    onPress={hideNotification}
                />
            )}

            <Animated.View
                style={[
                    styles.container,
                    positionStyle,
                    {
                        transform: [{ translateY: slideAnim }],
                        backgroundColor: colors.notification,
                    },
                ]}
            >
                <Text style={styles.text}>{message}</Text>

                {onAccept && (
                    <TouchableOpacity onPress={onAccept} style={styles.acceptButton}>
                        <Text style={styles.buttonText}>✓</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={hideNotification} style={styles.closeButton}>
                    <Text style={styles.buttonText}>✕</Text>
                </TouchableOpacity>

            </Animated.View>
        </>
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
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        backgroundColor: 'transparent',
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
