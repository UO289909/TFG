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
  const [fieldsEnabled, setFieldsEnabled] = useState<string[]>(['isbn']);

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
            editable={fieldsEnabled.includes('isbn')}
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
          editable={fieldsEnabled.includes('title')}
        />
        <CustomTextInput
          label="Autor:"
          value={authors}
          onChangeText={setAuthors}
          editable={fieldsEnabled.includes('authors')}
        />
        <CustomTextInput
          label="Número de páginas:"
          value={pages}
          onChangeText={setPages}
          keyboardType="numeric"
          editable={fieldsEnabled.includes('pages')}
        />
        <CustomTextInput
          label="Año de publicación:"
          value={year}
          onChangeText={setYear}
          editable={fieldsEnabled.includes('year')}
        />
        <CustomTextInput
          label="Portada (URL):"
          value={cover}
          onChangeText={setCover}
          editable={fieldsEnabled.includes('cover')}
        />
      </ScrollView>
      <FloatingButton
        onPress={handleGoBack}
        icon="close-outline"
        position="bottom-left"
        color={globalColors.primary}
        colorPressed={globalColors.primaryDark}
      />
      <FloatingButton
        onPress={handleGoBack}
        icon="add-outline"
        position="bottom-right"
        color={globalColors.primary}
        colorPressed={globalColors.primaryDark}
        disabled={!isbn || !title || !authors || !pages || !year || !cover}
      />
    </View>
  );
};
