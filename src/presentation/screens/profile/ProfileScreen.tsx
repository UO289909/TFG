import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { globalColors, globalStyles } from '../../../config/app-theme';
import { FloatingButton } from '../../components/pressables';
import { launchImageLibrary } from 'react-native-image-picker';
import { useEffect, useState } from 'react';
import { getUserAvatarUrl } from '../../../core/use-cases/user/get-user-avatar-url.use-case';
import { changeUserAvatar } from '../../../core/use-cases/user/change-user-avatar.use-case';

export const ProfileScreen = () => {

  const [avatarUrl, setAvatarUrl] = useState<string>('https://placehold.co/80x80.png?text=NoAvatar');

  useEffect(() => {
    loadUserAvatar();
  }, []);

  const loadUserAvatar = async () => {
    const url = await getUserAvatarUrl();
    setAvatarUrl(url);
  };

  const handleChangeAvatar = async () => {

    const picker = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });
    const asset = picker.assets ? picker.assets[0] : null;
    console.log(asset?.uri);
    if (!asset || picker.didCancel) {
      return;
    }

    await changeUserAvatar(asset.uri!);

    await loadUserAvatar();

  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={globalStyles.titleText}>Perfil</Text>
        <Image
          style={styles.avatar}
          source={{ uri: avatarUrl }}
        />
      </ScrollView>

      <FloatingButton
        onPress={handleChangeAvatar}
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
