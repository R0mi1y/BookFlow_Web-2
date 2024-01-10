import React, { useMemo, memo } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Border, Color, FontSize, FontFamily } from "../GlobalStyles";

const getStyleValue = (key, value) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};
const MisFavoritosContainer = memo(
  ({ userFavorites, showSolarstarOutlineIcon, propLeft, propLeft1 }) => {
    const groupViewStyle = useMemo(() => {
      return {
        ...getStyleValue("left", propLeft),
      };
    }, [propLeft]);

    const misFavoritosStyle = useMemo(() => {
      return {
        ...getStyleValue("left", propLeft1),
      };
    }, [propLeft1]);

    return (
      <View
        style={[
          styles.rectangleParent,
          styles.groupChildLayout,
          groupViewStyle,
        ]}
      >
        <View style={[styles.groupChild, styles.groupChildLayout]} />
        <Text style={[styles.misFavoritos, misFavoritosStyle]}>
          {userFavorites}
        </Text>
        <View style={styles.octiconperson24} />
        {showSolarstarOutlineIcon && (
          <Image
            style={styles.octiconperson24}
            contentFit="cover"
            source={require("../assets/books_vetor.png")}
          />
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  groupChildLayout: {
    height: 105,
    width: 115,
    position: "absolute",
  },
  groupChild: {
    top: 0,
    left: 0,
    borderRadius: Border.br_3xs,
    backgroundColor: Color.colorDimgray,
  },
  misFavoritos: {
    top: 19,
    left: 13,
    fontSize: FontSize.size_base,
    lineHeight: 20,
    fontFamily: FontFamily.rosarivoRegular,
    color: Color.colorBlanchedalmond_100,
    textAlign: "center",
    position: "absolute",
  },
  octiconperson24: {
    top: 62,
    left: 40,
    width: 35,
    height: 35,
    overflow: "hidden",
    position: "absolute",
  },
  rectangleParent: {
    top: 385,
    left: 133,
  },
});

export default MisFavoritosContainer;
