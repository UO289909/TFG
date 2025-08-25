import { View, StyleSheet, ScrollView } from 'react-native';
import { globalColors } from '../../../config/app-theme';
import { FloatingButton } from '../../components/pressables';
import { launchImageLibrary } from 'react-native-image-picker';
import { useEffect, useState } from 'react';
import { getUserAvatarUrl } from '../../../core/use-cases/user/get-user-avatar-url.use-case';
import { changeUserAvatar } from '../../../core/use-cases/user/change-user-avatar.use-case';
import { ProfileInfoHeader } from '../../components/profile';
import { FullScreenLoader } from '../../components/feedback/FullScreenLoader';

export const ProfileScreen = () => {

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUserAvatar();
  }, []);

  const loadUserAvatar = async () => {
    setIsLoading(true);
    const url = await getUserAvatarUrl();
    setAvatarUrl(url);
    setIsLoading(false);
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


  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ProfileInfoHeader
          username="inakitotuya"
          name="Iñaki Tuya Rodríguez"
          avatarUrl={avatarUrl}
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
  profileHeader: {
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginBottom: 16,
    left: 0,
  },
});
