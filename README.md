# Bookshelf App

En este repositorio encontrarás el código fuente de Bookshelf, una aplicación de registro, valoración y recomendación literaria que permite a sus usuarios tener una estantería digital donde guardar los libros leen, buscar a sus amigos para ver los libros que han leido y sus reseñas, y recibir recomendaciones literarias personalizadas mediante inteligencia artificial.

La aplicación ha sido desarrollada como parte de mi TFG y está disponible para dispositivos móviles Android. Para instalarla simplemente descarga el último APK disponible en *Releases* y abrelá con tu móvil.

## Desarrollo

> **Nota**: Estos pasos están diseñados para desarrolladores con las variables de entorno y otras informaciones requeridas.

### Paso 1: Iniciar Metro

Primero, necesitarás ejecutar **Metro** (herramienta de build de JavaScript para React Native).

Para iniciar el servidor de desarrollo Metro, ejecuta el siguiente comando desde la raíz del proyecto:

```sh
npm start
```

### Paso 2: Compilar y ejecutar la app

Con Metro en ejecución, abre una nueva terminal/pestaña desde la raíz del proyecto React Native y usa uno de los siguientes comandos para compilar y ejecutar la app en Android:

```sh
npm run android
```

Si todo está configurado correctamente, deberías ver la app ejecutándose en el emulador de Android o en el dispositivo conectado.

### Paso 3: Modificar la app

Ahora que has ejecutado la app correctamente, ¡haz cambios!

Abre cualquier archivo en ./src y realiza cambios. Al guardar, la app se actualizará automáticamente y reflejará los cambios.

Cuando quieras recargar forzosamente, por ejemplo para reiniciar el estado de la app, puedes realizar una recarga completa presionando R en la terminal donde estás ejecutando Metro.

## Despliegue

> **Nota**: Estos pasos están diseñados para desarrolladores con las variables de entorno y otras informaciones requeridas.

Para generar un apk debug/release debes ejecutar los siguientes comandos:

```sh
# Navegar a la carpeta ./android
cd ./android

# Limpiar caché (recomendado)
./gradlew clean

# Para generar un apk de debug
./gradlew assembleDebug

# Para generar un apk de release
./gradlew assembleRelease
```
