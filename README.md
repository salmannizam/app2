# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
# app2


//////locally build
{
  "cli": {
    "version": ">= 14.3.1",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true,
      "gradleCommand": ":app:assembleRelease",
      "distribution": "store",
      "android": {
        "artifact": "apk"
      },
      "channel": "production"
    }
  },
  "submit": {
    "production": {
      "track": "production"
    }
  }
}



//eas buiuld

{
  "cli": {
    "version": ">= 14.3.1",
    "appVersionSource": "remote"
  },
  "build": {
    "production": {
      "autoIncrement": true,
      "distribution": "store",
      "android": {
        "buildType": "apk"
      }
    },
    "development": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  }
}




<!-- ?????????????????? -->

rm -rf node_modules package-lock.json

npm uninstall react-native-reanimated
npm install react-native-reanimated

npm install

npm start -- --reset-cache
npx expo prebuild
cd android
./gradlew assembleRelease
android/app/build/outputs/apk/release/app-release.apk


/////////////
need to remove this as it is for http in appjson
    "android": {
      "package": "com.salman.survey",
      "permissions": [
        "READ_MEDIA_IMAGES",
        "INTERNET"
      ],
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon.png",
        "backgroundColor": "#ffffff"
      },
      "networkSecurityConfig": "./android/app/src/main/res/xml/network_security_config.xml"
    },