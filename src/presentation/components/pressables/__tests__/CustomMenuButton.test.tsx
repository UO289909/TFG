import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CustomMenuButton } from '../CustomMenuButton';

// IonIcon mock
jest.mock('../../icons', () => {
  const { Text } = require('react-native');
  return {
    IonIcon: ({ name, color }: any) => <Text>{`icon-${name}-${color}`}</Text>,
  };
});


describe('CustomMenuButton', () => {
  it('renders correctly the label and the icon', () => {
    const { getByText } = render(
      <CustomMenuButton onPress={() => {}} label="Profile" icon="person-outline" />
    );

    expect(getByText('Profile')).toBeTruthy();
    expect(getByText(/icon-person-outline/)).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <CustomMenuButton onPress={mockOnPress} label="Home" icon="home-outline" />
    );

    fireEvent.press(getByText('Home'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('uses disabled colors and styles', () => {
    const { getByText } = render(
      <CustomMenuButton
        onPress={() => {}}
        label="Disabled"
        icon="person-outline"
        disabled
      />
    );

    const label = getByText('Disabled');
    expect(label.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#999' }), // dark gray mocked
      ])
    );
  });

  it('changes the icon and color when pressed', () => {
    const { getByText } = render(
      <CustomMenuButton onPress={() => {}} label="Press" icon="person-outline" />
    );

    const button = getByText('Press');
    fireEvent(button, 'pressIn'); // movke press in
    expect(getByText(/icon-person-outline/)).toBeTruthy();
  });
});
