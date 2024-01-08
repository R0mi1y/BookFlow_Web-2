import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color } from "../GlobalStyles";

const AndroidLarge4 = () => {
  const navigation = useNavigation();

  return (
    <Pressable
      style={styles.androidLarge4}
      onPress={() => navigation.navigate("LogInScreen")}
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
          source={require("../assets/left-side3.png")}
        />
      </View>
      <Image
        style={styles.bf842adB0c2136846f444ea1Icon}
        contentFit="cover"
        source={require("../assets/223045685bf842adb0c2136846f444ea-1.png")}
      />
    </Pressable>
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
  bf842adB0c2136846f444ea1Icon: {
    top: 44,
    left: -161,
    width: 713,
    height: 713,
    position: "absolute",
  },
  androidLarge4: {
    backgroundColor: Color.colorGray_200,
    flex: 1,
    width: "100%",
    height: 800,
    overflow: "hidden",
  },
});

export default AndroidLarge4;
