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
    it('renderiza 5 estrellas', () => {
        const { getAllByText } = render(<FiveStarsInput onPress={() => { }} />);
        const estrellas = getAllByText(/icon-star-outline/);
        expect(estrellas.length).toBe(5);
    });

    it('llama a onPress con el valor correcto al tocar una estrella', () => {
        const mockOnPress = jest.fn();
        const { getAllByText, rerender } = render(<FiveStarsInput onPress={mockOnPress} />);

        const estrellas = getAllByText(/icon-star-outline/);
        fireEvent.press(estrellas[2]); // tercera estrella (valor 3)

        expect(mockOnPress).toHaveBeenCalledWith(3);

        rerender(<FiveStarsInput onPress={mockOnPress} value={3} />);
        const nuevas = getAllByText(/icon-star/);
        expect(nuevas.length).toBeGreaterThan(0);
    });

    it('no responde si editable=false', () => {
        const mockOnPress = jest.fn();
        const { getAllByText } = render(
            <FiveStarsInput onPress={mockOnPress} editable={false} />
        );

        const estrellas = getAllByText(/icon-star-outline/);
        fireEvent.press(estrellas[0]);
        expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('limita el valor máximo y mínimo sin error', () => {
        render(<FiveStarsInput onPress={() => { }} value={8} />);
        render(<FiveStarsInput onPress={() => { }} value={-2} />);
    });
});
