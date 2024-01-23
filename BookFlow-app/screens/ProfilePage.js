import React from "react";
import { View } from "react-native-animatable";
import { StyleSheet } from 'react-native';

export const ProfilePage = () => {
  return (
    <View style={styles.telaUser}>
      <View style={styles.div}>
        <Image 
          style={styles.materialSymbols}
          source={require("../assets/material-symbols-arrow-back-ios.svg")}
        />
        <View style={styles.textWrapper}>Profile</View>
        <View style={styles.group}>
          <View style={styles.overlap}>
            <View style={styles.overlapGroupWrapper}>
              <View style={styles.overlapGroup}>
                <Image
                  style={styles.ellipse}
                  source={require("../assets/ellipse-2.png")}
                  />
                <View style={styles.ellipse2}></View>
              </View>
            </View>
            <Image
              style={styles.solarCamera}
              source={require("../assets/solar-camera-minimalistic-bold.svg")}
            />
         </View>
        </View>
        <View style={styles.group2}>
          <View style={styles.textWrapper2}>Name</View>
          <View style={styles.divWrapper}>
            <View style={styles.overlapGroup2}>
              <View style={styles.textWrapper3}>Melissa Peters</View>
            </View>
          </View>
        </View>
        <View style={styles.group3}>
          <View style={styles.textWrapper4}>Email</View>
          <View style={styles.divWrapper}>
            <View style={styles.overlapGroup2}>
              <View style={styles.textWrapper3}>melpeters@gmail.com</View>
            </View>
          </View>
        </View>
        <View style={styles.group4}>
          <View style={styles.textWrapper4}>Password</View>
          <View style={styles.divWrapper}>
            <View style={styles.overlapGroup2}>
              <View style={styles.textWrapper3}>************</View>
            </View>
          </View>
        </View>
        <View style={styles.overlapWrapper}>
          <View style={styles.overlap2}>
            <View style={styles.textWrapper5}>Save changes</View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  telaUser: {
    backgroundColor: "#1c161e",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },

  div: {
    backgroundColor: "#1c161e",
    height: "800px",
    position: "relative",
    width: "360px",
  },

  materialSymbols: {
    height: "30px",
    left: "25px",
    position: "absolute",
    top: "58px",
    width: "30px",
  },
  textWrapper: {
    color: '#efe3c8',
    fontFamily: 'Rosarivo-Regular',
    fontSize: 20,
    fontWeight: '400',
    left: 148,
    letterSpacing: 0,
    lineHeight: 17.5,
    position: 'absolute',
    top: 66,
    whiteSpace: 'nowrap',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  group: {
    height: 195,
    left: 95,
    position: 'absolute',
    top: 86,
    width: 170,
  },
  overlap: {
    height: 195,
    position: 'relative',
  },
  overlapGroupWrapper: {
    height: 175,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 170,
  },
  overlapGroup: {
    borderRadius: 85,
    height: 175,
    position: 'relative',
  },
  ellipse: {
    height: 173,
    left: 1,
    resizeMode: 'cover',
    position: 'absolute',
    top: 1,
    width: 168,
  },
  ellipse2: {
    borderColor: '#efe3c8',
    borderRadius: 85,
    borderWidth: 1,
    height: 175,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 170,
  },
  solarCamera: {
    height: 32,
    left: 127,
    position: 'absolute',
    top: 163,
    width: 32,
  },
  group2: {
    height: 69,
    left: 24,
    position: 'absolute',
    top: 308,
    width: 316,
  },
  textWrapper2: {
    color: '#efe3c8',
    fontFamily: 'Rosarivo-Regular',
    fontSize: 16,
    fontWeight: '400',
    left: 0,
    letterSpacing: 0,
    lineHeight: 14,
    position: 'absolute',
    textShadowColor: '#00000040',
    top: 0,
    whiteSpace: 'nowrap',
  },
  divWrapper: {
    height: 44,
    left: 0,
    position: 'absolute',
    top: 25,
    width: 316,
  },
  overlapGroup2: {
    borderColor: '#efe2c880',
    borderRadius: 6,
    height: 44,
    position: 'relative',
    width: 314,
  },
  textWrapper3: {
    color: '#efe3c8',
    fontFamily: 'Rosarivo-Regular',
    fontSize: 14,
    fontWeight: '400',
    left: 9,
    letterSpacing: 0,
    lineHeight: 12.3,
    position: 'absolute',
    top: 15,
    whiteSpace: 'nowrap',
  },
  group3: {
    height: 69,
    left: 24,
    position: 'absolute',
    top: 395,
    width: 316,
  },
  textWrapper4: {
    color: '#efe3c8',
    fontFamily: 'Rosarivo-Regular',
    fontSize: 16,
    fontWeight: '400',
    left: 0,
    letterSpacing: 0,
    lineHeight: 14,
    position: 'absolute',
    top: 0,
    whiteSpace: 'nowrap',
  },
  group4: {
    height: 69,
    left: 24,
    position: 'absolute',
    top: 482,
    width: 316,
  },
  overlapWrapper: {
    height: 45,
    left: 73,
    position: 'absolute',
    top: 626,
    width: 223,
  },
  overlap2: {
    backgroundColor: '#efe3c8',
    borderRadius: 6,
    height: 45,
    position: 'relative',
    width: 221,
  },
  textWrapper5: {
    color: '#4a2b29',
    fontFamily: 'Rosarivo-Regular',
    fontSize: 20,
    fontWeight: '400',
    left: 40,
    letterSpacing: 0,
    lineHeight: 17.5,
    position: 'absolute',
    top: 14,
    whiteSpace: 'nowrap',
  },
  

});

export default ProfilePage;