import React, { useMemo, memo } from "react";
import { StyleSheet, View, Text, Image, Pressable, Dimensions } from "react-native";
import { Border, Color, FontSize, FontFamily } from "../GlobalStyles";

const getStyleValue = (key, value) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const MisFavoritosContainer = memo(
  ({ userFavorites, showSolarstarOutlineIcon, source, onPress }) => {
    return (
      <Pressable onPress={onPress}>
        <View
          style={[
            styles.groupChildLayout,
          ]}
        >
          <View style={[styles.groupChild, styles.groupChildLayout]} />
          <Text style={[styles.misFavoritos]}>
            {userFavorites}
          </Text>
          <View style={styles.octiconperson24} />
          {showSolarstarOutlineIcon && (
            <Image
              style={styles.octiconperson24}
              contentFit="cover"
              source={source}
            />
          )}
        </View>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  groupChildLayout: {
    height: 105,
    width: screenWidth * 0.28,
    alignItems: "center",
    marginRight: 5,
    marginLeft: 5,
  },
  groupChild: {
    top: 0,
    left: 0,
    borderRadius: Border.br_3xs,
    backgroundColor: Color.colorDimgray,
  },
  misFavoritos: {
    top: 19,
    fontSize: FontSize.size_base,
    lineHeight: 20,
    fontFamily: FontFamily.rosarivoRegular,
    color: Color.colorBlanchedalmond_100,
    textAlign: "center",
    position: "absolute",
  },
  octiconperson24: {
    top: 62,
    left: 38,
    width: 35,
    height: 35,
    overflow: "hidden",
    position: "absolute",
  },
});

export default MisFavoritosContainer;
