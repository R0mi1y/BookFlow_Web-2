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
          <View style={[styles.groupChild, styles.groupChildLayout]} >
            <Text style={[styles.misFavoritos]}>
              {userFavorites}
            </Text>
            {showSolarstarOutlineIcon && (
              <Image
                style={[styles.octiconperson24, styles.octiconperson24]}
                contentFit="cover"
                source={source}
              />
            )}
          </View>
        </View>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  groupChildLayout: {
    height: 120,
    width: screenWidth * 0.28,
    alignItems: "center",
    marginRight: 5,
    marginLeft: 5,
    justifyContent: "space-between"
  },
  groupChild: {
    borderRadius: Border.br_3xs,
    backgroundColor: Color.colorDimgray,
  },
  misFavoritos: {
    marginTop: 19,
    fontSize: FontSize.size_base,
    lineHeight: 20,
    fontFamily: FontFamily.rosarivoRegular,
    color: Color.colorBlanchedalmond_100,
    textAlign: "center",
  },
  octiconperson24: {
    height: 24,
    width: 24,
    bottom: 15,
    overflow: "hidden",
  },
});

export default MisFavoritosContainer;
