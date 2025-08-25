import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { CustomTextInput } from '../../components/inputs/CustomTextInput';
import { CustomButton } from '../../components/pressables/CustomButton';
import { openLibraryFetcher } from '../../../config/adapters/openLibrary.adapter';
import { useNavigation } from '@react-navigation/native';
import { FloatingButton } from '../../components/pressables/FloatingButton';
import { globalColors } from '../../../config/app-theme';
import { getBookByIsbn } from '../../../core/use-cases/books/get-book-by-isbn.use-case';
import { Book } from '../../../core/entities/book.entity';
import { postNewBook } from '../../../core/use-cases/books/post-new-book-to-user.use-case';
import { CustomNotification } from '../../components/feedback/CustomNotification';

export const AddBookScreen = () => {

  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState('');
  const [year, setYear] = useState('');
  const [cover, setCover] = useState('');
  const [fieldsEnabled, setFieldsEnabled] = useState<string[]>(['isbn']);

  const [showNotif, setShowNotif] = useState(true);
  const [notifMsg, setNotifMsg] = useState('Introduce el ISBN del libro para buscarlo');

  const [isNewBook, setIsNewBook] = useState(false);
  const [canSearch, setCanSearch] = useState(true);

  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSearchISBN = async () => {
    try {
      const { book, fromOpenLibrary, alreadyInUser } = await getBookByIsbn(openLibraryFetcher, isbn);

      if (alreadyInUser) {
        setNotifMsg('Este libro ya está en tu colección');
        setShowNotif(true);
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

        setNotifMsg('Rellena los campos que quieras editar y guarda tu libro');
        setShowNotif(true);
      } else {
        setNotifMsg('No se encontró ningún libro con ese ISBN, prueba otro');
        setShowNotif(true);
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
      rating: null,
      start_date: null,
      finish_date: null,
    };

    await postNewBook(book, fieldsEnabled, isNewBook);

    handleGoBack();

  };

  return (
    <View style={styles.container}>

      {showNotif &&
        <CustomNotification
          message={notifMsg}
          position="bottom"
          onClose={() => setShowNotif(false)}
        />
      }

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.searchContainer}>
          <CustomTextInput
            label="ISBN:"
            value={isbn}
            onChangeText={setIsbn}
            placeholder="Introduce ISBN de 13 dígitos"
            style={styles.container}
            keyboardType="numeric"
            editable={fieldsEnabled.includes('isbn')}
          />
          <CustomButton
            title="Buscar"
            onPress={handleSearchISBN}
            style={styles.button}
            disabled={!canSearch || !(isbn.length === 13)}
          />
        </View>

        <View style={styles.separator} />

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
      </ScrollView>
      <FloatingButton
        onPress={handleGoBack}
        icon="close-outline"
        position="bottom-left"
        color={globalColors.danger}
        colorPressed={globalColors.dangerDark}
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 1,
  },
});
