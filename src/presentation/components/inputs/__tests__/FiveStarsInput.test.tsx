import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FiveStarsInput } from '../FiveStarsInput';

// IonIcon mock
jest.mock('../../icons/IonIcon', () => {
  const { Text } = require('react-native');
  return {
    IonIcon: ({ name }: any) => <Text>{`icon-${name}`}</Text>,
  };
});


describe('FiveStarsInput', () => {
    it('renders 5 stars', () => {
        const { getAllByText } = render(<FiveStarsInput onPress={() => { }} />);
        const stars = getAllByText(/icon-star-outline/);
        expect(stars.length).toBe(5);
    });

    it('calls onPress with the correct value when a star is pressed', () => {
        const mockOnPress = jest.fn();
        const { getAllByText, rerender } = render(<FiveStarsInput onPress={mockOnPress} />);

        const stars = getAllByText(/icon-star-outline/);
        fireEvent.press(stars[2]); // third star (value 3)

        expect(mockOnPress).toHaveBeenCalledWith(3);

        rerender(<FiveStarsInput onPress={mockOnPress} value={3} />);
        const newStars = getAllByText(/icon-star/);
        expect(newStars.length).toBeGreaterThan(0);
    });

    it('not calls onPress when editable is false', () => {
        const mockOnPress = jest.fn();
        const { getAllByText } = render(
            <FiveStarsInput onPress={mockOnPress} editable={false} />
        );

        const estrellas = getAllByText(/icon-star-outline/);
        fireEvent.press(estrellas[0]);
        expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('limits the max and min value without error', () => {
        render(<FiveStarsInput onPress={() => { }} value={8} />);
        render(<FiveStarsInput onPress={() => { }} value={-2} />);
    });
});
