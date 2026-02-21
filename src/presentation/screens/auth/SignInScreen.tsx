import { Text, StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GoogleAuthButton } from '../../components/pressables';
import { NavigationProp, useNavigation, useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';
import { CustomTextInput } from '../../components/inputs';
import { CustomButton } from '../../components/pressables';
import { FullScreenLoader } from '../../components/feedback';
import { RootStackParams } from '../../navigation/AuthStackNavigator';
import { isValidEmail } from '../../../utils/isValidEmail';
import { useNotification } from '../../context/NotificationContext';

export const SignInScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const { colors } = useTheme() as CustomTheme;

  const { showNotification } = useNotification();

  const { signIn, signInWithGoogle, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      showNotification({ message: 'Error al iniciar sesión con Google.', position: 'top' });
    }
  };

  const handleSignIn = async () => {

    if (!isValidEmail(email)) {
      showNotification({ message: 'El correo electrónico no es válido', position: 'top' });
      return;
    }

    try {
      await signIn(email, password);
    } catch (error: any) {
      showNotification({ message: error.message, position: 'top' });
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('PasswordReset');
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Text style={{ ...styles.title, color: colors.text }}>Iniciar Sesión</Text>

        <CustomTextInput
          label="Correo electrónico"
          style={styles.input}
          placeholder="something@provider.com"
          value={email}
          onChangeText={text => setEmail(text.replace(/\s/g, ''))}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <CustomTextInput
          label="Contraseña"
          style={styles.input}
          placeholder="abcD5*"
          value={password}
          onChangeText={text => setPassword(text.replace(/\s/g, ''))}
          secureTextEntry={true}
        />

        <CustomButton
          title="Iniciar sesión"
          onPress={handleSignIn}
          disabled={!email || !password}
        />

        <Text style={{ ...styles.forgot, color: colors.text }}>
          o también puedes...
        </Text>

        <GoogleAuthButton
          onPress={handleGoogleSignIn}
        />

        <TouchableOpacity style={styles.forgotContainer} onPress={handleForgotPassword}>
          <Text style={{ ...styles.forgot, color: colors.secondaryText }} >
            ¿Has olvidado tu contraseña?
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  forgotContainer: {
    paddingVertical: 20,
  },
  forgot: {
    marginTop: 18,
    fontSize: 14,
    fontFamily: 'Roboto-Light',
    textAlign: 'center',
  },
});
