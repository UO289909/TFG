import Icon from '@react-native-vector-icons/ionicons';

export type IonIconNames =
    | 'book-outline'
    | 'library'
    | 'library-outline'
    | 'person'
    | 'person-outline'
    | 'home'
    | 'home-outline'
    | 'add-outline'
    | 'close-outline'
    | 'star'
    | 'star-outline'
    | 'trash-outline'
    | 'pencil-outline'
    | 'checkmark-outline';

interface Props {
    name: IonIconNames;
    size?: number;
    color?: string;
}

export const IonIcon = ({ name, size = 20, color = 'black'}: Props) => {
    return (
        <Icon
            name={name}
            size={size}
            color={color}
        />
    );
};
