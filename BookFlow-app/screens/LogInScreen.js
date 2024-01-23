import * as React from "react";
import CustomPopup from '../components/CustomPopup';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image,
  Button,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily, Border, FontSize, Padding } from "../GlobalStyles";
import Constants from 'expo-constants';

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google"
import { KeyboardAvoidingView, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';


WebBrowser.maybeCompleteAuthSession();

const LogInScreen = () => {
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  const apiUrl = Constants.expoConfig.extra.apiUrl;

  const [popupVisible, setPopupVisible] = React.useState(false);
  const [messagePopup, setPopupTexto] = React.useState("Seja bem vindo!");

  const togglePopup = (message) => {
    if (message != null) setPopupVisible(true);
    else setPopupVisible(false);
    setPopupTexto(message);
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


  const login = () => {
    console.log(`${apiUrl}/api/user/login/`);
    fetch(
      `${apiUrl}/api/user/login/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: `{"email": "${email}", "password": "${pass}"}`,
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data?.status == "success") {
          SecureStore.setItemAsync("user", JSON.stringify(data['user']));
          setUserInfo(data['user']);

          console.log();

          // navigation.navigate("pickDocument");
          navigation.navigate("HomeScreen");
        } else {
          if (data?.message ?? false) {
            togglePopup(data?.message);
          }
        }
      })
      .catch((error) => console.error("1º fetch erro:" + error))
      .finally(() => console.log('Requisição finalizada'));
  }

  async function handleSingInWithGoogle() {
    const user = await SecureStore.getItemAsync("user")
      .then((user) => {
        console.log(user);
        if (!user) {
          if (!response) return;
          if (response?.type == "success") {
            getUserInfo(response.authentication.accessToken)
          }
        } else {
          send_user(user);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const send_user = async (user) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/user/signup/googleaccount/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();

      if (data?.status === "success") {
        user = data.user;

        await SecureStore.setItemAsync("user", JSON.stringify(user));
        setUserInfo(user);

        // navigation.navigate("pickDocument");
        navigation.navigate("HomeScreen");
        return user;
      } else {
        if (data?.message) {
          togglePopup(data.message);
        }

        return false;
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      return false;
    }
  };

  const getUserInfo = async (token) => {
    if (!token) return;

    try {
      var response_user = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response_user.json();
      console.log(user);
      response = send_user(user);

    } catch (err) {
      console.log("Conexão com o servidor google perdida!");
    };
  }

  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ImageBackground
        style={styles.backgroundImage}
        resizeMode="cover"
        source={require("../assets/androidlarge5.png")}
      >
        <CustomPopup
          visible={popupVisible}
          onClose={() => {togglePopup(null)}}
          message={messagePopup}
        />
        {/* <Image
          style={[styles.icon]}
          contentFit="cover"
          source={require("../assets/logo.png")}
        /> */}
        <View style={styles.textContainer}>
          <Text style={styles.getStarted}>Vamos começar!</Text>
          <Text style={styles.joinUsNow}>Entre conosco nessa jornada.</Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.textInput}
              placeholder="E-mail"
              placeholderTextColor="#d1d5db"
              value={email}
              onChangeText={text => setEmail(text)}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Senha"
              placeholderTextColor="#d1d5db"
              value={pass}
              onChangeText={text => setPass(text)}
              secureTextEntry
            />
          </View>
          <TouchableOpacity
            onPress={() => login()}
            style={styles.createAccountButton}
          >
            <Text style={[styles.loginButton, styles.buttonText]}>Login</Text>
          </TouchableOpacity>
          <View style={{ height: 10 }} />
          <TouchableOpacity
            onPress={() => promptAsync()}
            style={styles.googleButton}
          >
            <Text style={[styles.googleButtonbuttonText, styles.buttonText]}>Login com Google</Text>
          </TouchableOpacity>
          <View style={{ height: 10 }} />
          <TouchableOpacity
            onPress={() => navigation.navigate("SignUpScreen")}
          >
            <Text style={[styles.createAccountbuttonText, styles.buttonText]}>Crie uma conta</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
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
    marginTop: 40,
    textAlign: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
  googleButtonbuttonText: {
    color: 'white',
  },
  createAccountbuttonText: {
    color: Color.colorBeige_100,
  },
  loginButton: {
    color: '#50372d',
  },
  textInput: {
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: 'transparent',
    height: 45,
    marginBottom: 10,
    borderRadius: 10,
    paddingLeft: 15,
    color: Color.colorBeige_100,
    fontFamily: FontFamily.rosarivoRegular,
  },
  label: {
    color: 'white',
    marginBottom: 5,
  },
  fieldContainer: {
    marginBottom: 16,
    width: '80%',
  },
});


export default LogInScreen;
