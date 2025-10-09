import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { CustomTextInput } from '../../components/inputs/CustomTextInput';
import { openLibraryFetcher } from '../../../config/adapters/openLibrary.adapter';
import { NavigationProp, useNavigation, useTheme } from '@react-navigation/native';
import { FloatingButton } from '../../components/pressables/FloatingButton';
import { CustomTheme } from '../../../config/app-theme';
import { getBookByIsbn } from '../../../core/use-cases/books/get-book-by-isbn.use-case';
import { Book } from '../../../core/entities/book.entity';
import { postNewBook } from '../../../core/use-cases/books/post-new-book-to-user.use-case';
import { CustomNotification } from '../../components/feedback/CustomNotification';
import { SearchBar } from '../../components/inputs';
import { normalizeDateToYear } from '../../../utils/normalizeDateToYear';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { FullScreenLoader } from '../../components/feedback';

export const AddBookScreen = () => {

  const { colors } = useTheme() as CustomTheme;

  const today = new Date();

  const [loadingBook, setLoadingBook] = useState(false);
  const [addingBook, setAddingBook] = useState(false);

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

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSearchISBN = async (text: string) => {

    setLoadingBook(true);
    setFieldsEnabled([]);

    if (text.length === 0) {
      setFieldsEnabled(['isbn']);
      return;
    }

    if (text.length !== 13) {
      setFieldsEnabled(['isbn']);
      setNotifMsg(`El ISBN debe tener 13 dígitos (actualmente ${text.length})`);
      setShowNotif(true);
      return;
    }

    setIsbn(text);

    try {
      const { book, fromOpenLibrary, alreadyInUser } = await getBookByIsbn(openLibraryFetcher, text);

      if (alreadyInUser) {
        setFieldsEnabled(['isbn']);
        setNotifMsg('Este libro ya está en tu colección');
        setShowNotif(true);
        return;
      }

      if (book !== null) {
        if (fromOpenLibrary) {
          setIsNewBook(true);
        }

        console.log('Libro encontrado:', book);

        setFieldsEnabled([]);
        setTitle(book.title);

        if (book.author) { setAuthor(book.author); }
        else { setFieldsEnabled(prev => [...prev, 'author']); }

        if (book.pages) { setPages(book.pages.toString()); }
        else { setFieldsEnabled(prev => [...prev, 'pages']); }

        if (book.release_year) {
          setYear(normalizeDateToYear(book.release_year));
        }
        else { setFieldsEnabled(prev => [...prev, 'year']); }

        if (book.cover_url) { setCover(book.cover_url); }
        else { setFieldsEnabled(prev => [...prev, 'cover']); }

        setNotifMsg('Rellena los campos que quieras editar y guarda tu libro');
        setShowNotif(true);
      } else {
        setFieldsEnabled(['isbn']);
        setNotifMsg('No se encontró ningún libro con ese ISBN, prueba otro');
        setShowNotif(true);
      }
    } catch (error) {
      throw new Error(`Error searching book by ISBN: ${error}`);
    } finally {
      setLoadingBook(false);
    }
  };

  const handleAddBook = async () => {

    setAddingBook(true);

    const book: Book = {
      title,
      isbn: isbn,
      author: author,
      pages: pages,
      current_page: null,
      release_year: year,
      cover_url: cover,
      rating: null,
      start_date: null,
      finish_date: null,
      created_at: null,
    };

    await postNewBook(book, fieldsEnabled, isNewBook);

    setAddingBook(false);

    navigation.reset({
      index: 0,
      routes: [
        { name: 'MyBooksList', params: { doRefetch: true } },
      ],
    });

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

      <SearchBar
        placeholder="Introduce el ISBN de 13 dígitos..."
        numeric
        disabled={!fieldsEnabled.includes('isbn')}
        onSearch={handleSearchISBN}
      />

      <View style={{ ...styles.separator, shadowColor: colors.shadow }} />


      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {(loadingBook || addingBook) &&
          <FullScreenLoader
            message={
              loadingBook
                ? 'Buscando información del libro...'
                : 'Añadiendo libro a tu colección...'
            }
            style={styles.loader}
          />
        }

        <CustomTextInput
          label="Título:"
          value={title}
          onChangeText={setTitle}
          editable={fieldsEnabled.includes('title') && !addingBook}
          style={styles.textInput}
        />
        <CustomTextInput
          label="Autor:"
          value={author}
          onChangeText={setAuthor}
          editable={fieldsEnabled.includes('author') && !addingBook}
          style={styles.textInput}
        />
        <CustomTextInput
          label="Número de páginas:"
          value={pages}
          onChangeText={text => setPages(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          editable={fieldsEnabled.includes('pages') && !addingBook}
          style={styles.textInput}
        />
        <CustomTextInput
          label="Año de publicación:"
          value={year}
          onChangeText={text => setYear(text.replace(/[^0-9]/g, ''))}
          editable={fieldsEnabled.includes('year') && !addingBook}
          style={styles.textInput}
          info={`No puedes leer libros del futuro (estamos en ${today.getFullYear()})`}
        />
        <CustomTextInput
          label="URL de la portada (opcional):"
          value={cover}
          onChangeText={setCover}
          editable={fieldsEnabled.includes('cover') && !addingBook}
        />
      </ScrollView>
      <FloatingButton
        onPress={handleGoBack}
        icon="close-outline"
        position="bottom-left"
        color={colors.danger}
        colorPressed={colors.dangerDark}
        disabled={addingBook}
      />
      <FloatingButton
        onPress={handleAddBook}
        icon="add-outline"
        position="bottom-right"
        color={colors.primary}
        colorPressed={colors.primaryDark}
        disabled={
          (!isbn || !title || !author || !pages || !year)
          || year.length !== 4
          || Number(year) > today.getFullYear()
          || addingBook
        }
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
    paddingBottom: 84,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  loader: {
    marginVertical: 10,
  },
  button: {
    marginLeft: 10,
  },
  separator: {
    height: 1,
    borderRadius: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  textInput: {
    marginBottom: 18,
  },
});
