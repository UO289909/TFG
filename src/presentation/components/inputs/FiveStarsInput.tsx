import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { IonIcon } from '../icons/IonIcon';

interface Props {
    onPress: (rating: number) => void;
    value?: number | null;
    editable?: boolean;
    size?: 'large' | 'small' | 'tiny';
}

export const FiveStarsInput = ({ onPress, value = 0, editable = true, size = 'large' }: Props) => {
    const [rating, setRating] = useState(value === null ? 0 : value > 5 ? 5 : value < 0 ? 0 : value);

    return (
        <View style={styles.container}>
            {[1, 2, 3, 4, 5].map((star, idx) => (
                <TouchableOpacity
                    key={star}
                    onPress={
                        editable
                            ? () => {
                                  rating === star ? setRating(0) : setRating(star);
                                  onPress(rating === star ? 0 : star);
                              }
                            : () => {}
                    }
                    activeOpacity={editable ? 0.2 : 1}
                    style={idx !== 4 ? styles.starWithMargin : styles.starLast}
                    disabled={!editable}
                >
                    <IonIcon
                        name={rating >= star ? 'star' : 'star-outline'}
                        size={size === 'tiny' ? 14 : size === 'small' ? 24 : 36}
                        color={
                            editable
                                ? '#AAA'
                                : rating >= star
                                    ? '#FFD700'
                                    : '#AAA'
                        }
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    starWithMargin: {
        marginRight: 8,
    },
    starLast: {
        marginRight: 0,
    },
});
