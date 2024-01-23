import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ImageBackground,
  Image,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Frame from "../components/Frame";
import { FontFamily, Color, FontSize, Padding, Border } from "../GlobalStyles";
import { TextInput } from "react-native";
import Constants from 'expo-constants';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import CustomPopup from '../components/CustomPopup';


  const SignUpScreen = () => {
    const [popupVisible, setPopupVisible] = React.useState(false);
    const [messagePopup, setPopupTexto] = React.useState("");

    const togglePopup = (message) => {
      if (message != null) setPopupVisible(true);
      else setPopupVisible(false);
      setPopupTexto(message);
    };

    const [email, setEmail] = React.useState('');
    const [pass, setPass] = React.useState('');
    const [confirmPass, setConfirmPass] = React.useState('');
    const [name, setName] = React.useState('');

    const apiUrl = Constants.expoConfig.extra.apiUrl;
    const navigation = useNavigation();
    const [cTAContainerVisible, setCTAContainerVisible] = useState(false);


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

  function handleSingInWithGoogle() {
    const user = AsyncStorage.getItem("@user")
      .then((user) => {
        if (!user) {
          if (!response) return;
          if (response?.type == "success") {
            getUserInfo(response.authentication.accessToken)
          }
        } else {
          console.log(user);
          send_user(user);
        }
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
            // body: {},
            body: JSON.stringify(user),
          }
        );

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();

        if (data?.status === "success") {
          user = data.user;

        AsyncStorage.setItem("@refresh_token", JSON.stringify(user["refresh_token"]));
        AsyncStorage.setItem("@user", JSON.stringify(user));
        setUserInfo(user);

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

  const getRefreshToken = () => {
    fetch(
      `${apiUrl}/api/token/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({password:pass, email:email, username:name}),
      }
    ).then((json) => json.json())
    .then((data) => {
      console.log(data);
      if("refresh" in data){
        AsyncStorage.setItem("@refresh_token", JSON.stringify(data["refresh"]));
        navigation.navigate("HomeScreen");
      } else {
        console.log("Falha ao obter refresh token!");
        console.log(JSON.stringify({password:pass, email:email, username:name}));
        navigation.navigate("LogInScreen");
        togglePopup("Falha ao obter refresh token!\nFaça login");
      }
    })
    .catch((err) => {
      console.error(err);
    });
  }

  const signUp = () => {
    togglePopup("Loading");
    if (pass == '' || email == '') {
      togglePopup();
      togglePopup("Todos os campos devem ser preenchidos!");
      return;
    } else if (pass !== confirmPass) {
      togglePopup();
      togglePopup("A senha e a confirmação precisam ser iguais!");
      return;
    }
    console.error(`${apiUrl}/api/user/`);
    try {
      fetch(
        `${apiUrl}/api/user/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({password:pass, email:email, username:name}),
        }
      ).then((json) => json.json())
      .then((data) => {
        if ("id" in data) {
          AsyncStorage.setItem("@user", JSON.stringify(data));

            getRefreshToken();
          } else {
            let message = "";

            data_array = Object.entries(data);
            data_array.forEach(element => {
              message += "\n\n";
              message += element[1];
            });

          togglePopup();
          togglePopup(message);
        }
      })
      .catch((err) => {
        console.error(err);
      });
    } catch (err) {
      console.error(err);
      togglePopup();
      togglePopup("Falha no servidor");
    }
  }

  return (
    <>
    <CustomPopup
          visible={popupVisible}
          onClose={togglePopup}
          message={messagePopup}
        />
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ImageBackground
        style={styles.backgroundImage}
        resizeMode="cover"
        source={require("../assets/androidlarge5.png")}
      >
        <View style={[styles.containerlements]}>


            <Text
              style={[styles.createAccount, styles.createAccountFlexBox]}
            >{`Criar conta`}
            </Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nome"
                placeholderTextColor="#d1d5db"
                value={name}
                onChangeText={text => setName(text)}
                multiline={false}
              />
            </View>

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

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Confirmar senha</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Confirmar senha"
                placeholderTextColor="#d1d5db"
                value={confirmPass}
                onChangeText={text => setConfirmPass(text)}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              onPress={() => signUp()}
              style={styles.createAccountButton}
            >
              <Text style={[styles.loginButton, styles.buttonText]}>Criar conta</Text>
            </TouchableOpacity>
            <View style={{ height: 10 }} />
            <TouchableOpacity
              onPress={() => promptAsync()}
              style={styles.googleButton}
            >
              <Text style={[styles.googleButtonbuttonText, styles.buttonText]}>Criar conta com Google</Text>
            </TouchableOpacity>
            <View style={{ height: 10 }} />

          </View>
          <Pressable
            style={styles.goBack}
            onPress={() => navigation.navigate("LogInScreen")}
          >
            <Image
              style={styles.icon}
              contentFit="cover"
              source={require("../assets/go-back.png")}
            />
          </Pressable>
        </ImageBackground>

        {/* <Modal animationType="fade" transparent visible={cTAContainerVisible}>
          <View style={styles.cTAContainerOverlay}>
            <Pressable
              style={styles.cTAContainerBg}
              onPress={closeCTAContainer}
            />
            <Frame onClose={closeCTAContainer} />
          </View>
        </Modal> */}
      </KeyboardAvoidingView>
      </>
    );
  };

  const styles = StyleSheet.create({

    containerlements: {
      alignItems: 'center',
      width: '80%',
      marginVertical: 10,
    },

    batteryIconPosition: {
      right: 0,
      top: 0,
      position: "absolute",
    },
    sidePosition: {
      top: 17,
      height: 11,
      position: "absolute",
    },
    topLayout: {
      width: 298,
      position: "absolute",
    },
    createAccountFlexBox: {
      fontFamily: FontFamily.rosarivoRegular,
      textAlign: "left",
    },
    checkboxLayout: {
      height: 61,
      position: "absolute",
    },
    bgLayout: {
      height: 20,
      width: 20,
      left: 0,
      position: "absolute",
    },
    bgBorder: {
      borderWidth: 1,
      borderColor: Color.colorBlanchedalmond_100,
      borderStyle: "solid",
    },
    passwordLayout: {
      height: 74,
      width: 302,
      left: 0,
      position: "absolute",
    },
    titleTypo: {
      height: 29,
      fontFamily: FontFamily.openSansSemiBold,
      fontWeight: "600",
      fontSize: FontSize.size_base,
      textAlign: "left",
      color: Color.colorBlanchedalmond_100,
      position: "absolute",
    },
    examplePosition: {
      color: Color.colorBeige_100,
      left: 15,
      top: 39,
      fontSize: FontSize.size_base,
      textAlign: "left",
      fontFamily: FontFamily.rosarivoRegular,
    },
    ctaPosition: {
      paddingBottom: Padding.p_smi,
      paddingTop: 15,
      paddingHorizontal: 50,
      justifyContent: "center",
      flexDirection: "row",
      height: 45,
      borderRadius: Border.br_3xs,
      width: 302,
      left: 29,
      alignItems: "center",
      position: "absolute",
    },
    signUpWithTypo: {
      fontFamily: FontFamily.openSansSemiBold,
      fontWeight: "600",
    },
    bgIcon: {
      top: -2,
      right: 70,
      bottom: 16,
      left: 69,
      maxWidth: "100%",
      maxHeight: "100%",
      display: "none",
      position: "absolute",
      overflow: "hidden",
    },
    batteryIcon: {
      width: 24,
      height: 11,
    },
    wifiIcon: {
      width: 15,
      height: 11,
    },
    mobileSignalIcon: {
      width: 17,
      height: 11,
    },
    rightSide: {
      right: 15,
      width: 67,
      height: 11,
    },
    leftSideIcon: {
      left: 34,
      width: 28,
      height: 11,
    },
    iosstatusBarblack: {
      left: 2,
      height: 44,
      overflow: "hidden",
    },
    createAccount: {
      color: Color.colorBeige_100,
      fontFamily: FontFamily.rosarivoRegular,
      fontSize: FontSize.size_29xl,
      marginBottom: 10,
    },


    icon: {
      height: 20,
      width: 20,
      position: 'absolute',
      top: 80,
      left: 40,
    },

    goBack: {
      width: 14,
      height: 24,
      left: 0,
      top: 0,
      position: "absolute",
    },
    top: {
      top: 77,
      left: 31,
      height: 157,
    },
    iAgreeTo: {
      top: 11,
      left: 30,
      color: Color.colorBeige_100,
      fontSize: FontSize.size_base,
      fontFamily: FontFamily.rosarivoRegular,
    },
    terms: {
      textDecoration: "underline",
      color: Color.colorBeige_200,
    },
    iAgreeToContainer1: {
      width: "100%",
    },
    iAgreeToContainer: {
      fontSize: 15,
      lineHeight: 15,
      width: 273,
      transform: [
        {
          rotate: "0.01deg",
        },
      ],
      left: 29,
      alignItems: "center",
      display: "flex",
      fontFamily: FontFamily.rosarivoRegular,
      textAlign: "left",
      top: 0,
    },
    bg: {
      borderRadius: Border.br_8xs,
      height: 20,
      width: 20,
      left: 0,
      position: "absolute",
      top: 0,
    },
    bgWrapper: {
      top: 11,
    },
    checkbox: {
      top: 287,
      width: 302,
      left: 0,
    },
    bg1: {
      top: 29,
      backgroundColor: Color.colorBlanchedalmond_300,
      height: 45,
      borderRadius: Border.br_3xs,
      borderWidth: 1,
      borderColor: Color.colorBlanchedalmond_100,
      borderStyle: "solid",
      width: 302,
      left: 0,
      position: "absolute",
    },
    hiddenIcon: {
      top: 47,
      left: 266,
      width: 22,
      height: 14,
      position: "absolute",
    },
    confirmPasswordTitle: {
      width: 174,
    },
    confirmPassword: {
      top: 198,
    },
    exampleForPassword: {
      width: 158,
    },
    passwordTitle: {
      width: 110,
    },
    password: {
      top: 99,
    },
    exampleForEmail: {
      width: 202,
    },
    emailTitle: {
      width: 55,
    },
    email: {
      top: 0,
    },
    input: {
      height: 272,
      width: 302,
      left: 0,
      top: 0,
      position: "absolute",
    },
    signUp: {
      top: 234,
      height: 348,
      width: 302,
      left: 29,
      position: "absolute",
    },
    cTAContainerOverlay: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(113, 113, 113, 0.3)",
    },
    cTAContainerBg: {
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
    },
    createAccount1: {
      color: Color.colorGray_100,
      textAlign: "center",
      fontSize: FontSize.size_base,
      fontWeight: "600",
    },
    cta: {
      top: 591,
      backgroundColor: Color.colorBlanchedalmond_100,
      shadowColor: "rgba(0, 0, 0, 0.15)",
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowRadius: 15,
      elevation: 15,
      shadowOpacity: 1,
    },
    iconGoogle: {
      height: 24,
      width: 24,
      overflow: "hidden",
    },
    signUpWith: {
      fontSize: 18,
      marginLeft: 15,
      fontWeight: "600",
      textAlign: "left",
      color: Color.colorBlanchedalmond_100,
    },
    iconGoogleParent: {
      justifyContent: "center",
      flexDirection: "row",
      alignItems: "center",
      left: 0,
      top: 0,
      position: "absolute",
    },
    btnSignUpWithGoogle: {
      width: 213,
      height: 25,
    },
    cta1: {
      top: 650,
      borderWidth: 1,
      borderColor: Color.colorBlanchedalmond_100,
      borderStyle: "solid",
    },
    SignUpScreen: {
      flex: 1,
      height: 800,
      overflow: "hidden",
      width: "100%",
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    textInput: {
      borderColor: 'white',
      borderWidth: 1,
      backgroundColor: 'transparent',
      borderRadius: 10,
      height: 45,
      marginBottom: 10,
      paddingLeft: 15,
      color: Color.colorBeige_100,
      fontFamily: FontFamily.rosarivoRegular,
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
    fieldContainer: {
      marginBottom: 16,
      width: '80%',
    },
    label: {
      color:'white',
      marginBottom: 5,
    },
    

  });

  export default SignUpScreen;
