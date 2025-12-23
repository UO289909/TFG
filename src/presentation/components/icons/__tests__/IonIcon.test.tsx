/* eslint-disable @typescript-eslint/no-shadow */

import React from 'react';
import { render } from '@testing-library/react-native';
import { IonIcon } from '../IonIcon';

// mock @react-native-vector-icons/ionicons
jest.mock('@react-native-vector-icons/ionicons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return (props: any) => React.createElement(Text, { testID: 'ion-icon', ...props }, 'Icon');
});

describe('IonIcon', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<IonIcon name="home" />);
    const icon = getByTestId('ion-icon');
    expect(icon.props.name).toBe('home');
    expect(icon.props.size).toBe(20);
    expect(icon.props.color).toBe('black');
  });

  it('renders correctly with custom props', () => {
    const { getByTestId } = render(<IonIcon name="star" size={30} color="red" style={{ margin: 10 }} />);
    const icon = getByTestId('ion-icon');
    expect(icon.props.name).toBe('star');
    expect(icon.props.size).toBe(30);
    expect(icon.props.color).toBe('red');
    expect(icon.props.style).toEqual({ margin: 10 });
  });
});
