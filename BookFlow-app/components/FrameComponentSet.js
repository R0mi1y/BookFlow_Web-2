import React, { memo } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Color, Border, FontFamily, FontSize } from "../GlobalStyles";

const FrameComponentSet = memo(() => {
  return (
    <View style={styles.property1defaultParent}>
      <View style={[styles.property1default, styles.property1defaultLayout]}>
        <Text style={[styles.autores, styles.autoresLayout]}>Autores</Text>
      </View>
      <View style={[styles.property1variant2, styles.property1defaultLayout]}>
        <Text style={[styles.autores1, styles.autoresLayout]}>Autores</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  property1defaultLayout: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 34,
    width: 90,
    borderColor: Color.colorBlanchedalmond_100,
    borderStyle: "solid",
    borderRadius: Border.br_3xs,
    left: 20,
    position: "absolute",
    borderWidth: 1,
  },
  autoresLayout: {
    height: 16,
    width: 88,
    textAlign: "center",
    fontFamily: FontFamily.rosarivoRegular,
    lineHeight: 18,
    fontSize: FontSize.size_sm,
  },
  autores: {
    color: Color.colorBlanchedalmond_100,
  },
  property1default: {
    top: 20,
  },
  autores1: {
    color: Color.colorGray_200,
  },
  property1variant2: {
    top: 74,
    backgroundColor: Color.colorBlanchedalmond_100,
  },
  property1defaultParent: {
    borderRadius: Border.br_8xs,
    borderStyle: "dashed",
    borderColor: "#9747ff",
    width: 130,
    height: 128,
    overflow: "hidden",
    borderWidth: 1,
  },
});

export default FrameComponentSet;
