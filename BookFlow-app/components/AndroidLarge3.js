import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
import { Color, FontFamily, FontSize } from "../GlobalStyles";

const AndroidLarge3 = memo(({ onClose }) => {
  return (
    <View style={styles.androidLarge3}>
      <Image
        style={[styles.octiconperson24, styles.octiconpersonLayout]}
        contentFit="cover"
        source={require("../assets/octiconperson24.png")}
      />
      <Image
        style={[styles.octiconperson241, styles.octiconpersonLayout]}
        contentFit="cover"
        source={require("../assets/octiconperson241.png")}
      />
      <Image
        style={[styles.octiconperson242, styles.octiconpersonLayout]}
        contentFit="cover"
        source={require("../assets/octiconperson242.png")}
      />
      <Text style={styles.iniciarSesin}>Iniciar Sesión</Text>
      <Text style={[styles.configuracin, styles.contctanosTypo]}>
        Configuración
      </Text>
      <Text style={[styles.contctanos, styles.contctanosTypo]}>
        Contáctanos
      </Text>
      <View style={[styles.androidLarge3Child, styles.androidLayout]} />
      <View style={[styles.androidLarge3Item, styles.androidLayout]} />
      <View style={[styles.androidLarge3Inner, styles.androidLayout]} />
    </View>
  );
});

const styles = StyleSheet.create({
  octiconpersonLayout: {
    height: 24,
    width: 24,
    left: 36,
    position: "absolute",
    overflow: "hidden",
  },
  contctanosTypo: {
    textAlign: "left",
    color: Color.colorBlanchedalmond_100,
    fontFamily: FontFamily.rosarivoRegular,
    lineHeight: 15,
    fontSize: FontSize.size_sm,
    left: 82,
    position: "absolute",
  },
  androidLayout: {
    height: 1,
    width: 289,
    borderTopWidth: 0.5,
    borderColor: Color.colorBlanchedalmond_200,
    borderStyle: "solid",
    left: 0,
    position: "absolute",
  },
  octiconperson24: {
    top: 92,
  },
  octiconperson241: {
    top: 144,
  },
  octiconperson242: {
    top: 196,
  },
  iniciarSesin: {
    top: 99,
    textAlign: "center",
    color: Color.colorBlanchedalmond_100,
    fontFamily: FontFamily.rosarivoRegular,
    lineHeight: 15,
    fontSize: FontSize.size_sm,
    left: 82,
    position: "absolute",
  },
  configuracin: {
    top: 151,
  },
  contctanos: {
    top: 203,
  },
  androidLarge3Child: {
    top: 129,
  },
  androidLarge3Item: {
    top: 181,
  },
  androidLarge3Inner: {
    top: 233,
  },
  androidLarge3: {
    backgroundColor: "#27181d",
    width: 288,
    height: 800,
    maxWidth: "100%",
    maxHeight: "100%",
    overflow: "hidden",
  },
});

export default AndroidLarge3;
