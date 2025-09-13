import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';
import { CustomTextInput } from '../../components/inputs';
import { CustomButton } from '../../components/pressables';
import { CustomNotification, FullScreenLoader } from '../../components/feedback';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail } from '../../../utils/isValidEmail';

export const SignUpScreen = () => {

  const { colors } = useTheme() as CustomTheme;
  const { signUp, loading } = useAuth();

  const [showNotif, setShowNotif] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSignUp = async () => {

    if (!isValidEmail(email)) {
      setNotifMessage('El correo electrónico no es válido');
      setShowNotif(true);
      return;
    }

    if (password !== confirmPassword) {
      setNotifMessage('Las contraseñas no coinciden');
      setShowNotif(true);
      return;
    }

    try {
      const success = await signUp(email, password, fullName.trim(), nickname);
      if (success) {
        setNotifMessage('¡Registro exitoso! Confirma tu email y podrás iniciar sesión');
        setShowNotif(true);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        setNickname('');
      }
    } catch (error: any) {
      setNotifMessage(error.message);
      setShowNotif(true);
    }
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
        <Text style={{ ...styles.title, color: colors.text }}>Registrarse</Text>

        <CustomTextInput
          label="Nombre completo"
          style={styles.input}
          placeholder="Nombre y apellidos"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />

        <CustomTextInput
          label="Nickname"
          style={styles.input}
          placeholder="Tu apodo"
          value={nickname}
          onChangeText={text => setNickname(text.replace(/\s/g, ''))}
          autoCapitalize="none"
        />

        <CustomTextInput
          label="Correo Electrónico"
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
          placeholder="1234abcd"
          value={password}
          onChangeText={text => setPassword(text.replace(/\s/g, ''))}
          secureTextEntry={true}
        />

        <CustomTextInput
          label="Repetir contraseña"
          style={styles.input}
          placeholder="1234abcd"
          value={confirmPassword}
          onChangeText={text => setConfirmPassword(text.replace(/\s/g, ''))}
          secureTextEntry={true}
        />

        <CustomButton
          title="Registrarse"
          onPress={handleSignUp}
          disabled={!email || !password || !fullName || !nickname}
        />

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
    fontSize: 14,
    fontFamily: 'Roboto-Light',
    textAlign: 'center',
  },
});
