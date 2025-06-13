/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, TextInput, Text, ScrollView } from 'react-native';
import { CustomTextInput } from '../../components/inputs/CustomTextInput';
import { CustomButton } from '../../components/pressables/CustomButton';
// import { openLibraryFetcher } from '../../../config/adapters/openLibrary.adapter';

export const AddBookScreen = () => {
  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [pages, setPages] = useState('');
  const [genre, setGenre] = useState('');
  const [cover, setCover] = useState('');

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
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>ISBN:</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <CustomTextInput
          label="ISBN:"
          value={isbn}
          onChangeText={setIsbn}
          placeholder="Introduce ISBN"
          style={{ flex: 1 }}
        />
        <CustomButton
          title="Buscar"
          onPress={handleFetchFromOpenLibrary}
          style={{ marginLeft: 10}}
        />
      </View>
      <Text>Título:</Text>
      <TextInput value={title} onChangeText={setTitle} style={{ borderBottomWidth: 1 }} />
      <Text>Autor(es):</Text>
      <TextInput value={authors} onChangeText={setAuthors} style={{ borderBottomWidth: 1 }} />
      <Text>Páginas:</Text>
      <TextInput value={pages} onChangeText={setPages} keyboardType="numeric" style={{ borderBottomWidth: 1 }} />
      <Text>Género:</Text>
      <TextInput value={genre} onChangeText={setGenre} style={{ borderBottomWidth: 1 }} />
      <Text>Portada (URL):</Text>
      <TextInput value={cover} onChangeText={setCover} style={{ borderBottomWidth: 1 }} />
      {/* Aquí puedes añadir el botón para guardar el libro */}
    </ScrollView>
  );
};
