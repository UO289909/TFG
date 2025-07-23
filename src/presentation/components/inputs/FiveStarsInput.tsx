/* eslint-disable react-native/no-inline-styles */
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { IonIcon } from '../icons/IonIcon';

interface Props {
    onPress: () => void;
}

export const FiveStarsInput = ({ onPress }: Props) => {
    const [rating, setRating] = useState(0);

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map((star, idx) => (
                <TouchableOpacity
                    key={star}
                    onPress={() => {
                        rating === star ? setRating(0) : setRating(star);
                        onPress();
                    }}
                    style={{ marginRight: idx !== 4 ? 8 : 0 }}
                >
                    <IonIcon
                        name={rating >= star ? 'star' : 'star-outline'}
                        size={36}
                        color={rating >= star ? '#FFD700' : '#AAA'}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};
