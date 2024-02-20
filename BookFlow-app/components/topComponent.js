import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  Pressable,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import React, { memo, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const TopComponent = memo(
  ({ middle, text1 = "Book", text2 = "Flow", searchBtn = true }) => {
    const navigation = useNavigation();
    const [phlistIconVisible, setPhlistIconVisible] = useState(false);
    const [searchCamp, setSearchCamp] = React.useState("");
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const handleSearchPress = () => {
      setIsSearchVisible(true);
      console.log(isSearchVisible);
    };

    const handleSearchClose = () => {
      setIsSearchVisible(false);
    };

    function search() {
      handleSearchClose();
      navigation.navigate("ListBook", {
        dataToSend: "SEARCH",
        search: searchCamp,
      });
    }

    function logout() {
      SecureStore.deleteItemAsync("user");
      navigation.navigate("LogInScreen");
    }

    const openPhlistIcon = useCallback(() => {
      setPhlistIconVisible(true);
    }, []);

    const closePhlistIcon = useCallback(() => {
      setPhlistIconVisible(false);
    }, []);

    return (
      <>
        <Modal
          transparent={true}
          animationType="slide"
          visible={isSearchVisible}
        >
          <View style={styles.modalContainer}>
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Pesquisar..."
                style={styles.searchInput}
                value={searchCamp}
                onChangeText={(text) => setSearchCamp(text)}
              />

              <Pressable onPress={search}>
                <Image
                  contentFit="cover"
                  source={require("../assets/epsearch.png")}
                />
              </Pressable>
              <TouchableOpacity
                onPress={handleSearchClose}
                style={styles.searchButton}
              >
                <Text style={styles.textButton}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={[styles.topLayout]}>
          <Pressable onPress={openPhlistIcon}>
            <Image
              style={[styles.icon, styles.iconLayout, styles.phlistLayout]}
              contentFit="cover"
              source={require("../assets/phlist.png")}
            />
          </Pressable>

          <Pressable onPress={middle}>
            <View style={styles.brandLogo}>
              <Text style={[styles.l]}>{text1}</Text>
              <Text style={styles.libro}>{text2}</Text>
            </View>
          </Pressable>
          {!searchBtn ? (
            <View style={[styles.phlistLayout]}></View>
          ) : (
            <Pressable onPress={handleSearchPress}>
              <Image
                style={[styles.phlistLayout]}
                contentFit="cover"
                source={require("../assets/epsearch.png")}
              />
            </Pressable>
          )}
        </View>
        <Modal animationType="fade" transparent visible={phlistIconVisible}>
          <View style={styles.phlistIconOverlay}>
            <Pressable style={styles.phlistIconBg} onPress={closePhlistIcon} />
            <View style={styles.Menu}>
              <Image
                style={[styles.octiconperson24, styles.octiconpersonLayout]}
                contentFit="cover"
                source={require("../assets/octiconperson24.png")}
              />
              <Image
                style={[styles.octiconperson241, styles.iconBell]}
                contentFit="cover"
                source={require("../assets/notification-bell.png")}
              />
              <Text
                style={styles.iniciarSesin}
                onPress={() => {
                  setPhlistIconVisible(false);
                  navigation.navigate("Profile");
                }}
              >
                Editar Perfil
              </Text>
              <Text style={[styles.configuracin, styles.contctanosTypo]} onPress={() => {
                  setPhlistIconVisible(false);
                  navigation.navigate("NotificationScreen");
                }}
              >
                Notificações
              </Text>
              <Image
                style={[styles.octiconperson242, styles.octicon]}
                contentFit="cover"
                source={require("../assets/lista_books.png")}
              />
              <Image
                style={[styles.iconlogout, styles.octiconpersonLayout]}
                contentFit="cover"
                source={require("../assets/logout.png")}
              />
              <Text
                style={[styles.contctanos, styles.contctanosTypo]}
                onPress={() => {
                  setPhlistIconVisible(false);
                  navigation.navigate("ListBook", { "dataToSend": "MY_BOOKS" })}
                }
              >
                Meus Empréstimos
              </Text>
              <Pressable onPress={logout}>
                <Text style={[styles.logout, styles.contctanosTypo]}>
                  Logout
                </Text>
              </Pressable>
              <View style={[styles.androidLarge3Child, styles.androidLayout]} />
              <View style={[styles.androidLarge3Item, styles.androidLayout]} />
              <View style={[styles.androidLarge3Inner, styles.androidLayout]} />
              <View style={[styles.androidLargeLogout, styles.androidLayout]} />
            </View>
          </View>
        </Modal>
      </>
    );
  }
);

const styles = StyleSheet.create({
  logout: {
    marginTop: 790,
  },
  iconlogout: {
    top: 768,
  },
  octiconpersonLayout: {
    height: 24,
    width: 24,
    left: 36,
    position: "absolute",
    overflow: "hidden",
  },

  octicon: {
    height: 25,
    width: 29,
    left: 35,
    position: "absolute",
    overflow: "hidden",
  },
  iconBell: {
    height: 38,
    width: 38,
    left: 31,
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
    alignSelf: "center",
    position: "absolute",
  },
  octiconperson24: {
    top: 92,
  },
  octiconperson241: {
    top: 138,
  },
  octiconperson242: {
    top: 196,
  },
  logout: {
    top: 770,
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
  androidLargeLogout: {
    top: 799,
  },
  Menu: {
    position: "absolute",
    top: 0,
    left: 0,

    backgroundColor: "#27181d",
    right: 60,
    width: 300,
    height: "100%",
    maxWidth: "100%",
    maxHeight: "100%",
    overflow: "hidden",
  },
  phlistIconOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(113, 113, 113, 0.3)",
  },
  phlistIconBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
  },
  searchButton: {
    borderColor: "brown",
    borderWidth: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  textButton: {
    color: "brown",
    textAlign: "center",
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Color.colorGray_200, // Define um fundo escuro semi-transparente
  },
  searchContainer: {
    width: "80%",
    top: screenHeight * 0.05,
    padding: 20,
    backgroundColor: "transparent",
    // backgroundColor: 'white',
    borderRadius: 10,
  },
  searchInput: {
    borderColor: "white",
    borderWidth: 1,
    backgroundColor: "transparent",
    height: 45,
    marginBottom: 10,
    borderRadius: 10,
    paddingLeft: 15,
    color: Color.colorBeige_100,
    fontFamily: FontFamily.rosarivoRegular,
  },
  topLayout: {
    marginTop: 60,
    marginLeft: screenWidth * 0.05,
    marginRight: screenWidth * 0.05,
    width: screenWidth * 0.9,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconLayout: {
    width: "100%",
    overflow: "hidden",
  },
  phlistLayout: {
    height: 25,
    width: 25,
    marginTop: 15,
  },
  icon: {
    height: "100%",
    overflow: "hidden",
  },
  l: {
    fontSize: FontSize.size_11xl,
    color: Color.colorBlanchedalmond_400,
    fontFamily: FontFamily.rosarivoRegular,
  },
  libro: {
    fontSize: FontSize.size_23xl,
    color: Color.colorBlanchedalmond_100,
    fontFamily: FontFamily.rosarivoRegular,
  },
  brandLogo: {
    flexDirection: "row",
    alignItems: "center",
    width: screenWidth * 0.5,
    justifyContent: "center",
  },
  text: {
    top: 190,
    left: 37,
    fontFamily: FontFamily.openSansRegular,
    width: 100,
    height: 18,
    lineHeight: 18,
    textAlign: "left",
    color: Color.colorWhite,
    fontWeight: "600",
  },
});

export default TopComponent;
