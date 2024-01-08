import * as React from "react";
import { Image } from 'expo-image';
import CustomPopup from '../components/CustomPopup';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Button,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily, Border, FontSize, Padding } from "../GlobalStyles";
import Constants from 'expo-constants';

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google"
import AsyncStorage from "@react-native-async-storage/async-storage";


WebBrowser.maybeCompleteAuthSession();

const LogInScreen = () => {

  const apiUrl = Constants.manifest.extra.apiUrl;

  const [popupVisible, setPopupVisible] = React.useState(!false);
  const [messagePopup, setPopupTexto] = React.useState("Seja bem vindo!");

  const togglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "842894758664-481628oq82dna6jg90v2if1nn4rb411r.apps.googleusercontent.com",
    iosClientId: "842894758664-5lvro06b7p49mtbpgr563v9fd5fsd1eq.apps.googleusercontent.com",
    webClientId: "842894758664-t5fusntv19irac1qoq3dskv0ljecchgn.apps.googleusercontent.com",
    expoClientId: "842894758664-v1rbiib3kghprffpqr5u1kc25svb6hkf.apps.googleusercontent.com"
  });

  React.useEffect(() => {
    handleSingInWithGoogle();
  }, [response]);

  handleSingInWithGoogle();

  async function handleSingInWithGoogle(){
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (!response) return;
      if (response?.type == "success") {
        await getUserInfo(response.authentication.accessToken)
      }
    } else {
      var response_user = send_user(user);
      console.log(response_user);
      if (response_user) navigation.navigate("SignUpScreen");
    }
  }

  const send_user = async (user) => {
    await fetch(
      `${apiUrl}/api/user/signup/googleaccount/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
      .then((response) => response.json())
      .then((data) => console.log(data.body))
    .then((data) => {
      if (data?.status == "success"){
        user = data.user;

        AsyncStorage.setItem("@user", JSON.stringify(user));
        setUserInfo(user);
        
        return user;
      } else {
        if (data.message) {
          setPopupTexto(data.message);
        } else {
          setPopupTexto("Erro no servidor ao cadastrar ou logar!");
        }
        togglePopup();

        return false;
      }
    })
    .catch((error) => console.error(error))
    .finally(() => console.log('Requisição finalizada'));
  }

  const getUserInfo = async (token) => {
    if (!token) return;

    try {
      var response_user = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      console.log(user);
      try {
        response = send_user(user);
      } catch (err) {
        setPopupTexto("Conexão com o servidor perdida!");
        togglePopup();
      }

    } catch (err) {
      setPopupTexto("Conexão com o servidor google perdida!");
        togglePopup();
    };
  }

  const navigation = useNavigation();

  return (
    <ImageBackground
      style={styles.backgroundImage}
      resizeMode="cover"
      source={require("../assets/androidlarge5.png")}
    >
      <CustomPopup
        visible={popupVisible}
        onClose={togglePopup}
        message={messagePopup}
      />
      {/* <Image
        style={[styles.icon]}
        contentFit="cover"
        source={require("../assets/223045685bf842adb0c2136846f444ea-11.png")}
      /> */}
      <View style={styles.textContainer}>
        <Text style={styles.getStarted}>Vamos começar!</Text>
        <Text style={styles.joinUsNow}>Entre conosco nessa jornada.</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignUpScreen")}
          style={styles.createAccountButton}
        >
          <Text style={[styles.createAccountbuttonText, styles.buttonText]}>Crie uma conta</Text>
        </TouchableOpacity>
        <View style={{ height: 10 }} />
        <TouchableOpacity
          onPress={() => promptAsync()}
          style={styles.googleButton}
        >
          <Text style={[styles.googleButtonbuttonText, styles.buttonText]}>Login com Google</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100, // Ajuste conforme necessário
    height: 170, // Ajuste conforme necessário
  },
  textContainer: {
    width: "90%",
    display: "flex",
    alignItems: 'flex-start', // Assegurando alinhamento à esquerda
    justifyContent: 'center',
    marginLeft: "5%",
  },
  getStarted: {
    color: Color.colorBeige_100,
    fontFamily: FontFamily.rosarivoRegular,
    fontSize: FontSize.size_29xl,
    marginBottom: 10,
  },
  joinUsNow: {
    color: Color.colorBeige_100,
    fontFamily: FontFamily.rosarivoRegular,
    fontSize: 26,
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '80%',
    marginVertical: 10,
  },
  googleButton: {
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  createAccountButton: {
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    textAlign: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
  googleButtonbuttonText: {
    color: 'white',
  },
  createAccountbuttonText: {
    color: '#50372d',
  },
});


export default LogInScreen;
