import { createContext, useCallback, useContext, useState } from 'react';

interface NotificationOptions {
    message: string;
    position?: 'top' | 'bottom';
    duration?: number;
    onAccept?: () => void;
    onClose?: () => void;
}

interface NotificationState extends NotificationOptions {
    visible: boolean;
}

interface NotificationContextProps {
    state: NotificationState;
    showNotification: (opts: NotificationOptions) => void;
    hideNotification: () => void;
}

const defaultState: NotificationState = {
    visible: false,
    message: '',
    position: 'top',
    duration: 3000,
    onAccept: undefined,
    onClose: undefined,
};

const NotificationContext = createContext<NotificationContextProps>({
    state: defaultState,
    showNotification: () => { },
    hideNotification: () => { },
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [state, setState] = useState<NotificationState>(defaultState);

    const showNotification = useCallback((opts: NotificationOptions) => {
        setState({
            visible: true,
            message: opts.message,
            position: opts.position ?? 'top',
            duration: opts.duration ?? 3000,
            onAccept: opts.onAccept,
            onClose: opts.onClose,
        });
    }, []);

    const hideNotification = useCallback(() => {
        setState(prev => {
            if (prev.onClose) {
                prev.onClose();
            }
            return defaultState;
        });
    }, []);

    return (
        <NotificationContext.Provider value={{ state, showNotification, hideNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
