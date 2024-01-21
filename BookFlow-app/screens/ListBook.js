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
import Constants from "expo-constants";
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

      const response = await fetch(`${apiUrl}/api/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      if (!response.ok) {
        console.error(
          `Erro na requisição de atualização do token: ${response.statusText}`
        );
        return;
      }

      if (response.code === "token_not_valid") {
        console.error("Invalid token: " + response.statusText);
        navigation.navigate("LogInScreen");
      }

      const data = await response.json();

      if (!("access" in data)) {
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
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessToken,
            },
          });

          if (!response.ok) {
            throw new Error(response.text());
          }

          const data = await response.json();
          setBooks(data);
          console.log(data);
        } else {
          console.error("Falha ao obter AccessToken");
        }
      } catch (error) {
        console.error("Erro ao buscar livros:", error.message);
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
          {/* ICON MENU */}
          <Image
            style={[styles.icon, styles.iconLayout]}
            contentFit="cover"
            source={require("../assets/phlist.png")}
          />
        </Pressable>

        {/* ICON BUSCA */}
        <Image
          style={[styles.epsearchIcon, styles.phlistLayout]}
          contentFit="cover"
          source={require("../assets/epsearch.png")}
        />

        {/* TITULO DA HOME */}
        <View style={styles.brandLogo}>
          <Text style={[styles.l, styles.lTypo]}>Book</Text>
          <Text style={styles.book}>Flow</Text>
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
              {/* LIVROS */}
              <View style={[styles.groupChild3, styles.groupLayout]}>
                <Image
                  style={[styles.groupChild4, styles.groupChildLayout1]}
                  resizeMode="cover"
                  source={{
                    uri: apiUrl + (book.cover ? book.cover : "/static/img/default_cover.jpg"),
                  }}
                />
                <View style={styles.bookInfoContainer}>
                  <Text style={[styles.titleBook, styles.groupChildLayout1]}>
                    {book.title.length > 20
                      ? `${book.title.substring(0, 20)}...`
                      : book.title}
                  </Text>
                  <Text style={styles.authorBook}>{book.author}</Text>
                  <Text style={[styles.genre, styles.genreTypo]}>
                    {book.genre.replace(/,/g, " •")}
                  </Text>
                </View>
              </View>
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
  bookInfoContainer: {
    top: 12,
    textAlign: "center",
    width: "80%",
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
  genreTypo: {
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
    marginLeft: 10,
    left: 99,
    width: 250,
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
  phlistLayout: {
    height: 25,
    width: 25,
    top: 62,
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
  book: {
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
  groupChild3: {
    backgroundColor: Color.colorGray_300,
    flexDirection: "row",
  },
  groupChild4: {
    height: 77,
    top: 16,
    left: 19,
    width: 77,
    borderRadius: Border.br_mini,
  },
  authorBook: {
    top: 40,
    fontSize: FontSize.size_base,
    color: Color.colorWhite,
    alignSelf: "center",
    fontFamily: FontFamily.rosarivoRegular,
    position: "absolute",
  },
  titleBook: {
    alignSelf: "center",
    fontSize: 20,
    fontFamily: FontFamily.rosarivoRegular,
    color: Color.colorBlanchedalmond_100,
  },
  genre: {
    top: 70,
    fontFamily: FontFamily.rosarivoRegular,
    alignSelf: "center",
    lineHeight: 20,
    color: Color.colorWhite,
    fontWeight: "600",
  },
  scrol1: {
    top: 180,
    width: screenWidth * 0.9,
    margin: screenWidth * 0.05,
    height: "100%",
    position: "absolute",
  },
  listBook: {
    flex: 1,
    height: 1410,
    overflow: "hidden",
    backgroundColor: Color.colorGray_200,
  },
});

export default ListBook;
