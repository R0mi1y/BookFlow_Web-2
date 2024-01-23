import React, { memo } from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";


const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const Menu = memo(({ onClose }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.Menu}>
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
      
      <Text style={styles.iniciarSesin} onPress={() => navigation.navigate("Profile")}>Editar Perfil</Text>
     

      <Text style={[styles.configuracin, styles.contctanosTypo]}>
        Configurações
      </Text>
      <Text style={[styles.contctanos, styles.contctanosTypo]}>
        Contatos
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
    lineHeight: 20,
    fontSize: FontSize.size_sm,
    left: 82,
    position: "absolute",
  },
  androidLayout: {
    height: 1,
    width: 250,
    borderTopWidth: 0.5,
    borderColor: Color.colorBlanchedalmond_200,
    borderStyle: "solid",
    alignSelf:"center",
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
    lineHeight: 20,
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
  Menu: {
    position: 'absolute',
    top:0,
    left:0,

    backgroundColor: "#27181d",
    right:60,
    width: 300,
    height: "100%",
    maxWidth: "100%",
    maxHeight: "100%",
    overflow: "hidden",
    
  },
});

export default Menu;
