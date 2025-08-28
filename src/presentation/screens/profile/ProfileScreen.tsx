/* eslint-disable react-hooks/exhaustive-deps */
import { View, StyleSheet, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { ProfileInfoHeader } from '../../components/profile';
import { FullScreenLoader } from '../../components/feedback/FullScreenLoader';
import { useProfile } from '../../hooks/useProfile';
import { CustomMenuButton } from '../../components/pressables/CustomMenuButton';
import { useCallback, useState } from 'react';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/ProfileStackNavigator';
import { globalStyles } from '../../../config/app-theme';

export const ProfileScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const { isLoading, myProfile, friendRequests, refetch, changeAvatar } = useProfile();

  const [changingAvatar, setChangingAvatar] = useState(false);

  const handleFriends = () => {
    navigation.navigate('Friends', { friendRequests });
  };

  const handleSearchUsers = () => {
    navigation.navigate('SearchUsers');
  };

  const handleFriendRequests = () => {
    navigation.navigate('FriendRequests');
  };

  const handleChangeAvatar = async () => {

    if (changingAvatar) {
      return;
    }

    setChangingAvatar(true);

    try {
      const picker = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      const asset = picker.assets ? picker.assets[0] : null;

      if (!asset || picker.didCancel) {
        setChangingAvatar(false);
        return;
      }

      await changeAvatar(asset.uri!);
    } finally {
      setChangingAvatar(false);
    }

  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );


  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={styles.container}>

      <ProfileInfoHeader
        nickname={myProfile!.nickname}
        name={myProfile!.full_name}
        avatarUrl={myProfile!.avatarUrl}
        style={styles.profileHeader}
      />

      <View style={globalStyles.separator} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>


        <CustomMenuButton
          onPress={handleChangeAvatar}
          label="Cambiar foto de avatar"
          icon="images"
          style={styles.button}
          disabled={changingAvatar}
        />

        <CustomMenuButton
          onPress={handleFriends}
          label="Amigos"
          icon="people"
          style={styles.button}
        />

        <CustomMenuButton
          onPress={handleSearchUsers}
          label="Buscar usuarios"
          icon="search"
          style={styles.button}
        />

        <CustomMenuButton
          onPress={handleFriendRequests}
          label="Solicitudes de amistad"
          icon="person-add"
          style={styles.button}
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
    alignItems: 'center',
    padding: 20,
  },
  profileHeader: {
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginBottom: 16,
    left: 0,
  },
  button: {
    width: '100%',
  },
});
