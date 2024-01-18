import React, { useState, useCallback, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Text,
  View,
  Modal,
  Image,
  Dimensions,
} from "react-native";
import AndroidLarge3 from "../components/AndroidLarge3";
import Constants from 'expo-constants';
import MisFavoritosContainer from "../components/MisFavoritosContainer";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";


const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const ListBook = ({ route }) => {
  var receivedData = route.params?.dataToSend || 'NONE';
  console.log(receivedData);
  const navigation = useNavigation();
  const [phlistIconVisible, setPhlistIconVisible] = useState(false);
  const openPhlistIcon = useCallback(() => {
    setPhlistIconVisible(true);
  }, []);
  const closePhlistIcon = useCallback(() => {
    setPhlistIconVisible(false);
  }, []);
  const apiUrl = Constants.manifest.extra.apiUrl;
  const [books, setBooks] = useState([]);
  
  const getAccessToken = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem("@user"));

      if (!user) {
        console.error("Usuário não encontrado");
        navigation.navigate("LogInScreen");
        return;
      }

      const refreshToken = user.refresh_token;

      if (!refreshToken) {
        console.error("Refresh token não encontrado");
        navigation.navigate("LogInScreen");
        return;
      }

      const response = await fetch(
        `${apiUrl}/api/token/refresh/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        }
      );

      if (!response.ok) {
        console.error(`Erro na requisição de atualização do token: ${response.statusText}`);
        return;
      }

      if (response.code === "token_not_valid") {
        console.error("Invalid token: " + response.statusText);
        navigation.navigate("LogInScreen");
      }

      const data = await response.json();

      if (!('access' in data)) {
        console.error("Resposta não contém o token de acesso");
        navigation.navigate("LogInScreen");
        return;
      }

      return data.access;

    } catch (error) {
      console.error("Erro ao obter o token de acesso", error);
      navigation.navigate("LogInScreen");
    }
  };
  const getBooks = () => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(await AsyncStorage.getItem("@user"));
        const accessToken = await getAccessToken();

        var url = `${apiUrl}/api/book/`;

        if (accessToken) {
          if (receivedData == 'SEARCH') {
            console.log(route.params);
            var search = route.params?.search || '';

            url += `?search=${search}`;
          }
          else if (receivedData != 'NONE') url += `user/${user.id}?filter=${receivedData}`;
        
          console.log(url);
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              "Authorization": 'Bearer ' + accessToken,
            },
          });

          if (!response.ok) {
            throw new Error(`Erro ao buscar livros: ${response.text()}`);
          }

          const data = await response.json();
          setBooks(data);
          console.log(data);
        } else {
          console.error("Falha ao obter AccessToken");
        }
      } catch (error) {
        console.error('Erro ao buscar livros:', error.message);
      }
    };

    fetchData();

  }
  useEffect(getBooks, []);

  const changeScreen = (screen) => {
    receivedData = screen;
    navigation.navigate("ListBook", { dataToSend: screen });
    setBooks([]);
    getBooks();
  }

  return (
    <ScrollView>
      <View style={[styles.listBook, styles.iconLayout]}>
        {/* BOTÕES SUPERIOSRES DE PESQUISA E MENU */}
        <Pressable
          style={[styles.phlist, styles.phlistLayout]}
          onPress={openPhlistIcon}
        >
          <Image
            style={[styles.icon, styles.iconLayout]}
            contentFit="cover"
            source={require("../assets/phlist.png")}
          />
        </Pressable>

        {/* TITULO DA HOME */}
        <View style={styles.brandLogo}>
          <Text style={[styles.l, styles.lTypo]}>Book</Text>
          <Text style={styles.libro}>Flow</Text>
        </View>
        {/*----------------*/}

        {/* NAV-BAR HOME */}
        <View style={styles.instanceParent}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity onPress={() => changeScreen("MY_BOOKS")} style={[styles.autoresWrapper, styles.frameBorder, receivedData == "MY_BOOKS" ? styles.selected : null]}>
              <Text style={[styles.autores, styles.autoresTypo, receivedData == "MY_BOOKS" ? styles.selected : null]}>Meus livros</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeScreen("PENDING")} style={[styles.autoresContainer, styles.frameBorder, receivedData == "PENDING" ? styles.selected : null]}>
              <Text style={[styles.autores, styles.autoresTypo, receivedData == "PENDING" ? styles.selected : null]}>Pendentes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeScreen("WISHLIST")} style={[styles.autoresFrame, styles.frameBorder, receivedData == "WISHLIST" ? styles.selected : null]}>
              <Text style={[styles.autores, styles.autoresTypo, receivedData == "WISHLIST" ? styles.selected : null]}>Desejados</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeScreen("REGISTRED_BOOKS")} style={[styles.autoresFrame, styles.frameBorder, receivedData == "REGISTRED_BOOKS" ? styles.selected : null]}>
              <Text style={[styles.autores, styles.autoresTypo, receivedData == "REGISTRED_BOOKS" ? styles.selected : null]}>Cadastrados por mim</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeScreen("POPULARS")} style={[styles.frameView, styles.frameBorder, receivedData == "POPULARS" ? styles.selected : null]}>
              <Text style={[styles.autores, styles.autoresTypo, receivedData == "POPULARS" ? styles.selected : null]}>Populares</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.scrol1}>
          {books.map((book) => (
            <Pressable
              key={book.id}
              style={styles.groupLayout}
              onPress={() => navigation.navigate("BookDetailScreen", { bookId: book.id, fromScreen: receivedData })}
            >
              {/* LIVRO 1 */}

              <View style={[styles.groupChild3, styles.groupLayout]} />

              <Image
                style={[styles.groupChild4, styles.groupChildLayout1]}
                contentFit="cover"
                source={{ uri: apiUrl + book.cover }}
                defaultSource={require("../assets/rectangle-174.png")}
              />
              <Text
                style={[styles.pachinkoNovela, styles.groupChildLayout1]}
              >{book.title}</Text>
              <Text style={styles.minJinLee}>{book.author}</Text>
              {/* <View style={[styles.groupChild5, styles.groupChildLayout]} /> */}
              <Text style={[styles.text, styles.textTypo]}>{book.genre}</Text>
              <View style={[styles.groupChild6, styles.groupChildLayout]} />
            </Pressable>
          ))}
        </View>
      </View>

      <Modal animationType="fade" transparent visible={phlistIconVisible}>
        <View style={styles.phlistIconOverlay}>
          <Pressable style={styles.phlistIconBg} onPress={closePhlistIcon} />
          <AndroidLarge3 onClose={closePhlistIcon} />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  container: {
    top: 20,
  },
  iconLayout: {
    width: "100%",
    overflow: "hidden",
  },
  phlistLayout: {
    height: 25,
    width: 25,
    top: 62,
    position: "absolute",
  },
  textFlexBox: {
    textAlign: "left",
    color: Color.colorWhite,
  },
  coleccinTypo: {
    fontFamily: FontFamily.plusJakartaSansLight,
    fontWeight: "300",
    fontSize: FontSize.size_3xs,
    textAlign: "left",
    color: Color.colorWhite,
    position: "absolute",
  },
  rectangleLayout1: {
    height: 150,
    width: 309,
  },
  crimenTypo: {
    letterSpacing: 2.8,
    fontSize: FontSize.size_21xl,
    textAlign: "left",
    color: Color.colorWhite,
    position: "absolute",
  },
  lTypo: {
    fontFamily: FontFamily.rosarivoRegular,
    textAlign: "left",
    position: "absolute",
  },
  autoresTypo: {
    textAlign: "center",
    color: Color.colorBlanchedalmond_100,
    fontFamily: FontFamily.rosarivoRegular,
  },
  frameBorder: {
    marginLeft: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 34,
    borderWidth: 1,
    borderColor: Color.colorBlanchedalmond_100,
    borderStyle: "solid",
    borderRadius: Border.br_3xs,
    flexDirection: "row",
  },
  iconGroupLayout: {
    maxHeight: "100%",
    maxWidth: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  rectangleLayout: {
    height: 105,
    width: 110,
    position: "absolute",
  },
  textTypo: {
    fontSize: FontSize.size_base,
    position: "absolute",
  },
  groupLayout: {
    height: 110,
    width: "100%",
    marginBottom: 15,
  },
  audiolibrosTypo: {
    letterSpacing: 0.1,
    fontFamily: FontFamily.rosarivoRegular,
    fontSize: FontSize.size_xl,
    textAlign: "left",
    color: Color.colorWhite,
  },
  sidePosition: {
    top: 17,
    height: 11,
    position: "absolute",
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
  icon: {
    height: "100%",
    overflow: "hidden",
  },
  phlist: {
    left: 26,
    height: 25,
    width: 25,
  },
  epsearchIcon: {
    left: 360,
    overflow: "hidden",
  },
  groupChild: {
    borderRadius: Border.br_mini,
    left: 0,
    top: 0,
    height: 150,
    width: 309,
    position: "absolute",
  },
  cienciaFiccion: {
    top: 43,
    fontFamily: FontFamily.kodchasanSemiBold,
    fontWeight: "600",
    color: Color.colorWhite,
    lineHeight: 25,
    letterSpacing: 1.8,
    fontSize: FontSize.size_6xl,
    position: "absolute",
    left: 21,
  },
  coleccin: {
    top: 27,
    left: 50,
  },
  crimen: {
    top: 35,
    left: 71,
    fontFamily: FontFamily.kameron,
  },
  coleccin1: {
    top: 22,
    left: 125,
  },
  rectangleGroup: {
    marginLeft: 20,
  },
  aventura: {
    top: 50,
    left: 173,
    fontFamily: FontFamily.miniver,
    lineHeight: 25,
    letterSpacing: 1.8,
    fontSize: FontSize.size_6xl,
    position: "absolute",
  },
  coleccin2: {
    top: 34,
    left: 197,
  },
  biografia: {
    top: 101,
    left: 154,
    fontFamily: FontFamily.karantinaRegular,
  },
  coleccin3: {
    top: 88,
    left: 184,
  },
  infantil: {
    top: 59,
    left: 36,
    fontFamily: FontFamily.karantinaRegular,
    fontSize: FontSize.size_xl,
    textAlign: "left",
    color: Color.colorWhite,
    position: "absolute",
  },
  coleccin4: {
    top: 46,
    left: 46,
  },
  groupParent: {
    top: 186,
    flexDirection: "row",
    width: 309,
    left: 50,
    position: "absolute",
  },
  l: {
    top: 9,
    fontSize: FontSize.size_11xl,
    color: Color.colorBlanchedalmond_400,
    height: 43,
    width: 100,
    left: 0,
  },
  libro: {
    left: 75,
    fontSize: FontSize.size_23xl,
    width: 105,
    height: 50,
    color: Color.colorBlanchedalmond_100,
    fontFamily: FontFamily.rosarivoRegular,
    textAlign: "left",
    top: 0,
    position: "absolute",
  },
  brandLogo: {
    top: 49,
    left: 115,
    width: 144,
    height: 52,
    position: "absolute",
  },
  autores: {
    width: 88,
    height: 16,
    lineHeight: 18,
    fontSize: FontSize.size_sm,
    textAlign: "center",
  },
  selected: {
    backgroundColor: "white",
    color: "black",
  },
  autoresWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 34,
    borderWidth: 1,
    borderColor: Color.colorBlanchedalmond_100,
    borderStyle: "solid",
    width: 90,
    borderRadius: Border.br_3xs,
    flexDirection: "row",
  },
  autoresContainer: {
    width: 110,
  },
  autoresFrame: {
    width: 90,
    marginLeft: 15,
  },
  frameView: {
    width: 112,
  },
  autoresWrapper1: {
    width: 87,
  },
  instanceParent: {
    top: 120,
    width: "100%",
    flexDirection: "row",
    position: "absolute",
  },
  miBiblioteca: {
    top: 354,
    width: 170,
    height: 20,
    lineHeight: 20,
    fontSize: FontSize.size_base,
    left: 22,
    fontFamily: FontFamily.rosarivoRegular,
    textAlign: "left",
    color: Color.colorWhite,
    position: "absolute",
  },
  vectorIcon: {
    height: "2.61%",
    width: "11.11%",
    top: "31.77%",
    right: "15.56%",
    bottom: "66.62%",
    left: "77%",
  },
  rectangleView: {
    backgroundColor: Color.colorDimgray,
    borderRadius: Border.br_3xs,
    width: 95,
    left: 0,
    top: 0,
  },
  iniciarSesin: {
    top: 19,
    lineHeight: 20,
    textAlign: "center",
    color: Color.colorBlanchedalmond_100,
    fontFamily: FontFamily.rosarivoRegular,
    left: 10,
  },
  octiconperson24: {
    left: 48,
    height: 37,
    top: 62,
    width: 54,

    overflow: "hidden",
  },
  rectangleParent2: {
    top: 385,
    left: 17,
  },
  groupChild3: {
    borderRadius: 13,
    backgroundColor: Color.colorGray_300,
    left: 0,
    top: 0,
    end: 10,
    position: "absolute",
  },
  groupChild4: {
    height: 77,
    top: 16,
    left: 19,
    width: 77,
    borderRadius: Border.br_mini,
    position: "absolute",
  },
  minJinLee: {
    top: 45,
    left: 176,
    lineHeight: 20,
    fontSize: FontSize.size_base,
    color: Color.colorWhite,
    textAlign: "left",
    fontFamily: FontFamily.rosarivoRegular,
    position: "absolute",
  },
  pachinkoNovela: {
    top: 15,
    left: 115,
    height: 40,
    width: 200,
    fontSize: 20,
    fontFamily: FontFamily.rosarivoRegular,
    textAlign: "center",
    color: Color.colorBlanchedalmond_100,
    position: "absolute",
  },
  groupChild5: {
    backgroundColor: Color.colorGray_400,
    width: 111,
    left: 12,
  },
  text: {
    top: 70,
    left: 190,
    fontFamily: FontFamily.openSansRegular,
    width: 100,
    height: 18,
    lineHeight: 18,
    textAlign: "left",
    color: Color.colorWhite,
    fontWeight: "600",
  },
  // groupChild6: {
  //   left: 84,
  //   backgroundColor: Color.colorBlanchedalmond_100,
  //   width: 39,
  // },
  groupIcon: {
    height: "9.37%",
    width: "15.37%",
    top: "81.61%",
    right: "16.74%",
    bottom: "10.83%",
    left: "69%",
  },
  groupChild7: {
    borderTopLeftRadius: Border.br_mini,
    borderBottomRightRadius: Border.br_mini,
    borderBottomLeftRadius: Border.br_12xs,
    backgroundColor: Color.colorDarkslategray,
    width: 41,
    left: 12,
    top: 12,
    height: 20,
    position: "absolute",
  },
  groupChild8: {
    height: "4.35%",
    width: "7.78%",
    top: "7.39%",
    right: "78.89%",
    bottom: "88.26%",
    left: "13.33%",
  },
  text1: {
    top: 13,
    left: 33,
    width: 13,
    height: 14,
    fontSize: FontSize.size_3xs,
    fontFamily: FontFamily.rosarivoRegular,
    color: Color.colorWhite,
  },
  rectangleParent3: {
    marginLeft: 0,
  },
  groupContainer: {
    // marginTop: 12,
    // marginRight: 20,
    flexDirection: "column",
    textAlign: "center",
    top: 15,
  },

  agregadosRecientemente: {
    marginTop: 12,
  },
  scrol1: {
    top: 180,
    width: screenWidth * 0.9,
    margin: screenWidth * 0.05,
    height: "100%",
    position: "absolute",
  },
  bgIcon: {
    top: -2,
    right: 70,
    bottom: 16,
    left: 69,
    display: "none",
  },
  batteryIcon: {
    right: 0,
    height: 11,
    top: 0,
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
  // iosstatusBarblack: {
  //   right: 1,
  //   left: 1,
  //   height: 44,
  //   top: 0,
  //   position: "absolute",
  //   overflow: "hidden",
  //   backgroundColor: Color.colorGray_200,
  // },
  listBook: {
    flex: 1,
    height: 1410,
    overflow: "hidden",
    backgroundColor: Color.colorGray_200,
  },
});

export default ListBook;
