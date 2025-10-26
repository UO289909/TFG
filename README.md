
# Bookshelf App (TFG)

> **Note**: This steps are design for developers with the required env variables and other information. Currently, the app is thought to run on Android.

## Development

### Step 1: Start Metro

First, you will need to run **Metro** (JavaScript build tool for React Native).

To start the Metro dev server, run the following command from the root of the project:

```sh
# Using npm
npm start
```

### Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

```sh
# Using npm
npm run android
```

If everything is set up correctly, you should see your new app running in the Android Emulator or your connected device.


### Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open any ./src file and make some changes. When you save, the app will automatically update and reflect these changes.

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload pressing R on the terminal where you are running Metro.


## Deployment

For generating a debug/release apk you have to run the following commands:

```sh
# Navigate to ./android folder
cd ./android

# Clear cache (recommendated)
./gradlew clean

# To generate a debug apk
./gradlew assembleDebug

# To generate a release apk
./gradlew assembleRelease
```
