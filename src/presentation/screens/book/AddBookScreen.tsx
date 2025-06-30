/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { CustomTextInput } from '../../components/inputs/CustomTextInput';
import { CustomButton } from '../../components/pressables/CustomButton';
import { openLibraryFetcher } from '../../../config/adapters/openLibrary.adapter';
import { useNavigation } from '@react-navigation/native';
import { FloatingButton } from '../../components/pressables/FloatingButton';
import { globalColors } from '../../../config/app-theme';
import { getBookByIsbn } from '../../../core/use-cases/get-book-by-isbn.use-case';
import { Book } from '../../../core/entities/book.entity';
import { postNewBook } from '../../../core/use-cases/post-new-book-to-user.use-case';

export const AddBookScreen = () => {
  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState('');
  const [year, setYear] = useState('');
  const [cover, setCover] = useState('');
  const [infoText, setInfoText] = useState('Introduce el ISBN del libro para buscarlo');
  const [isNewBook, setIsNewBook] = useState(false);
  const [canSearch, setCanSearch] = useState(true);
  const [fieldsEnabled, setFieldsEnabled] = useState<string[]>(['isbn']);

  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSearchISBN = async () => {
    try {
      const { book, fromOpenLibrary, alreadyInUser } = await getBookByIsbn(openLibraryFetcher, isbn);

      if (alreadyInUser) {
        setInfoText('Este libro ya está en tu colección');
        return;
      }

      if (book !== null) {

        if (fromOpenLibrary) {
          setIsNewBook(true);
        }

        setFieldsEnabled([]);
        setTitle(book.title);

        if (book.author) { setAuthor(book.author); }
        else { setFieldsEnabled(prev => [...prev, 'author']); }

        if (book.pages) { setPages(book.pages.toString()); }
        else { setFieldsEnabled(prev => [...prev, 'pages']); }

        if (book.release_year) { setYear(book.release_year); }
        else { setFieldsEnabled(prev => [...prev, 'year']); }

        if (book.cover_url) { setCover(book.cover_url); }
        else { setFieldsEnabled(prev => [...prev, 'cover']); }

        setCanSearch(false);
        setInfoText('Libro encontrado, añade los campos restantes si los hay');
      } else {
        setInfoText('No se encontró ningún libro con ese ISBN\nPrueba otro');
      }
    } catch (error) {
      throw new Error(`Error searching book by ISBN: ${error}`);
    }
  };

  const handleAddBook = async () => {
    const book: Book = {
      title,
      isbn: isbn,
      author: author,
      pages: pages,
      release_year: year,
      cover_url: cover,
    };

    await postNewBook(book, fieldsEnabled, isNewBook);

    handleGoBack();

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
            onPress={handleSearchISBN}
            style={{ marginLeft: 10 }}
            disabled={!canSearch || !(isbn.length === 13)}
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
          value={author}
          onChangeText={setAuthor}
          editable={fieldsEnabled.includes('author')}
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
          label="URL de la portada (opcional):"
          value={cover}
          onChangeText={setCover}
          editable={fieldsEnabled.includes('cover')}
        />
        <Text
          style={{
            marginTop: 10,
            color: globalColors.primary,
            fontFamily: 'Roboto-Medium',
            fontSize: 16,
            textAlign: 'center',
          }}
        >
          {infoText}
        </Text>
      </ScrollView>
      <FloatingButton
        onPress={handleGoBack}
        icon="close-outline"
        position="bottom-left"
        color={globalColors.primary}
        colorPressed={globalColors.primaryDark}
      />
      <FloatingButton
        onPress={handleAddBook}
        icon="add-outline"
        position="bottom-right"
        color={globalColors.primary}
        colorPressed={globalColors.primaryDark}
        disabled={!isbn || !title || !author || !pages || !year}
      />
    </View>
  );
};
