/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { CustomTextInput } from '../../components/inputs/CustomTextInput';
import { CustomButton } from '../../components/pressables/CustomButton';
// import { openLibraryFetcher } from '../../../config/adapters/openLibrary.adapter';
import { useNavigation } from '@react-navigation/native';
import { FloatingButton } from '../../components/pressables/FloatingButton';
import { globalColors } from '../../../config/app-theme';

export const AddBookScreen = () => {
  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [pages, setPages] = useState('');
  const [year, setYear] = useState('');
  const [cover, setCover] = useState('');

  const navigation = useNavigation();

    const handleGoBack = () => {
      navigation.goBack();
    };

  const handleFetchFromOpenLibrary = async () => {
    // try {
    //   const details = await openLibraryFetcher.get('', {
    //     params: {
    //       format: 'json',
    //       jscmd: 'data',
    //       bibkeys: `ISBN:${isbn}`,
    //     },
    //   });
    //   const bookData = Object.values(details)[0];
    //   if (bookData) {
    //     setTitle(bookData.title || '');
    //     setAuthors(bookData.authors?.map(a => a.name).join(', ') || '');
    //     setPages(bookData.number_of_pages?.toString() || '');
    //     setCover(bookData.cover?.medium || '');
    //   }
    // } catch (e) {
    //   // Maneja el error
    // }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CustomTextInput
            label="ISBN:"
            value={isbn}
            onChangeText={setIsbn}
            placeholder="Introduce ISBN de 13 dígitos"
            style={{ flex: 1 }}
            keyboardType="numeric"
          />
          <CustomButton
            title="Buscar"
            onPress={handleFetchFromOpenLibrary}
            style={{ marginLeft: 10 }}
          />
        </View>
        <CustomTextInput
          label="Título:"
          value={title}
          onChangeText={setTitle}
        />
        <CustomTextInput
          label="Autor:"
          value={authors}
          onChangeText={setAuthors}
        />
        <CustomTextInput
          label="Número de páginas:"
          value={pages}
          onChangeText={setPages}
          keyboardType="numeric"
        />
        <CustomTextInput
          label="Año de publicación:"
          value={year}
          onChangeText={setYear}
        />
        <CustomTextInput
          label="Portada (URL):"
          value={cover}
          onChangeText={setCover}
        />
      </ScrollView>
      <FloatingButton
              onPress={ handleGoBack }
              icon="close-outline"
              position="bottom-left"
              color={ globalColors.primary }
              colorPressed={ globalColors.primaryDark }
            />
    </View>
  );
};
