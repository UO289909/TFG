import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { globalColors, globalStyles } from '../../../config/app-theme';
import { FloatingButton } from '../../components/pressables';
import { launchImageLibrary } from 'react-native-image-picker';
import { useState } from 'react';

export const ProfileScreen = () => {

  const [avatar, setAvatar] = useState<string>('https://placehold.co/80x80.png?text=Avatar');

  const handleAddAvatar = () => {

    launchImageLibrary(
      {
        mediaType: 'photo',
        maxHeight: 200,
        maxWidth: 200,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0].uri;
          if (selectedImage) {
            setAvatar(selectedImage);
          }
        }
      }
    );
  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={globalStyles.titleText}>Perfil</Text>
        <Image
          style={styles.avatar}
          source={{ uri: avatar }}
        />
      </ScrollView>

      <FloatingButton
        onPress={handleAddAvatar}
        position="bottom-right"
        icon="pencil-outline"
        color={globalColors.primary}
        colorPressed={globalColors.primaryDark}
      />

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginBottom: 16,
  },
});
