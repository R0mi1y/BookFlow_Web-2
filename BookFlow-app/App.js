// android: 842894758664-481628oq82dna6jg90v2if1nn4rb411r.apps.googleusercontent.com
// ios: 842894758664-5lvro06b7p49mtbpgr563v9fd5fsd1eq.apps.googleusercontent.com

const Stack = createNativeStackNavigator();
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import LogInScreen from "./screens/LogInScreen";
import AndroidLarge1 from "./screens/AndroidLarge1";
import FrameComponentSet from "./components/FrameComponentSet";
import AndroidLarge2 from "./screens/AndroidLarge2";
import AndroidLarge4 from "./screens/AndroidLarge4";
import SignUpScreen from "./screens/SignUpScreen";
import Frame from "./components/Frame";
import AndroidLarge3 from "./components/AndroidLarge3";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Pressable, TouchableOpacity } from "react-native";

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
              name="LogInScreen"
              component={LogInScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AndroidLarge1"
              component={AndroidLarge1}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AndroidLarge2"
              component={AndroidLarge2}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AndroidLarge4"
              component={AndroidLarge4}
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
            <Stack.Screen
              name="AndroidLarge3"
              component={AndroidLarge3}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        ) : null}
      </NavigationContainer>
    </>
  );
};
export default App;
