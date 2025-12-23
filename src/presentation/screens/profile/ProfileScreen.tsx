/* eslint-disable react-hooks/exhaustive-deps */
import { View, StyleSheet, ScrollView, RefreshControl, useWindowDimensions, Text } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { ProfileInfoHeader } from '../../components/profile';
import { FullScreenLoader } from '../../components/feedback/FullScreenLoader';
import { useProfile } from '../../hooks/useProfile';
import { CustomMenuButton } from '../../components/pressables/CustomMenuButton';
import { useEffect, useState } from 'react';
import { NavigationProp, RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/ProfileStackNavigator';
import { CustomTheme } from '../../../config/app-theme';
import { ThemeSelectorMenu } from '../../components/profile/ThemeSelectorMenu';
import { useAuth } from '../../context/AuthContext';
import { CustomNotification } from '../../components/feedback';

export const ProfileScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const { params } = useRoute<RouteProp<RootStackParams, 'ProfileMenu'>>();
  const doRefetch = params?.doRefetch ?? false;

  const { colors } = useTheme() as CustomTheme;

  const {
    isLoading,
    isLoadingProfile,
    isLoadingFriendRequests,
    myProfile,
    refetch,
    refetchProfile,
    changeAvatar,
  } = useProfile();

  const { signOut, sendNonceCode, loading } = useAuth();

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height || width >= 768;

  const [showNotif, setShowNotif] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');

  const [changingAvatar, setChangingAvatar] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (doRefetch) {
      refetch();
      navigation.setParams({ doRefetch: false });
    }
  }, [doRefetch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleFriends = () => {
    navigation.navigate('Friends');
  };

  const handleSearchUsers = () => {
    navigation.navigate('SearchUsers');
  };

  const handleFriendRequests = () => {
    navigation.navigate('FriendRequests');
  };

  const handleChangePassword = async () => {
    try {
      await sendNonceCode();
    } catch (error: any) {
      navigation.navigate('PasswordChange', { alreadySentCode: true, notifPosition: 'bottom' });
      return;
    }
    navigation.navigate('PasswordChange', { alreadySentCode: false, notifPosition: 'bottom' });
  };

  const handleChangeNickname = () => {
    navigation.navigate('NicknameChange');
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    setNotifMessage('¿Estás seguro de que quieres cerrar sesión?');
    setShowNotif(true);
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
      await refetchProfile();

    } finally {
      setChangingAvatar(false);
    }

  };

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[colors.primary]}
    />
  );


  if (isLoading || loading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>

      {showThemeSelector &&
        <ThemeSelectorMenu
          onClose={() => setShowThemeSelector(false)}
        />
      }

      {showNotif &&
        <CustomNotification
          message={notifMessage}
          onClose={() => {
            setShowNotif(false);
            setSigningOut(false);
          }}
          onAccept={() => {
            setShowNotif(false);
            setSigningOut(false);
            signOut();
          }}
          position="bottom"
        />
      }

      <ProfileInfoHeader
        nickname={myProfile!.nickname}
        name={myProfile!.full_name}
        avatarUrl={myProfile!.avatarUrl}
        style={isLandscape ? styles.profileHeaderLandscape : styles.profileHeader}
        loadingAvatar={isLoadingProfile}
        landscape={isLandscape}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContainer, isLandscape && styles.scrollContainerLandscape]}
        refreshControl={refreshControl}
      >

        <Text style={{ ...styles.title, color: colors.text }}>Social</Text>

        <CustomMenuButton
          onPress={handleFriends}
          label="Amigos"
          icon="people"
          style={styles.button}
          disabled={loading || isLoadingFriendRequests}
        />

        <CustomMenuButton
          onPress={handleSearchUsers}
          label="Buscar usuarios"
          icon="search"
          style={styles.button}
          disabled={loading || isLoadingFriendRequests}
        />

        <CustomMenuButton
          onPress={handleFriendRequests}
          label="Solicitudes de amistad"
          icon="person-add"
          style={[styles.button, styles.bottomButton]}
          disabled={loading || isLoadingFriendRequests}
        />

        <Text style={{ ...styles.title, color: colors.text }}>Ajustes</Text>

        <CustomMenuButton
          onPress={handleChangeAvatar}
          label="Cambiar foto de avatar"
          icon="images"
          style={styles.button}
          disabled={loading || changingAvatar || isLoadingProfile}
        />

        <CustomMenuButton
          onPress={() => setShowThemeSelector(true)}
          label="Cambiar esquema de color"
          icon="contrast"
          style={styles.button}
          disabled={loading || showThemeSelector}
        />

        <CustomMenuButton
          onPress={handleChangePassword}
          label="Cambiar contraseña"
          icon="lock-open"
          style={styles.button}
          disabled={loading}
        />

        <CustomMenuButton
          onPress={handleChangeNickname}
          label="Cambiar nickname"
          icon="text"
          style={styles.button}
          disabled={loading}
        />

        <CustomMenuButton
          onPress={handleSignOut}
          label="Cerrar sesión"
          icon="log-out"
          style={styles.button}
          disabled={loading || signingOut}
        />

      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLandscape: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 20,
  },
  scrollContainerLandscape: {
    paddingVertical: 10,
    paddingHorizontal: 36,
  },
  profileHeader: {
    marginBottom: 0,
  },
  profileHeaderLandscape: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto-Italic',
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
  bottomButton: {
    marginBottom: 20,
  },
});
