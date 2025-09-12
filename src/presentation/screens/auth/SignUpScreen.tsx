import { Text, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
import { GoogleAuthButton } from '../../components/pressables';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';
import { CustomTextInput } from '../../components/inputs';
import { CustomButton } from '../../components/pressables';

export const SignUpScreen = () => {
  const { colors } = useTheme() as CustomTheme;
  // const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');

  // Aquí iría la lógica de registro con Google
  const handleGoogleSignUp = async () => {
    // Implementa aquí la integración con Supabase y Google
    // Ejemplo: await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const handleSignUp = async () => {

  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ ...styles.title, color: colors.text }}>Registrarse</Text>

      <Text style={{ ...styles.subtitle, color: colors.text }}>Nombre completo</Text>
      <CustomTextInput
        style={styles.input}
        placeholder="Nombre y apellidos"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
      />

      <Text style={{ ...styles.subtitle, color: colors.text }}>Nickname</Text>
      <CustomTextInput
        style={styles.input}
        placeholder="Tu apodo"
        value={nickname}
        onChangeText={setNickname}
        autoCapitalize="none"
      />

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
        title="Registrarse"
        onPress={handleSignUp}
        disabled={!email || !password || !fullName || !nickname}
      />
      <Text style={{ ...styles.forgot, color: colors.text }}>
        o también puedes...
      </Text>
      <GoogleAuthButton onPress={handleGoogleSignUp} type="signUp" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
    fontSize: 14,
    fontFamily: 'Roboto-Light',
    textAlign: 'center',
  },
});
