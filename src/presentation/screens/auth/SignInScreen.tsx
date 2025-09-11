import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GoogleAuthButton } from '../../components/pressables';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';
import { CustomTextInput } from '../../components/inputs';
import { CustomButton } from '../../components/pressables';
import { CustomNotification } from '../../components/feedback';

export const SignInScreen = () => {

  const [showNotif, setShowNotif] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');

  const { colors } = useTheme() as CustomTheme;

  const { signIn } = useAuth();
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
      console.log('Error al iniciar sesión:', error);
      setNotifMessage('Error al iniciar sesión. Revisa tus credenciales.');
      setShowNotif(true);
    }
  };

  return (
    <View style={styles.container}>

      {showNotif &&
        <CustomNotification
          message={notifMessage}
          onClose={() => setShowNotif(false)}
          position="bottom"
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

        <CustomButton title="Iniciar sesión" onPress={handleSignIn} />
        <Text style={{ ...styles.forgot, color: colors.secondaryText }} onPress={() => {/* navega a PasswordResetScreen */ }}>
          o también puedes...
        </Text>
        <GoogleAuthButton onPress={handleGoogleSignIn} type="signIn" />


        {/* Aquí puedes añadir el enlace para recuperar contraseña */}
        <Text style={{ ...styles.forgot, color: colors.secondaryText }} onPress={() => {/* navega a PasswordResetScreen */ }}>
          ¿Has olvidado tu contraseña?
        </Text>

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
  forgot: {
    marginTop: 18,
    textAlign: 'center',
  },
});
