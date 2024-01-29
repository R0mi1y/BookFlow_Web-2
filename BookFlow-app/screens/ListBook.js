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
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import * as SecureStore from 'expo-secure-store';
import CustomPopup from '../components/CustomPopup';
import TopComponent from '../components/topComponent';
import getAccessToken from '../components/auxiliarFunctions';


const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const ListBook = ({ route }) => {
  var receivedData = route.params?.dataToSend || 'NONE';

  const [popupVisible, setPopupVisible] = React.useState(true);
  const [messagePopup, setPopupTexto] = React.useState("Loading");
  const [user, setUser] = React.useState(null);

  const navigation = useNavigation();

  useEffect(async () => {
    setUser(JSON.parse(await SecureStore.getItemAsync("user")));
  }, []);
  
  const apiUrl = Constants.expoConfig.extra.apiUrl;
  const [books, setBooks] = useState([]);
  
  const togglePopup = (message=null) => {
    setPopupVisible(false);
    if (message != null) {
      setPopupTexto(message);
      setPopupVisible(true);
    }
  };

  const getBooks = () => {
    let cont = 0;
    const fetchData = async () => {
      try {
        const user = JSON.parse(await SecureStore.getItemAsync("user"));
        const accessToken = await getAccessToken(navigation);

        var url = `${apiUrl}/api/book/`;

        if (accessToken) {
          if (receivedData == 'SEARCH') {
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
            throw new Error(await response.text());
          }

          const data = await response.json();

          setBooks(data);
          togglePopup();
          cont = 0;
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "LogInScreen" }],
          });
          console.error("Falha ao obter AccessToken");
        }
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
        if (cont < 5) {
          cont ++;
          fetchData();
        } else {
          cont = 0;
        }
      }
    };

    fetchData();
  }
  useEffect(getBooks, []);

  const changeScreen = (screen) => {
    togglePopup("Loading");
    receivedData = screen;
    navigation.navigate("ListBook", { dataToSend: screen });
    setBooks([]);
    getBooks();
  }

  return (
    <>
      <CustomPopup
        visible={popupVisible}
        onClose={() => {togglePopup(null)}}
        message={messagePopup}
      />
      <ScrollView style={{minHeight: screenHeight, backgroundColor: Color.colorGray_200,}}>
        <View style={[styles.listBook, styles.iconLayout, { flex: 1 }]}>
          {/* BOTÕES SUPERIOSRES DE PESQUISA E MENU */}
          <TopComponent
            middle={() => {
              navigation.navigate("HomeScreen");
            }}
            text1="Liv"
            text2="ros"
          />

          {/* NAV-BAR HOME */}
          <View style={styles.instanceParent}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <TouchableOpacity onPress={() => changeScreen("MY_BOOKS")} style={[styles.frameView, styles.frameBorder, receivedData == "MY_BOOKS" ? styles.selected : null]}>
                <Text style={[styles.autores, styles.autoresTypo, receivedData == "MY_BOOKS" ? styles.selected : null]}>Meus livros</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeScreen("PENDING")} style={[styles.frameView, styles.frameBorder, receivedData == "PENDING" ? styles.selected : null]}>
                <Text style={[styles.autores, styles.autoresTypo, receivedData == "PENDING" ? styles.selected : null]}>Pendentes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeScreen("WISHLIST")} style={[styles.frameView, styles.frameBorder, receivedData == "WISHLIST" ? styles.selected : null]}>
                <Text style={[styles.autores, styles.autoresTypo, receivedData == "WISHLIST" ? styles.selected : null]}>Desejados</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeScreen("POPULARS")} style={[styles.frameView, styles.frameBorder, receivedData == "POPULARS" ? styles.selected : null]}>
                <Text style={[styles.autores, styles.autoresTypo, receivedData == "POPULARS" ? styles.selected : null]}>Populares</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeScreen("REQUIRED_BY_ME")} style={[styles.frameView, styles.frameBorder, receivedData == "REQUIRED_BY_ME" ? styles.selected : null]}>
                <Text style={[styles.autores, styles.autoresTypo, receivedData == "REQUIRED_BY_ME" ? styles.selected : null]}>Requisitei</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeScreen("REQUIRED")} style={[styles.frameView, styles.frameBorder, receivedData == "REQUIRED" ? styles.selected : null]}>
                <Text style={[styles.autores, styles.autoresTypo, receivedData == "REQUIRED" ? styles.selected : null]}>Requisitados</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.scrol1}>
            {books.map((book) => (
              <Pressable
                key={book.id}
                style={styles.groupLayout}
                onPress={() => navigation.navigate("BookDetailScreen", { bookId: book.id, fromScreen: receivedData, owner: book.owner == user.id })}
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
      </ScrollView>
    </>
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
    marginBottom: 22,
    borderRadius: Border.br_3xs,
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
  autores: {
    width: 150,
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
    width: 250,
  },
  autoresWrapper1: {
    width: 87,
  },
  instanceParent: {
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
  },
  groupChild3: {
    backgroundColor: Color.colorGray_300,
    flexDirection: "row",
  },
  groupChild4: {
    height: "100%",
    width: 100,
    top: 0,
    left: 0,
    borderRadius: Border.br_mini,
  },
  authorBook: {
    top: 30,
    fontSize: FontSize.size_base,
    color: Color.colorBlanchedalmond_100,
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
    top: 55,
    fontFamily: FontFamily.rosarivoRegular,
    alignSelf: "center",
    lineHeight: 20,
    color: Color.colorWhite,
    fontWeight: "600",
  },
  scrol1: {
    marginTop: 30,
    width: screenWidth * 0.9,
    margin: screenWidth * 0.05,
    height: "100%",
  },
  listBook: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: Color.colorGray_200,
  },
});

export default ListBook;
