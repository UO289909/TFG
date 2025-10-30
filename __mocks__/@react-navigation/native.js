const actualNav = jest.requireActual('@react-navigation/native');

module.exports = {
    ...actualNav,
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
    useTheme: () => ({
        colors: {
            primary: '#06B3DC',
            primaryDark: '#0489A8',
            card: '#fff',
            cardPressed: '#f0f0f0',
            text: '#111',
            grey: '#ccc',
            greyDark: '#999',
            shadow: '#000',
        },
    }),
    NavigationContainer: ({ children }) => children,
};
