import * as React from "react";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Pressable,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, FontSize, Color, Border, Padding } from "../GlobalStyles";



const Profile = () => {

  const navigation = useNavigation();

  return (
    <View style={styles.Profile}>
      <Image
        style={[styles.phlistIcon, styles.iconLayout]}
        contentFit="cover"
        source={require("../assets/phlist.png")}
      />
      {/* <Image
        style={[styles.epsearchIcon, styles.iconLayout]}
        contentFit="cover"
        source={require("../assets/epsearch.png")}
      /> */}
      <Pressable
        style={styles.brandLogo}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <Text style={[styles.libro, styles.libroPosition]}>Pagina</Text>
        <Text style={[styles.l, styles.lTypo]}>Vazia</Text>
      </Pressable>
      <View style={styles.container}>
      <Text style={styles.kkk}>kkkkkkkkkkkkkkkkkkkk</Text>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Centraliza verticalmente
    alignItems: "center", // Centraliza horizontalmente
  },
  kkk:{
    alignSelf: "center",
    color: Color.colorBlanchedalmond_100,
    fontFamily: FontFamily.rosarivoRegular,
    fontSize: 25,

    position: "absolute",
  },
  phlistIcon: {
    height: 25,
    left: 27,
    width: 25,
    top: 62,
  },

  lTypo: {
    textAlign: "center",
    fontFamily: FontFamily.rosarivoRegular,
  },
  libroPosition: {
    top: 0,
    position: "absolute",
  },

  lPosition: {
    left: 0,
    position: "absolute",
  },

  l: {
    top: 46,
    fontSize: FontSize.size_29xl,
    color: Color.colorBlanchedalmond_400,
    width: 250,
    height: 100,
    left: 50,
    position: "absolute",
  },
  libro: {
    fontSize: FontSize.size_23xl,
    width: 350,
    height: 100,
    color: Color.colorBlanchedalmond_100,
    textAlign: "center",
    fontFamily: FontFamily.rosarivoRegular,
  },
  brandLogo: {
    top: 49,
    left: 10,
    width: 144,
    height: 52,
    position: "absolute",
  },

  Profile: {
    flex: 1,
    width: "100%",
    height: 900,
    overflow: "hidden",
    backgroundColor: Color.colorGray_200,
  },
});

export default Profile;
