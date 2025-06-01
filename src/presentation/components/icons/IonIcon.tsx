import Icon from '@react-native-vector-icons/ionicons';

type IonIconNames =
    | 'book-outline'
    | 'library-outline'
    | 'person-outline'
    | 'home-outline'
    | 'add-outline';

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
