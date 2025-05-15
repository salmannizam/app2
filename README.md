
<!-- // to fix all package with expo verson
npx expo install --fix -->

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

<!--
  -->

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