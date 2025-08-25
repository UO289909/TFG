import { View, StyleSheet, ScrollView } from 'react-native';
import { globalColors } from '../../../config/app-theme';
import { FloatingButton } from '../../components/pressables';
import { launchImageLibrary } from 'react-native-image-picker';
import { ProfileInfoHeader } from '../../components/profile';
import { FullScreenLoader } from '../../components/feedback/FullScreenLoader';
import { useProfile } from '../../hooks/useProfile';

export const ProfileScreen = () => {

  const { isLoading, myProfile, changeAvatar } = useProfile();

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

    await changeAvatar(asset.uri!);

  };


  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ProfileInfoHeader
          nickname={myProfile!.nickname}
          name={myProfile!.full_name}
          avatarUrl={myProfile!.avatarUrl}
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
