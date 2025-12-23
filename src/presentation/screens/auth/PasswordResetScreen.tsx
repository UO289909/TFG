import { StyleSheet, ScrollView, View } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CustomTextInput } from '../../components/inputs';
import { CustomButton } from '../../components/pressables';
import { CustomNotification, FullScreenLoader } from '../../components/feedback';
import { isValidEmail } from '../../../utils/isValidEmail';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/AuthStackNavigator';

export const PasswordResetScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const [showNotif, setShowNotif] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');

  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {

    if (!isValidEmail(email)) {
      setNotifMessage('El correo electrónico no es válido');
      setShowNotif(true);
      return;
    }

    try {
      await resetPassword(email);
      setNotifMessage('Revisa tu correo para las instrucciones de reseteo');
      setShowNotif(true);
      setEmail('');
      navigation.navigate('PasswordChange', { alreadySentCode: true, notifPosition: 'top' });
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

        <CustomTextInput
          label="Correo electrónico"
          style={styles.input}
          placeholder="something@provider.com"
          value={email}
          onChangeText={text => setEmail(text.replace(/\s/g, ''))}
          keyboardType="email-address"
          autoCapitalize="none"
          info="Si el correo está registrado, recibirás un email con instrucciones para resetear tu contraseña"
        />

        <CustomButton
          title="Resetear contraseña"
          onPress={handleResetPassword}
          disabled={!email}
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
  input: {
    marginBottom: 16,
  },
});
