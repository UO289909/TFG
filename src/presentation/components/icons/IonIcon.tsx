import Icon from '@react-native-vector-icons/ionicons';
import { StyleProp, TextStyle } from 'react-native';

export type IonIconNames =
    | 'library'
    | 'library-outline'
    | 'person'
    | 'person-outline'
    | 'person-add'
    | 'person-add-outline'
    | 'person-remove'
    | 'person-remove-outline'
    | 'people'
    | 'people-outline'
    | 'home'
    | 'home-outline'
    | 'images'
    | 'images-outline'
    | 'add-outline'
    | 'close'
    | 'close-outline'
    | 'star'
    | 'star-outline'
    | 'contrast'
    | 'contrast-outline'
    | 'sunny'
    | 'sunny-outline'
    | 'moon'
    | 'moon-outline'
    | 'phone-portrait'
    | 'phone-portrait-outline'
    | 'log-out'
    | 'log-out-outline'
    | 'lock-open'
    | 'lock-open-outline'
    | 'book'
    | 'book-outline'
    | 'arrow-up'
    | 'arrow-up-outline'
    | 'text'
    | 'text-outline'
    | 'search'
    | 'archive'
    | 'send'
    | 'bookmark'
    | 'bookmark-outline'
    | 'trash-outline'
    | 'pencil-outline'
    | 'checkmark-outline'
    | 'logo-google';

interface Props {
    name: IonIconNames;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle>;
}

export const IonIcon = ({ name, size = 20, color = 'black', style}: Props) => {
    return (
        <Icon
            name={name}
            size={size}
            color={color}
            style={style}
        />
    );
};
