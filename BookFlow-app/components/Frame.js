import React, { memo } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, Border, Color, FontSize } from "../GlobalStyles";

const Frame = memo(({ onClose }) => {
  const navigation = useNavigation();

  return (
    <Pressable
      style={[styles.popUpBgParent, styles.popLayout]}
      onPress={() => navigation.navigate("AndroidLarge1")}
    >
      <View style={[styles.popUpBg, styles.popLayout]} />
      <Text
        style={[styles.didntRecieveItContainer, styles.verifyYourEmailTypo]}
      >
        <Text style={styles.didntRecieveItContainer1}>
          <Text style={styles.didntRecieveIt}>Didn’t recieve it?</Text>
          <Text style={styles.text}>{` `}</Text>
          <Text style={styles.text}>
            <Text style={styles.tryAgain1}>try again</Text>
          </Text>
        </Text>
      </Text>
      <Image
        style={styles.closeIcon}
        contentFit="cover"
        source={require("../assets/close.png")}
      />
      <Text style={styles.weveSentA}>
        We’ve sent a link to your email address. In order to activate your
        account, you need to click on the link.
      </Text>
      <Text style={[styles.verifyYourEmail, styles.verifyYourEmailTypo]}>
        Verify Your Email Address
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  popLayout: {
    height: 402,
    width: 361,
  },
  verifyYourEmailTypo: {
    display: "flex",
    fontFamily: FontFamily.rosarivoRegular,
    textAlign: "center",
    position: "absolute",
  },
  popUpBg: {
    top: 0,
    left: 0,
    borderTopLeftRadius: Border.br_11xl,
    borderTopRightRadius: Border.br_11xl,
    backgroundColor: Color.colorBlanchedalmond_100,
    position: "absolute",
  },
  didntRecieveIt: {
    color: "rgba(28, 22, 30, 0.7)",
  },
  text: {
    color: Color.colorGray_200,
  },
  tryAgain1: {
    textDecoration: "underline",
  },
  didntRecieveItContainer1: {
    width: "100%",
  },
  didntRecieveItContainer: {
    top: 323,
    left: 73,
    alignItems: "center",
    width: 217,
    height: 32,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.rosarivoRegular,
  },
  closeIcon: {
    top: 21,
    left: 291,
    width: 30,
    height: 30,
    overflow: "hidden",
    position: "absolute",
  },
  weveSentA: {
    top: 181,
    left: 38,
    lineHeight: 27,
    fontFamily: FontFamily.openSansRegular,
    color: "rgba(28, 22, 30, 0.8)",
    width: 289,
    height: 77,
    textAlign: "center",
    fontSize: FontSize.size_base,
    position: "absolute",
  },
  verifyYourEmail: {
    top: 92,
    left: 37,
    fontSize: FontSize.size_5xl,
    alignItems: "flex-end",
    justifyContent: "center",
    width: 288,
    height: 76,
    color: Color.colorGray_200,
  },
  popUpBgParent: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
});

export default Frame;
