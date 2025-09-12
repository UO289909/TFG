import { Text, StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GoogleAuthButton } from '../../components/pressables';
import { NavigationProp, useNavigation, useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';
import { CustomTextInput } from '../../components/inputs';
import { CustomButton } from '../../components/pressables';
import { CustomNotification, FullScreenLoader } from '../../components/feedback';
import { RootStackParams } from '../../navigation/AuthStackNavigator';

export const SignInScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const { colors } = useTheme() as CustomTheme;

  const [showNotif, setShowNotif] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');

  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Aquí iría la lógica de Google Sign-In con Supabase
  const handleGoogleSignIn = async () => {
    // Implementa aquí la integración con Supabase y Google
    // Ejemplo: await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      setNotifMessage('Error al iniciar sesión. Revisa tus credenciales.');
      setEmail('');
      setPassword('');
      setShowNotif(true);
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

      {showNotif &&
        <CustomNotification
          message={notifMessage}
          onClose={() => setShowNotif(false)}
          position="top"
        />
      }

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Text style={{ ...styles.title, color: colors.text }}>Iniciar Sesión</Text>

        <Text style={{ ...styles.subtitle, color: colors.text }}>Correo electrónico</Text>
        <CustomTextInput
          style={styles.input}
          placeholder="something@provider.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={{ ...styles.subtitle, color: colors.text }}>Contraseña</Text>
        <CustomTextInput
          style={styles.input}
          placeholder="1234abcd"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <CustomButton
          title="Iniciar sesión"
          onPress={handleSignIn}
          disabled={!email || !password}
        />

        <Text style={{ ...styles.forgot, color: colors.text }} onPress={() => {/* navega a PasswordResetScreen */ }}>
          o también puedes...
        </Text>

        <GoogleAuthButton
          onPress={handleGoogleSignIn}
          type="signIn"
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
  subtitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginBottom: 8,
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
