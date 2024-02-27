import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Dimensions, Pressable, TouchableOpacity } from "react-native";
import { CameraView, Camera } from "expo-camera/next";
import { useNavigation } from "@react-navigation/native";
import TopComponent from '../components/topComponent';
import { FontFamily, FontSize, Color, Border, Padding } from "../GlobalStyles";
import CustomPopup from '../components/CustomPopup';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const ScanQRcode = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [messagePopup, setPopupTexto] = useState();
  const [popupVisible, setPopupVisible] = useState(true);
  const navigation = useNavigation();

  const togglePopup = (message=null) => {
    setPopupVisible(false);
    if (message != null) {
      setPopupTexto(message);
      setPopupVisible(true);
    }
  };

  var closePopUp = () => togglePopup(null);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    console.log(data);
    const bookIdIndex = data.indexOf("BOOKID::") + 8;
    const bookId = data.slice(bookIdIndex);

    navigation.navigate("BookDetailScreen", { bookId: bookId });
  };

  var requestPermission = async () => {
    if (hasPermission === null) {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    }
    if (hasPermission === false) {
      togglePopup("Você precisa dar permissão para ler o QrCode");
      closePopUp = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      };
    }
  }

  useEffect(() => {
    requestPermission();
  });

  return (
    <View style={styles.container}>
      <CustomPopup
        visible={popupVisible}
        onClose={closePopUp}
        message={messagePopup}
      />
      <View 
        style={styles.topView}>
        <TopComponent
          middle={() => {
            navigation.navigate("HomeScreen");
          }}
          searchBtn={false}
          text1=""
          text2="Scanner"
        />
      </View>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barCodeTypes: ["qr", "pdf417"],
        }}
        style={[StyleSheet.absoluteFillObject, {zIndex: -1}]}
      />
      <View style={styles.navBottom}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: scanned ? Color.colorBeige_100 : "gray"}]}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.textButton}>Ler Novamente</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.squares}>
        <View style={styles.top}>
          <View style={[styles.squareTopLeft, styles.squareBorder, {borderColor: scanned ? "gray" : Color.colorBeige_100}]}/>
          <View style={[styles.squareTopRight, styles.squareBorder, {borderColor: scanned ? "gray" : Color.colorBeige_100}]}/>
        </View>
        <View style={styles.bottom}>
          <View style={[styles.squareBottomLeft, styles.squareBorder, {borderColor: scanned ? "gray" : Color.colorBeige_100}]}/>
          <View style={[styles.squareBottomRight, styles.squareBorder, {borderColor: scanned ? "gray" : Color.colorBeige_100}]}/>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  topView: {
    position: "absolute",
    top: 0,
    backgroundColor: Color.backGround,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  squareBorder: {
    height: screenWidth * 0.15,
    width: screenWidth * 0.15,
    borderColor: "white",
  },
  squares: {
    height: screenWidth * 0.5,
    width: screenWidth * 0.5,
    position: "absolute",
    flexDirection: "column",
    justifyContent: 'space-between',
  },
  squareTopLeft: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 20.
  },
  squareTopRight: {
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 20,
  },
  squareBottomRight: {
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 20,
  },
  squareBottomLeft: {
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderBottomLeftRadius: 20,
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "100%",
  },
  bottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "100%",
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.colorBg,
    height: screenHeight * 0.1,
    width: screenWidth,
    position: 'absolute',
    top: 0,
    zIndex: 100,
  },
  button: {
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  navBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: Color.backGround,
    height: screenHeight * 0.1,
    width: screenWidth,
    position: 'absolute',
    bottom: 0,
    zIndex: 100,
  },
  textButton: {
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 7,
    marginLeft: 30,
    marginRight: 30,
    fontSize: 20,
    minWidth: screenWidth * 0.5,
    fontWeight: "bold",
    color: Color.colorBg,
    fontFamily: FontFamily.rosarivoRegular,
  },
  text: {
    color: "white",
    fontSize: screenHeight * 0.04,
    fontWeight: "bold",
  },
  logo: {
    marginRight: 30,
    height: screenHeight * 0.09,
    width: screenHeight * 0.09,
    backgroundColor: "#8d7a68",
    borderRadius: 40
  },
  urlIcon: {
    height: 40, 
    width: 40,
    marginRight: 10,
  }
});

export default ScanQRcode;