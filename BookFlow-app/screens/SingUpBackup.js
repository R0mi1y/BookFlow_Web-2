import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ImageBackground,
  Modal,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Frame from "../components/Frame";
import { FontFamily, Color, FontSize, Padding, Border } from "../GlobalStyles";
import { TextInput } from "react-native-gesture-handler";

const SignUpScreen = () => {
  
  const navigation = useNavigation();
  const [cTAContainerVisible, setCTAContainerVisible] = useState(false);

  const openCTAContainer = useCallback(() => {
    setCTAContainerVisible(true);
  }, []);

  const closeCTAContainer = useCallback(() => {
    setCTAContainerVisible(false);
  }, []);

  return (
    <>
      <ImageBackground
        style={styles.backgroundImage}
        resizeMode="cover"
        source={require("../assets/androidlarge5.png")}
      >
        <View style={[styles.iosstatusBarblack, styles.batteryIconPosition]}>
          <Image
            style={styles.bgIcon}
            contentFit="cover"
            source={require("../assets/bg.png")}
          />
          <View style={[styles.rightSide, styles.sidePosition]}>
            <Image
              style={[styles.batteryIcon, styles.batteryIconPosition]}
              contentFit="cover"
              source={require("../assets/battery.png")}
            />
            <Image
              style={styles.wifiIcon}
              contentFit="cover"
              source={require("../assets/wifi.png")}
            />
            <Image
              style={styles.mobileSignalIcon}
              contentFit="cover"
              source={require("../assets/mobile-signal.png")}
            />
          </View>
          <Image
            style={[styles.leftSideIcon, styles.sidePosition]}
            contentFit="cover"
            source={require("../assets/left-side2.png")}
          />
        </View>
        <View style={[styles.top, styles.topLayout]}>
          <Text
            style={[styles.createAccount, styles.createAccountFlexBox]}
          >{`Criar conta`}</Text>
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
        </View>
        <View style={styles.signUp}>
          <View style={[styles.checkbox, styles.checkboxLayout]}>
            <Text style={[styles.iAgreeToContainer, styles.checkboxLayout]}>
              <Text style={styles.iAgreeToContainer1}>
                <Text style={styles.iAgreeTo}>{`I agree to the `}</Text>
                <Text style={styles.terms}>terms</Text>
                <Text style={styles.iAgreeTo}>{` And `}</Text>
                <Text style={styles.terms}>privacy policy</Text>
              </Text>
            </Text>
            <View style={[styles.bgWrapper, styles.bgLayout]}>
              <View style={[styles.bg, styles.bgBorder]} />
            </View>
          </View>
          <View style={styles.input}>
            <View style={[styles.confirmPassword, styles.passwordLayout]}>
              <View style={styles.bg1} />
              <Image
                style={styles.hiddenIcon}
                contentFit="cover"
                source={require("../assets/hidden.png")}
              />
              <Text style={[styles.confirmPasswordTitle, styles.titleTypo]}>
                Confirm Password
              </Text>
            </View>
            <View style={[styles.password, styles.passwordLayout]}>
              <View style={styles.bg1} />
              <Image
                style={styles.hiddenIcon}
                contentFit="cover"
                source={require("../assets/hidden.png")}
              />
              <TextInput style={[styles.exampleForPassword, styles.examplePosition]}>
                e.g. Examp!e2006
              </TextInput>
              <Text style={[styles.passwordTitle, styles.titleTypo]}>
                Password
              </Text>
            </View>
            <View style={[styles.email, styles.passwordLayout]}>
              <View style={styles.bg1} />
              <Text style={[styles.exampleForEmail, styles.examplePosition]}>
                e.g. example@mail.com
              </Text>
              <Text style={[styles.emailTitle, styles.titleTypo]}>Email</Text>
            </View>
          </View>
        </View>
        <Pressable
          style={[styles.cta, styles.ctaPosition]}
          onPress={openCTAContainer}
        >
          <Text style={[styles.createAccount1, styles.signUpWithTypo]}>
            Criar conta
          </Text>
        </Pressable>
        <View style={[styles.cta1, styles.ctaPosition]}>
          <View style={styles.btnSignUpWithGoogle}>
            <View style={styles.iconGoogleParent}>
              <Image
                style={styles.iconGoogle}
                contentFit="cover"
                source={require("../assets/icon--google.png")}
              />
              <Text style={[styles.signUpWith, styles.signUpWithTypo]}>
                Sign Up with Google
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <Modal animationType="fade" transparent visible={cTAContainerVisible}>
        <View style={styles.cTAContainerOverlay}>
          <Pressable
            style={styles.cTAContainerBg}
            onPress={closeCTAContainer}
          />
          <Frame onClose={closeCTAContainer} />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
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
    alignItems: "center",
    display: "flex",
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
    left: 0,
    top: 0,
    position: "absolute",
  },
  examplePosition: {
    color: Color.colorBeige_100,
    left: 15,
    top: 43,
    fontSize: FontSize.size_base,
    textAlign: "left",
    fontFamily: FontFamily.rosarivoRegular,
    position: "absolute",
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
    top: 90,
    fontSize: FontSize.size_29xl,
    // lineHeight: 50, // Remova ou ajuste esta linha
    height: 115,
    color: Color.colorBlanchedalmond_100,
    left: 0,
    width: 298,
    position: "absolute",
  },
  
  icon: {
    height: "100%",
    width: "100%",
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
    color: Color.colorBlanchedalmond_100,
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
});

export default SignUpScreen;
