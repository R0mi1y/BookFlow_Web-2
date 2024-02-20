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
import * as SecureStore from "expo-secure-store";
import CustomPopup from "../components/CustomPopup";
import TopComponent from "../components/topComponent";
import getAccessToken from "../components/auxiliarFunctions";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const ListBook = ({ route }) => {
  let receivedData = route.params?.dataToSend || "NONE";

  const [popupVisible, setPopupVisible] = React.useState(true);
  const [messagePopup, setPopupTexto] = React.useState("Loading");
  const [user, setUser] = React.useState(null);

  const navigation = useNavigation();

  useEffect(async () => {
    setUser(JSON.parse(await SecureStore.getItemAsync("user")));
  }, []);

  const apiUrl = Constants.expoConfig.extra.apiUrl;
  const [books, setBooks] = useState([]);

  const togglePopup = (message = null) => {
    setPopupVisible(false);
    if (message != null) {
      setPopupTexto(message);
      setPopupVisible(true);
    }
  };

  const getBooks = async () => {
    try {
      let attempts = 0;

      while (attempts < 5) {
        const user = JSON.parse(await SecureStore.getItemAsync("user"));
        const accessToken = await getAccessToken(navigation);

        let url = `${apiUrl}/api/book/`;

        if (accessToken) {
          if (receivedData === "SEARCH") {
            const search = route.params?.search || "";
            url += `?search=${search}`;
          } else if (receivedData !== "NONE") {
            url += `user/${user.id}?filter=${receivedData}`;
          }

          const response = await fetch(url, {
            method: "GET",
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
          return; // Sai da função se a busca for bem-sucedida
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "LogInScreen" }],
          });
          console.log("Falha ao obter AccessToken");
          return; // Sai da função se falhar ao obter AccessToken
        }
      }

      console.error(
        "Número máximo de tentativas atingido. Falha ao buscar livros."
      );
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    }
  };

  useEffect(() => {
    getBooks();
  }, [route, navigation]);

  const changeScreen = (screen) => {
    togglePopup("Loading");
    receivedData = screen;
    navigation.navigate("ListBook", { dataToSend: screen });
    setBooks([]);
    getBooks();
  };

  return (
    <>
      <CustomPopup
        visible={popupVisible}
        onClose={() => {
          togglePopup(null);
        }}
        message={messagePopup}
      />
      <ScrollView
        style={{
          minHeight: screenHeight,
          backgroundColor: Color.colorGray_200,
        }}
      >
        <View style={[styles.listBook, styles.iconLayout, { flex: 1 }]}>
          {/* BOTÕES SUPERIOSRES DE PESQUISA E MENU */}
          <TopComponent
            middle={() => {
              navigation.navigate("HomeScreen");
            }}
            text1="Notificações"
            text2=""
          />

          <View style={styles.scrol1}>
            {books.map((book) => (
              <Pressable
                key={book.id}
                style={styles.groupLayout}
                onPress={() =>
                  navigation.navigate("BookDetailScreen", {
                    bookId: book.id,
                    fromScreen: receivedData,
                    owner: book.owner == user.id,
                  })
                }
              >
                {/* LIVROS */}
                <View style={[styles.groupChild3, styles.groupLayout]}>
                  <View style={styles.bookInfoContainer}>
                    <Text style={[styles.titleBook, styles.groupChildLayout1]}>
                      Empréstimo de Livro Aprovado!
                    </Text>
                    <View style={[styles.androidLarge, styles.androidLayout]} />
                    <Text style={styles.authorBook}>
                      Seu pedido de empréstimo do livro 'A Arte da Guerra' foi
                      aprovado. Entre em contato com o proprietario.
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
  androidLayout: {
    top: 29.5,
    height: 1,
    width: 310,
    borderTopWidth: 0.5,
    borderColor: Color.colorBlanchedalmond_200,
    borderStyle: "solid",
    alignSelf: "center",
    position: "absolute",
  },
  bookInfoContainer: {
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
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
    padding: 8,
    width: "100%",
    marginBottom: 2,
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
  authorBook: {
    marginTop: 11,
    fontSize: FontSize.size_base,
    color: Color.colorBlanchedalmond_100,
    textAlign: "center",
    fontFamily: FontFamily.openSansLight,
  },
  titleBook: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: FontFamily.openSansSemiBold,
    color: Color.colorBlanchedalmond_100,
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
