// android: 842894758664-481628oq82dna6jg90v2if1nn4rb411r.apps.googleusercontent.com
// ios: 842894758664-5lvro06b7p49mtbpgr563v9fd5fsd1eq.apps.googleusercontent.com

const Stack = createNativeStackNavigator();
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import LogInScreen from "./screens/LogInScreen";
import HomeScreen from "./screens/HomeScreen";
import SplashScreen from "./screens/SplashScreen";
import BookDetailScreen from "./screens/BookDetailScreen";
import SignUpScreen from "./screens/SignUpScreen";
import RegisterBook from "./screens/RegisterBook";
import ListBook from "./screens/ListBook";
import Profile from "./screens/Profile";
import Frame from "./components/Frame";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const App = () => {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);

  const [fontsLoaded, error] = useFonts({
    "Kodchasan-SemiBold": require("./assets/fonts/Kodchasan-SemiBold.ttf"),
    "PlusJakartaSans-Light": require("./assets/fonts/PlusJakartaSans-Light.ttf"),
    Kameron: require("./assets/fonts/Kameron.ttf"),
    Miniver: require("./assets/fonts/Miniver.ttf"),
    "Karantina-Regular": require("./assets/fonts/Karantina-Regular.ttf"),
    "Rosarivo-Regular": require("./assets/fonts/Rosarivo-Regular.ttf"),
    "OpenSans-Light": require("./assets/fonts/OpenSans-Light.ttf"),
    "OpenSans-Regular": require("./assets/fonts/OpenSans-Regular.ttf"),
    "OpenSans-SemiBold": require("./assets/fonts/OpenSans-SemiBold.ttf"),
  });

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
      <NavigationContainer>
        {hideSplashScreen ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LogInScreen"
              component={LogInScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RegisterBook"
              component={RegisterBook}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ListBook"
              component={ListBook}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BookDetailScreen"
              component={BookDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUpScreen"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Frame"
              component={Frame}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        ) : null}
      </NavigationContainer>
    </>
  );
};
export default App;
